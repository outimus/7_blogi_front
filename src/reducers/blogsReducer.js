import { createSlice } from '@reduxjs/toolkit'

const getId = () => {
  const id = Number((Math.random() * 1000000).toFixed(0))
  return id
}

const blogSlice = createSlice({
  name: 'blogs',
  initialState: {
    currentBlog: null,
    allBlogs: []
  },
  reducers: {
    appendBlog(state, action) {
      const content = action.payload
      state.allBlogs.push({
        title: content.title,
        author: content.author,
        url: content.url,
        user: content.userId,
        id: getId(),
        likes: 0
      })
    },
    setAllBlogs(state, action) {
      console.log('ACTION: ', action)
      state.allBlogs = action.payload
      return state
    },
    setCurrentBlog(state, action) {
      console.log('ACTION: ', action)
      state.currentBlog = action.payload
      return state
    }
  }
})

export const { appendBlog, setAllBlogs, setCurrentBlog } = blogSlice.actions

// asynkroniset action creatorit
export const initializeBlogs = (blogs) => {
  return async dispatch => {
    dispatch(setAllBlogs(blogs))
  }
}

export const setCurrent = (blog) => {
  return async dispatch => {
    dispatch(setCurrentBlog(blog))
  }
}

export const createBlog = (content) => {
  return async dispatch => {
    dispatch(appendBlog(content))
  }
}

export default blogSlice.reducer