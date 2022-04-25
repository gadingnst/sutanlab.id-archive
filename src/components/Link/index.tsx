import { FunctionComponent, MouseEvent, PropsWithChildren } from 'react';
import { useRouter } from 'next/router';
import { isURL } from 'utils/helpers/url';

export interface Props {
  to?: string;
  href?: string;
  className?: string;
  disabled?: boolean;
  target?: string;
  title?: string;
  onClick?: (event: MouseEvent<HTMLAnchorElement, globalThis.MouseEvent>) => void;
}

const Link: FunctionComponent<PropsWithChildren<Props>> = (props) => {
  const router = useRouter();

  const {
    children,
    href,
    to,
    disabled,
    className,
    title,
    target,
    onClick
  } = props;

  const link = href || to;

  const clickHandler = (event: MouseEvent<HTMLAnchorElement, globalThis.MouseEvent>) => {
    event.preventDefault();
    if (onClick && !disabled) {
      onClick(event);
    } else if (link && !disabled && link !== '#') {
      if (isURL(link)) {
        window.open(link, target);
      } else {
        router.push(link);
      }
    }
  };

  let classes = className;
  if (disabled) classes += ' cursor-not-allowed';

  return (
    <a role="link" className={classes} href={link} onClick={clickHandler} title={title}>
      {children}
    </a>
  );
};

Link.defaultProps = {
  to: '',
  href: '',
  className: 'text-primary dark:text-accent-2',
  disabled: false,
  target: '_blank',
  title: ''
};

export default Link;
