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

        if (action.startsWith('put/user')) request = await api(data?.id, data?.value)

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
