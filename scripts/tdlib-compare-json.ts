import fs from 'fs';
import path from 'path';

type JsonValue = any;

interface CompareOptions {
  ignoreKeys: string[];
}

function loadJsonFiles(dir: string): Record<string, JsonValue> {
  const result: Record<string, JsonValue> = {};
  if (!fs.existsSync(dir)) {
    return result;
  }
  for (const file of fs.readdirSync(dir)) {
    if (!file.endsWith('.json')) continue;
    const full = path.join(dir, file);
    const content = fs.readFileSync(full, 'utf8');
    result[file] = JSON.parse(content);
  }
  return result;
}

function stripIgnored(obj: JsonValue, ignore: string[]): JsonValue {
  if (Array.isArray(obj)) {
    return obj.map((v) => stripIgnored(v, ignore));
  }
  if (obj && typeof obj === 'object') {
    const out: Record<string, JsonValue> = {};
    for (const [k, v] of Object.entries(obj)) {
      if (ignore.includes(k)) continue;
      out[k] = stripIgnored(v, ignore);
    }
    return out;
  }
  return obj;
}

function compareJson(a: JsonValue, b: JsonValue): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}

function main() {
  const [expectedDir, actualDir] = process.argv.slice(2);
  if (!expectedDir || !actualDir) {
    // eslint-disable-next-line no-console
    console.error('Usage: ts-node tdlib-compare-json.ts <expectedDir> <actualDir>');
    process.exit(1);
  }

  const options: CompareOptions = {
    ignoreKeys: ['date', 'edit_date', 'id', '@extra'],
  };

  const expected = loadJsonFiles(expectedDir);
  const actual = loadJsonFiles(actualDir);

  let failed = 0;

  for (const [file, expJson] of Object.entries(expected)) {
    const actJson = actual[file];
    if (!actJson) {
      // eslint-disable-next-line no-console
      console.error(`[tdlib-compare] Missing actual file for ${file}`);
      failed++;
      continue;
    }

    const expStripped = stripIgnored(expJson, options.ignoreKeys);
    const actStripped = stripIgnored(actJson, options.ignoreKeys);

    if (!compareJson(expStripped, actStripped)) {
      // eslint-disable-next-line no-console
      console.error(`[tdlib-compare] JSON mismatch for ${file}`);
      failed++;
    } else {
      // eslint-disable-next-line no-console
      console.log(`[tdlib-compare] OK: ${file}`);
    }
  }

  if (failed > 0) {
    process.exit(1);
  }
}

main();

