import axios from 'axios'
import { Duration } from '@icholy/duration'
import qs from 'qs'
import { refreshTokenActionCreator } from '../redux/action/creator/auth'
import { customHistory as history } from '../router/browserHistory'

let store
export const injectStore = _store => {
    store = _store
}

const { REACT_APP_BACKEND_URL, REACT_APP_REQUEST_TIMEOUT } = process.env
const axiosInstance = axios.create()
const duration = new Duration(REACT_APP_REQUEST_TIMEOUT)

axiosInstance.defaults.baseURL = REACT_APP_BACKEND_URL
axiosInstance.defaults.timeout = duration.milliseconds()
axiosInstance.defaults.withCredentials = true
axiosInstance.defaults.paramsSerializer = (params) => qs.stringify(params, {
    arrayFormat: 'brackets'
})

axiosInstance.interceptors.request.use(
    (config) => {
        const isFormDataInstance = config.data instanceof FormData

        if (!isFormDataInstance) config.data = qs.stringify(config.data)

        const token = localStorage.getItem('@acc_token')

        if (token !== null) config.headers.common.Authorization = `Bearer ${token}`

        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)
axiosInstance.interceptors.response.use(
    (response) => {
        const token = response.data?.data?.token
        const role = response.data?.data?.role

        if (token && role === 'ADMIN') localStorage.setItem('@acc_token', token)

        return response
    },
    async (error) => {
        const originalRequest = error.config

        if (
            (
                error?.response?.data?.data?.message === 'Session not found' ||
                error?.response?.data?.data?.message === 'Empty refresh token' ||
                error?.response?.data?.data?.message === 'Token mismatch, user not found'
            ) && originalRequest.url.includes('/auth/refresh-token')
        ) {
            localStorage.clear()
            history.replace('/auth')

            return Promise.reject()
        }

        if (
            !originalRequest.url.includes('/auth/refresh-token') &&
            error?.response?.status === 400 &&
            (
                error?.response?.data.data.message === 'jwt expired' ||
                error?.response?.data?.data?.message === 'Session not found'
            ) &&
            !originalRequest?._retry
        ) {
            try {
                await store.dispatch(refreshTokenActionCreator())

                originalRequest.headers.Authorization = `Bearer ${store.getState().auth.refreshToken?.response?.token}`
                originalRequest._retry = true

                return Promise.resolve(axios(originalRequest))
            } catch (errorDispatchRefreshTokenActionCreator) {
                return Promise.reject(errorDispatchRefreshTokenActionCreator)
            }
        }

        return Promise.reject(error)
    }
)

const ACCOUNT_PATH = '/account'
const AUTHENTICATION_PATH = '/auth'
const BANNER_PATH = '/banner'
const CATEGORY_PATH = '/category'
const PRODUCT_PATH = '/product'
const TRANSACTION_PATH = '/transaction'
const USER_PATH = '/user'

const queryParams = (value = {}) => {
    return {
        params: value
    }
}

export const getProfile = async () => await axiosInstance.get(`${ACCOUNT_PATH}/profile`)
export const updateProfile = async (data = {}) => await axiosInstance.put(`${ACCOUNT_PATH}/update`, data)

export const register = async (data = {}) => axiosInstance.post(`${AUTHENTICATION_PATH}/register`, data)
export const login = async (data = {}) => await axiosInstance.post(`${AUTHENTICATION_PATH}/login`, data)
export const refreshToken = async () => await axiosInstance.get(`${AUTHENTICATION_PATH}/refresh-token`)
export const logout = async () => await axiosInstance.delete(`${AUTHENTICATION_PATH}/logout`)

export const getAllBanner = async (filter = { limit: 100 }) => await axiosInstance.get(BANNER_PATH, queryParams(filter))
export const getBannerById = async (id = '') => await axiosInstance.get(`${BANNER_PATH}/${id}`)
export const postBanner = async (data = {}) => await axiosInstance.post(BANNER_PATH, data)
export const putBanner = async (id = '', data = {}) => await axiosInstance.put(`${BANNER_PATH}/${id}`, data)
export const deleteBanner = async (id = '') => await axiosInstance.delete(`${BANNER_PATH}/${id}`)

export const getAllCategory = async (filter = { limit: 100 }) => await axiosInstance.get(CATEGORY_PATH, queryParams(filter))
export const getCategoryById = async (id = '') => await axiosInstance.get(`${CATEGORY_PATH}/${id}`)
export const postCategory = async (data = {}) => await axiosInstance.post(CATEGORY_PATH, data)
export const putCategory = async (id = '', data = {}) => await axiosInstance.put(`${CATEGORY_PATH}/${id}`, data)
export const deleteCategory = async (id = '') => await axiosInstance.delete(`${CATEGORY_PATH}/${id}`)

export const getAllProduct = async (filter = {}) => await axiosInstance.get(PRODUCT_PATH, queryParams(filter))
export const getProductById = async (id = '') => await axiosInstance.get(`${PRODUCT_PATH}/${id}`)
export const postProduct = async (data = {}) => await axiosInstance.post(PRODUCT_PATH, data)
export const putProduct = async (id = '', data = {}) => await axiosInstance.put(`${PRODUCT_PATH}/${id}`, data)
export const deleteProduct = async (id = '') => await axiosInstance.delete(`${PRODUCT_PATH}/${id}`)

export const getAllTransaction = async (filter = { limit: 100 }) => await axiosInstance.get(TRANSACTION_PATH, queryParams(filter))
export const getTransactionById = async (id = '') => await axiosInstance.get(`${TRANSACTION_PATH}/${id}`)
export const postTransaction = async (data = {}) => await axiosInstance.post(TRANSACTION_PATH, data)
export const putTransaction = async (id = '', data = {}) => await axiosInstance.put(`${TRANSACTION_PATH}/${id}`, data)

export const getAllUser = async (filter = { limit: 100 }) => await axiosInstance.get(USER_PATH, queryParams(filter))
export const getUserById = async (id = '') => await axiosInstance.get(`${USER_PATH}/${id}`)
export const postUser = async (data = {}) => await axiosInstance.post(USER_PATH, data)
export const putUser = async (id = '', data = {}) => await axiosInstance.put(`${USER_PATH}/${id}`, data)
export const deleteUser = async (id = '') => await axiosInstance.delete(`${USER_PATH}/${id}`)
