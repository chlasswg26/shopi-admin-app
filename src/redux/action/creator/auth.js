import { createAsyncThunk } from '@reduxjs/toolkit'
import {
    registerType,
    loginType,
    refreshTokenType,
    logoutType
} from '../type/auth'
import {
    register,
    login,
    refreshToken,
    logout
} from '../../../utils/http'

const thunkAction = (action, api) => createAsyncThunk(action, async (data, {
    fulfillWithValue,
    rejectWithValue
}) => {
    try {
        const response = await api(data)

        return fulfillWithValue(response)
    } catch (error) {
        return rejectWithValue(error)
    }
})

export const registerActionCreator = thunkAction(registerType, register)
export const loginActionCreator = thunkAction(loginType, login)
export const refreshTokenActionCreator = thunkAction(refreshTokenType, refreshToken)
export const logoutActionCreator = thunkAction(logoutType, logout)
