import { createAsyncThunk } from '@reduxjs/toolkit'
import { accountProfileType, accountUpdateType } from '../type/account'
import { getProfile, updateProfile } from '../../../utils/http'

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

export const accountProfileActionCreator = thunkAction(accountProfileType, getProfile)
export const accountUpdateActionCreator = thunkAction(accountUpdateType, updateProfile)
