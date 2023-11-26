import { regexPlugin } from './plugin-helper';

import type { LinkMeta } from 'src/@types/tasklist';

export const linkPlugin = (linkMap: Map<string, LinkMeta>) =>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  regexPlugin(/\[\[([^\]]+)\]\]/, (match: string[], utils: any) => {
    const content = match[1];
    const [link, label] = content.trim().split('|');
    // #todo #jve Review this after manual testing.
    const linkItem: LinkMeta | undefined = linkMap.get(link);
    const displayText = label ?? linkItem?.linkName ?? link;
    const filePath = linkItem?.filePath ?? link;
    return `<a data-href="${link}" data-type="link" data-filepath="${filePath}" class="internal-link">${utils.escape(
      displayText
    )}</a>`;
  });
