export type Key = string|symbol;
export type AnyObject = Record<Key, any>;
export type Methods = Record<Key,Function>;
export type Watchs = Record<Key, Function>;
export type AnyAnnyeongComponent = AnnyeongComponent<any, AnyObject>;
export type Attribute<T, This> = Partial<{
    [K in keyof T]: (this: This) => Partial<T[K]>;
}>;

export interface ComponentParams<T extends HTMLElement, P extends AnyObject> {
    props?: P;
    methods?: Methods;
    childs?: AnyAnnyeongComponent[];
    attrs?: Attribute<T, this["props"]>;
    mounted?: Function;
    watchs?: Watchs;
    beforeDestroy?: Function;
}

export interface AnnyeongComponent<T extends HTMLElement, P extends AnyObject> {
    el: T;
    props:  P;
    methods: Methods;
    watchs: Watchs;
    attrs: Attribute<T, this["props"]> | {};
    childs: AnyAnnyeongComponent[];
    beforeDestroy?: Function;
}

export function Annyeong<T extends HTMLElement, P extends AnyObject>(rootEl: string, param: ComponentParams<T, P>) {
    const { childs, props, attrs, mounted, methods, watchs, beforeDestroy  } = param;
    const component: AnnyeongComponent<T, P> = {
        el: document.createElement(rootEl) as T,
        props: { ...props },
        childs: [],
        methods: { ...methods },
        attrs: { ...attrs },
        watchs: { ...watchs },
        beforeDestroy: beforeDestroy,
    }
    const childsLength = childs?.length || 0;
    for (let idx = 0; idx < childsLength; ++idx) {
        component.el.appendChild(childs[idx].el);
    }
    
    if (mounted) {
        mounted.apply(param.props);
    }
    
    for (const key in attrs) {
        const property = attrs[key].call(param.props);
        
        if (typeof property === 'object') {
            for (const key2 in property as any) {
                (component.el[key] as any)[key2] = property[key2];
            }
        } else {
            component.el[key] = property;
        }
    }

    return component;
}


/** default handler
const handler = {
    set(obj, prop, value) { 
        return Reflect.set(obj, prop, value);
    },
    get: function (target, prop, receiver) {
        return Reflect.get(target, prop, receiver);
    },
    apply: function (target, thisArg, argumentsList) {
        return target.apply(thisArg, argumentsList);
    },
    deleteProperty(target, prop) {
        if (prop in target) {
            delete target[prop];
            return true;
        }
        return false;
    }
}
*/
