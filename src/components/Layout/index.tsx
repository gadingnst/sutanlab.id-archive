import { NextPage } from 'next';
import { FunctionComponent, Fragment, PropsWithChildren } from 'react';
import Head from 'components/Head';
import { SITE_NAME } from 'utils/config';

export interface Props {
  title: string;
}

export type UnknownProps = Record<string, unknown>;

const Layout: FunctionComponent<PropsWithChildren<Props>> = (props) => {
  const { children, title } = props;

  return (
    <Fragment>
      <Head>
        <title>
          {title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`}
        </title>
      </Head>
      <div className="flex flex-col min-h-screen">
        {children}
      </div>
    </Fragment>
  );
};

export const withLayoutPage = <T extends UnknownProps>(
  PageComponent: NextPage<T>, layoutProps: Props
) => {
  const LayoutPage: FunctionComponent<T> = (pageProps) => {
    return (
      <Layout {...layoutProps}>
        <PageComponent {...pageProps} />
      </Layout>
    );
  };
  return LayoutPage;
};

export default Layout;
