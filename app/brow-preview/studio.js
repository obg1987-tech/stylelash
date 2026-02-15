"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";

let detectorPromise;
const DEFAULT_PROMPT =
  "ultra realistic eyebrow embroidery, natural hair stroke pattern, seamless skin blend, photoreal";
const DEFAULT_NEGATIVE_PROMPT =
  "artifact, blurry, duplicated eyebrow, extra eyes, deformation, text, watermark";
const STYLE_PRESETS = [
  {
    id: "ultra-soft-straight",
    label: "Ultra Soft Straight",
    note: "아주 연한 일자형",
    prompt:
      "very thin straight eyebrows, super soft edge, sparse light hair strokes, low contrast, light ash brown tone, natural korean look",
    negativePrompt: `${DEFAULT_NEGATIVE_PROMPT}, dark heavy brows, high arch, blocky shape`,
    steps: 20,
    denoise: 0.46,
    cfg: 5.4
  },
  {
    id: "flat-masculine",
    label: "Flat Masculine",
    note: "남성형 도톰 일자",
    prompt:
      "thick flat masculine eyebrows, strong straight line, broader brow body, dense dark ash strands, low arch, high definition",
    negativePrompt: `${DEFAULT_NEGATIVE_PROMPT}, rounded arch, ultra thin brows`,
    steps: 24,
    denoise: 0.58,
    cfg: 6.8
  },
  {
    id: "clean-mid-arch",
    label: "Clean Mid Arch",
    note: "정리된 중간 아치",
    prompt:
      "clean medium arch eyebrows, tidy contour, medium density, smooth directioned strands, neutral brown, polished salon finish",
    negativePrompt: `${DEFAULT_NEGATIVE_PROMPT}, flat brows, broken tail`,
    steps: 26,
    denoise: 0.64,
    cfg: 7.6
  },
  {
    id: "high-arch-glam",
    label: "High Arch Glam",
    note: "강한 고아치",
    prompt:
      "high dramatic arch eyebrows, sharp peak and tapered tail, dense glamorous strands, crisp contour, dark espresso tone",
    negativePrompt: `${DEFAULT_NEGATIVE_PROMPT}, flat line, low contrast`,
    steps: 30,
    denoise: 0.82,
    cfg: 9.4
  },
  {
    id: "bold-block",
    label: "Bold Block",
    note: "진하고 강한 블록형",
    prompt:
      "bold block style eyebrows, fuller inner brow, heavy density, dark cool brown-black, strong edge clarity, high contrast",
    negativePrompt: `${DEFAULT_NEGATIVE_PROMPT}, pale thin brows, weak shape`,
    steps: 28,
    denoise: 0.84,
    cfg: 9.8
  },
  {
    id: "ombre-powder",
    label: "Ombre Powder",
    note: "그라데이션 파우더형",
    prompt:
      "ombre powder eyebrows, soft faded front and darker tail, powder makeup texture, smooth gradient fill, refined shape",
    negativePrompt: `${DEFAULT_NEGATIVE_PROMPT}, hard block front, patchy gradient`,
    steps: 26,
    denoise: 0.8,
    cfg: 8.2
  },
  {
    id: "ash-brown-tone",
    label: "Ash Brown Tone",
    note: "쿨 회갈색 강조",
    prompt:
      "eyebrow color must be cool ash brown, visible cool gray-brown tint, medium shape, realistic strands, no warm hue",
    negativePrompt: `${DEFAULT_NEGATIVE_PROMPT}, red eyebrows, orange eyebrows, black eyebrows`,
    steps: 27,
    denoise: 0.85,
    cfg: 10.6
  },
  {
    id: "light-warm-brown",
    label: "Light Warm Brown",
    note: "밝은 웜브라운",
    prompt:
      "eyebrow color must be light warm brown, brighter than natural black hair, airy soft strokes, gentle feminine shape",
    negativePrompt: `${DEFAULT_NEGATIVE_PROMPT}, dark black eyebrows, gray eyebrows, cold tone`,
    steps: 25,
    denoise: 0.86,
    cfg: 10.8
  },
  {
    id: "graphite-cool",
    label: "Graphite Cool",
    note: "딥 그라파이트 쿨톤",
    prompt:
      "eyebrow color must be deep graphite gray, cool dark gray-black tint, dense but clean strands, sharp modern contour",
    negativePrompt: `${DEFAULT_NEGATIVE_PROMPT}, warm brown eyebrows, red eyebrows, orange eyebrows`,
    steps: 28,
    denoise: 0.87,
    cfg: 11
  }
];
const DEFAULT_PRESET = STYLE_PRESETS[0];

