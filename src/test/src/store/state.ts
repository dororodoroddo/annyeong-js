import { InitialState } from '../../../store';
import TestState from './types';

const testInitialState: InitialState<TestState> = () => {
  return {
    test: '',
  };
};

export default testInitialState;