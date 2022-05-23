/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-console */

require('dotenv').config();

import Fs from 'fs/promises';
import Path from 'path';
import CloudinaryInstance from 'cloudinary';
import {
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
  CLOUDINARY_CLOUD_NAME
} from '../src/utils/config';
import Concurrency from '../src/utils/lib/Concurrency';

const Cloudinary = CloudinaryInstance.v2;
Cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET
});

const rootDir = process.cwd();
const mediaDir = Path.resolve(rootDir, 'public', 'media');

/**
 *
 * @param dir - directory to be read
 * @see https://stackoverflow.com/a/45130990
 */
async function* getFiles(dir: string): any {
  const dirents = await Fs.readdir(dir, { withFileTypes: true });
  for (const dirent of dirents) {
    const res = Path.resolve(dir, dirent.name);
    if (dirent.isDirectory()) {
      yield* getFiles(res);
    } else {
      yield res;
    }
  }
}

async function main() {
  const concurrent = new Concurrency({ workers: 5, withPing: true });
  console.log('> Uploading all files in `media` folder to Cloudinary...');
  for await (const file of getFiles(mediaDir)) {
    const pathToUpload = Path.join('media', file.replace(mediaDir, ''));
    const fullFileName = Path.basename(pathToUpload);
    const folderName = Path.dirname(pathToUpload);
    const extension = Path.extname(fullFileName);
    const fileName = fullFileName.slice(0, -extension.length);
    concurrent.add(async() => {
      const response = await Cloudinary.uploader.upload(
        file,
        {
          public_id: fileName,
          folder: `gading.dev/${folderName}`,
          overwrite: false
        }
      );
      return response.public_id;
    });
  }
  await concurrent.run();
  console.log('Done:', concurrent.getListedProcess());
}

main();