const LEFT_TOP = [70, 63, 105, 66, 107];
const LEFT_BOTTOM = [52, 53, 46];
const RIGHT_TOP = [336, 296, 334, 293, 300];
const RIGHT_BOTTOM = [276, 283, 282];

async function getDetector() {
  if (detectorPromise) return detectorPromise;
  detectorPromise = (async () => {
    const tf = await import("@tensorflow/tfjs-core");
    await import("@tensorflow/tfjs-backend-webgl");
    const model = await import("@tensorflow-models/face-landmarks-detection");
    await tf.setBackend("webgl");
    await tf.ready();
    return model.createDetector(model.SupportedModels.MediaPipeFaceMesh, {
      runtime: "tfjs",
      maxFaces: 1,
      refineLandmarks: true
    });
  })();
  return detectorPromise;
}

function pick(points, indexes) {
  return indexes
    .map((index) => points[index])
    .filter(Boolean)
    .map((point) => ({ x: point.x, y: point.y }));
}

function drawMaskPolygon(ctx, topPoints, bottomPoints, topOffset, bottomOffset) {
  if (!topPoints.length || !bottomPoints.length) return;
  ctx.beginPath();
  ctx.moveTo(topPoints[0].x, topPoints[0].y + topOffset);
  for (let i = 1; i < topPoints.length; i += 1) {
    ctx.lineTo(topPoints[i].x, topPoints[i].y + topOffset);
  }
  for (let i = bottomPoints.length - 1; i >= 0; i -= 1) {
    ctx.lineTo(bottomPoints[i].x, bottomPoints[i].y + bottomOffset);
  }
  ctx.closePath();
  ctx.fill();
}

async function fileToImage(file) {
  const image = new Image();
  image.src = URL.createObjectURL(file);
  await new Promise((resolve, reject) => {
    image.onload = resolve;
    image.onerror = reject;
  });
  return image;
}

async function resizeImageFile(file, maxLongEdge = 1280) {
  const image = await fileToImage(file);
  const width = image.naturalWidth;
  const height = image.naturalHeight;
  const longEdge = Math.max(width, height);
  if (!longEdge || longEdge <= maxLongEdge) {
    return file;
  }

  const scale = maxLongEdge / longEdge;
  const targetWidth = Math.max(1, Math.round(width * scale));
  const targetHeight = Math.max(1, Math.round(height * scale));

  const canvas = document.createElement("canvas");
  canvas.width = targetWidth;
  canvas.height = targetHeight;
  const ctx = canvas.getContext("2d");
  ctx.drawImage(image, 0, 0, targetWidth, targetHeight);

  const blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/png"));
  return new File([blob], `resized_${Date.now()}.png`, { type: "image/png" });
}

async function buildMaskFile(file, strongMode = false) {
  const image = await fileToImage(file);
  const detector = await getDetector();
  const faces = await detector.estimateFaces(image, { flipHorizontal: false });
  if (!faces?.length) throw new Error("Face not detected for mask generation.");

  const points = faces[0].keypoints || [];
  const leftTop = pick(points, LEFT_TOP);
  const leftBottom = pick(points, LEFT_BOTTOM);
  const rightTop = pick(points, RIGHT_TOP);
  const rightBottom = pick(points, RIGHT_BOTTOM);
  if (!leftTop.length || !leftBottom.length || !rightTop.length || !rightBottom.length) {
    throw new Error("Eyebrow landmarks not found for mask generation.");
  }

  const canvas = document.createElement("canvas");
  canvas.width = image.naturalWidth;
  canvas.height = image.naturalHeight;
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "white";
  const topOffset = strongMode ? -18 : -8;
  const bottomOffset = strongMode ? 14 : 6;
  drawMaskPolygon(ctx, leftTop, leftBottom, topOffset, bottomOffset);
  drawMaskPolygon(ctx, rightTop, rightBottom, topOffset, bottomOffset);

  if (strongMode) {
    // Add one more expanded fill pass to aggressively widen editable area around brows.
    drawMaskPolygon(ctx, leftTop, leftBottom, topOffset - 6, bottomOffset + 6);
    drawMaskPolygon(ctx, rightTop, rightBottom, topOffset - 6, bottomOffset + 6);
  }

  const blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/png"));
  return new File([blob], `mask_${Date.now()}.png`, { type: "image/png" });
}

