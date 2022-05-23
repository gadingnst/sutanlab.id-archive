import { CLOUDINARY_CLOUD_NAME } from '@/utils/config';

/**
 * get the cloudinary url
 * @param path - path to file
 * @param imgScale - scale of image
 * @returns {string} - image url
 */
function getCloudinaryPath(path: string, imgScale?: number): string {
  const scaling = imgScale ? `w_${imgScale},h_${imgScale},c_scale/` : '';
  const basePath =
    `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload/${scaling}gading.dev${path}`;
  return basePath;
}

export default getCloudinaryPath;
