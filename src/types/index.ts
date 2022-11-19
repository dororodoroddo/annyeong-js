export type Key = string | symbol;

export type AnyObject = Record<Key, any>;

export type AnyFunction = (data?: any) => any;

export type Attribute<HTMLType extends HTMLElement> = Partial<{
  [Attribute in keyof HTMLType]: Partial<HTMLType[Attribute]>;
}>;