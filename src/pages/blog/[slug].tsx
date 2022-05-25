import { GetStaticPathsResult, GetStaticPropsContext, GetStaticPropsResult, NextPage } from 'next';
import { Fragment } from 'react';
import { Content, Footer, Navbar, Banner, CardHero, withLayoutPage, ContentParser, ContentInfo } from '@/components';
import { getAllBlogPaths, MDContents, parseContent } from '@/server/content-parser';
import { IS_DEV } from '@/utils/config';

type Props = {
  contents: MDContents;
  locale?: string;
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
        contents,
        locale
      }
    };
  }
  return {
    notFound: true
  };
};

const BlogDetailPage: NextPage<Props> = (props) => {
  const { contents, locale } = props;
  const { meta, content } = contents;
  return (
    <Fragment>
      <Navbar />
      <Banner
        bgImage={meta.image}
        className="font-courgette text-white util--text-shadow text-center"
      >
        <div className="-mt-48 px-8 md:px-0">
          <h1 className="font-bold text-xl sm:text-2xl md:text-3xl mb-8 text-white dark:text-white underline" style={{ textUnderlinePosition: 'under' }}>
            {meta.title}
          </h1>
          <p className="font-bold text-base sm:text-lg px-8 text-white dark:text-white leading-tight">
            {meta.description}”
          </p>
          <ContentInfo
            meta={meta}
            locale={locale}
            className="font-poppins text-xs mt-12 opacity-80"
            colorClassName="text-light-50 dark:text-light-50"
          />
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
