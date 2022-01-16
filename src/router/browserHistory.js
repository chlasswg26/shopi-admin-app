import { Router } from 'react-router-dom'
import { useRef, useState, useLayoutEffect, memo } from 'react'
import { createBrowserHistory } from 'history'
import { shallowEqual } from '@mantine/hooks'

export const customHistory = createBrowserHistory()

const CustomBrowserRouter = ({ basename, children }) => {
    const historyRef = useRef()
    if (historyRef.current == null) {
        historyRef.current = customHistory
    }
    const history = historyRef.current
    const [state, setState] = useState({
        action: history.action,
        location: history.location
    })

    useLayoutEffect(() => history.listen(setState), [history])

    return (
        <Router
            basename={basename}
            location={state.location}
            navigationType={state.action}
            navigator={history}>
            {children}
        </Router>
    )
}

export const BrowserRouter = memo(CustomBrowserRouter, shallowEqual)
