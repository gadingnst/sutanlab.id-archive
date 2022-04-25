import { NextPage } from 'next';
import { Fragment } from 'react';
import { Content, Footer, Navbar, Banner, CardHero, Image, withLayoutPage } from 'components';
import { AUTHOR_NAME } from 'utils/config';

import styles from 'styles/pages/about.module.css';
import imgBanner from 'assets/images/banners/0.jpg';
import imgProfile from 'assets/images/authors/gading-talks.jpeg';

const AboutPage: NextPage = () => {
  return (
    <Fragment>
      <Navbar />
      <Banner bgImage={imgBanner.src} className="font-courgette text-white text-shadow text-center">
        <div className="-mt-48">
          <h1 className="font-bold text-4xl mb-8 text-white dark:text-white">
            {AUTHOR_NAME}
          </h1>
          <p className="text-lg px-8 text-white dark:text-white">
            Just an ordinary Man who turns a ☕️ into beautiful &lt; /&gt;.”
          </p>
        </div>
      </Banner>
      <Content>
        <CardHero>
          <div className="relative flex justify-around mb-56">
            <div>
              <p>Hello</p>
            </div>
            <div className={styles['profile-pic']}>
              <Image
                classNameWrapper="absolute rounded-full mx-auto shadow-all transition-all hover:-mt-12"
                src={imgProfile}
                alt={AUTHOR_NAME}
                width={180}
                height={180}
                placeholder="blur"
                layout="responsive"
              />
            </div>
            <div>
              <p>World</p>
            </div>
          </div>
          <div>
            <h2 className="text-center">🚧 Under Construction.</h2>
          </div>
        </CardHero>
      </Content>
      <Footer />
    </Fragment>
  );
};

export default withLayoutPage(AboutPage, {
  title: 'About'
});
