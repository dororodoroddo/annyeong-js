import TestState from './types';
import { InitialState } from '../../../types/index';

const testInitialState: InitialState<TestState> = () => {
  return {
    test: '',
  };
};

export default testInitialState;