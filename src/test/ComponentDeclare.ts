import { Annyeong, AnyObject, ComponentParams } from '../index.js';

export function AnnyeongDiv<P extends AnyObject>(
  param: ComponentParams<HTMLDivElement, P>
) {
  return Annyeong<HTMLDivElement, P>('div', param);
}
