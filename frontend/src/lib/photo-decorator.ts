export const FRAME_STYLES = [
  { id: "gold", label: "골든", colors: ["#F6D9A6", "#E7B776"] },
  { id: "sunset", label: "선셋", colors: ["#F4B96E", "#E89B5E"] },
  { id: "ocean", label: "오션", colors: ["#A9C7E8", "#7FA8D8"] },
  { id: "forest", label: "포레스트", colors: ["#CDE6C2", "#94C39C"] },
  { id: "lavender", label: "라벤더", colors: ["#C9B6E4", "#A98FD0"] },
  { id: "brand", label: "발자국 블루", colors: ["#5B78FF", "#3B5BFE"] },
] as const;

export type FrameStyleId = (typeof FRAME_STYLES)[number]["id"];

export function getFrameStyle(frameId?: string) {
  return FRAME_STYLES.find((item) => item.id === frameId) ?? FRAME_STYLES[0];
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("이미지를 불러오지 못했습니다."));
    img.src = src;
  });
}

/** 원본 비율 유지 — 잘라내지 않고 축소만(용량 절약). */
export async function prepareWalletPhoto(
  imageSrc: string,
  maxEdge = 1200,
): Promise<string> {
  const img = await loadImage(imageSrc);
  const scale = Math.min(1, maxEdge / Math.max(img.width, img.height));
  const width = Math.round(img.width * scale);
  const height = Math.round(img.height * scale);

  if (
    scale === 1 &&
    imageSrc.startsWith("data:image/jpeg") &&
    imageSrc.length < 900_000
  ) {
    return imageSrc;
  }

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("캔버스를 초기화하지 못했습니다.");

  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, width, height);
  ctx.drawImage(img, 0, 0, width, height);
  return canvas.toDataURL("image/jpeg", 0.92);
}

export function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") resolve(reader.result);
      else reject(new Error("파일을 읽지 못했습니다."));
    };
    reader.onerror = () => reject(new Error("파일을 읽지 못했습니다."));
    reader.readAsDataURL(file);
  });
}
