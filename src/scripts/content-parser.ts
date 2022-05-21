import Fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';
import { bundleMDX } from 'mdx-bundler';
import readingTime, { ReadTimeResults } from 'reading-time';
import day from 'utils/day';
import { IS_DEV } from 'utils/config';
import { I18n } from 'types/contents';

import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypePrism from 'rehype-prism-plus';
import rehypeSlug from 'rehype-slug';
import remarkGfm from 'remark-gfm';
import { GetStaticPathsResult } from 'next';

export interface FormatReadingTime extends ReadTimeResults {
  cups: string;
}

export interface MetaContents {
  title: string;
  slug: string;
  date: Date|string;
  description: string;
  keywords: string;
  image: string;
  tags: string[];
  sourceCSS: string[];
  sourceJS: string[];
  readTime: FormatReadingTime;
}

export interface MDContents {
  slug: string;
  content: string;
  meta: MetaContents;
}

export const rootDir = path.join(process.cwd(), 'src');
export const contentsDir = path.join(rootDir, 'contents');

/**
 *
 * @param content - content to be parsed
 * @returns {FormatReadingTime} - formatted reading time
 */
function formatReadingTime(content: string): FormatReadingTime {
  const { minutes, ...otherResult } = readingTime(content);
  const cupsCount = Math.round(minutes / 5);
  const cups = `${new Array(cupsCount || 1).fill('☕️').join('')}`;
  return { minutes, cups, ...otherResult };
}

/**
 *
 * @param filePath - path to file
 * @param language - language of file
 * @returns {Promise<string>} - asynchronouse content string
 */
async function readContent(filePath: string, language = 'en'): Promise<string> {
  const files = await Fs.readdir(filePath).catch(() => []);
  const file = files.find((file) => file.endsWith(`${language}.md`) || file.endsWith(`${language}.mdx`));
  let fallbackFile;
  if (files.length === 0) throw new Error(`ERRNOTFOUND: No content found on directory ${filePath}`);
  if (!file) fallbackFile = files.find((file) => file.endsWith('.md') || file.endsWith('.mdx'));
  return Fs.readFile(path.join(filePath, file || fallbackFile as string), 'utf8');
}

/**
 *
 * @param filePath - slug path to file
 * @param language - language of file (default: en)
 * @returns {Promise<MetaContents>} - asynchronous content meta
 */
async function getBlogMeta(filePath: string, language: string): Promise<MetaContents> {
  const fileContents = await readContent(filePath, language);
  const { content, data } = matter(fileContents);
  const readTime = formatReadingTime(content);
  return { ...data, readTime } as MetaContents;
}

/**
 * @param type - type of content published or drafts
 * @returns - MetaContents and locale
 */
async function getAllPostMeta(type: 'published'|'drafts') {
  const postsPath = path.join(contentsDir, 'posts');
  const filePath = path.join(postsPath, type);
  const slugPaths = await Fs.readdir(filePath).catch(() => []);
  const result = await Promise.all(slugPaths.map(async(slugPath) => {
    const blogPaths = path.join(filePath, slugPath);
    const i18n = Object.values(I18n);
    return Promise.all(i18n.map(async language => {
      const meta = await getBlogMeta(blogPaths, language);
      return {
        meta,
        locale: language.replace(/\.(md|mdx)$/, '')
      };
    }));
  }));
  return result.flat(1);
}

/**
 *
 * @param slugParam - slug of the content
 * @param language - language of the content (default: en)
 * @returns {Promise<MDContents>} - asynchronous content meta & detail
 * @see https://www.learnnext.blog/blogs/lets-build-a-blog-with-tailwind-mdx-bundler-and-next#creating-the-mdxjs-file
 */
export async function parseContent(slugParam: string, language = 'en'): Promise<MDContents> {
  const slug = slugParam.replace(/\.(md|mdx)$/, '');
  const fullPath = path.join(contentsDir, slug);
  const fileContents = await readContent(fullPath, language);
  const result = await bundleMDX({
    source: fileContents,
    cwd: rootDir,
    mdxOptions(options) {
      options.remarkPlugins = [...(options?.remarkPlugins ?? []), remarkGfm];
      options.rehypePlugins = [
        ...(options?.rehypePlugins ?? []),
        rehypeSlug,
        rehypePrism,
        [
          rehypeAutolinkHeadings,
          {
            properties: {
              className: ['hash-anchor']
            }
          }
        ]
      ];
      return options;
    }
  });
  const source = matter(fileContents).content;
  const { code: content, frontmatter: meta } = result;
  const readTime = formatReadingTime(source);
  meta.date = day(meta.date).format('YYYY-MM-DD');
  meta.readTime = readTime;
  return { slug, meta, content } as MDContents;
}

/**
 * Get all blog static paths
 * @returns {Promise<GetStaticPathsResult['paths']>} - Next static paths
 */
export async function getBlogPaths(): Promise<GetStaticPathsResult['paths']> {
  const [published, draft] = await Promise.all([
    getAllPostMeta('published'),
    IS_DEV ? Promise.resolve([]) : getAllPostMeta('drafts')
  ]);
  return [...published, ...draft].map(({ meta, locale }) => ({
    params: {
      slug: meta.slug
    },
    locale
  }));
}

/**
 *
 * @param language - language of the content (default: en)
 * @returns {Promise<MDContents[]>} - asynchronous all content meta
 */
export async function getBlogList(language = 'en'): Promise<MetaContents[]> {
  const fullPath = path.join(contentsDir, 'posts', 'published');
  const dirs = await Fs.readdir(fullPath).catch(() => []);
  return Promise.all(dirs.map(async(dir) => {
    const filePath = path.join(fullPath, dir);
    return getBlogMeta(filePath, language);
  }));
}
