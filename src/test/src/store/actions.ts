import TestState from './types';
import { Actions } from '../../../types/index';

const testActions: Actions<TestState> = {
  getLengthOfTest() {
    return this.test.length;
  },
};

export default testActions;