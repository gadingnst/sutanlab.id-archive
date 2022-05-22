import { GetStaticPathsResult, GetStaticPropsContext, GetStaticPropsResult, NextPage } from 'next';
import { Fragment } from 'react';
import { Content, Footer, Navbar, Banner, CardHero, withLayoutPage, ContentParser } from '@/components';
import { getAllBlogPaths, MDContents, parseContent } from '@/server/content-parser';
import { IS_DEV } from '@/utils/config';

type Props = {
  contents: MDContents;
};

export const getStaticPaths = async(): Promise<GetStaticPathsResult> => {
  const paths = await getAllBlogPaths();
  return {
    paths,
    fallback: false
  };
};

export const getStaticProps = async(ctx: GetStaticPropsContext): Promise<GetStaticPropsResult<Props>> => {
  const { locale, params } = ctx;
  const { slug } = params as any;
  const contents = await parseContent(`posts/published/${slug}`, locale)
    .catch((err: any) => {
      if (IS_DEV && err.message.includes('ERRNOTFOUND')) {
        return parseContent(`posts/drafts/${slug}`, locale);
      }
      return null;
    });
  if (contents) {
    return {
      props: {
        contents
      }
    };
  }
  return {
    notFound: true
  };
};

const BlogDetailPage: NextPage<Props> = (props) => {
  const { contents } = props;
  const { meta, content } = contents;
  return (
    <Fragment>
      <Navbar />
      <Banner
        bgImage={meta.image}
        className="font-courgette text-white util--text-shadow text-center"
      >
        <div className="-mt-48">
          <h1 className="font-bold text-4xl mb-8 text-white dark:text-white">
            {meta.title}
          </h1>
          <p className="text-lg px-8 text-white dark:text-white">
            {meta.description}”
          </p>
        </div>
      </Banner>
      <Content>
        <CardHero>
          <ContentParser>
            {content}
          </ContentParser>
        </CardHero>
      </Content>
      <Footer />
    </Fragment>
  );
};

export default withLayoutPage(BlogDetailPage, (props) => {
  const { title } = props.contents.meta;
  return {
    title
  };
});
