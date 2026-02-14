export default function manifest() {
  return {
    name: "STYLE LASH",
    short_name: "STYLE LASH",
    description: "군포 산본 스타일래쉬 눈썹문신/반영구 시술 안내",
    start_url: "/",
    display: "standalone",
    background_color: "#f5f6f8",
    theme_color: "#111214",
    lang: "ko",
    icons: [
      {
        src: "/og/sqare.png",
        sizes: "1200x1200",
        type: "image/png"
      }
    ]
  };
}
