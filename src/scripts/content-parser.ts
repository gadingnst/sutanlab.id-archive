import Fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';
import { bundleMDX } from 'mdx-bundler';
import readingTime, { ReadTimeResults } from 'reading-time';
import day from 'utils/day';

import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypePrism from 'rehype-prism-plus';
import rehypeSlug from 'rehype-slug';
import remarkGfm from 'remark-gfm';

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
  readTime?: FormatReadingTime;
}

export interface MDContents {
  slug: string;
  content: string;
  meta: MetaContents;
}

/**
 *
 * @param content - content to be parsed
 * @returns {FormatReadingTime} - formatted reading time
 */
const formatReadingTime = (content: string): FormatReadingTime => {
  const { minutes, ...otherResult } = readingTime(content);
  const cupsCount = Math.round(minutes / 5);
  const cups = `${new Array(cupsCount || 1).fill('☕️').join('')}`;
  return { minutes, cups, ...otherResult };
};

/**
 *
 * @param filePath - path to file
 * @param language - language of file
 * @returns {Promise<string>} - asynchronouse content string
 */
const readContent = async(filePath: string, language = 'en'): Promise<string> => {
  const files = await Fs.readdir(filePath).catch(() => []);
  const file = files.find((file) => file.endsWith(`${language}.md`) || file.endsWith(`${language}.mdx`));
  let fallbackFile;
  if (files.length === 0) throw new Error(`No content found on directory ${filePath}`);
  if (!file) fallbackFile = files.find((file) => file.endsWith('.md') || file.endsWith('.mdx'));
  return Fs.readFile(path.join(filePath, file || fallbackFile as string), 'utf8');
};

export const rootDir = path.join(process.cwd(), 'src');
export const contentsDir = path.join(rootDir, 'contents');

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
 *
 * @param language - language of the content (default: en)
 * @returns {Promise<MDContents[]>} - asynchronous all content meta
 */
export const getBlogList = async(language = 'en'): Promise<MetaContents[]> => {
  const fullPath = path.join(contentsDir, 'posts', 'published');
  const dirs = await Fs.readdir(fullPath).catch(() => []);
  return Promise.all(dirs.map(async(dir) => {
    const filePath = path.join(fullPath, dir);
    const fileContents = await readContent(filePath, language);
    const { content, data } = matter(fileContents);
    const readTime = formatReadingTime(content);
    return { ...data, readTime } as MetaContents;
  }));
};
