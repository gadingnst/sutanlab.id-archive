import { FunctionComponent } from 'react';
import { Link, Button } from '@/components';
import { AUTHOR_NAME, GITHUB_USERNAME, PRODUCTION_URL, SITE_NAME } from '@/utils/config';
import clsxm from '@/utils/helpers/clsxm';
import styles from './styles.module.css';

export interface Props {
  className?: string;
}

const Footer: FunctionComponent<Props> = (props) => {
  const { className } = props;
  return (
    <footer className={clsxm('w-full h-full', className, styles.footer)}>
      <div className="flex container mx-auto my-64 flex-col justify-between max-w-5xl lg:flex-row">
        <p className="text-2xl text-left">
          Let&lsquo;s get in touch on my social.
        </p>
        <div className="relative h-full my-24 lg:my-0">
          <Button
            href="#"
            className="bg-primary text-white rounded-8 p-8 mx-4 dark:text-white"
          >
            H
          </Button>
          <Button
            href="#"
            className="bg-primary text-white rounded-8 p-8 mx-4 dark:text-white"
          >
            H
          </Button>
          <Button
            href="#"
            className="bg-primary text-white da rounded-8 p-8 mx-4 dark:text-whitev"
          >
            H
          </Button>
          <Button
            href="#"
            className="bg-primary text-white rounded-8 p-8 mx-4 dark:text-white"
          >
            H
          </Button>
          <Button
            href="#"
            className="bg-primary text-white rounded-8 p-8 mx-4 dark:text-white"
          >
            H
          </Button>
          <Button
            href="#"
            className="bg-primary text-white rounded-8 p-8 mx-4 dark:text-white"
          >
            H
          </Button>
        </div>
      </div>
      <hr className="container max-w-5xl" />
      <div className="container w-full mx-auto my-48 text-sm max-w-5xl">
        <span className="inline-block">&copy;&nbsp;{new Date().getFullYear()}&nbsp;</span>
        <Link className="inline-block" href={PRODUCTION_URL}>{SITE_NAME}</Link>
        <span className="inline-block">&nbsp;&bull;&nbsp;</span>
        <Link className="inline-block" href={`https://github.com/${GITHUB_USERNAME}/gading.dev`}>Built</Link>
        <span className="inline-block">&nbsp;with&nbsp;</span>
        <span className="inline-block util--underline-dotted">Bullshit</span>
        <span className="inline-block">&nbsp;by&nbsp;</span>
        <Link className="inline-block text-primary" href={`https://github.com/${GITHUB_USERNAME}`}>
          {AUTHOR_NAME}
        </Link>
        <div className="-ml-4 dark:text-white">
          <span className="inline-block">&nbsp;See colors system&nbsp;</span>
          <Link className="inline-block text-primary" href="/docs/colors">
            here.
          </Link>
        </div>
      </div>
    </footer>
  );
};

Footer.defaultProps = {
  className: ''
};

export default Footer;
