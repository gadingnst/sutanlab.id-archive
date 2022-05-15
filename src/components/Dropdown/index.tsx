import Button from 'components/Button';
import Icon from 'components/Image/Icon';
import { FunctionComponent, PropsWithChildren, ReactNode, useRef } from 'react';
import clsxm from 'utils/helpers/clsxm';
import styles from './index.module.css';
import iconCaretDown from 'assets/icons/tools/caret-down.svg';
import { useToggler, useOutsideClick } from 'hooks';

export interface Props {
  title?: ReactNode;
  className?: string;
  contentClassName?: string;
}

const Dropdown: FunctionComponent<PropsWithChildren<Props>> = (props) => {
  const {
    title,
    children,
    className,
    contentClassName
  } = props;

  const [show, toggler] = useToggler();
  const refContent = useRef<HTMLDivElement>(null);

  useOutsideClick(() => {
    toggler(false);
  }, refContent);

  return (
    <div
      className={clsxm(
        styles.dropdown,
        className
      )}
    >
      <Button
        onClick={toggler}
        className={styles.button}
      >
        {title} <Icon src={iconCaretDown} size={12} className="-mt-4" />
      </Button>
      {show && (
        <div
          ref={refContent}
          className={clsxm(
            styles['dropdown-content'],
            'bg-primary dark:bg-dark-40',
            contentClassName
          )}
        >
          {children}
        </div>
      )}
    </div>
  );
};

Dropdown.defaultProps = {
  title: '',
  className: 'bg-primary text-white'
};

export default Dropdown;
