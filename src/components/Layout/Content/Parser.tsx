import { FunctionComponent, PropsWithChildren, useMemo } from 'react';
import { getMDXComponent, MDXContentProps } from 'mdx-bundler/client';
import * as SharedComponents from 'components';

import clsxm from 'utils/helpers/clsxm';
import styles from './parser.module.css';

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
        components={{ ...components, ...SharedComponents } as any}
      />
    </div>
  );
};

ContentParser.defaultProps = {
  className: ''
};

export default ContentParser;
