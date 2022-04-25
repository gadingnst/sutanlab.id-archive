import { NextPage } from 'next';
import { Fragment } from 'react';
import { Content, Footer, Navbar, Banner, CardHero, withLayoutPage } from 'components';

import imgBanner from 'assets/images/banners/5.jpg';

const BlogPage: NextPage = () => {
  return (
    <Fragment>
      <Navbar />
      <Banner bgImage={imgBanner.src} className="font-courgette text-white text-shadow text-center">
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

export default withLayoutPage(BlogPage, {
  title: 'Blog'
});
