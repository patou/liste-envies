// Test de non-régression de la connexion : une seule copie des paquets @firebase
// partagés doit être installée. Avec plusieurs copies, les FirebaseError ne sont plus
// reconnues (instanceof) et toute connexion échoue en "auth/network-request-failed".
import { readdirSync, readFileSync, existsSync, statSync } from "node:fs";
import { join } from "node:path";

const shared = ["util", "auth", "app", "component", "logger"];
const versions = {};

function walk(dir) {
  if (!existsSync(dir)) return;
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    let isDir = false;
    try {
      isDir = statSync(p).isDirectory();
    } catch {
      continue;
    }
    if (!isDir) continue;
    if (name === "@firebase") {
      for (const pkg of shared) {
        const pj = join(p, pkg, "package.json");
        if (existsSync(pj)) {
          const v = JSON.parse(readFileSync(pj, "utf8")).version;
          (versions[pkg] ||= new Set()).add(v);
        }
      }
    }
    // descend into node_modules, scopes and packages (nested node_modules)
    if (name === "node_modules" || dir.endsWith("node_modules") || dir.includes("node_modules")) {
      if (name !== ".cache" && name !== ".bin") walk(p);
    }
  }
}
walk("node_modules");

let failed = false;
for (const pkg of shared) {
  const set = versions[pkg] || new Set();
  if (set.size > 1) {
    failed = true;
    console.error(`@firebase/${pkg}: plusieurs versions installées : ${[...set].join(", ")}`);
  } else {
    console.log(`@firebase/${pkg}: ${[...set][0] ?? "absent"}`);
  }
}
process.exit(failed ? 1 : 0);
