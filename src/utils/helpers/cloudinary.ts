import { CLOUDINARY_CLOUD_NAME } from '@/utils/config';

/**
 * get the cloudinary url
 * @param path - path to file
 * @param imgScale - scale of image
 * @returns {string} - image url
 */
function cloudinary(path: string, imgScale?: number): string {
  const isOnMedia = path.startsWith('/media/');
  if (isOnMedia) {
    const blurring = !path.endsWith('.gif') ? ',e_blur:500' : '';
    const scaling = imgScale ? `w_${imgScale},h_${imgScale}${blurring},c_scale/` : '';
    const basePath =
      `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload/${scaling}gading.dev${path}`;
    return basePath;
  }
  return path;
}

export default cloudinary;
