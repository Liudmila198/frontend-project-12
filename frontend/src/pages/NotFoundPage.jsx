// import { Link } from 'react-router-dom'
// import Header from '../components/Header'

// const NotFoundPage = () => {
//   return (
//     <div className="d-flex flex-column h-100">
//       <Header />
//       <div className="container text-center mt-5">
//         <h1>404 - Страница не найдена</h1>
//         <Link to="/">Вернуться на главную</Link>
//       </div>
//     </div>
//   )
// }

// export default NotFoundPage

import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Header from '../components/Header'

const NotFoundPage = () => {
  const { t } = useTranslation()

  return (
    <div className="d-flex flex-column h-100">
      <Header />
      <div className="container text-center mt-5">
        <h1>{t('notFound.title')}</h1>
        <Link to="/">{t('notFound.link')}</Link>
      </div>
    </div>
  )
}

export default NotFoundPage
