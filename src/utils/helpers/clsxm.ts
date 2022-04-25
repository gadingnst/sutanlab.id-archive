import clsx, { ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 *
 * @param classes tailwind class names
 * @returns string of tailwind classes
 */
function clsxm(...classes: ClassValue[]) {
  return twMerge(clsx(...classes));
}

export default clsxm;
