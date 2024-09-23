declare module "*.module.scss" {
  const classes: { readonly [key: string]: string };
  export default classes;
}

declare module "*.svelte" {
  export { SvelteComponentDev as default } from "svelte/internal";
}
