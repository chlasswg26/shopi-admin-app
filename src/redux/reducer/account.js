import { createReducer } from '@reduxjs/toolkit'
const initialState = {
    profile: {},
    update: {}
}
const accountReduceer = createReducer(initialState, (builder) => {
    builder
        .addMatcher(
            (action) => action.type.endsWith('account/pending'),
            (state, action) => {
                const type = action.type.split('/')

                state[type[0]] = {
                    isPending: true
                }
            }
        )
        .addMatcher(
            (action) => action.type.endsWith('account/rejected'),
            (state, action) => {
                const type = action.type.split('/')

                state[type[0]] = {
                    isRejected: true,
                    statusCode: action.payload?.response?.data?.status,
                    errorMessage: action.payload?.response?.data?.data?.message || action.payload?.message
                }
            }
        )
        .addMatcher(
            (action) => action.type.endsWith('account/fulfilled'),
            (state, action) => {
                const type = action.type.split('/')

                state[type[0]] = {
                    isFulfilled: true,
                    response: action.payload?.data?.data
                }
            }
        )
})

export default accountReduceer
