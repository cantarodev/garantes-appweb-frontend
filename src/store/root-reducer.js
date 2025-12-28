import { combineReducers } from '@reduxjs/toolkit';

import { reducer as accountReducer } from 'src/slices/account';

export const rootReducer = combineReducers({
  account: accountReducer,
});
