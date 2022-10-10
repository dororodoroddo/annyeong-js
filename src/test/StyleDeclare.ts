import { AnnyeongComponent } from '../index.js';
declare module '../index.js' {
  interface AnnyeongComponent<T extends HTMLElement, P> {
    abc(this: AnnyeongComponent<HTMLElement, P>): AnnyeongComponent<T, P>;
    cde(this: AnnyeongComponent<HTMLElement, P>): AnnyeongComponent<T, P>;
  }
}
export default function () {
  AnnyeongComponent.prototype.abc = function () {
    this.el.style.background = '#f99';
    return this;
  };

  AnnyeongComponent.prototype.cde = function () {
    this.el.style.height = '50vh';
    return this;
  };
}
