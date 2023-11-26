import type { CachedMetadata, TagCache, TFile } from 'obsidian';

export type TodoItem = {
  checked: boolean;
  filePath: string;
  fileName: string;
  fileLabel: string;
  fileCreatedTs: number;
  // #todo #jve Review this after manual testing.
  mainTag?: string | null;
  // #todo #jve Review this after manual testing.
  subTag?: string | null;
  line: number;
  spacesIndented: number;
  fileInfo: FileInfo;
  originalText: string;
  rawHTML: string;
};

type BaseGroup = {
  type: GroupByType;
  todos: TodoItem[];
  id: string;
  sortName: string;
  className: string;
  oldestItem: number;
  newestItem: number;
  groups?: TodoGroup[];
};

export type PageGroup = BaseGroup & {
  type: 'page';
  pageName?: string;
};
export type TagGroup = BaseGroup & {
  type: 'tag';
  // #todo #jve Review this after manual testing.
  mainTag?: string | null;
  // #todo #jve Review this after manual testing.
  subTags?: string | null;
};

export type TodoGroup = PageGroup | TagGroup;

export type FileInfo = {
  content: string;
  cache: CachedMetadata;
  parseEntireFile: boolean;
  frontmatterTag: string;
  file: TFile;
  validTags: TagCache[];
};

// #todo #jve Review this after manual testing.
export type TagMeta = {
  main: string | null;
  sub: string | null;
};
export type LinkMeta = { filePath: string; linkName: string };

export type GroupByType = 'page' | 'tag';
export type SortDirection = 'new->old' | 'old->new' | 'a->z' | 'z->a';
export type LookAndFeel = 'compact' | 'classic';

export type Icon = 'chevron' | 'settings';

// #todo #jve Review this after manual testing.
export type KeysOfTypeString<T> = {
  [K in keyof T]: T[K] extends string & { localeCompare(other: T): number } ? K : never;
}[keyof T];

// #todo #jve Review this after manual testing.
export type KeysOfType<T, V extends string | number> = {
  [K in keyof T]: T[K] extends V ? K : never;
}[keyof T];

// #todo #jve Review this after manual testing.
export type KeyConstraint<TObject, TValue> = {
  [K in keyof TObject]: TObject[K] extends TValue ? K : never;
}[keyof TObject];
