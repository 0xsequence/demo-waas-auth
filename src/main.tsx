import React from 'react'
import ReactDOM from 'react-dom/client'
import '@0xsequence/design-system/styles.css'
import { ThemeProvider, ToastProvider } from '@0xsequence/design-system'
import { createHashRouter, RouterProvider } from 'react-router-dom'

import Login from './Login.tsx'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { SequenceWaaS } from '@0xsequence/waas'
import App from './App.tsx'
import { ethers } from 'ethers'
import './main.css'
import { MaybeWithStytch } from './components/MaybeWithStytch.tsx'

export const node = new ethers.JsonRpcProvider('https://nodes.sequence.app/polygon')

export const sequence = new SequenceWaaS({
  network: 'polygon',
  projectAccessKey: import.meta.env.VITE_SEQUENCE_PROJECT_ACCESS_KEY,
  waasConfigKey: import.meta.env.VITE_SEQUENCE_WAAS_CONFIG_KEY
})

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
      <ToastProvider>
        <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
          <MaybeWithStytch>
            <RouterProvider router={router} />
          </MaybeWithStytch>
        </GoogleOAuthProvider>
      </ToastProvider>
    </ThemeProvider>
  </React.StrictMode>
)
