import { Navigate, Outlet } from 'react-router'
import { useSelector } from 'react-redux'

export const PrivateRoute = () => {
  const { isAuthenticated } = useSelector(state => state.auth)

  if (!isAuthenticated) {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}
