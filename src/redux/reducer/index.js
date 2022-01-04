import { combineReducers } from '@reduxjs/toolkit'
import { persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import account from './account'
import auth from './auth'
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
    account,
    auth,
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
    if (action.type.startsWith('logout/auth')) {
        state = {}
    }

    return appReducer(state, action)
}

export default rootReducer
