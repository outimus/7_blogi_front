import { createSlice } from '@reduxjs/toolkit'

const userSlice = createSlice({
  name: 'user',
  initialState: null,
  reducers: {
    storeLoggedInUser(state, action) {
      console.log('ACTION: ', action)
      state = action.payload
      return state
    }
  }
})

export const { storeLoggedInUser } = userSlice.actions

// asynkroniset action creatorit
export const setUser = (user) => {
  return async dispatch => {
    dispatch(storeLoggedInUser(user))
  }
}

export default userSlice.reducer