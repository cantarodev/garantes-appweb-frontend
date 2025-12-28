import { createSlice } from '@reduxjs/toolkit';

const initialState = '';

const reducers = {
  setAccount: (state, action) => action.payload,
};

export const slice = createSlice({
  name: 'account',
  initialState,
  reducers,
});

export const { setAccount } = slice.actions;

export const { reducer } = slice;
