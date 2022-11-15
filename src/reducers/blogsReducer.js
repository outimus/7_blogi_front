import { createSlice } from '@reduxjs/toolkit'

const getId = () => {
  const id = Number((Math.random() * 1000000).toFixed(0))
  return id
}

const blogSlice = createSlice({
  name: 'blogs',
  initialState: [],
  reducers: {
    appendBlog(state, action) {
      const content = action.payload
      state.push({
        title: content.title,
        author: content.author,
        url: content.url,
        user: content.userId,
        id: getId(),
        likes: 0
      })
    },
    setBlogs(state, action) {
      return action.payload
    }
  }
})

export const { appendBlog, setBlogs } = blogSlice.actions

// asynkroniset action creatorit
export const initializeBlogs = (blogs) => {
  return async dispatch => {
    dispatch(setBlogs(blogs))
  }
}

export const createBlog = (content) => {
  return async dispatch => {
    dispatch(appendBlog(content))
  }
}

export default blogSlice.reducer