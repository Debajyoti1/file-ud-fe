export function formatFileSize(bytes) {
  if (!bytes) return "0 Bytes";

  const kb = 1024;
  const mb = kb * 1024;
  const gb = mb * 1024;

  if (bytes < kb) return `${bytes} Bytes`;
  if (bytes < mb) return `${(bytes / kb).toFixed(2)} KB`;
  if (bytes < gb) return `${(bytes / mb).toFixed(2)} MB`;
  return `${(bytes / gb).toFixed(2)} GB`;
}
