export declare type Key = string | symbol;
export declare type AnyObject = Record<Key, any>;
export declare type AnyFunction = (data?: any) => any;
export declare type Methods = Record<Key, AnyFunction>;
export declare type Watchs = Record<Key, AnyFunction>;
export declare type AnyAnnyeongComponent = AnnyeongComponent<any, AnyObject>;
export declare type Attribute<T, This> = Partial<{
    [K in keyof T]: ((this: This) => Partial<T[K]>) | string;
}>;
export interface ComponentParams<T extends HTMLElement, P extends AnyObject> {
    props?: P;
    methods?: Methods;
    childs?: (this: this['props'] & {
        parantsKey?: string;
    } & this['methods']) => AnyAnnyeongComponent[];
    key?: string;
    attrs?: Attribute<T, this['props']>;
    mounted?: () => void;
    watchs?: Watchs;
    beforeDestroy?: AnyFunction;
}
export declare class AnnyeongComponent<T extends HTMLElement, P extends AnyObject> {
    el: T;
    props: P;
    methods: Methods;
    watchs: Watchs;
    attrs: Attribute<T, this['props']>;
    childs: AnyAnnyeongComponent[];
    key: string;
    beforeDestroy?: AnyFunction;
    private childsIds;
    private childsFunction;
    private propsTree;
    private watchsTree;
    private attrsTree;
    private observeTarget;
    static returnProps: boolean;
    constructor(el: string, param: ComponentParams<T, P>);
    private updateChilds;
    updateProps(newProps: P): void;
    private handler;
}
export declare function Annyeong<T extends HTMLElement, P extends AnyObject>(rootEl: string, param: ComponentParams<T, P>): AnnyeongComponent<T, P>;
