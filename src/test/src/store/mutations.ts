import { Mutations } from '../../../types';
import TestState from './types';

const testMutations: Mutations<TestState> = {
  setTest(value) {
    this.test = value;
  },
};

export default testMutations;