import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import { Provider as ReduxProvider } from 'react-redux'
import { store, persistor } from './redux/store'
import { PersistGate } from 'redux-persist/integration/react'
import { BrowserRouter } from 'react-router-dom'

ReactDOM.render(
    <React.StrictMode>
        <ReduxProvider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <BrowserRouter>
                    <App />
                </BrowserRouter>
            </PersistGate>
        </ReduxProvider>
    </React.StrictMode>,
    document.getElementById('root')
)
