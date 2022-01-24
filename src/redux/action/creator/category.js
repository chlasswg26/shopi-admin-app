import { createAsyncThunk } from '@reduxjs/toolkit'
import {
    getCategoryType,
    getCategoryByIdType,
    postCategoryType,
    putCategoryType,
    deleteCategoryType
} from '../type/category'
import {
    getAllCategory,
    getCategoryById,
    postCategory,
    putCategory,
    deleteCategory
} from '../../../utils/http'

const thunkAction = (action, api) => createAsyncThunk(action, async (data, {
    fulfillWithValue,
    rejectWithValue
}) => {
    try {
        let request

        if (action.startsWith('put/category')) request = await api(data?.id, data?.value)

        const response = request || await api(data)

        return fulfillWithValue(response)
    } catch (error) {
        return rejectWithValue(error)
    }
})

export const getCategoryActionCreator = thunkAction(getCategoryType, getAllCategory)
export const getCategoryByIdActionCreator = thunkAction(getCategoryByIdType, getCategoryById)
export const postCategoryActionCreator = thunkAction(postCategoryType, postCategory)
export const putCategoryActionCreator = thunkAction(putCategoryType, putCategory)
export const deleteCategoryActionCreator = thunkAction(deleteCategoryType, deleteCategory)
