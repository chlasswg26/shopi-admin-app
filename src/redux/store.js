import { configureStore } from '@reduxjs/toolkit'
import { persistStore, persistReducer } from 'redux-persist'
import { createLogger } from 'redux-logger'
import rootReducer from './reducer/index'
import storage from 'redux-persist/lib/storage'

const { NODE_ENV } = process.env
const rootPersistConfig = {
    key: 'root',
    storage,
    whitelist: []
}
const persistedReducer = persistReducer(rootPersistConfig, rootReducer)
const logger = createLogger({
    predicate: () => NODE_ENV !== 'production'
})

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: false
    }).concat(logger),
    devTools: NODE_ENV === 'development'
})

export const persistor = persistStore(store)
