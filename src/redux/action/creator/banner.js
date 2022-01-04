import { createAsyncThunk } from '@reduxjs/toolkit'
import {
    getBannerType,
    getBannerByIdType,
    postBannerType,
    putBannerType,
    deleteBannerType
} from '../type/banner'
import {
    getAllBanner,
    getBannerById,
    postBanner,
    putBanner,
    deleteBanner
} from '../../../utils/http'

const thunkAction = (action, api) => createAsyncThunk(action, async (data, {
    fulfillWithValue,
    rejectWithValue
}) => {
    try {
        let request

        if (action.startsWith('post/banner')) request = await api(data?.value, data?.token)
        if (action.startsWith('put/banner')) request = await api(data?.type, data?.id, data?.value, data?.token)
        if (action.startsWith('delete/banner')) request = await api(data?.type, data?.id, data?.token)

        const response = request || await api(data)

        return fulfillWithValue(response)
    } catch (error) {
        return rejectWithValue(error)
    }
})

export const getBannerActionCreator = thunkAction(getBannerType, getAllBanner)
export const getBannerByIdActionCreator = thunkAction(getBannerByIdType, getBannerById)
export const postBannerActionCreator = thunkAction(postBannerType, postBanner)
export const putBannerActionCreator = thunkAction(putBannerType, putBanner)
export const deleteBannerActionCreator = thunkAction(deleteBannerType, deleteBanner)
