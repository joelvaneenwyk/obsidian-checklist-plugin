import { regexPlugin } from './plugin-helper';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const highlightPlugin = regexPlugin(/==([^=]+)==/, (match: string[], utils: any) => {
  return `<mark>${utils.escape(match[1])}</mark>`;
});
