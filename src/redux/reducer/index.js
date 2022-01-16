import { combineReducers } from '@reduxjs/toolkit'
import { persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import auth from './auth'
import account from './account'
import banner from './banner'
import cart from './cart'
import category from './category'
import product from './product'
import transaction from './transaction'
import user from './user'
import theme from './theme'

const customPersistCart = {
    key: 'cart',
    storage
}
const customPersistTheme = {
    key: 'theme',
    storage
}

const appReducer = combineReducers({
    auth,
    account,
    banner,
    cart: persistReducer(
        customPersistCart,
        cart
    ),
    category,
    product,
    transaction,
    user,
    theme: persistReducer(
        customPersistTheme,
        theme
    )
})
const rootReducer = (state, action) => {
    if (action.type === 'logout/auth/fulfilled') {
        state = {}
        localStorage.clear()
    }

    return appReducer(state, action)
}

export default rootReducer
