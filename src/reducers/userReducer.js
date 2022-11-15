import { createSlice } from '@reduxjs/toolkit'

const userSlice = createSlice({
  name: 'user',
  initialState: {
    loggedIn: null,
    allUsers: []
  },
  reducers: {
    storeLoggedInUser(state, action) {
      console.log('ACTION: ', action)
      state.loggedIn = action.payload
      return state
    },
    storeAllUsers(state, action) {
      console.log('ACTION: ', action)
      state.allUsers = action.payload
      return state
    }
  }
})

export const { storeLoggedInUser, storeAllUsers } = userSlice.actions

// asynkroniset action creatorit
export const setUser = (user) => {
  return async dispatch => {
    dispatch(storeLoggedInUser(user))
  }
}

export const setAllUsers = (users) => {
  return async dispatch => {
    dispatch(storeAllUsers(users))
  }
}

export default userSlice.reducer