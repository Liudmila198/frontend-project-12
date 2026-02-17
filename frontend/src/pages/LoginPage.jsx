import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, Link } from 'react-router-dom'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { useTranslation } from 'react-i18next'
import { login, clearLoginError } from '../slices/authSlice'
import { useEffect } from 'react'
import Header from '../components/Header'

const LoginPage = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { t } = useTranslation()
  const { loading, loginError, token } = useSelector((state) => state.auth)

  useEffect(() => {
    if (token) {
      navigate('/')
    }
  }, [token, navigate])

  const formik = useFormik({
    initialValues: { username: '', password: '' },
    validationSchema: Yup.object({
      username: Yup.string().required(t('validation.required')),
      password: Yup.string().required(t('validation.required')),
    }),
    onSubmit: async (values) => {
      dispatch(clearLoginError())
      const resultAction = await dispatch(login(values))
      if (login.fulfilled.match(resultAction)) {
        navigate('/')
      }
    },
  })

  return (
    <div className="d-flex flex-column h-100">
      <Header />
      <div className="container-fluid h-100">
        <div className="row justify-content-center align-content-center h-100">
          <div className="col-12 col-md-8 col-xxl-6">
            <div className="card shadow-sm">
              <div className="card-body row p-5">
                <div className="col-12 col-md-6 d-flex align-items-center justify-content-center">
                  <img
                    src="/assets/avatar-DIE1AEpS.jpg"
                    className="rounded-circle"
                    alt={t('login.title')}
                  />
                </div>
                <form
                  onSubmit={formik.handleSubmit}
                  className="col-12 col-md-6 mt-3 mt-md-0"
                >
                  <h1 className="text-center mb-4">{t('login.title')}</h1>
                  {loginError && (
                    <div className="alert alert-danger" role="alert">
                      {t('login.error')}
                    </div>
                  )}
                  <div className="form-floating mb-3">
                    <input
                      name="username"
                      autoComplete="username"
                      placeholder={t('login.username')}
                      id="username"
                      className={`form-control ${formik.touched.username && formik.errors.username ? 'is-invalid' : ''}`}
                      value={formik.values.username}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                    <label htmlFor="username">{t('login.username')}</label>
                    {formik.touched.username && formik.errors.username && (
                      <div className="invalid-feedback">
                        {formik.errors.username}
                      </div>
                    )}
                  </div>
                  <div className="form-floating mb-4">
                    <input
                      name="password"
                      autoComplete="current-password"
                      placeholder={t('login.password')}
                      type="password"
                      id="password"
                      className={`form-control ${formik.touched.password && formik.errors.password ? 'is-invalid' : ''}`}
                      value={formik.values.password}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                    <label htmlFor="password">{t('login.password')}</label>
                    {formik.touched.password && formik.errors.password && (
                      <div className="invalid-feedback">
                        {formik.errors.password}
                      </div>
                    )}
                  </div>
                  <button
                    type="submit"
                    className="w-100 mb-3 btn btn-outline-primary"
                    disabled={loading}
                  >
                    {loading ? t('loading') : t('login.submit')}
                  </button>
                </form>
              </div>
              <div className="card-footer p-4">
                <div className="text-center">
                  <span>{t('login.noAccount')}</span>{' '}
                  <Link to="/signup">{t('login.signupLink')}</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
