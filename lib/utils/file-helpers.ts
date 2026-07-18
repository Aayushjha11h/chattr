import { ACCEPTED_FILE_TYPES, MAX_FILE_SIZE, MAX_IMAGE_SIZE } from "@/lib/constants/config";

export function getFileType(mimeType: string): string {
  if (ACCEPTED_FILE_TYPES.image.includes(mimeType)) return "image";
  if (ACCEPTED_FILE_TYPES.video.includes(mimeType)) return "video";
  if (ACCEPTED_FILE_TYPES.audio.includes(mimeType)) return "audio";
  if (ACCEPTED_FILE_TYPES.document.includes(mimeType)) {
    if (mimeType === "application/pdf") return "pdf";
    if (mimeType.includes("word")) return "doc";
    if (mimeType.includes("excel")) return "excel";
    if (mimeType === "application/zip") return "zip";
    return "file";
  }
  return "file";
}

export function validateFile(file: File): { valid: boolean; error?: string } {
  const fileType = getFileType(file.type);

  if (fileType === "image" && file.size > MAX_IMAGE_SIZE) {
    return { valid: false, error: `Image too large. Max ${MAX_IMAGE_SIZE / 1024 / 1024}MB` };
  }

  if (file.size > MAX_FILE_SIZE) {
    return { valid: false, error: `File too large. Max ${MAX_FILE_SIZE / 1024 / 1024}MB` };
  }

  const allTypes = Object.values(ACCEPTED_FILE_TYPES).flat();
  if (!allTypes.includes(file.type)) {
    return { valid: false, error: "File type not supported" };
  }

  return { valid: true };
}

export function compressImage(file: File, maxWidth: number = 1920): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    img.onload = () => {
      let width = img.width;
      let height = img.height;

      if (width > maxWidth) {
        height = (height * maxWidth) / width;
        width = maxWidth;
      }

      canvas.width = width;
      canvas.height = height;
      ctx?.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          if (blob) resolve(blob);
          else reject(new Error("Compression failed"));
        },
        "image/jpeg",
        0.85
      );
    };

    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
}