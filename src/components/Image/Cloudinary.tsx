import { FunctionComponent } from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import getCloudinaryPath from '@/utils/helpers/cloudinary';
import { IS_DEV } from '@/utils/config';

interface Props {
  src: string;
  alt?: string;
}

const ImageCloudinary: FunctionComponent<Props> = (props) => {
  const { src, alt } = props;
  return (
    <LazyLoadImage
      src={IS_DEV ? src : getCloudinaryPath(src)}
      placeholderSrc={IS_DEV ? src : getCloudinaryPath(src, 0.2)}
      alt={alt}
      effect="blur"
      wrapperClassName="flex items-center justify-content-center w-full"
      className="mx-auto"
    />
  );
};

export default ImageCloudinary;
