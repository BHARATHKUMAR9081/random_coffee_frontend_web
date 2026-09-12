import { configureStore } from '@reduxjs/toolkit'
import {
  FLUSH,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  REHYDRATE,
  persistReducer,
  persistStore,
  type Storage,
} from 'redux-persist'
import { bindAuthAccessors } from './authAccessors'
import authReducer, { clearAuth, setTokens } from './authSlice'

const persistStorage: Storage = {
  getItem: (key) => {
    try {
      return Promise.resolve(window.localStorage.getItem(key))
    } catch {
      return Promise.resolve(null)
    }
  },
  setItem: (key, value) => {
    try {
      window.localStorage.setItem(key, value)
    } catch {
      // Private mode or blocked storage should not crash the app.
    }
    return Promise.resolve()
  },
  removeItem: (key) => {
    try {
      window.localStorage.removeItem(key)
    } catch {
      // Ignore storage failures.
    }
    return Promise.resolve()
  },
}

const persistConfig = {
  key: 'randomcoffee.auth',
  storage: persistStorage,
  whitelist: [
    'sessionKind',
    'accessToken',
    'refreshToken',
    'account',
    'profile',
    'isProfileVerified',
    'isIdentityVerified',
    'identitySelfieUrl',
    'identityVerification',
    'verificationStatus',
    'businessIdNumber',
    'planId',
    'billing',
    'callHistory',
  ],
}

const persistedAuthReducer = persistReducer(persistConfig, authReducer)

export const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
})

export const persistor = persistStore(store)

bindAuthAccessors({
  getAccessToken: () => store.getState().auth.accessToken,
  getRefreshToken: () => store.getState().auth.refreshToken,
  setTokens: (tokens) => {
    store.dispatch(setTokens(tokens))
  },
  clearAuth: () => {
    store.dispatch(clearAuth())
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