function isImageFile(file) {
  if (!file) return false;
  if (file.type?.startsWith("image/")) return true;
  return /\.(png|jpe?g|webp|bmp|gif)$/i.test(file.name || "");
}

function getDroppedImageFile(dataTransfer) {
  const files = Array.from(dataTransfer?.files || []);
  return files.find(isImageFile) || null;
}

function applyMagnetic(event) {
  const rect = event.currentTarget.getBoundingClientRect();
  const px = (event.clientX - rect.left) / rect.width - 0.5;
  const py = (event.clientY - rect.top) / rect.height - 0.5;
  const maxShift = 8;
  event.currentTarget.style.setProperty("--mag-x", `${(px * maxShift).toFixed(2)}px`);
  event.currentTarget.style.setProperty("--mag-y", `${(py * maxShift).toFixed(2)}px`);
}

function resetMagnetic(event) {
  event.currentTarget.style.setProperty("--mag-x", "0px");
  event.currentTarget.style.setProperty("--mag-y", "0px");
}

function formatErrorMessage(error) {
  const message = error?.message || "Generation failed.";
  if (message.includes("Face not detected")) {
    return "얼굴을 찾지 못했어요. 정면 얼굴 사진으로 다시 시도해 주세요.";
  }
  if (message.includes("Eyebrow landmarks")) {
    return "눈썹 위치를 찾지 못했어요. 눈썹이 잘 보이는 사진으로 다시 시도해 주세요.";
  }
  if (message.includes("Checkpoint")) {
    return "ComfyUI 체크포인트를 찾지 못했어요. 모델 파일명/위치를 다시 확인해 주세요.";
  }
  if (message.includes("ComfyUI is not reachable")) {
    return "ComfyUI 서버 연결 실패예요. ComfyUI 실행 상태와 포트를 확인해 주세요.";
  }
  if (message.includes("ComfyUI execution error")) {
    return `ComfyUI 노드 실행 오류: ${message}`;
  }
  return message;
}

function readImageSize(src) {
  return new Promise((resolve, reject) => {
    const image = new window.Image();
    image.onload = () => {
      resolve({
        width: image.naturalWidth || 1,
        height: image.naturalHeight || 1
      });
    };
    image.onerror = () => reject(new Error("Image size read failed"));
    image.src = src;
  });
}

