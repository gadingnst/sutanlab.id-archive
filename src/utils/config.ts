process.env;

export const {
  NEXT_PUBLIC_APP_ENVIRONMENT: APP_ENVIRONMENT = 'production'
} = process.env;

export const IS_DEV = APP_ENVIRONMENT !== 'production';
export const PRODUCTION_URL = 'https://gading.dev';
export const SITE_NAME = 'Gading\'s Hideout';
export const AUTHOR_NAME = 'Gading Nasution.';
export const AUTHOR_FULLNAME = 'Sutan Gading Fadhillah Nasution';
export const EMAIL = 'contact@gading.dev';
export const FACEBOOK_USERNAME = 'gadingnstn';
export const TWITTER_USERNAME = 'gadingnstn';
export const INSTAGRAM_USERNAME = 'gadingnst';
export const GITHUB_USERNAME = 'gadingnst';
export const LINKEDIN_USERNAME = 'gadingnst';
export const DISQUS_SHORTNAME = 'sutanlab';
export const BLOG_PAGINATION_LIMIT = 6;
