import { FunctionComponent } from 'react';
import { LazyLoadImage, LazyLoadImageProps } from 'react-lazy-load-image-component';
import { useToggler } from '@/hooks';
import cloudinary from '@/utils/helpers/cloudinary';
import clsxm from '@/utils/helpers/clsxm';
import { IS_DEV } from '@/utils/config';
import styles from './cloudinary.module.css';

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
    className,
    ...otherProps
  } = props;

  const [loading, setLoading] = useToggler(true);
  const isOnMedia = src.startsWith('/media/');
  const source = !isOnMedia ? src : cloudinary(src);
  const placeholder = !isOnMedia ? src : cloudinary(src, placeholderScaling);

  return (
    <span className="flex relative items-center justify-center">
      <LazyLoadImage
        {...otherProps}
        src={IS_DEV ? src : source}
        placeholderSrc={IS_DEV ? src : placeholder}
        style={{ ...style, height, width }}
        effect="blur"
        afterLoad={setLoading}
        className={clsxm('min-h-[50px]', className)}
      />
      {loading && (
        <span className={clsxm(styles.spinner, 'absolute')} />
      )}
    </span>
  );
};

ImageCloudinary.defaultProps = {
  className: '',
  style: {},
  wrapperClassName: '',
  placeholderScaling: 0.15 /* 15% */
};

export default ImageCloudinary;
