import { classifyString, sortGenericItemsInplace } from './helpers';

import type { GroupByType, SortDirection, TodoGroup, TodoItem } from 'src/@types/tasklist';
export const groupTodos = (
  items: TodoItem[],
  groupBy: GroupByType,
  // #todo #jve Review this after manual testing.
  sortGroups: SortDirection | null,
  // #todo #jve Review this after manual testing.
  sortItems: SortDirection | null,
  // #todo #jve Review this after manual testing.
  subGroups: boolean | null,
  // #todo #jve Review this after manual testing.
  subGroupSort: SortDirection | null
): TodoGroup[] => {
  const groups: TodoGroup[] = [];
  for (const item of items) {
    const itemKey =
      groupBy === 'page' ? item.filePath : `#${[item.mainTag, item.subTag].filter((e) => e != null).join('/')}`;
    let group = groups.find((g) => g.id === itemKey);
    if (!group) {
      const newGroup: TodoGroup = {
        id: itemKey,
        sortName: '',
        className: '',
        type: groupBy,
        todos: [],
        oldestItem: Infinity,
        newestItem: 0
      };

      if (newGroup.type === 'page') {
        newGroup.pageName = item.fileLabel;
        newGroup.sortName = item.fileLabel;
        newGroup.className = classifyString(item.fileLabel);
      } else if (newGroup.type === 'tag') {
        newGroup.mainTag = item.mainTag;
        newGroup.subTags = item.subTag;
        newGroup.sortName = item.mainTag + (item.subTag ?? '0');
        newGroup.className = classifyString((newGroup.mainTag ?? '') + (newGroup.subTags ?? ''));
      }
      groups.push(newGroup);
      group = newGroup;
    }
    if (group.newestItem < item.fileCreatedTs) group.newestItem = item.fileCreatedTs;
    if (group.oldestItem > item.fileCreatedTs) group.oldestItem = item.fileCreatedTs;

    group.todos.push(item);
  }

  const nonEmptyGroups = groups.filter((g) => g.todos.length > 0);

  sortGenericItemsInplace(
    nonEmptyGroups,
    sortGroups,
    'sortName',
    sortGroups === 'new->old' ? 'newestItem' : 'oldestItem'
  );

  if (!subGroups) {
    for (const g of groups) {
      // #todo #jve Review this after manual testing.
      sortGenericItemsInplace(g.todos, sortItems, 'originalText', 'fileCreatedTs');
    }
  } else {
    for (const g of nonEmptyGroups) {
      // #todo #jve Review this after manual testing.
      g.groups = groupTodos(g.todos, groupBy === 'page' ? 'tag' : 'page', subGroupSort, sortItems, false, null);
    }
  }

  return nonEmptyGroups;
};
