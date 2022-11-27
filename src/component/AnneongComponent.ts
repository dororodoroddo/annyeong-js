import { AnyObject } from '../types';
import Store from '../store/index';
import annyeongProcessManager from './ProcessManager';
import { Attribute } from '../types/index';

export interface AnnyeongParameters<ElementType extends HTMLElement> {
  htmlType: string;
  state: AnyObject;
  store?: Store<AnyObject>;
  // 컴포넌트는 html 반환하는 컴포넌트 이거나 컨포넌트를 반환하는 컴포넌트이고, 어느 하나를 선택적으로 반환할 수는 없다.
  renderFuntion:(() => string)|(() => AnnyeongComponent<HTMLElement>[]);
  mounted?: (this: this['state']) => void;
  attributes?: Attribute<ElementType>;
  key?: string;
}

/**
 * main component
 */
export default class AnnyeongComponent<ElementType extends HTMLElement> {
  public rootEl!: ElementType;
  private render!: () => void;
  private isRender = false;
  private renderState: Set<PropertyKey> = new Set();
  private isSync = false;
  
  // 전역에서 유일하면서 같은 파라미터라면 동일해야함
  private key!: string;

  constructor({ htmlType, state, renderFuntion, mounted, store, key, attributes }: AnnyeongParameters<ElementType>) {
    this.key = annyeongProcessManager.getKey(key);
    this.rootEl = document.createElement(htmlType) as ElementType;
    for (const attributeKey in attributes) {
      const attribute = attributes[attributeKey];
      if (attribute) {
        if (typeof attribute === 'object') {
          for (const subAttributeKey in attribute) {
            const subAttribute = attribute[subAttributeKey];
            if (subAttribute) {
              this.rootEl[attributeKey][subAttributeKey] = subAttribute;
            }
          }
        } else {
          this.rootEl[attributeKey] = attribute;
        }
      }
    }

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
          annyeongProcessManager.pushRenderQueue(this.key, this.render);
        }
        return Reflect.set(target, key, value, reciever);
      },
    });

    if (store) {
      for (const key in state) {
        if (/^global__/.test(key)) {
          const stateKey = key.slice(8);
          store.stateSetMethods[stateKey].push((value: any)=>{
            this.isSync = true;
            state[key] = value;
            this.isSync = false;
          });
          this.isSync = true;
          state[key] = store.state[stateKey];
          this.isSync = false;
        }
      }
    }
  
    this.render();

    mounted?.call(state);
  }
}