import { NextResponse } from "next/server";

const COMFYUI_URL = process.env.COMFYUI_URL || "http://127.0.0.1:8188";
const FLUX_UNET = process.env.COMFYUI_FLUX_UNET || "flux1-fill-dev.safetensors";
const FLUX_CLIP_L = process.env.COMFYUI_FLUX_CLIP_L || "clip_l.safetensors";
const FLUX_T5 = process.env.COMFYUI_FLUX_T5 || "t5xxl_fp16.safetensors";
const FLUX_VAE = process.env.COMFYUI_FLUX_VAE || "ae.safetensors";
const READY_CACHE_TTL_MS = 30000;

let readyCache = null;
let readyCacheAt = 0;

async function uploadImageToComfy(file, name) {
  const form = new FormData();
  form.append("image", file, name);
  form.append("overwrite", "true");
  const response = await fetch(`${COMFYUI_URL}/upload/image`, {
    method: "POST",
    body: form
  });
  if (!response.ok) {
    throw new Error("Failed to upload image to ComfyUI.");
  }
  return response.json();
}

function buildWorkflow({
  imageName,
  maskName,
  prompt,
  negativePrompt,
  steps,
  guidance,
  denoise,
  seed,
  unetName,
  clipLName,
  t5Name,
  vaeName
}) {
  return {
    "1": {
      class_type: "UNETLoader",
      inputs: { unet_name: unetName, weight_dtype: "default" }
    },
    "2": {
      class_type: "DualCLIPLoader",
      inputs: { clip_name1: clipLName, clip_name2: t5Name, type: "flux" }
    },
    "3": {
      class_type: "CLIPTextEncodeFlux",
      inputs: { clip: ["2", 0], clip_l: prompt, t5xxl: prompt, guidance }
    },
    "4": {
      class_type: "LoadImage",
      inputs: { image: imageName }
    },
    "5": {
      class_type: "LoadImageMask",
      inputs: { image: maskName, channel: "red" }
    },
    "6": {
      class_type: "CLIPTextEncodeFlux",
      inputs: {
        clip: ["2", 0],
        clip_l: negativePrompt,
        t5xxl: negativePrompt,
        guidance: 0
      }
    },
    "7": {
      class_type: "VAELoader",
      inputs: { vae_name: vaeName }
    },
    "8": {
      class_type: "InpaintModelConditioning",
      inputs: {
        positive: ["3", 0],
        negative: ["6", 0],
        vae: ["7", 0],
        pixels: ["4", 0],
        mask: ["5", 0],
        noise_mask: true
      }
    },
    "9": {
      class_type: "KSampler",
      inputs: {
        seed,
        steps,
        cfg: 1.0,
        sampler_name: "euler",
        scheduler: "simple",
        denoise,
        model: ["1", 0],
        positive: ["8", 0],
        negative: ["8", 1],
        latent_image: ["8", 2]
      }
    },
    "10": {
      class_type: "VAEDecode",
      inputs: {
        samples: ["9", 0],
        vae: ["7", 0]
      }
    },
    "11": {
      class_type: "SaveImage",
      inputs: {
        filename_prefix: "brow_inpaint",
        images: ["10", 0]
      }
    }
  };
}

async function ensureComfyReady() {
  if (readyCache && Date.now() - readyCacheAt < READY_CACHE_TTL_MS) {
    return readyCache;
  }

  try {
    const response = await fetch(`${COMFYUI_URL}/object_info`);
    if (!response.ok) {
      throw new Error(`ComfyUI responded ${response.status}.`);
    }

    const objectInfo = await response.json();
    const requiredNodes = [
      "UNETLoader",
      "DualCLIPLoader",
      "VAELoader",
      "CLIPTextEncodeFlux",
      "InpaintModelConditioning"
    ];
    const missingNodes = requiredNodes.filter((nodeName) => !objectInfo?.[nodeName]);
    if (missingNodes.length) {
      throw new Error(`Missing required ComfyUI nodes for FLUX: ${missingNodes.join(", ")}`);
    }

    const unetChoices = objectInfo?.UNETLoader?.input?.required?.unet_name?.[0] || [];
    const clipChoices = objectInfo?.DualCLIPLoader?.input?.required?.clip_name1?.[0] || [];
    const vaeChoices = objectInfo?.VAELoader?.input?.required?.vae_name?.[0] || [];

    if (!unetChoices.includes(FLUX_UNET)) {
      throw new Error(
        `FLUX model "${FLUX_UNET}" not found in ComfyUI/models/diffusion_models.`
      );
    }
    if (!clipChoices.includes(FLUX_CLIP_L) || !clipChoices.includes(FLUX_T5)) {
      throw new Error(
        `Text encoders missing. Required: "${FLUX_CLIP_L}" and "${FLUX_T5}" in ComfyUI/models/text_encoders.`
      );
    }
    if (!vaeChoices.includes(FLUX_VAE)) {
      throw new Error(`VAE "${FLUX_VAE}" not found in ComfyUI/models/vae.`);
    }

    const assets = {
      unetName: FLUX_UNET,
      clipLName: FLUX_CLIP_L,
      t5Name: FLUX_T5,
      vaeName: FLUX_VAE
    };
    readyCache = assets;
    readyCacheAt = Date.now();
    return assets;
  } catch (error) {
    readyCache = null;
    readyCacheAt = 0;
    if (error.message.includes("not found") || error.message.includes("Missing required")) {
      throw error;
    }
    throw new Error(
      `ComfyUI is not reachable at ${COMFYUI_URL}. Start ComfyUI first, then retry.`
    );
  }
}

