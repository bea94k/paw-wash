import React from 'react'
import ReactDOM from 'react-dom'
import { createStore } from 'redux'
import { Provider } from 'react-redux'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import { PersistGate } from 'redux-persist/integration/react'
import { composeWithDevTools } from 'redux-devtools-extension'

import './index.css'
import App from './App'
import washLogReducer from './redux/washLog'

const persistConfig = { key: 'root', storage }
const persistedReducer = persistReducer(persistConfig, washLogReducer)
const store = createStore(persistedReducer, composeWithDevTools())
const persistor = persistStore(store)

ReactDOM.render(
    <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
            <App />
        </PersistGate>
    </Provider>,
    document.getElementById('root')
)
