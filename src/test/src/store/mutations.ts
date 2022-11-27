import { Mutations } from '../../../store';
import TestState from './types';

const testMutations: Mutations<TestState> = {
  setTest(value) {
    this.test = value;
  },
};

export default testMutations;