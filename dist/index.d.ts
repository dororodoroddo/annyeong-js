export declare type Key = string | symbol;
export declare type AnyObject = Record<Key, any>;
export declare type Methods = Record<Key, Function>;
export declare type Watchs = Record<Key, Function>;
export declare type AnyAnnyeongComponent = AnnyeongComponent<any, AnyObject>;
export declare type Attribute<T, This> = Partial<{
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
    props: P;
    methods: Methods;
    watchs: Watchs;
    attrs: Attribute<T, this["props"]> | {};
    childs: AnyAnnyeongComponent[];
    beforeDestroy?: Function;
}
export declare function Annyeong<T extends HTMLElement, P extends AnyObject>(rootEl: string, param: ComponentParams<T, P>): AnnyeongComponent<T, P>;
