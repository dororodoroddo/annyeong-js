/**
 * common types 
 */
export type AnyObject = Record<PropertyKey, any>;

export type AnyFunction = (data?: any) => any;

export type Attribute<HTMLType extends HTMLElement> = Partial<{
  [Attribute in keyof HTMLType]: Partial<HTMLType[Attribute]>;
}>;
