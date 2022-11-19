import { AnyObject, Key } from '../types/index';

export type InitialState<state extends AnyObject> = () => state;
export type Actions<state extends AnyObject> = {
  [actionKey: Key]: (this: state) => any;
};
export type Mutations<state extends AnyObject> = {
  [actionKey: Key]: (this: state) => void;
};
export type Getters<state extends AnyObject> = {
  [actionKey: Key]: (this: state) => any;
};


export default function store<state extends AnyObject>(initialState: InitialState<state>, actions: Actions<state>, mutaions: Mutations<state>, getters: Getters<state>) {
  this.stateSetMethods = {};
  this.state = new Proxy(initialState(),{
    set: (target, key, value, reciever) => {
      if (target[key] !== value) {
        this.stateSetMethods[key].forEach((methods: any)=>{
          methods(value);
        });
      }
      return Reflect.set(target, key, value, reciever);
    }
  });
  for (const stateKey in this.state) {
    this.stateSetMethods[stateKey] = [];
  }
  this.actions = {};
  for (const actionKey in actions) {
    this.actions[actionKey] = actions[actionKey].bind(this.state);
  }
}