import { shallowEqual, useSelector } from 'react-redux'
import { Navigate, useLocation } from 'react-router-dom'

export const UnnecessaryAuth = ({ children }) => {
    const token = localStorage.getItem('@acc_token')
    const location = useLocation()
    const auth = useSelector(state => state.auth, shallowEqual)

    if ((auth.login?.isFulfilled && token) || token) {
        return <Navigate to={location.state?.from?.pathname || '../../'} state={{ from: location }} replace />
    }

    return children
}
