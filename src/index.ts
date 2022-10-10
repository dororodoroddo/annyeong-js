export type Key = string | symbol;
export type AnyObject = Record<Key, any>;
export type AnyFunction = (data?: any) => any;
export type Methods = Record<Key, AnyFunction>;
export type Watchs = Record<Key, AnyFunction>;
export type AnyAnnyeongComponent = AnnyeongComponent<any, AnyObject>;
export type Attribute<T, This> = Partial<{
  [K in keyof T]: ((this: This) => Partial<T[K]>) | string;
}>;

type ReactorsTree<P extends AnyObject> = Partial<{
  [key in keyof P]: AnyFunction[];
}>;

export interface ComponentParams<T extends HTMLElement, P extends AnyObject> {
  props?: P;
  methods?: Methods;
  childs?: (this: this['props'] & { parantsKey?: string } & this['methods'] ) => AnyAnnyeongComponent[];
  key?: string;
  attrs?: Attribute<T, this['props']>;
  mounted?: () => void;
  watchs?: Watchs;
  beforeDestroy?: AnyFunction;
}

let id = 0;
function getHash(): string {
  return `ANID${++id}`;
}

/**
 * 컴포넌트 core
 */
export class AnnyeongComponent<T extends HTMLElement, P extends AnyObject> {
  public el!: T;
  public props: P;
  public methods: Methods;
  public watchs: Watchs;
  public attrs: Attribute<T, this['props']>;
  public childs: AnyAnnyeongComponent[];
  public key: string;
  public beforeDestroy?: AnyFunction;

  private childsIds: string[] = [];
  private childsFunction: (props: AnyObject) => AnyAnnyeongComponent[];
  private propsTree: ReactorsTree<P>= {};
  private watchsTree: ReactorsTree<this['watchs']>;
  private attrsTree: ReactorsTree<this['attrs']>;
  private observeTarget: AnyFunction;

  static returnProps = false;
  /**
   * 컴포넌트 core constructor
   * @param el: string 엘리먼트 종류
   * @param param: 컴포넌트 구성 요소
   */
  constructor(el: string, param: ComponentParams<T, P>) {
    const { childs, props, attrs, mounted, methods, watchs, beforeDestroy, key } =
      param;
    this.el = document.createElement(el) as T;
    this.props = { ...props };
    this.methods = { ...methods };
    this.watchs = { ...watchs };
    this.attrs = { ...attrs };
    this.childs = [];
    this.beforeDestroy = beforeDestroy;
    this.key = key?key:getHash();
    /**
     * 반응성 주입
     */
    this.props = new Proxy(this.props, {
      set: (obj: P, prop: keyof P, value: any) => {
        if (obj[prop] === value) {
          return;
        }
        for (const func of this.propsTree[prop] || []) {
          func();
        }
        return Reflect.set(obj, prop, value);
      },
      get: (target: P, prop: keyof P, receiver: any) => {
        if (this.observeTarget) {
          if (this.propsTree[prop] === undefined) {
            this.propsTree[prop] = [];
          }
          this.propsTree[prop].push(this.observeTarget);
        }
        return Reflect.get(target, prop, receiver);
      },
    });

    /**
     * 자식 요소 주입
     * 자식 생성 > 자식 param키 검사 > 
     */
    if (childs) {
      this.observeTarget = this.updateChilds;
      const childComponents = childs?.apply({ ...this.props }) || [];
      const childsLength = childComponents?.length || 0;
      const childsKeys: { [key in string ]: boolean } = {};
      for (let idx = 0; idx < childsLength; ++idx) {
        const childComponent = childComponents[idx];
        this.el.appendChild(childComponent.el);
        this.childs.push(childComponent);
        this.childsIds.push(childComponent.key);
        if (childComponent.key in childsKeys) {
          throw new Error(`has duplicated key in ${this.key}`);
        }
        childsKeys[childComponent.key] = true;
      }
  
      this.childsFunction = childs;
    }

    /**
     * html attributes 주입
     */
    for (const key in attrs) {
      const attr = attrs[key];
      if (typeof attr === 'string') {
        this.el[key] = attr as T[Extract<keyof T, string>];
        continue;
      }
      const property = attr.call(param.props);

      if (typeof property === 'object') {
        for (const key2 in property) {
          const attrDepth2: { [K in typeof property]: string } = this.el[
            key
          ] as { [K in typeof property]: string };
          if (attrDepth2[key2] !== property[key2]) {
            attrDepth2[key2] = property[key2];
          }
        }
      } else {
        if (this.el[key] !== property) {
          this.el[key] = property;
        }
      }
    }

    /**
     * 마운티드
     */
    if (mounted) {
      mounted.apply(this);
    }
  }
  /**
   * 자식요소 업데이트
   */
  private updateChilds = () => {
    /**
     * 가진것
     * 새 프롭스
     * 기존 컴포넌트
     * 
     */
    AnnyeongComponent.returnProps = true;
    const newProps = this.childsFunction?.apply(this.props) || [];
    AnnyeongComponent.returnProps = false;

    for (let idx = 0; idx < newProps.length; ++idx) {
      this.childs[idx].updateProps(newProps[idx]);
    }
  };

  /**
   * props 업데이트
   * @param newProps
   */
  public updateProps(newProps: P) {
    for (const propKey in newProps) {
      if (this.props[propKey] !== newProps[propKey]) {
        this.props[propKey] = newProps[propKey];
      }
    }
  }
  /**
   * core proxy 핸들러
   */
  private handler = {
    set(obj: AnyObject, prop: Key, value: any) {
      return Reflect.set(obj, prop, value);
    },
    get: function (target: AnyObject, prop: Key, receiver: any) {
      return Reflect.get(target, prop, receiver);
    },
    apply: function (target: AnyFunction, thisArg: any, argumentsList: any[]) {
      return Reflect.apply(target, thisArg, argumentsList);
    },
    deleteProperty(target: AnyObject, prop: Key) {
      if (prop in target) {
        delete target[prop];
        return true;
      }
      return false;
    },
  };
}

export function Annyeong<T extends HTMLElement, P extends AnyObject>(
  rootEl: string,
  param: ComponentParams<T, P>
) {
  return new AnnyeongComponent<T, P>(rootEl, param);
}

/** default handler
const handler = {
    set(obj: Object, prop: Key, value: any) { 
        return Reflect.set(obj, prop, value);
    },
    get: function (target: Object, prop: Key, receiver: any) {
        return Reflect.get(target, prop, receiver);
    },
    apply: function (target: Function, thisArg: any, argumentsList: any[]) {
        return Reflect.apply(target, thisArg, argumentsList);
    },
    deleteProperty(target: AnyObject, prop: Key) {
        if (prop in target) {
            delete target[prop];
            return true;
        }
        return false;
    }
}
*/
