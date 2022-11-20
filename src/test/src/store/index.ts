import store from '../../../store/index';
import testActions from './actions';
import testInitialState from './state';
import testMutations from './mutations';
import testGetters from './getters';
import TestState from './types';

const testStore = new store<TestState>(
  testInitialState,
  testActions,
  testMutations,
  testGetters
);

export default testStore;