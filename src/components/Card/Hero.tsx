import { FunctionComponent, PropsWithChildren } from 'react';
import Card, { Props as CardProps } from 'components/Card';
import clsxm from 'utils/helpers/clsxm';

const CardHero: FunctionComponent<PropsWithChildren<CardProps>> = (props) => {
  const { className, children, ...cardProps } = props;
  return (
    <Card
      {...cardProps}
      className={clsxm(
        'min-h-[500px] max-w-5xl rounded-24 p-16 mx-auto -mt-80 md:py-24 md:px-32',
        className
      )}
    >
      {children}
    </Card>
  );
};

export default CardHero;
