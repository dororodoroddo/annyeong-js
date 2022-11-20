import TestState from './types';
import { Getters } from '../../../types/index';

const testGetters: Getters<TestState> = {
  getLengthOfTest() {
    return this.test.length;
  },
};

export default testGetters;