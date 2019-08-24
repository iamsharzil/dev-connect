import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import logger from 'redux-logger';
import thunk from 'redux-thunk';

import rootReducer from './root-reducer';

const middleWares = [thunk];

// if (process.env.NODE_ENV === 'development') {
//   middlewares.push(logger);
// }

export const store = createStore(
  rootReducer,
  composeWithDevTools(applyMiddleware(...middleWares))
);
