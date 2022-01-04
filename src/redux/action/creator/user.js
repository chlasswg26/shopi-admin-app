import { createAsyncThunk } from '@reduxjs/toolkit'
import {
    getUserType,
    getUserByIdType,
    postUserType,
    putUserType,
    deleteUserType
} from '../type/user'
import {
    getAllUser,
    getUserById,
    postUser,
    putUser,
    deleteUser
} from '../../../utils/http'

const thunkAction = (action, api) => createAsyncThunk(action, async (data, {
    fulfillWithValue,
    rejectWithValue
}) => {
    try {
        let request

        if (action.startsWith('post/user')) request = await api(data?.value, data?.token)
        if (action.startsWith('put/user')) request = await api(data?.type, data?.id, data?.value, data?.token)
        if (action.startsWith('delete/user')) request = await api(data?.type, data?.id, data?.token)

        const response = request || await api(data)

        return fulfillWithValue(response)
    } catch (error) {
        return rejectWithValue(error)
    }
})

export const getUserActionCreator = thunkAction(getUserType, getAllUser)
export const getUserByIdActionCreator = thunkAction(getUserByIdType, getUserById)
export const postUserActionCreator = thunkAction(postUserType, postUser)
export const putUserActionCreator = thunkAction(putUserType, putUser)
export const deleteUserActionCreator = thunkAction(deleteUserType, deleteUser)
