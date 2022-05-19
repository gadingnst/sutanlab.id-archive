import { FunctionComponent, MouseEvent, PropsWithChildren, useCallback } from 'react';
import { useRouter } from 'next/router';
import { isURL } from 'utils/helpers/url';

export interface Props {
  to?: string;
  href?: string;
  className?: string;
  disabled?: boolean;
  target?: string;
  title?: string;
  locale?: string;
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
    locale,
    onClick
  } = props;

  const link = href || to;

  const clickHandler = useCallback((event: MouseEvent<HTMLAnchorElement, globalThis.MouseEvent>) => {
    event.preventDefault();
    if (onClick && !disabled) onClick(event);
    if (link && !disabled && link !== '#') {
      if (isURL(link)) {
        window.open(link, target);
      } else {
        if (locale) {
          router.push(link, link, { locale });
        } else {
          router.push(link);
        }
      }
    }
  }, []);

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
