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
import { defaults, ExtendedSequenceConfig } from '@0xsequence/waas'
import { base64 } from "ethers/lib/utils";

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID
const SEQUENCE_API_KEY = import.meta.env.VITE_SEQUENCE_API_KEY

export const node = new ethers.providers.JsonRpcProvider('https://nodes.sequence.app/polygon')

const urlParams = new URLSearchParams(window.location.search)
let sequenceAPIKey = urlParams.get('sequenceKey') ?? SEQUENCE_API_KEY
let extendedConfig = extendedSequenceConfigFromBase64(urlParams.get('extendedConfig') ?? "") ?? defaults.TEMPLATE_NEXT

function extendedSequenceConfigFromBase64(config: string): ExtendedSequenceConfig | undefined {
  if (config === "") {
    return undefined
  }
  return JSON.parse(new TextDecoder().decode(base64.decode(config))) as unknown as ExtendedSequenceConfig
}

export const sequence = new Sequence({
  network: 'polygon',
  key: sequenceAPIKey,
}, extendedConfig)

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
