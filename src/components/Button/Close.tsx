import { FunctionComponent } from 'react';
import clsxm from 'utils/helpers/clsxm';
import Button from 'components/Button';
import styles from './close.module.css';

export interface Props {
  className?: string;
  onClick?: () => void;
}

const ButtonClose: FunctionComponent<Props> = (props) => {
  const { onClick, className } = props;

  return (
    <Button
      className={clsxm(styles['close-button'], className)}
      onClick={onClick}
    >
      <span className={clsxm(styles['cross-left'], 'bg-dark-10 dark:bg-white')} />
      <span className={clsxm(styles['cross-right'], 'bg-dark-10 dark:bg-white')} />
    </Button>
  );
};

ButtonClose.defaultProps = {
  className: '',
  onClick: () => void 0
};

export default ButtonClose;
