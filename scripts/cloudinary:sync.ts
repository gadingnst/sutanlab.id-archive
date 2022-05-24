/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-console */

require('dotenv').config();

import Path from 'path';
import isImage from 'is-image';
import CloudinaryInstance from 'cloudinary';
import {
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
  CLOUDINARY_CLOUD_NAME
} from '../src/utils/config';
import getFiles from '../src/server/get-files';
import ConcurrencyManager from '../src/utils/lib/ConcurrencyManager';

const Cloudinary = CloudinaryInstance.v2;
Cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET
});

const rootDir = process.cwd();
const mediaDir = Path.resolve(rootDir, 'public', 'media');

async function syncMedia() {
  console.log('> Syncing `media` files...');
  const concurrent = new ConcurrencyManager({ workers: 5, withPing: true });
  console.log('> Deleting `media` folder in Cloudinary...');
  await Cloudinary.api.delete_resources_by_prefix('gading.dev/media/');
  console.log('> Uploading all files in local `media` folder to Cloudinary.');
  for await (const file of getFiles(mediaDir)) {
    const pathToUpload = Path.join('media', file.replace(mediaDir, ''));
    const fullFileName = Path.basename(pathToUpload);
    const folderName = Path.dirname(pathToUpload);
    const extension = Path.extname(fullFileName);
    const fileName = fullFileName.slice(0, -extension.length);
    if (isImage(pathToUpload)) {
      concurrent.add(async() => {
        process.stdout.write(`.`);
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
  }
  await concurrent.run();
  console.log('\n> Done:', concurrent.getListedProcess());
}

syncMedia();
