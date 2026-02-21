import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux'; // добавляем useDispatch
import { useEffect } from 'react'; // добавляем useEffect

import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ChatPage from './pages/ChatPage';
import NotFoundPage from './pages/NotFoundPage';

// Импортируем сокет (предполагается, что файл создан по пути ./utils/socket)
import socket from './utils/socket';

// Импортируем действия для обновления состояния
import { addMessage } from './slices/messagesSlice';
// Если в проекте есть каналы, раскомментируйте строки ниже
// import { addChannel, removeChannel, renameChannel } from './slices/channelsSlice';

const PrivateRoute = ({ children }) => {
  const token = useSelector((state) => state.auth.token);
  return token ? children : <Navigate to="/login" />;
};

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    // Подписка на новые сообщения
    socket.on('newMessage', (message) => {
      console.log('New message via socket:', message);
      dispatch(addMessage(message));
    });

    // Если ваш проект поддерживает каналы, добавьте обработчики:
    // socket.on('newChannel', (channel) => {
    //   dispatch(addChannel(channel));
    // });
    // socket.on('removeChannel', ({ id }) => {
    //   dispatch(removeChannel(id));
    // });
    // socket.on('renameChannel', (channel) => {
    //   dispatch(renameChannel(channel));
    // });

    // Важно: отписываемся от событий при размонтировании компонента
    return () => {
      socket.off('newMessage');
      // socket.off('newChannel');
      // socket.off('removeChannel');
      // socket.off('renameChannel');
    };
  }, [dispatch]); // эффект зависит только от dispatch

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route
          path="/"
          element={
            <PrivateRoute>
              <ChatPage />
            </PrivateRoute>
          }
        />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
