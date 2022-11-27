import { Getters } from '../../../store';
import TestState from './types';

const testGetters: Getters<TestState> = {
  getLengthOfTest() {
    return this.test.length;
  },
};

export default testGetters;