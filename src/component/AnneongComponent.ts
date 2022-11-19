// import Store from '../store/index';
import { AnyObject } from '../types';


export type AnnyeongParameters<ElementType extends HTMLElement> = {
  htmlType: string;
  state: AnyObject;
  renderFuntion: ()=>string|AnnyeongComponent<HTMLElement>[];
}

/**
 * 
 */
export default class AnnyeongComponent<ElementType extends HTMLElement> {
  public rootEl!: ElementType;
  private render!: () => void;
  constructor({ htmlType, state, renderFuntion }: AnnyeongParameters<ElementType>) {
    this.rootEl = document.createElement(htmlType) as ElementType;
    let isRender = false;
    const isSync = false;
    this.render = () => {
      isRender = true;
      const childs = renderFuntion.call(state);
      if (typeof childs === 'string') {
        this.rootEl.innerHTML = childs;
      }
      if (typeof childs === 'object') {
        for (const child of childs) {
          this.rootEl.appendChild(child);
        }
      }
      isRender = false;
    };
    const renderState: Array<string|symbol> = [];
    state = new Proxy(state, {
      get: (target, key, reciever) => {
        if(isRender) {
          renderState.push(key);
        }
        return Reflect.get(target, key, reciever);
      },
      set: (target, key, value, reciever) => {
        if ((typeof key === 'string') && /^global__/.test(key) && !isSync) {
          throw new Error('cannot set on global state');
        }
        if (target[key] !== value && renderState.includes(key)) {
          setTimeout(this.render);
        }
        return Reflect.set(target, key, value, reciever);
      },
    });
    for (const key in state) {
      if (/^global__/.test(key)) {
        // const stateKey = key.split('global__')[1];
        // Store.stateSetMethods[stateKey].push((value: any)=>{
        //   isSync = true;
        //   state[key] = value;
        //   isSync = false;
        // });
        // isSync = true;
        // state[key] = Store.state[stateKey];
        // isSync = false;
      }
    }
  
    this.render();
  }
}