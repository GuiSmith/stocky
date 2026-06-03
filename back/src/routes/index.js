import { readdir } from "node:fs/promises";
import { dirname, join, parse } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

import { Router } from "express";

const currentDir = dirname(fileURLToPath(import.meta.url));

const getRoutePrefix = (fileName) => {
  const routeName = parse(fileName).name.replace(/\.routes$/, "");
  return `/${routeName}`;
};

const loadRoutes = async () => {
  const router = Router();
  const files = await readdir(currentDir);
  const routeFiles = files
    .filter((fileName) => fileName.endsWith(".routes.js"))
    .sort((a, b) => a.localeCompare(b));

  for (const fileName of routeFiles) {
    const routePath = join(currentDir, fileName);
    const routeModule = await import(pathToFileURL(routePath));

    router.use(getRoutePrefix(fileName), routeModule.default);
  }

  return router;
};

export default loadRoutes;
