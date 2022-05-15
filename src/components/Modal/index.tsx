import { FunctionComponent, PropsWithChildren } from 'react';
import { createPortal } from 'react-dom';
import { useMounted, useToggler } from 'hooks';
import clsxm from 'utils/helpers/clsxm';
import styles from './index.module.css';

export interface Props {
  show: boolean;
  className?: string;
}

const Modal: FunctionComponent<PropsWithChildren<Props>> = (props) => {
  const {
    show,
    className,
    children
  } = props;

  const [renderable, setRenderable] = useToggler();

  useMounted(setRenderable);

  if (renderable) {
    const Component = (
      <div role="dialog" className={styles['modal-overlay']}>
        <div
          className={clsxm([
            styles['modal-container'],
            className
          ])}
        >
          {children}
        </div>
      </div>
    );
    return show ? createPortal(Component, document.body) : null;
  }

  return null;
};

Modal.defaultProps = {
  className: ''
};

export default Modal;
