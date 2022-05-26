import { GetStaticPathsResult } from 'next';
import Fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';
import { bundleMDX } from 'mdx-bundler';
import readingTime, { ReadTimeResults } from 'reading-time';
import day from '@/utils/day';
import { I18n } from '@/types/contents';

import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypePrism from 'rehype-prism-plus';
import rehypeCodeTitles from 'rehype-code-titles';
import rehypeSlug from 'rehype-slug';
import rehypeKatex from 'rehype-katex';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import { DEFAULT_LOCALE } from '@/utils/config';

export interface MetaContents {
  title: string;
  slug: string;
  date: string;
  description: string;
  keywords: string;
  image: string;
  tags: string[];
  readTime: ReadTimeResults;
}

export interface MDContents {
  slug: string;
  content: string;
  meta: MetaContents;
}

export interface MetaLocale {
  meta: MetaContents;
  locale: string;
}

export const rootDir = path.join(process.cwd(), 'src');
export const contentsDir = path.join(rootDir, 'contents');

/**
 *
 * @param fileContents - string file content that have to be read
 * @returns {Promise<MDContents>} - asynchronous content meta & detail
 * @see https://www.learnnext.blog/blogs/lets-build-a-blog-with-tailwind-mdx-bundler-and-next#creating-the-mdxjs-file
 */
async function parseContent(fileContents: string): Promise<MDContents> {
  const result = await bundleMDX({
    source: fileContents,
    cwd: rootDir,
    mdxOptions(options) {
      options.remarkPlugins = [
        ...(options?.remarkPlugins ?? []),
        remarkGfm,
        remarkMath
      ];
      options.rehypePlugins = [
        ...(options?.rehypePlugins ?? []),
        rehypeSlug,
        rehypeCodeTitles,
        rehypePrism,
        rehypeKatex,
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
  const readTime = readingTime(source);
  meta.date = day(meta.date).format('YYYY-MM-DD');
  meta.readTime = readTime;
  return {
    slug: meta.slug,
    meta,
    content
  } as MDContents;
}

/**
 * Get content with multi language with one slug path
 * @param contentPath - path to content
 * @param language - language of the content 'en'|'id'
 * @returns {Promise<MDContents>} - asynchronous content string
 */
export async function getContentMultiLanguage(contentPath: string, language = DEFAULT_LOCALE): Promise<MDContents> {
  const filePath = path.join(contentsDir, contentPath);
  const files = await Fs.readdir(filePath).catch(() => []);
  const file = files.find((file) => file.endsWith(`${language}.md`) || file.endsWith(`${language}.mdx`));
  let fallbackFile;
  if (files.length === 0) throw new Error(`ERRNOTFOUND: No content found on directory ${filePath}`);
  if (!file) fallbackFile = files.find((file) => file.endsWith('.md') || file.endsWith('.mdx'));
  const fileContents = await Fs.readFile(path.join(filePath, file || fallbackFile as string), 'utf8');
  return parseContent(fileContents);
}

export async function getContent(slug: string, language = DEFAULT_LOCALE): Promise<MDContents> {
  const filePath = path.join(contentsDir, 'posts', language, slug);
  const fileContents = await Fs.readFile(`${filePath}.md`, 'utf8')
    .catch((err) => {
      if (err.code === 'ENOENT' && err.message.includes('.md')) {
        return Fs.readFile(`${filePath}.mdx`, 'utf8');
      }
      throw err;
    });
  return parseContent(fileContents);
}

/**
 * Get blog meta information
 * @param slug - slug file with extension
 * @returns {Promise<MetaContents>} - asynchronous content meta
 */
async function getBlogMeta(slug: string, language = DEFAULT_LOCALE): Promise<MetaContents> {
  const blogFile = path.join(contentsDir, 'posts', language, slug);
  const fileContents = await Fs.readFile(blogFile, 'utf8');
  const { content, data } = matter(fileContents);
  data.date = day(data.date).format('YYYY-MM-DD');
  const readTime = readingTime(content);
  return { ...data, readTime } as MetaContents;
}

/**
 * Get all blog static paths
 * @returns {Promise<GetStaticPathsResult['paths']>} - asynchronous next static paths
 */
export async function getAllBlogPaths(): Promise<GetStaticPathsResult['paths']> {
  const paths = await Promise.all(Object.keys(I18n).map(getAllBlogMeta));
  return paths.flat(1).map(({ meta, locale }) => ({
    params: {
      slug: meta.slug
    },
    locale
  }));
}

/**
 * Get all blog meta information
 * @param language - filter language of file 'en'|'id'
 * @returns {Promise<MetaLocale[]>} - asynchronous all blog meta and locale
 */
async function getAllBlogMeta(language = DEFAULT_LOCALE): Promise<MetaLocale[]> {
  const postsPath = path.join(contentsDir, 'posts', language);
  const slugPaths = await Fs.readdir(postsPath).catch(() => []);
  const result = await Promise.all(slugPaths.map(async(slug) => {
    const meta = await getBlogMeta(slug, language);
    return { meta, locale: language };
  }));
  return result;
}

/**
 * Get blog list by language
 * @param language - language of the content (default: en)
 * @returns {Promise<MDContents[]>} - asynchronous all content meta
 */
export async function getBlogList(language = DEFAULT_LOCALE): Promise<MetaContents[]> {
  const contents = await getAllBlogMeta(language);
  return contents
    .sort((a, b) => {
      const dateA = day(a.meta.date);
      const dateB = day(b.meta.date);
      return dateB.isBefore(dateA) ? -1 : 1;
    })
    .map(({ meta }) => meta);
}
