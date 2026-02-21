import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { signup } from '../slices/authSlice';
import Header from '../components/Header';

const SignupPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { loading } = useSelector((state) => state.auth);

  const [serverError, setServerError] = useState('');

  return (
    <div className="d-flex flex-column h-100">
      <Header />
      <div className="container-fluid h-100 d-flex align-items-center justify-content-center">
        <div className="col-12 col-md-6 col-lg-4">
          <h2 className="text-center mb-4">{t('signup.title')}</h2>
          <Formik
            initialValues={{ username: '', password: '', confirmPassword: '' }}
            validationSchema={Yup.object({
              username: Yup.string()
                .min(3, t('validation.usernameLength'))
                .max(20, t('validation.usernameLength'))
                .required(t('validation.required')),
              password: Yup.string()
                .min(6, t('validation.passwordLength'))
                .required(t('validation.required')),
              confirmPassword: Yup.string()
                .oneOf([Yup.ref('password'), null], t('validation.passwordsMustMatch'))
                .required(t('validation.required')),
            })}
            onSubmit={async (values, { setSubmitting }) => {
              setServerError('');
              try {
                const resultAction = await dispatch(signup({
                  username: values.username,
                  password: values.password,
                }));
                if (signup.fulfilled.match(resultAction)) {
                  toast.success(t('toast.signupSuccess'));
                  navigate('/');
                } else if (signup.rejected.match(resultAction)) {
                  // Обработка ошибки от сервера (например, пользователь уже существует)
                  const error = resultAction.payload;
                  if (error?.status === 409) {
                    setServerError(t('validation.userExists'));
                  } else {
                    setServerError(t('toast.error'));
                  }
                }
              } catch (err) {
                setServerError(t('toast.error'));
              } finally {
                setSubmitting(false);
              }
            }}
          >
            {({ errors, touched, isSubmitting }) => (
              <Form className="p-4 border rounded bg-light">
                <div className="mb-3">
                  <label htmlFor="username" className="form-label">
                    {t('signup.username')}
                  </label>
                  <Field
                    type="text"
                    name="username"
                    id="username"
                    className={`form-control ${touched.username && errors.username ? 'is-invalid' : ''}`}
                    autoFocus
                  />
                  {touched.username && errors.username && (
                    <div className="invalid-feedback">{errors.username}</div>
                  )}
                </div>

                <div className="mb-3">
                  <label htmlFor="password" className="form-label">
                    {t('signup.password')}
                  </label>
                  <Field
                    type="password"
                    name="password"
                    id="password"
                    className={`form-control ${touched.password && errors.password ? 'is-invalid' : ''}`}
                  />
                  {touched.password && errors.password && (
                    <div className="invalid-feedback">{errors.password}</div>
                  )}
                </div>

                <div className="mb-3">
                  <label htmlFor="confirmPassword" className="form-label">
                    {t('signup.confirmPassword')}
                  </label>
                  <Field
                    type="password"
                    name="confirmPassword"
                    id="confirmPassword"
                    className={`form-control ${touched.confirmPassword && errors.confirmPassword ? 'is-invalid' : ''}`}
                  />
                  {touched.confirmPassword && errors.confirmPassword && (
                    <div className="invalid-feedback">{errors.confirmPassword}</div>
                  )}
                </div>

                {serverError && (
                  <div className="alert alert-danger" role="alert">
                    {serverError}
                  </div>
                )}

                <button
                  type="submit"
                  className="btn btn-primary w-100"
                  disabled={isSubmitting || loading}
                >
                  {isSubmitting || loading ? t('loading') : t('signup.submit')}
                </button>

                <div className="text-center mt-3">
                  <Link to="/login">{t('signup.alreadyHaveAccount')}</Link>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
