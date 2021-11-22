import { applyMiddleware, compose, createStore, combineReducers } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
// import { createLogger } from 'redux-logger';
import blockchainReducer from './blockchain/blockchainReducer';
import dataReducer from './data/dataReducer';

const rootReducer = combineReducers({
  blockchain: blockchainReducer,
  data: dataReducer,
});

const middleware = [thunk];
const composeEnhancers = compose(
  applyMiddleware(...middleware),
  composeWithDevTools()
);

const configureStore = () => {
  return createStore(rootReducer, composeEnhancers);
};

const store = configureStore();

export default store;
