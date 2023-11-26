import { regexPlugin } from './plugin-helper';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const commentPlugin = regexPlugin(/%%([^%]+)%%/, (match: string[], utils: any) => {
  return `<!--${utils.escape(match[1])}}-->`;
});