export default function BrowPreviewStudio() {
  const [file, setFile] = useState(null);
  const [sourceUrl, setSourceUrl] = useState("");
  const [resultUrl, setResultUrl] = useState("");
  const [sourceSize, setSourceSize] = useState({ width: 1, height: 1 });
  const [resultSize, setResultSize] = useState({ width: 1, height: 1 });
  const [ratio, setRatio] = useState(0.5);
  const [prompt, setPrompt] = useState(DEFAULT_PRESET.prompt);
  const [negativePrompt, setNegativePrompt] = useState(DEFAULT_PRESET.negativePrompt);
  const [steps, setSteps] = useState(DEFAULT_PRESET.steps);
  const [denoise, setDenoise] = useState(DEFAULT_PRESET.denoise);
  const [cfg, setCfg] = useState(DEFAULT_PRESET.cfg);
  const [selectedPresetId, setSelectedPresetId] = useState(DEFAULT_PRESET.id);
  const [strongTransform, setStrongTransform] = useState(false);
  const [status, setStatus] = useState("Upload a photo to start ComfyUI inpainting.");
  const [busy, setBusy] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const sliderRef = useRef(null);
  const draggingRef = useRef(false);

  useEffect(() => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    setSourceUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  useEffect(() => {
    let active = true;
    if (!sourceUrl) {
      setSourceSize({ width: 1, height: 1 });
      return;
    }
    readImageSize(sourceUrl)
      .then((size) => {
        if (active) setSourceSize(size);
      })
      .catch(() => {
        if (active) setSourceSize({ width: 1, height: 1 });
      });
    return () => {
      active = false;
    };
  }, [sourceUrl]);

  useEffect(() => {
    let active = true;
    if (!resultUrl) {
      setResultSize(sourceSize);
      return;
    }
    readImageSize(resultUrl)
      .then((size) => {
        if (active) setResultSize(size);
      })
      .catch(() => {
        if (active) setResultSize(sourceSize);
      });
    return () => {
      active = false;
    };
  }, [resultUrl, sourceSize]);

  const clearSelectedFile = () => {
    setFile(null);
    setSourceUrl("");
    setResultUrl("");
    setStatus("업로드가 취소되었습니다. 새 사진을 올려주세요.");
  };

  const onFileChange = (event) => {
    const next = event.target.files?.[0];
    if (!next) return;
    if (!isImageFile(next)) {
      setStatus("Only image files are supported (png, jpg, jpeg, webp, bmp, gif).");
      return;
    }
    setFile(next);
    setResultUrl("");
    setStatus("Ready. Click Generate with ComfyUI.");
  };

  const onDrop = (event) => {
    event.preventDefault();
    setIsDragging(false);
    const next = getDroppedImageFile(event.dataTransfer);
    if (!next) {
      setStatus("Drop an image file (png, jpg, jpeg, webp, bmp, gif).");
      return;
    }
    setFile(next);
    setResultUrl("");
    setStatus("Ready. Click Generate with ComfyUI.");
  };

  const onDragOver = (event) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const onDragEnter = (event) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = (event) => {
    event.preventDefault();
    if (!event.currentTarget.contains(event.relatedTarget)) {
      setIsDragging(false);
    }
  };

  const generate = async () => {
    if (!file) return;

    setBusy(true);
    setStatus("Resizing image, generating mask, and sending to ComfyUI...");
    try {
      const resizedFile = await resizeImageFile(file, 1280);
      const effectiveSteps = strongTransform ? Math.min(42, steps + 8) : steps;
      const effectiveCfg = strongTransform ? Math.min(13, cfg + 1.2) : cfg;
      const effectiveDenoise = strongTransform ? Math.min(0.92, denoise + 0.12) : denoise;
      const maskFile = await buildMaskFile(resizedFile, strongTransform);
      const form = new FormData();
      form.append("image", resizedFile);
      form.append("mask", maskFile);
      form.append("prompt", prompt.trim() || DEFAULT_PROMPT);
      form.append("negativePrompt", negativePrompt.trim() || DEFAULT_NEGATIVE_PROMPT);
      form.append("steps", String(effectiveSteps));
      form.append("cfg", String(effectiveCfg));
      form.append("denoise", String(effectiveDenoise));

      const response = await fetch("/api/comfyui/generate", {
        method: "POST",
        body: form
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload?.detail || payload?.error || "Generation failed");
      setResultUrl(payload.image);
      setStatus(`Done. Seed ${payload.seed}`);
    } catch (error) {
      setStatus(formatErrorMessage(error));
    } finally {
      setBusy(false);
    }
  };

  const updateRatio = (clientX) => {
    const slider = sliderRef.current;
    if (!slider) return;
    const rect = slider.getBoundingClientRect();
    const value = (clientX - rect.left) / rect.width;
    setRatio(Math.max(0.05, Math.min(0.95, value)));
  };

  const onHandlePointerDown = (event) => {
    draggingRef.current = true;
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const onHandlePointerUp = (event) => {
    draggingRef.current = false;
    event.currentTarget.releasePointerCapture(event.pointerId);
  };

  const onPointerMove = (event) => {
    if (!draggingRef.current) return;
    updateRatio(event.clientX);
  };

  const selectedPreset = STYLE_PRESETS.find((preset) => preset.id === selectedPresetId) || null;

  return (
    <main className="brow-studio-page">
      <header className="brow-studio-head">
        <Link href="/" className="brow-studio-back">← Back to Home</Link>
        <h1>ComfyUI Brow Inpaint</h1>
        <p>Local mode: FLUX Fill inpainting workflow (no API billing).</p>
      </header>

      <section className="brow-studio-panel">
        <div className="brow-upload">
          <label htmlFor="comfy-file">Upload photo</label>
          <div
            className={`brow-dropzone${isDragging ? " is-dragging" : ""}`}
            onDrop={onDrop}
            onDragOver={onDragOver}
            onDragEnter={onDragEnter}
            onDragLeave={onDragLeave}
          >
            <p>{isDragging ? "Drop to upload" : "Drag image here"}</p>
            <span>{isDragging ? "놓으면 바로 첨부됩니다" : "or click to choose file"}</span>
            <input id="comfy-file" type="file" accept="image/*" onChange={onFileChange} />
          </div>
          {sourceUrl ? (
            <div className="brow-upload-preview">
              <div className="brow-upload-preview-head">
                <strong>{file?.name}</strong>
                <button type="button" onClick={clearSelectedFile} disabled={busy} aria-label="Remove image">
                  x
                </button>
              </div>
              <Image
                src={sourceUrl}
                alt="selected preview"
                width={sourceSize.width}
                height={sourceSize.height}
                unoptimized
              />
            </div>
          ) : null}
          <p>{status}</p>
        </div>

        <div className="brow-controls">
          <div className="brow-full-width-control brow-preset-wrap">
            <p className="brow-preset-title">Style Presets</p>
            <div className="brow-preset-list">
              {STYLE_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  className={selectedPresetId === preset.id ? "is-active" : ""}
                  onClick={() => {
                    setSelectedPresetId(preset.id);
                    setPrompt(preset.prompt);
                    setNegativePrompt(preset.negativePrompt);
                    setSteps(preset.steps);
                    setCfg(preset.cfg);
                    setDenoise(preset.denoise);
                    setStatus(`${preset.label} 프리셋 적용됨`);
                  }}
                  disabled={busy}
                >
                  {preset.label}
                </button>
              ))}
            </div>
            {selectedPreset ? (
              <div className="brow-preset-detail">
                <strong>{selectedPreset.label}</strong>
                <span>{selectedPreset.note}</span>
                <code>Prompt: {selectedPreset.prompt}</code>
                <code>Negative: {selectedPreset.negativePrompt}</code>
                <code>
                  Recommended: steps {selectedPreset.steps}, cfg {selectedPreset.cfg}, denoise{" "}
                  {selectedPreset.denoise}
                </code>
              </div>
            ) : null}
          </div>
          <div className="brow-full-width-control brow-strong-toggle">
            <button
              type="button"
              className={strongTransform ? "is-active" : ""}
              onClick={() => setStrongTransform((prev) => !prev)}
              disabled={busy}
            >
              {strongTransform ? "Strong Transform: ON" : "Strong Transform: OFF"}
            </button>
            <p>ON이면 마스크 범위 + 변환 강도를 높여 프리셋 차이를 크게 만듭니다.</p>
          </div>
          <div className="brow-actions">
            <button type="button" onClick={generate} disabled={!file || busy}>
              {busy ? "Generating..." : "Generate with ComfyUI"}
            </button>
          </div>
          <p style={{ margin: 0, color: "#5a6572", fontSize: "0.82rem" }}>
            ComfyUI must be running at <code>http://127.0.0.1:8000</code> with FLUX model files available.
          </p>
        </div>
      </section>

      <section className="brow-compare-panel">
        <h2>Before / After</h2>
        <div ref={sliderRef} className="brow-compare-canvas-wrap" onPointerMove={onPointerMove}>
          {resultUrl ? (
            <Image
              src={resultUrl}
              alt="after"
              className="brow-canvas"
              width={resultSize.width}
              height={resultSize.height}
              unoptimized
            />
          ) : null}
          {sourceUrl ? (
            <div className="brow-before-layer" style={{ clipPath: `inset(0 ${100 - ratio * 100}% 0 0)` }}>
              <Image
                src={sourceUrl}
                alt="before"
                className="brow-canvas"
                width={sourceSize.width}
                height={sourceSize.height}
                unoptimized
              />
            </div>
          ) : null}

          <span className="brow-canvas-tag brow-canvas-tag-left">Before</span>
          <span className="brow-canvas-tag brow-canvas-tag-right">After</span>

          <div className="brow-compare-divider" style={{ left: `${ratio * 100}%` }}>
            <div className="brow-compare-line" />
            <button
              type="button"
              className="brow-compare-handle"
              onPointerDown={onHandlePointerDown}
              onPointerUp={onHandlePointerUp}
              onPointerCancel={onHandlePointerUp}
              onPointerMove={onPointerMove}
            >
              ↔
            </button>
          </div>
        </div>
      </section>

      <Link
        href="/"
        className="brow-floating-home-btn"
        aria-label="Go to home"
        onMouseMove={applyMagnetic}
        onMouseLeave={resetMagnetic}
      >
        <span>Home</span>
        <small>Back</small>
      </Link>
    </main>
  );
}
