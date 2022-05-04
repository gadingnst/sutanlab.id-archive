import type { AppProps } from 'next/app';
import { Fragment, FunctionComponent } from 'react';
import NProgress from 'nextjs-progressbar';
import useAppTheme from 'hooks/stores/useAppTheme';
import 'styles/globals.css';

const App: FunctionComponent<AppProps> = (props) => {
  const { Component, pageProps } = props;
  const [theme] = useAppTheme();
  const nprogressColor = theme.current === 'light' ? '#B89BFF' : '#5E72E4';
  return (
    <Fragment>
      <NProgress color={nprogressColor} />
      <Component {...pageProps} />
    </Fragment>
  );
};

export default App;
