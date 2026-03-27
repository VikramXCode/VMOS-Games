const assetModules = import.meta.glob("../assets/*.{png,jpg,jpeg,webp,gif,svg,avif}", {
  eager: true,
  import: "default",
}) as Record<string, string>;

const assetByFileName = Object.entries(assetModules).reduce<Record<string, string>>((acc, [key, url]) => {
  const fileName = key.split("/").pop();
  if (fileName) {
    acc[fileName.toLowerCase()] = url;
  }
  return acc;
}, {});

const hasWebProtocol = (value: string): boolean => {
  return /^(https?:)?\/\//i.test(value);
};

export const resolveImageUrl = (value?: string | null): string => {
  if (!value) {
    return "/placeholder.svg";
  }

  const trimmed = value.trim();
  if (!trimmed) {
    return "/placeholder.svg";
  }

  if (hasWebProtocol(trimmed) || /^data:/i.test(trimmed) || /^blob:/i.test(trimmed)) {
    return trimmed;
  }

  let normalized = trimmed
    .replace(/\\/g, "/")
    .replace(/assests/gi, "assets")
    .replace(/^\.\//, "")
    .replace(/^public\//i, "/")
    .replace(/^\/public\//i, "/");

  const fileName = normalized.split("/").pop()?.toLowerCase();
  if (fileName && assetByFileName[fileName]) {
    return assetByFileName[fileName];
  }

  if (normalized.startsWith("/src/assets/") || normalized.startsWith("src/assets/") || normalized.startsWith("assets/") || normalized.startsWith("/assets/")) {
    if (fileName && assetByFileName[fileName]) {
      return assetByFileName[fileName];
    }
  }

  if (!normalized.startsWith("/")) {
    normalized = `/${normalized}`;
  }

  return normalized;
};
