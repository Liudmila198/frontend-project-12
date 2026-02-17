import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, Link } from 'react-router-dom'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { useTranslation } from 'react-i18next'
import { register, clearRegisterError } from '../slices/authSlice'
import { useEffect } from 'react'
import Header from '../components/Header'

const SignupPage = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { t } = useTranslation()
  const { loading, registerError, token } = useSelector((state) => state.auth)

  useEffect(() => {
    if (token) {
      navigate('/')
    }
  }, [token, navigate])

  const formik = useFormik({
    initialValues: { username: '', password: '', confirmPassword: '' },
    validationSchema: Yup.object({
      username: Yup.string()
        .min(3, t('validation.usernameLength'))
        .max(20, t('validation.usernameLength'))
        .required(t('validation.required')),
      password: Yup.string()
        .min(6, t('validation.passwordMin'))
        .required(t('validation.required')),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref('password'), null], t('validation.passwordsMustMatch'))
        .required(t('validation.required')),
    }),
    onSubmit: async (values) => {
      dispatch(clearRegisterError())
      const resultAction = await dispatch(register(values))
      if (register.fulfilled.match(resultAction)) {
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
                    alt={t('signup.title')}
                  />
                </div>
                <form
                  onSubmit={formik.handleSubmit}
                  className="col-12 col-md-6 mt-3 mt-md-0"
                >
                  <h1 className="text-center mb-4">{t('signup.title')}</h1>
                  {registerError && registerError.status === 409 && (
                    <div className="alert alert-danger" role="alert">
                      {t('signup.errorExists')}
                    </div>
                  )}
                  <div className="form-floating mb-3">
                    <input
                      name="username"
                      autoComplete="username"
                      placeholder={t('signup.username')}
                      id="signup-username"
                      className={`form-control ${formik.touched.username && formik.errors.username ? 'is-invalid' : ''}`}
                      value={formik.values.username}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                    <label htmlFor="signup-username">
                      {t('signup.username')}
                    </label>
                    {formik.touched.username && formik.errors.username && (
                      <div className="invalid-feedback">
                        {formik.errors.username}
                      </div>
                    )}
                  </div>
                  <div className="form-floating mb-3">
                    <input
                      name="password"
                      autoComplete="new-password"
                      placeholder={t('signup.password')}
                      type="password"
                      id="signup-password"
                      className={`form-control ${formik.touched.password && formik.errors.password ? 'is-invalid' : ''}`}
                      value={formik.values.password}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                    <label htmlFor="signup-password">
                      {t('signup.password')}
                    </label>
                    {formik.touched.password && formik.errors.password && (
                      <div className="invalid-feedback">
                        {formik.errors.password}
                      </div>
                    )}
                  </div>
                  <div className="form-floating mb-4">
                    <input
                      name="confirmPassword"
                      autoComplete="new-password"
                      placeholder={t('signup.confirmPassword')}
                      type="password"
                      id="confirm-password"
                      className={`form-control ${formik.touched.confirmPassword && formik.errors.confirmPassword ? 'is-invalid' : ''}`}
                      value={formik.values.confirmPassword}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                    <label htmlFor="confirm-password">
                      {t('signup.confirmPassword')}
                    </label>
                    {formik.touched.confirmPassword &&
                      formik.errors.confirmPassword && (
                        <div className="invalid-feedback">
                          {formik.errors.confirmPassword}
                        </div>
                      )}
                  </div>
                  <button
                    type="submit"
                    className="w-100 mb-3 btn btn-outline-primary"
                    disabled={loading}
                  >
                    {loading ? t('loading') : t('signup.submit')}
                  </button>
                </form>
              </div>
              <div className="card-footer p-4">
                <div className="text-center">
                  <span>{t('signup.alreadyHaveAccount')}</span>{' '}
                  <Link to="/login">{t('signup.loginLink')}</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SignupPage
