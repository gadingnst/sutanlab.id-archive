import { GetStaticPropsContext, GetStaticPropsResult, NextPage } from 'next';
import { Fragment } from 'react';
import {
  Content,
  Footer,
  Navbar,
  Banner,
  Card,
  Image,
  withLayoutPage
} from 'components';

import imgBanner from 'assets/images/banners/2.jpg';
import { getBlogList } from 'scripts/content-parser';

type Props = {
  contents: any[];
};

export const getStaticProps = async(ctx: GetStaticPropsContext): Promise<GetStaticPropsResult<Props>> => {
  const { locale } = ctx;
  await getBlogList(locale);
  return {
    props: {
      contents: []
    }
  };
};

const BlogListPage: NextPage<Props> = (props) => {
  const { contents } = props;
  return (
    <Fragment>
      <Navbar />
      <Banner
        bgImage={imgBanner.src}
        className="font-courgette text-white text-shadow text-center"
      >
        <div className="-mt-48">
          <h1 className="font-bold text-4xl mb-8 text-white dark:text-white">
            Blog
          </h1>
          <p className="text-lg px-8 text-white dark:text-white">
            Coding, work, life, and whatever i want.”
          </p>
        </div>
      </Banner>
      <Content className="flex items-center justify-center">
        <div className="grid grid-cols-1 gap-28 max-w-5xl md:grid-cols-2 lg:grid-cols-3 -mt-80">
          {contents.map(item => (
            <Card hoverEffect className="rounded-12 overflow-hidden" key={item.image}>
              <div className="relative w-full h-[200px]">
                <Image
                  src={item.image}
                  layout="fill"
                  objectFit="contain"
                  alt={item.name}
                  className="transition-transform duration-200 hover:scale-110"
                />
              </div>
              <div className="flex flex-col pt-12 pb-16 px-16">
                <p className="mb-4 text-primary dark:text-primary-2">
                  {item.name}
                </p>
                <p className="text-sm">
                  {item.description}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </Content>
      <Footer />
    </Fragment>
  );
};

export default withLayoutPage(BlogListPage, {
  title: 'Blog'
});
