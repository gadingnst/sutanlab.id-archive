import { GetStaticPropsResult, NextPage } from 'next';
import { Content, Footer, Navbar, Banner, CardHero, Layout, ContentParser } from 'components';

import imgBanner from 'assets/images/banners/8.jpg';
import parseContent, { MDContents } from 'utils/scripts/content-parser';

interface Props {
  contents: MDContents;
}

export const getStaticProps = async(): Promise<GetStaticPropsResult<Props>> => {
  const contents = await parseContent('now');
  return {
    props: {
      contents
    }
  };
};

const NowPage: NextPage<Props> = (props) => {
  const { contents } = props;
  const { meta, content } = contents;
  return (
    <Layout title={meta.title}>
      <Navbar />
      <Banner
        bgImage={imgBanner.src}
        className="font-courgette text-white text-shadow text-center"
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
    </Layout>
  );
};

export default NowPage;
