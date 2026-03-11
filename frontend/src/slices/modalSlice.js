import { createSlice } from '@reduxjs/toolkit'

// state: { isOpened: bool, type: 'add' | 'rename' | 'remove' | null, extra: any }
const initialState = {
  isOpened: false,
  type: null,
  extra: null,
}

const modalSlice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    show: (state, { payload: { type, extra = null } }) => {
      state.isOpened = true
      state.type = type
      state.extra = extra
    },
    hide: () => initialState,
  },
})

export const { show, hide } = modalSlice.actions
export default modalSlice.reducer
