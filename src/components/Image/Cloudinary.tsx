import { FunctionComponent } from 'react';
import { LazyLoadImage, LazyLoadImageProps } from 'react-lazy-load-image-component';
import getCloudinaryPath from '@/utils/helpers/cloudinary';
import { IS_DEV } from '@/utils/config';

interface Props extends LazyLoadImageProps {
  src: string;
  placeholderScaling?: number;
}

const ImageCloudinary: FunctionComponent<Props> = (props) => {
  const {
    src,
    height,
    width,
    placeholderScaling,
    style,
    ...otherProps
  } = props;

  const isOnMedia = src.startsWith('/media/');
  const source = !isOnMedia ? src : getCloudinaryPath(src);
  const placeholder = !isOnMedia ? src : getCloudinaryPath(src, placeholderScaling);

  return (
    <LazyLoadImage
      {...otherProps}
      src={IS_DEV ? src : source}
      placeholderSrc={IS_DEV ? src : placeholder}
      style={{ ...style, height, width }}
      effect="blur"
    />
  );
};

ImageCloudinary.defaultProps = {
  className: '',
  style: {},
  wrapperClassName: '',
  placeholderScaling: 0.15 /* 15% */
};

export default ImageCloudinary;
