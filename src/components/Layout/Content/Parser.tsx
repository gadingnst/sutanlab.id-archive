import { FunctionComponent, PropsWithChildren, useMemo } from 'react';
import { getMDXComponent, MDXContentProps } from 'mdx-bundler/client';
import * as SharedComponents from '@/components';

import clsxm from '@/utils/helpers/clsxm';
import styles from './parser.module.css';
import 'katex/dist/katex.min.css';

export interface Props extends MDXContentProps {
  className?: string;
}

interface ImageProps {
  src: string;
  alt?: string;
}

const Image: FunctionComponent<ImageProps> = (props) => {
  const { src, alt } = props;
  return (
    <span className="w-full">
      <SharedComponents.Image
        className="w-full relative"
        src={src}
        alt={alt}
        layout="responsive"
        height="100%"
        width="100%"
        objectFit="contain"
      />
    </span>
  );
};

const ContentParser: FunctionComponent<PropsWithChildren<Props>> = (props) => {
  const { children, className, components, ...otherProps } = props;

  const Parser = useMemo(() => {
    return getMDXComponent(children as string);
  }, [children]);

  return (
    <div className={clsxm(styles.parser, className)}>
      <Parser
        {...otherProps}
        components={{
          ...components,
          ...SharedComponents,
          a: SharedComponents.Link,
          img: Image
        } as any}
      />
    </div>
  );
};

ContentParser.defaultProps = {
  className: ''
};

export default ContentParser;
