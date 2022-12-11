import { AnyObject } from '../types';
import Store from '../store/index';
import annyeongProcessManager from './ComponentProcessManager';
import { Attribute } from '../types/index';

export interface AnnyeongParameters<ElementType extends HTMLElement> {
  htmlType: string;
  state: AnyObject;
  store?: Store<AnyObject>;
  // 컴포넌트는 html 반환하는 컴포넌트 이거나 컨포넌트를 반환하는 컴포넌트이고, 어느 하나를 선택적으로 반환할 수는 없다.
  appendChilds:(() => AnnyeongComponent<HTMLElement>[]);
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

  constructor({ htmlType, state, appendChilds, mounted, key, attributes }: AnnyeongParameters<ElementType>) {
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
      const childs = renderFuntion.call(state) as string | AnnyeongComponent<HTMLElement>[];
      if (typeof childs === 'string') {
        this.rootEl.innerHTML = childs;
      } else {
        for (const child of childs) {
          this.rootEl.appendChild(child.rootEl);
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

    this.render();

    mounted?.call(state);
  }

  public paramsChanged(params: AnnyeongParameters<ElementType>) {
    console.log(params);
  }
}