import React from 'react'
import ReactDOM from 'react-dom/client'
import '@0xsequence/design-system/styles.css'
import { ThemeProvider } from '@0xsequence/design-system'
import {createHashRouter, RouterProvider} from 'react-router-dom'

import Login from './Login.tsx'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { SequenceWaaS } from '@0xsequence/waas'
import App from './App.tsx'
import { ethers } from 'ethers'
import './main.css'

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID
const SEQUENCE_PROJECT_ACCESS_KEY = import.meta.env.VITE_SEQUENCE_PROJECT_ACCESS_KEY
const SEQUENCE_WAAS_CONFIG_KEY = import.meta.env.VITE_SEQUENCE_WAAS_CONFIG_KEY
const SEQUENCE_PROJECT_ACCESS_KEY_DEV = import.meta.env.VITE_SEQUENCE_PROJECT_ACCESS_KEY_DEV
const SEQUENCE_WAAS_CONFIG_KEY_DEV = import.meta.env.VITE_SEQUENCE_WAAS_CONFIG_KEY_DEV

export const node = new ethers.providers.JsonRpcProvider('https://nodes.sequence.app/polygon')

const urlParams = new URLSearchParams(window.location.search)
const targetEnv = urlParams.get('env') ?? 'prod'
let projectAccessKey = urlParams.get('projectAccessKey') ?? SEQUENCE_PROJECT_ACCESS_KEY
let waasConfigKey = urlParams.get('waasConfigKey') ?? SEQUENCE_WAAS_CONFIG_KEY

if (targetEnv === 'dev') {
  console.log('Using dev environment')
  console.log(`Project Access Key: ${SEQUENCE_PROJECT_ACCESS_KEY_DEV}`)
  console.log(`Waas Config Key: ${SEQUENCE_WAAS_CONFIG_KEY_DEV}`)
  projectAccessKey = SEQUENCE_PROJECT_ACCESS_KEY_DEV
  waasConfigKey = SEQUENCE_WAAS_CONFIG_KEY_DEV
}

export const sequence = new SequenceWaaS({
  network: 'polygon',
  projectAccessKey: projectAccessKey,
  waasConfigKey: waasConfigKey,
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
      <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
        <RouterProvider router={router} />
      </GoogleOAuthProvider>
    </ThemeProvider>
  </React.StrictMode>
)
