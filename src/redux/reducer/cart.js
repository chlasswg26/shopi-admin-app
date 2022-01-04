import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    products: []
}
const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addCart: (state, action) => ({
            products: state.products.map(product => {
                const productValidation = product.id === action.id ? {
                    existsMessage: 'Product already selected, add another product'
                } : {
                    existsMessage: ''
                }

                return product.id === action.id ? {
                    ...product,
                    ...productValidation
                } : {
                    id: action.id,
                    ...productValidation
                }
            })
        }),
        incrementQuantityCart: (state, action) => ({
            products: state.products.map((product) => {
                const quantityValidation = product.quantity > 10 ? {
                    quantity: product.quantity,
                    disableIncrement: true,
                    message: 'Quantity order out of stock'
                } : {
                    quantity: product.quantity++,
                    disableIncrement: false,
                    message: ''
                }

                return product.id === action.id ? {
                    ...product,
                    ...quantityValidation
                } : product
            })
        }),
        decrementQuantityCart: (state, action) => ({
            products: state.products.map(product => {
                const quantityValidation = product.quantity < 1 ? {
                    quantity: 1,
                    disableDecrement: true,
                    message: 'Cannot reduce quantity order below 1'
                } : {
                    quantity: product.quantity--,
                    disableDecrement: false,
                    message: ''
                }

                return product.id === action.id ? {
                    ...product,
                    ...quantityValidation
                } : product
            })
        }),
        removeCart: (state, action) => ({
            products: state.products.filter((product) => {
                return product.id !== action.id
            })
        }),
        emptyCart: (state) => ({
            products: []
        })
    }
})

export const {
    addCart,
    incrementQuantityCart,
    decrementQuantityCart,
    removeCart,
    emptyCart
} = cartSlice.actions
export default cartSlice.reducer
