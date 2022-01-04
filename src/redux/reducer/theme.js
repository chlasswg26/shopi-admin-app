import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    mode: 'light'
}
const themeSlice = createSlice({
    name: 'theme',
    initialState,
    reducers: {
        lightTheme: () => ({
            mode: 'light'
        }),
        darkTheme: () => ({
            mode: 'dark'
        })
    }
})

export const {
    lightTheme,
    darkTheme
} = themeSlice.actions
export default themeSlice.reducer
