import { createAsyncThunk } from '@reduxjs/toolkit'
import {
    getTransactionType,
    getTransactionByIdType,
    postTransactionType,
    putTransactionType
} from '../type/transaction'
import {
    getAllTransaction,
    getTransactionById,
    postTransaction,
    putTransaction
} from '../../../utils/http'

const thunkAction = (action, api) => createAsyncThunk(action, async (data, {
    fulfillWithValue,
    rejectWithValue
}) => {
    try {
        let request

        if (action.startsWith('post/transaction')) request = await api(data?.value, data?.token)
        if (action.startsWith('put/transaction')) request = await api(data?.type, data?.id, data?.value, data?.token)

        const response = request || await api(data)

        return fulfillWithValue(response)
    } catch (error) {
        return rejectWithValue(error)
    }
})

export const getTransactionActionCreator = thunkAction(getTransactionType, getAllTransaction)
export const getTransactionByIdActionCreator = thunkAction(getTransactionByIdType, getTransactionById)
export const postTransactionActionCreator = thunkAction(postTransactionType, postTransaction)
export const putTransactionActionCreator = thunkAction(putTransactionType, putTransaction)
