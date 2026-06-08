import { Navigate, Outlet } from 'react-router' // Добавили Outlet
import { useSelector } from 'react-redux'

export const PrivateRoute = () => {
  // Убираем { children }, так как для вложенных роутов они не передаются как проп
  const { isAuthenticated } = useSelector(state => state.auth)

  if (!isAuthenticated) {
    return <Navigate to="/" replace />
  }

  // Outlet автоматически отрендерит ProjectsPage (если урл /list)
  // или BoardPage (если урл /board/:id)
  return <Outlet />
}
