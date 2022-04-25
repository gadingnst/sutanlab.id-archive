import type { FunctionComponent } from 'react';
import type { AppProps } from 'next/app';
import 'styles/globals.css';

const App: FunctionComponent<AppProps> = (props) => {
  const { Component, pageProps } = props;
  return (
    <Component {...pageProps} />
  );
};

export default App;
