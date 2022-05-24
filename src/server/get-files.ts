import { readdir } from 'fs/promises';
import { resolve } from 'path';

/**
 * Read all files in a directory deeply
 * @param dir - directory to be read
 * @see https://stackoverflow.com/a/45130990
 */
async function* getFiles(dir: string): any {
  const dirents = await readdir(dir, { withFileTypes: true });
  for (const dirent of dirents) {
    const res = resolve(dir, dirent.name);
    if (dirent.isDirectory()) {
      yield* getFiles(res);
    } else {
      yield res;
    }
  }
}

export default getFiles;
