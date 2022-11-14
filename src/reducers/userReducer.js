import { createSlice } from '@reduxjs/toolkit'

const userSlice = createSlice({
  name: 'user',
  initialState: null,
  reducers: {
    storeLoggedInUser(state, action) {
      console.log('STATE JA ACTION ', state, action)
      state = action.payload
      return state
    }
  }
})

export const { storeLoggedInUser } = userSlice.actions

// asynkroniset action creatorit
export const setUser = (user) => {
  console.log('USERI ON ',user)
  return async dispatch => {
    dispatch(storeLoggedInUser(user))
  }
}

export default userSlice.reducer