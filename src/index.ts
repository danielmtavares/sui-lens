import { pathToFileURL } from "node:url";

export function getSuiLensMessage(): string {
  return "sui-lens is ready for implementation.";
}

function isExecutedDirectly(): boolean {
  const entryPath = process.argv[1];

  if (entryPath === undefined) {
    return false;
  }

  return import.meta.url === pathToFileURL(entryPath).href;
}

if (isExecutedDirectly()) {
  console.log(getSuiLensMessage());
}
