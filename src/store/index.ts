import { AnyObject } from '../types/index';

export type InitialState<State extends AnyObject> = () => State;

export type Actions<State extends AnyObject> = {
  [actionKey: PropertyKey]: (this: State & Mutations<State>, value: any) => any;
};

export type Mutations<State extends AnyObject> = {
  [mutationKey: PropertyKey]: (this: State, value: any) => void;
};

export type Getters<State extends AnyObject> = {
  [getterKey: PropertyKey]: (this: State) => any;
};

export type SetMethods = {
  [key: PropertyKey]: ((value: any) => void)[];
}

export type GetterGetStates<State extends AnyObject> = Partial<{
  [key in keyof State]: Set<PropertyKey>;
}>

export default class Store<State extends AnyObject> {
  public state!: State;
  public stateSetMethods: SetMethods = {};
  public getterSetMethods: SetMethods = {};
  public getterGetStates: GetterGetStates<State> = {};
  public mutaions: Mutations<State> = {};
  public actions: Actions<State> = {};
  public getters: Getters<State> = {};
  private isGetter = '';

  constructor(
    initialState: InitialState<State>,
    actions: Actions<State>,
    mutaions: Mutations<State>,
    getters: Getters<State>
  ) {
    this.state = new Proxy(initialState(), {
      get: (target, key, reciever) => {
        if(this.isGetter !== '') {
          this.getterGetStates[key].add(this.isGetter);
        }
        return Reflect.get(target, key, reciever);
      },
      set: (target, key, value, reciever) => {
        if (target[key] !== value) {
          // this.getterGetStates[key].forEach() // wip
          this.stateSetMethods[key].forEach((methods) => {
            methods(value);
          });
        }
        return Reflect.set(target, key, value, reciever);
      },
    });

    for (const stateKey in this.state) {
      this.stateSetMethods[stateKey] = [];
      this.getterGetStates[stateKey] = new Set();
    }

    for (const mutaionKey in mutaions) {
      this.mutaions[mutaionKey] = mutaions[mutaionKey].bind(this.state);
    }

    for (const actionKey in actions) {
      this.actions[actionKey] = actions[actionKey].bind({
        ...this.state,
        ...this.mutaions,
      });
    }

    for (const getterKey in getters) {
      this.getters[getterKey] = new Proxy(getters[getterKey].bind(this.state), {
        apply:(target, thisArg, argArray) => {
          const value = Reflect.apply(target, thisArg, argArray);
          
          this.getterSetMethods[target.name].forEach((methods) => {
            methods(value);
          });

          return value;
        },
      });
    }
  }
}
