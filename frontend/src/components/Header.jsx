import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { logout } from '../slices/authSlice'

const Header = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const token = useSelector((state) => state.auth.token)
  const { t } = useTranslation()

  const handleLogout = () => {
    dispatch(logout())
    navigate('/login')
  }

  return (
    <nav className="shadow-sm navbar navbar-expand-lg navbar-light bg-white">
      <div className="container">
        <Link className="navbar-brand" to="/">
          {t('header.brand')}
        </Link>
        {token && (
          <button onClick={handleLogout} className="btn btn-outline-primary">
            {t('header.logout')}
          </button>
        )}
      </div>
    </nav>
  )
}

export default Header
