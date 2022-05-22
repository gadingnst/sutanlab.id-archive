import { GetStaticPropsContext, GetStaticPropsResult, NextPage } from 'next';
import { Fragment } from 'react';
import {
  Content,
  Footer,
  Navbar,
  Banner,
  Card,
  Image,
  withLayoutPage,
  Link
} from '@/components';
import { getBlogList, MetaContents } from '@/server/content-parser';

type Props = {
  contents: MetaContents[];
};

export const getStaticProps = async(ctx: GetStaticPropsContext): Promise<GetStaticPropsResult<Props>> => {
  const { locale } = ctx;
  const contents = await getBlogList(locale);
  return {
    props: {
      contents: JSON.parse(JSON.stringify(contents))
    }
  };
};

const BlogListPage: NextPage<Props> = (props) => {
  const { contents } = props;
  return (
    <Fragment>
      <Navbar />
      <Banner
        bgImage="/media/banners/5.jpg"
        className="font-courgette text-white util--text-shadow text-center"
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
        <div className="grid grid-cols-1 gap-28 max-w-5xl md:grid-cols-2 -mt-80">
          {contents.map(item => (
            <Card hoverEffect className="rounded-12 overflow-hidden" key={item.slug}>
              <div className="relative w-full h-[200px]">
                <Image
                  priority
                  src={item.image}
                  layout="fill"
                  objectFit="contain"
                  alt={item.title}
                  placeholder="empty"
                  className="transition-transform duration-200 hover:scale-110"
                />
              </div>
              <div className="flex flex-col pt-12 pb-16 px-16">
                <Link
                  href="/blog/[slug]"
                  asPath={`/blog/${item.slug}`}
                  className="mb-4 text-primary dark:text-primary-2"
                >
                  {item.title}
                </Link>
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
