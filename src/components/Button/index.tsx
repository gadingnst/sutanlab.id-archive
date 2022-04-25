import { FunctionComponent, PropsWithChildren } from 'react';
import clsxm from 'utils/helpers/clsxm';

export interface Props {
  text?: string;
  className?: string;
  href?: string;
  onClick?: () => void;
}

const Button: FunctionComponent<PropsWithChildren<Props>> = (props) => {
  const {
    text,
    children,
    className,
    href,
    onClick
  } = props;

  const Tag = `${href ? 'a' : 'button'}` as keyof JSX.IntrinsicElements;

  return (
    <Tag
      role="button"
      className={clsxm('relative cursor-pointer transition-all rounded-8 p-8', className)}
      onClick={onClick}
      {...(href ? { href } : {})}
    >
      {children || text}
    </Tag>
  );
};

Button.defaultProps = {
  text: '',
  className: 'bg-primary text-white',
  href: '',
  onClick: () => void 0
};

export default Button;
