import { FunctionComponent, PropsWithChildren, useMemo } from 'react';
import { getMDXComponent, MDXContentProps } from 'mdx-bundler/client';
import * as SharedComponents from '@/components';

import clsxm from '@/utils/helpers/clsxm';
import styles from './parser.module.css';
import 'katex/dist/katex.min.css';
import 'react-lazy-load-image-component/src/effects/blur.css';

export interface Props extends MDXContentProps {
  className?: string;
}

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
          a: SharedComponents.Link,
          img: SharedComponents.ImageCloudinary
        } as any}
      />
    </div>
  );
};

ContentParser.defaultProps = {
  className: ''
};

export default ContentParser;
