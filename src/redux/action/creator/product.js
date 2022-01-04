import { createAsyncThunk } from '@reduxjs/toolkit'
import {
    getProductType,
    getProductByIdType,
    postProductType,
    putProductType,
    deleteProductType
} from '../type/product'
import {
    getAllProduct,
    getProductById,
    postProduct,
    putProduct,
    deleteProduct
} from '../../../utils/http'

const thunkAction = (action, api) => createAsyncThunk(action, async (data, {
    fulfillWithValue,
    rejectWithValue
}) => {
    try {
        let request

        if (action.startsWith('post/product')) request = await api(data?.value, data?.token)
        if (action.startsWith('put/product')) request = await api(data?.type, data?.id, data?.value, data?.token)
        if (action.startsWith('delete/product')) request = await api(data?.type, data?.id, data?.token)

        const response = request || await api(data)

        return fulfillWithValue(response)
    } catch (error) {
        return rejectWithValue(error)
    }
})

export const getProductActionCreator = thunkAction(getProductType, getAllProduct)
export const getProductByIdActionCreator = thunkAction(getProductByIdType, getProductById)
export const postProductActionCreator = thunkAction(postProductType, postProduct)
export const putProductActionCreator = thunkAction(putProductType, putProduct)
export const deleteProductActionCreator = thunkAction(deleteProductType, deleteProduct)
