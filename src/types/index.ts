/**
 * common types 
 */
export type Key = string | symbol | number;

export type AnyObject = Record<Key, any>;

export type AnyFunction = (data?: any) => any;

export type Attribute<HTMLType extends HTMLElement> = Partial<{
  [Attribute in keyof HTMLType]: Partial<HTMLType[Attribute]>;
}>;

/**
 * store types 
 */

export type InitialState<State extends AnyObject> = () => State;

export type Actions<State extends AnyObject> = {
  [actionKey: Key]: (this: State&Mutations<State>, value: any) => any;
};
export type Mutations<State extends AnyObject> = {
  [mutationKey: Key]: (this: State, value: any) => void;
};
export type Getters<State extends AnyObject> = {
  [getterKey: Key]: (this: State) => any;
};
export type SetMethods ={
  [key: Key]: ((value: any) => void)[];
}
export type GetterGetStates<State extends AnyObject> = Partial<{
  [key in keyof State]: Set<Key>;
}>