function parseComfyExecutionError(run) {
  const messages = run?.status?.messages;
  if (!Array.isArray(messages)) return null;
  const hit = messages.find(
    (entry) => Array.isArray(entry) && entry[0] === "execution_error" && entry[1]
  );
  const details = hit?.[1];
  if (!details) return null;
  const nodeType = details.node_type || "unknown";
  const exception = details.exception_message || "unknown error";
  return `ComfyUI execution error at node ${nodeType}: ${exception}`;
}

async function pollHistory(promptId, timeoutMs = 180000) {
  const started = Date.now();
  while (Date.now() - started < timeoutMs) {
    await new Promise((resolve) => setTimeout(resolve, 1200));
    const historyResponse = await fetch(`${COMFYUI_URL}/history/${promptId}`);
    if (!historyResponse.ok) continue;
    const history = await historyResponse.json();
    const run = history?.[promptId];
    const comfyError = parseComfyExecutionError(run);
    if (comfyError) {
      throw new Error(comfyError);
    }
    const images = run?.outputs?.["11"]?.images;
    if (images?.length) return images[0];
  }
  throw new Error("ComfyUI generation timed out.");
}

export async function POST(request) {
  try {
    const fluxAssets = await ensureComfyReady();

    const formData = await request.formData();
    const image = formData.get("image");
    const mask = formData.get("mask");
    const prompt = String(
      formData.get("prompt") ||
        "realistic eyebrow embroidery, natural hair strokes, seamless skin blending"
    );
    const negativePrompt = String(
      formData.get("negativePrompt") ||
        "artifact, blur, duplicate eyebrow, extra eyes, text, watermark, deformed face"
    );
    const steps = Math.max(8, Math.min(60, Number(formData.get("steps") || 24)));
    const cfg = Math.max(1, Math.min(20, Number(formData.get("cfg") || 8)));
    const denoise = Math.max(0.1, Math.min(0.98, Number(formData.get("denoise") || 0.62)));
    const seed = Number(formData.get("seed") || Math.floor(Math.random() * 1000000000));

    if (!(image instanceof File) || !(mask instanceof File)) {
      return NextResponse.json({ error: "Image and mask are required." }, { status: 400 });
    }

    const uploadedImage = await uploadImageToComfy(image, `input_${Date.now()}.png`);
    const uploadedMask = await uploadImageToComfy(mask, `mask_${Date.now()}.png`);

    const workflow = buildWorkflow({
      imageName: uploadedImage.name,
      maskName: uploadedMask.name,
      prompt,
      negativePrompt,
      steps,
      guidance: cfg,
      denoise,
      seed,
      ...fluxAssets
    });

    const promptResponse = await fetch(`${COMFYUI_URL}/prompt`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: workflow })
    });

    if (!promptResponse.ok) {
      const detail = await promptResponse.text();
      return NextResponse.json(
        { error: "Failed to queue ComfyUI prompt.", detail },
        { status: 500 }
      );
    }

    const queued = await promptResponse.json();
    const promptId = queued.prompt_id;
    const imageInfo = await pollHistory(promptId);

    const params = new URLSearchParams({
      filename: imageInfo.filename,
      subfolder: imageInfo.subfolder || "",
      type: imageInfo.type || "output"
    });
    const imageResponse = await fetch(`${COMFYUI_URL}/view?${params.toString()}`);
    if (!imageResponse.ok) {
      return NextResponse.json({ error: "Failed to fetch output image." }, { status: 500 });
    }

    const arrayBuffer = await imageResponse.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString("base64");
    return NextResponse.json({
      image: `data:image/png;base64,${base64}`,
      seed
    });
  } catch (error) {
    return NextResponse.json({ error: error.message || "Unknown error." }, { status: 500 });
  }
}
