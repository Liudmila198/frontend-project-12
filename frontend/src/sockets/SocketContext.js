import React, { createContext, useContext, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import socketManager from './index'; // ваш существующий менеджер сокетов
import { addMessage, addChannel, removeChannelAction, renameChannelAction } from '../slices/chatSlice';

const SocketContext = createContext(null);

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within SocketProvider');
  }
  return context;
};

export const SocketProvider = ({ children }) => {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const socketRef = useRef(null);

  // Подключение и обработчики событий
  useEffect(() => {
    if (!token) {
      if (socketRef.current) {
        socketManager.disconnect();
        socketRef.current = null;
      }
      return;
    }

    // Подключаемся и сохраняем сокет
    const socket = socketManager.connect(token);
    socketRef.current = socket;

    // Обработчики событий от сервера
    socket.on('newMessage', (message) => {
      dispatch(addMessage(message));
    });

    socket.on('newChannel', (channel) => {
      dispatch(addChannel(channel));
    });

    socket.on('removeChannel', (channel) => {
      dispatch(removeChannelAction(channel.id));
    });

    socket.on('renameChannel', (channel) => {
      dispatch(renameChannelAction(channel));
    });

    // Обработка ошибок (опционально)
    socket.on('connect_error', (err) => {
      console.error('Socket connection error:', err);
    });

    return () => {
      // Отключаемся при размонтировании или смене токена
      socketManager.disconnect();
      socketRef.current = null;
    };
  }, [token, dispatch]);

  // API для отправки команд (возвращают Promise)
  const sendMessage = (data) => {
    return new Promise((resolve, reject) => {
      if (!socketRef.current) {
        reject(new Error('Socket not connected'));
        return;
      }
      // Предполагаем, что socketManager.emit умеет принимать callback
      socketRef.current.emit('newMessage', data, (response) => {
        if (response && response.status === 'ok') {
          resolve(response);
        } else {
          reject(response?.error || new Error('Failed to send message'));
        }
      });
    });
  };

  const createChannel = (name) => {
    return new Promise((resolve, reject) => {
      if (!socketRef.current) {
        reject(new Error('Socket not connected'));
        return;
      }
      socketRef.current.emit('newChannel', { name }, (response) => {
        if (response && response.status === 'ok') {
          resolve(response);
        } else {
          reject(response?.error || new Error('Failed to create channel'));
        }
      });
    });
  };

  const renameChannel = (id, name) => {
    return new Promise((resolve, reject) => {
      if (!socketRef.current) {
        reject(new Error('Socket not connected'));
        return;
      }
      socketRef.current.emit('renameChannel', { id, name }, (response) => {
        if (response && response.status === 'ok') {
          resolve(response);
        } else {
          reject(response?.error || new Error('Failed to rename channel'));
        }
      });
    });
  };

  const removeChannel = (id) => {
    return new Promise((resolve, reject) => {
      if (!socketRef.current) {
        reject(new Error('Socket not connected'));
        return;
      }
      socketRef.current.emit('removeChannel', { id }, (response) => {
        if (response && response.status === 'ok') {
          resolve(response);
        } else {
          reject(response?.error || new Error('Failed to remove channel'));
        }
      });
    });
  };

  const value = {
    sendMessage,
    createChannel,
    renameChannel,
    removeChannel,
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};
