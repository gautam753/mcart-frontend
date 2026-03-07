import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Amplify } from 'aws-amplify'
import App from './App.jsx'
import './index.css'

Amplify.configure({
  Auth: {
    Cognito: {
      region: import.meta.env.VITE_COGNITO_REGION,
      userPoolId: import.meta.env.VITE_COGNITO_USER_POOL_ID,
      userPoolClientId: import.meta.env.VITE_COGNITO_APP_CLIENT_ID,
      loginWith: {
        oauth: {
          domain: import.meta.env.VITE_COGNITO_DOMAIN,
          scopes: ['openid', 'email', 'profile'],
          redirectSignIn: [`${import.meta.env.VITE_APP_URL}/`],
          redirectSignOut: [`${import.meta.env.VITE_APP_URL}/`],
          responseType: 'code',
        },
      },
    },
  },
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)