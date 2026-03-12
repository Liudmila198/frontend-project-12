import { useNavigate, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../contexts/AuthContext'
import { ROUTES } from '../constants/routes'

const Header = () => {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const { isAuthenticated, username, logout } = useAuth()

  const handleLogout = () => {
    logout()
    navigate(ROUTES.LOGIN)
  }

  return (
    <nav className="shadow-sm navbar navbar-expand-lg navbar-light bg-white">
      <div className="container">
        <Link className="navbar-brand" to={ROUTES.HOME}> {/* replaced '/' */}
          {t('header.brand')}
        </Link>
        {isAuthenticated && (
          <div className="d-flex align-items-center">
            <span className="navbar-text me-3">{username}</span>
            <button onClick={handleLogout} className="btn btn-outline-primary">
              {t('header.logout')}
            </button>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Header
