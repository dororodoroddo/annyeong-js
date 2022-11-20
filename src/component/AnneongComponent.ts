// import Store from '../store/index';
import { AnyObject, Key } from '../types';


export interface AnnyeongParameters {
  htmlType: string;
  state: AnyObject;
  renderFuntion: ()=>string|AnnyeongComponent<HTMLElement>[];
  mounted?: (this: this['state']) => void;
}

/**
 * 
 */
export default class AnnyeongComponent<ElementType extends HTMLElement> {
  public rootEl!: ElementType;
  private render!: () => void;
  private isRender = false;
  private renderState: Set<Key> = new Set();
  private isSync = false;

  constructor({ htmlType, state, renderFuntion, mounted }: AnnyeongParameters) {
    this.rootEl = document.createElement(htmlType) as ElementType;

    this.render = () => {
      this.isRender = true;
      const childs = renderFuntion.call(state);
      if (typeof childs === 'string') {
        this.rootEl.innerHTML = childs;
      }
      if (typeof childs === 'object') {
        for (const child of childs) {
          this.rootEl.appendChild(child);
        }
      }
      this.isRender = false;
    };

    state = new Proxy(state, {
      get: (target, key, reciever) => {
        if(this.isRender) {
          this.renderState.add(key);
        }
        return Reflect.get(target, key, reciever);
      },
      set: (target, key, value, reciever) => {
        if ((typeof key === 'string') && /^global__/.test(key) && !this.isSync) {
          throw new Error('cannot set on global state');
        }
        if (target[key] !== value && this.renderState.has(key)) {
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

    mounted.call(state);
  }
}