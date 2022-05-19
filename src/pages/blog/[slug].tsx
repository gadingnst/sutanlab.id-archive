import { GetStaticPathsResult, GetStaticPropsResult, NextPage } from 'next';
import { Fragment } from 'react';
import { Content, Footer, Navbar, Banner, CardHero, withLayoutPage } from 'components';

type Props = {
  title: string;
};

export const getStaticPaths = async(): Promise<GetStaticPathsResult> => {
  return {
    paths: [
      {
        params: {
          slug: 'helloworld'
        },
        locale: 'en'
      },
      {
        params: {
          slug: 'helloworld'
        },
        locale: 'id'
      }
    ],
    fallback: false
  };
};

export const getStaticProps = async(): Promise<GetStaticPropsResult<Props>> => {
  return {
    props: {
      title: 'Hello World'
    }
  };
};

const BlogDetailPage: NextPage = () => {
  return (
    <Fragment>
      <Navbar />
      <Banner bgImage="/media/banners/5.jpg" className="font-courgette text-white text-shadow text-center">
        <div className="-mt-48">
          <h1 className="font-bold text-4xl mb-8 text-white dark:text-white">
            Blog
          </h1>
          <p className="text-lg px-8 text-white dark:text-white">
            Coding, work, life, and whatever i want.”
          </p>
        </div>
      </Banner>
      <Content>
        <CardHero>
          <div className="relative flex justify-around mb-56">
            <h2>🚧 Under Construction.</h2>
          </div>
        </CardHero>
      </Content>
      <Footer />
    </Fragment>
  );
};

export default withLayoutPage(BlogDetailPage, {
  title: 'Blog'
});
