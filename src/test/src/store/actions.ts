import { Actions } from '../../../store';
import TestState from './types';

const testActions: Actions<TestState> = {
  getLengthOfTest() {
    return this.test.length;
  },
};

export default testActions;