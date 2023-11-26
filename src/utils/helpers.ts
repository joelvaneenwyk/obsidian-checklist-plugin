import { TFile, Vault, parseFrontMatterTags, type CachedMetadata } from 'obsidian';

import { LOCAL_SORT_OPT } from '../constants';

import type { KeyConstraint, LinkMeta, SortDirection, TagMeta } from 'src/@types/tasklist';

export const isMacOS = () => window.navigator.userAgent.includes('Macintosh');
export const classifyString = (str: string) => {
  const sanitizedGroupName = (str ?? '').replace(/[^A-Za-z\d]/g, '');
  const dasherizedGroupName = sanitizedGroupName.replace(/^([A-Z])|[\s\\._](\w)/g, function (_, p1, p2) {
    if (p2) return '-' + p2.toLowerCase();
    return p1.toLowerCase();
  });
  return dasherizedGroupName;
};

export const removeTagFromText = (text: string, tag: string | null | undefined) => {
  if (!text) return '';
  if (!tag) return text.trim();
  return text.replace(new RegExp(`\\s?\\#${tag}[^\\s]*`, 'g'), '').trim();
};

export const getTagMeta = (tag: string): TagMeta => {
  const tagMatch = /^#([^/]+)\/?(.*)?$/.exec(tag);
  if (!tagMatch) return { main: null, sub: null };
  const [full, main, sub] = tagMatch;
  return { main, sub };
};

export const retrieveTag = (tagMeta: TagMeta): string => {
  return tagMeta.main ? tagMeta.main : tagMeta.sub ? tagMeta.sub : '';
};

export const mapLinkMeta = (linkMeta: LinkMeta[]) => {
  const map = new Map<string, LinkMeta>();
  for (const link of linkMeta) map.set(link.filePath, link);
  return map;
};

export const setLineTo = (line: string, setTo: boolean) =>
  line.replace(/^((\s|>)*([\-*]|\d+\.)\s\[)([^\]]+)(\].*$)/, `$1${setTo ? 'x' : ' '}$5`);

export const getAllLinesFromFile = (cache: string) => cache.split(/\r?\n/);
export const combineFileLines = (lines: string[]) => lines.join('\n');
export const lineIsValidTodo = (line: string) => {
  return /^(\s|>)*([\-*]|\d+\.)\s\[(.)\]\s{1,4}\S+/.test(line);
};
export const extractTextFromTodoLine = (line: string) =>
  /^(\s|>)*([\-*]|\d+\.)\s\[(.)\]\s{1,4}(\S.*)$/.exec(line)?.[4] ?? line;
export const getIndentationSpacesFromTodoLine = (line: string) =>
  /^(\s*)([\-*]|\d+\.)\s\[(.)\]\s{1,4}(\S+)/.exec(line)?.[1]?.length ?? 0;
export const todoLineIsChecked = (line: string) => /^(\s|>)*([-*]|\d+\.)\s\[(\S)\]/.test(line);
export const getFileLabelFromName = (filename: string): string => /^(.+)\.md$/.exec(filename)?.[1] ?? filename;

type CreateMutable<Type> = {
  -readonly [Property in keyof Type]: Type[Property];
};

/**
 * This function sorts the items by name or by date, depending on the direction
 * @param items - The items to sort
 * @param direction - The direction to sort the items in
 * @param sortByNameKey - The key to sort by name
 * @param sortByTimeKey - The key to sort by time
 */
export function sortGenericItemsInplace<
  Key extends string | number | symbol,
  Value,
  T extends Record<Key, Value>,
  VName extends KeyConstraint<T, string>,
  VTime extends KeyConstraint<T, number>
>(items: T[], direction: SortDirection | null, sortByNameKey: VName, sortByTimeKey: VTime) {
  if (sortByNameKey !== undefined && (direction === null || direction === 'a->z')) {
    items.sort((a, b) =>
      // @ts-ignore
      a[sortByNameKey].localeCompare(b[sortByNameKey], navigator.language, LOCAL_SORT_OPT)
    );
  }
  if (direction === 'z->a') {
    items.sort((a, b) =>
      // @ts-ignore
      b[sortByNameKey].localeCompare(a[sortByNameKey], navigator.language, LOCAL_SORT_OPT)
    );
  }
  if (direction === 'new->old' && sortByTimeKey !== undefined) {
    // @ts-ignore
    items.sort((a: T, b: T) => b[sortByTimeKey] - a[sortByTimeKey]);
  }
  if (direction === 'old->new' && sortByTimeKey) {
    // @ts-ignore
    items.sort((a: T, b: T) => a[sortByTimeKey] - b[sortByTimeKey]);
  }
}

export function ensureMdExtension(path?: string) {
  if (path) {
    if (!/\.md$/.test(path)) {
      return `${path}.md`;
    }
  }
  return path;
}

// #todo #jve Review this after manual testing.
export function getFrontmatterTags(cache: CachedMetadata | null, todoTags: string[] = []) {
  const frontMatterTags: string[] = parseFrontMatterTags(cache?.frontmatter) ?? [];
  return frontMatterTags.filter((tag: string) => {
    const mainTag = getTagMeta(tag).main;
    return !todoTags || !mainTag || todoTags.includes(mainTag);
  });
}

// #todo #jve Review this after manual testing.
export function getAllTagsFromMetadata(cache: CachedMetadata | null): string[] {
  if (!cache) return [];
  const frontmatterTags = getFrontmatterTags(cache);
  const blockTags = (cache.tags ?? []).map((e) => e.tag);
  return [...frontmatterTags, ...blockTags];
}

// #todo #jve Review this after manual testing.
export function getFileFromPath(vault: Vault, path?: string): TFile | null {
  let file: TFile | null = null;
  if (path) {
    const abstractFile = vault.getAbstractFileByPath(path);
    if (abstractFile instanceof TFile) {
      file = abstractFile;
    } else {
      const files = vault.getFiles();
      file ??= files.find((file) => file instanceof TFile && file.name === path) ?? null;
    }
  }
  return file;
}
