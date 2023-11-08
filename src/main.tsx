import React from 'react'
import ReactDOM from 'react-dom/client'
import '@0xsequence/design-system/styles.css'
import { ThemeProvider } from '@0xsequence/design-system'
import { createHashRouter, RouterProvider } from 'react-router-dom'

import Login from './Login.tsx'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { Sequence } from '@0xsequence/waas'
import App from './App.tsx'
import { ethers } from 'ethers'
import { defaults } from '@0xsequence/waas'

export const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID

export const node = new ethers.providers.JsonRpcProvider('https://nodes.sequence.app/polygon')

export const sequence = new Sequence({
  network: 'polygon',
  key: 'eyJzZWNyZXQiOiJ0YmQiLCJ0ZW5hbnQiOjksImlkZW50aXR5UG9vbElkIjoidXMtZWFzdC0yOjQyYzlmMzlkLWM5MzUtNGQ1Yy1hODQ1LTVjODgxNWM3OWVlMyJ9',
}, defaults.TEMPLATE_NEXT)

export const router = createHashRouter([
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/',
    element: <App />
  }
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider>
      <GoogleOAuthProvider clientId={CLIENT_ID}>
        <RouterProvider router={router} />
      </GoogleOAuthProvider>
    </ThemeProvider>
  </React.StrictMode>
)
