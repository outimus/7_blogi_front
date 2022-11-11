import { createSlice } from '@reduxjs/toolkit'

const notificationSlice = createSlice({
  name: 'notification',
  initialState: {
    content: null },
  reducers: {
    addNotification(state, action) {
      console.log('ACTION: ', action)
      state.content = action.payload
      return state
    },
    removeNotification(state, action) {
      console.log('ACTION: ',action)
      state.content = null
      return state
    } }
}
)

export const setNotification = ( notification, sec ) => {
  return async dispatch => {
    dispatch(addNotification(notification))
    setTimeout(() => {
      dispatch(removeNotification(notification))
    }, sec * 1000)
  }
}

export const { removeNotification, addNotification } = notificationSlice.actions
export default notificationSlice.reducer