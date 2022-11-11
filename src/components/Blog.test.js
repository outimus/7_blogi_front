import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import Blog from './Blog'

test('renders title', () => {
  const blog = {
    title: 'This is a test title',
    user: { username: 'mhhh',name: 'mikki hiiri' }
  }
  const user = { username: 'mhhh',name: 'mikki hiiri' }
  render(<Blog blog={blog} user={user} />)
  const element = screen.getByText('This is a test title')
  expect(element).toBeDefined()
})

