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

export interface MetaContents {
  title: string;
  slug: string;
  date: string;
  description: string;
  keywords: string;
  image: string;
  tags: string[];
  sourceCSS: string[];
  sourceJS: string[];
}

export interface FormatReadingTime extends ReadTimeResults {
  cups: string;
}

export interface MDContents {
  slug: string;
  content: string;
  meta: MetaContents;
  readTime: FormatReadingTime;
}

/**
 *
 * @param content content to be parsed
 * @returns formatted reading time
 */
const formatReadingTime = (content: string): FormatReadingTime => {
  const { minutes, ...otherResult } = readingTime(content);
  const cupsCount = Math.round(minutes / 5);
  const cups = `${new Array(cupsCount || 1).fill('☕️').join('')}`;
  return { minutes, cups, ...otherResult };
};

export const rootDir = path.join(process.cwd(), 'src');
export const contentsDir = path.join(rootDir, 'contents');

/**
 *
 * @param slugParam slug of the content
 * @param language language of the content (default: en)
 * @see https://www.learnnext.blog/blogs/lets-build-a-blog-with-tailwind-mdx-bundler-and-next#creating-the-mdxjs-file
 * @returns content meta & detail
 */
async function parseContent(slugParam: string, language = 'en'): Promise<MDContents> {
  const slug = slugParam.replace(/\.(md|mdx)$/, '');
  const fullPath = path.join(contentsDir, slug);
  const files = await Fs.readdir(fullPath).catch(() => []);
  const file = files.find((file) => file.endsWith(`${language}.md`) || file.endsWith(`${language}.mdx`));
  let fallbackFile;

  if (files.length === 0) throw new Error(`No content found on directory ${fullPath}`);
  if (!file) fallbackFile = files.find((file) => file.endsWith('.md') || file.endsWith('.mdx'));
  const fileContents = await Fs.readFile(path.join(fullPath, file || fallbackFile as string), 'utf8');

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
  return { slug, meta, content, readTime } as MDContents;
}

export default parseContent;
