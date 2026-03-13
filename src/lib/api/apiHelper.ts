export function apiGetEndpoint(path: string): string {
  path = path
    .split("/")
    .filter((v) => v !== "")
    .join("/");

  return `${import.meta.env.VITE_PUBLIC_BASE_APIM_ENDPOINT}${path}`;
}
