/**
 * Type declaration that adds 'onclick_outside' event to HTMLAttributes.
 */

declare namespace svelte.JSX {
  interface HTMLAttributes<T> {
    onclick_outside?: (ev: MouseEvent) => void;
  }
}

declare namespace svelteHTML {
  // enhance elements
  // interface IntrinsicElements {
  //   'my-custom-element': {
  //     some_attribute: string;
  //     'on:event': (e: CustomEvent<any>) => void;
  //   };
  // }

  // enhance attributes
  interface HTMLAttributes<T> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    'on:click_outside'?: (event: any) => any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    click_outside?: any;
  }
}

declare module '*.svelte' {
  export { SvelteComponentDev as default } from 'svelte/internal';
}
