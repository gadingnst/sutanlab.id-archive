import Link from 'components/Link';
import SwitchTheme from 'components/Switch/Theme';
import ButtonClose from 'components/Button/Close';
import { Fragment, FunctionComponent, ReactNode, useState } from 'react';
import { SITE_NAME } from 'utils/config';
import clsxm from 'utils/helpers/clsxm';
import styles from './styles.module.css';
import Icon from 'components/Image/Icon';
import Modal from 'components/Modal';
import Dropdown from 'components/Dropdown';
import { useRouter } from 'next/router';
import { useToggler, useMounted } from 'hooks';
import iconAppLogo from 'assets/icons/app/logo.svg';
import iconHamburger from 'assets/icons/tools/hamburger.svg';

export interface Props {
  title?: ReactNode|string;
  className?: string;
}

export const menus = [
  { label: 'Now', href: '/now' },
  { label: 'Portfolio', href: '/portfolio' },
  { label: 'Blog', href: '/blog' },
  { label: 'About', href: '/about' }
];

export const i18nList = new Map([
  ['en', <>🇺🇸&nbsp;&nbsp;&nbsp;EN</>],
  ['id', <>🇮🇩&nbsp;&nbsp;&nbsp;ID</>]
]);

const Navbar: FunctionComponent<Props> = (props) => {
  const { title, className } = props;
  const [transparent, setTransparent] = useState(true);
  const [modalVisibility, modalToggler] = useToggler();
  const { pathname, locale } = useRouter();

  const headerClass = transparent
    ? 'bg-transparent text-shadow'
    : 'bg-primary shadow-bottom dark:bg-dark-40';

  const onScroll = () => {
    setTransparent(window.scrollY < 80);
  };

  useMounted(() => {
    setTransparent(window.scrollY < 80);
    window.addEventListener('scroll', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  });

  return (
    <Fragment>
      <nav className={clsxm(styles.header, headerClass, className)}>
        <div className={styles['header-container']}>
          <Icon className="inline-block xxs:hidden mr-8" src={iconAppLogo} size={32} />
          <Link
            href="/"
            className="hidden xxs:inline-block mt-4 text-base transition-all duration-150 xs:text-2xl xs:mt-0 text-white dark:text-white hover:scale-105 hover:text-light-50"
          >
            {title}
          </Link>
          <div className="flex flex-grow font-poppins font-bold justify-end items-center xs:ml-16">
            <Dropdown
              className="bg-transparent pt-8 px-8 -mt-[3px]"
              title={i18nList.get(locale || 'en')}
            >
              {Array.from(i18nList).map(([code, label]) => (
                <Link
                  key={code}
                  href={pathname}
                  locale={code}
                  className="text-shadow-none text-white dark:text-white"
                >
                  {label}
                </Link>
              ))}
            </Dropdown>
            <SwitchTheme className="px-8" />
            <div className="hidden md:block">
              {menus.map(({ label, href }, idx) => (
                <Link
                  key={href}
                  href={href}
                  className={clsxm(
                    'font-bold text-lg mx-8 transition-all duration-200 hover:scale-105',
                    idx === (menus.length - 1) ? 'mr-0' : ''
                  )}
                >
                  <span
                    className={clsxm({
                      'text-accent dark:text-accent-2': pathname === href,
                      'text-white dark:text-white': pathname !== href
                    })}
                  >
                    {label}
                  </span>
                </Link>
              ))}
            </div>
            <div className="block ml-12 md:hidden">
              <Icon
                src={iconHamburger}
                className="cursor-pointer"
                onClick={modalToggler}
              />
            </div>
          </div>
        </div>
      </nav>
      <Modal
        show={modalVisibility}
        toggler={modalToggler}
        className={clsxm(
          styles['header-mobile'],
          'bg-white self-start justify-self-center dark:bg-dark-60'
        )}
      >
        <div className="flex items-center justify-between">
          <Link href="/" className="font-courgette transition-all duration-200 font-bold text-xl text-dark dark:text-white hover:scale-105">
            {title}
          </Link>
          <ButtonClose onClick={modalToggler} />
        </div>
        <hr className="my-8" />
        <div className="flex flex-col justify-center">
          {menus.map(({ label, href }, idx) => (
            <Link
              key={href}
              href={href}
              className={clsxm(
                'font-bold my-4 transition-all duration-200 hover:scale-105',
                idx === (menus.length - 1) ? 'mb-0' : '',
                pathname === href
                  ? 'text-accent dark:text-accent-2'
                  : 'text-dark dark:text-white'
              )}
            >
              {label}
            </Link>
          ))}
        </div>
      </Modal>
    </Fragment>
  );
};

Navbar.defaultProps = {
  title: SITE_NAME,
  className: ''
};

export default Navbar;
