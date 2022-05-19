/* eslint-disable @next/next/no-img-element */
import { FunctionComponent, MouseEventHandler, useCallback, useRef } from 'react';
import NextImage, { ImageProps } from 'next/image';
import SVG from 'react-inlinesvg';
import clsxm from 'utils/helpers/clsxm';

export type Props = ImageProps & {
  src: ImageProps['src'];
  inline?: boolean;
  fallbackSrc?: string;
  classNameWrapper?: string;
  onClick?: MouseEventHandler<HTMLImageElement> | MouseEventHandler<SVGAElement>;
};

export const DEFAULT = 'data:image/gif;base64,R0lGODlhAQABAIAAAMLCwgAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw==';

const Image: FunctionComponent<Props> = (props) => {
  const {
    inline,
    fallbackSrc,
    classNameWrapper,
    ...nextImageProps
  } = props;

  const {
    src,
    alt,
    className,
    width,
    height,
    onClick
  } = nextImageProps;

  const source = (src as any)?.src || src || fallbackSrc || DEFAULT;
  const isSvg = source.endsWith('.svg');
  const imgRef = useRef<HTMLImageElement>(null);

  let Component = <NextImage {...nextImageProps} />;

  const onError = useCallback(() => {
    if (imgRef.current) {
      imgRef.current.src = fallbackSrc || DEFAULT;
    }
  }, []);

  if (isSvg && inline) {
    Component = (
      <SVG
        cacheRequests
        src={source}
        className={className}
        width={width}
        height={height}
        onClick={onClick as MouseEventHandler<SVGAElement>}
      >
        <img
          ref={imgRef}
          src={source}
          onError={onError}
          className={className}
          width={width}
          height={height}
          alt={alt}
        />
      </SVG>
    );
  }

  return !classNameWrapper ? Component : (
    <div
      className={clsxm('inline-block overflow-hidden', classNameWrapper)}
      style={{ width, height }}
    >
      {Component}
    </div>
  );
};

Image.defaultProps = {
  className: '',
  classNameWrapper: '',
  fallbackSrc: '',
  inline: false,
  onClick: () => void 0
};

export default Image;
