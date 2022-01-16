import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import { Provider as ReduxProvider } from 'react-redux'
import { store, persistor } from './redux/store'
import { PersistGate } from 'redux-persist/integration/react'
import { BrowserRouter } from './router/browserHistory'
import { injectStore } from './utils/http'

injectStore(store)

ReactDOM.render(
    <React.StrictMode>
        <ReduxProvider store={store}>
            <PersistGate persistor={persistor}>
                <BrowserRouter>
                    <App />
                </BrowserRouter>
            </PersistGate>
        </ReduxProvider>
    </React.StrictMode>,
    document.getElementById('root')
)
