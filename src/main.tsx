import React from 'react'
import ReactDOM from 'react-dom/client'
import '@0xsequence/design-system/styles.css'
import { ThemeProvider } from '@0xsequence/design-system'
import {createHashRouter, RouterProvider} from 'react-router-dom'

import Login from './Login.tsx'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { Sequence } from '@0xsequence/waas'
import App from './App.tsx'
import { ethers } from 'ethers'
import { defaults } from '@0xsequence/waas'

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID
const SEQUENCE_API_KEY = import.meta.env.VITE_SEQUENCE_API_KEY

export const node = new ethers.providers.JsonRpcProvider('https://nodes.sequence.app/polygon')

export const sequence = new Sequence({
  network: 'polygon',
  key: SEQUENCE_API_KEY,
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
      <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
        <RouterProvider router={router} />
      </GoogleOAuthProvider>
    </ThemeProvider>
  </React.StrictMode>
)
