import { useCallback, useEffect, useReducer, useRef, useState } from 'react';
import PropTypes from 'prop-types';

import { authApi } from 'src/api/auth/authService';
import { Issuer } from 'src/utils/auth';
import { AuthContext, initialState } from './auth-context';

import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import SessionManager from 'src/components/session-manager';

const STORAGE_KEY = 'accessToken';

var ActionType;
(function (ActionType) {
  ActionType['INITIALIZE'] = 'INITIALIZE';
  ActionType['SIGN_IN'] = 'SIGN_IN';
  ActionType['SIGN_UP'] = 'SIGN_UP';
  ActionType['SIGN_OUT'] = 'SIGN_OUT';
  ActionType['REFRESH_SESSION'] = 'REFRESH_SESSION';
})(ActionType || (ActionType = {}));

const handlers = {
  INITIALIZE: (state, action) => {
    const { isAuthenticated, user } = action.payload;

    return {
      ...state,
      isAuthenticated,
      isInitialized: true,
      user,
    };
  },
  SIGN_IN: (state, action) => {
    const { user } = action.payload;

    return {
      ...state,
      isAuthenticated: true,
      user,
    };
  },
  SIGN_UP: (state, action) => {
    const { user } = action.payload;

    return {
      ...state,
      isAuthenticated: true,
      user,
    };
  },
  SIGN_OUT: (state) => ({
    ...state,
    isAuthenticated: false,
    user: null,
  }),
  REFRESH_SESSION: (state, action) => {
    const { user } = action.payload;
    return {
      ...state,
      isAuthenticated: true,
      user,
    };
  },
};

const reducer = (state, action) =>
  handlers[action.type] ? handlers[action.type](state, action) : state;

export const AuthProvider = (props) => {
  const { children } = props;
  const [state, dispatch] = useReducer(reducer, initialState);
  const [showModal, setShowModal] = useState(false);
  const [counter, setCounter] = useState(20);
  const navigate = useNavigate();
  const countdownRef = useRef(null);

  const getTokenExpirationTime = () => {
    const token = localStorage.getItem(STORAGE_KEY);
    if (!token) return null;

    const decodedToken = jwtDecode(token);
    return decodedToken.exp * 1000;
  };

  const refreshSession = useCallback(async () => {
    try {
      const accessToken = window.localStorage.getItem(STORAGE_KEY);
      if (accessToken) {
        const { token } = await authApi.refreshToken({ accessToken });
        localStorage.setItem(STORAGE_KEY, token);

        const user = await authApi.me();
        dispatch({
          type: ActionType.REFRESH_SESSION,
          payload: {
            user,
          },
        });
      } else {
        setShowModal(false);
        navigate('/');
      }
    } catch (err) {
      setShowModal(false);
      console.error('Error al refrescar la sesión:', err);
    }
  }, [dispatch]);

  const initialize = useCallback(async () => {
    try {
      const accessToken = window.localStorage.getItem(STORAGE_KEY);

      if (accessToken) {
        const user = await authApi.me({ accessToken });

        dispatch({
          type: ActionType.INITIALIZE,
          payload: {
            isAuthenticated: true,
            user,
          },
        });
      } else {
        dispatch({
          type: ActionType.INITIALIZE,
          payload: {
            isAuthenticated: false,
            user: null,
          },
        });
      }
    } catch (err) {
      console.error(err);
      dispatch({
        type: ActionType.INITIALIZE,
        payload: {
          isAuthenticated: false,
          user: null,
        },
      });
    }
  }, [dispatch]);

  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    if (showModal) {
      countdownRef.current = setInterval(() => {
        setCounter((prevCounter) => {
          if (prevCounter <= 1) {
            clearInterval(countdownRef.current);
            setShowModal(false);
            signOut();
            navigate('/');
            return 0;
          }
          return prevCounter - 1;
        });
      }, 1000);
    } else {
      clearInterval(countdownRef.current);
    }

    return () => clearInterval(countdownRef.current);
  }, [showModal, navigate]);

  const signIn = useCallback(
    async (email, password) => {
      const { accessToken } = await authApi.signIn({ email, password });
      localStorage.setItem(STORAGE_KEY, accessToken);

      const user = await authApi.me();
      dispatch({
        type: ActionType.SIGN_IN,
        payload: {
          user,
        },
      });
    },
    [dispatch]
  );

  const signUp = useCallback(
    async (dataUser) => {
      await authApi.signUp({ ...dataUser });

      dispatch({
        type: ActionType.SIGN_UP,
        payload: {
          user: null,
        },
      });
    },
    [dispatch]
  );

  const signOut = useCallback(async () => {
    localStorage.removeItem(STORAGE_KEY);
    dispatch({ type: ActionType.SIGN_OUT });
  }, [dispatch]);

  const extendSession = useCallback(() => {
    refreshSession();
    setShowModal(false);
    setCounter(20);
  }, [refreshSession]);

  useEffect(() => {
    const isSessionActive = () => {
      const currentTime = Date.now();
      const expirationTime = getTokenExpirationTime();
      return expirationTime > currentTime;
    };

    if (!isSessionActive()) {
      return;
    }

    const handleUserActivity = () => {
      if (!showModal) {
        setCounter(20);

        const currentTime = Date.now();
        const expirationTime = getTokenExpirationTime();
        const timeRemaining = expirationTime - currentTime;

        if (timeRemaining <= 1000 * 20 && timeRemaining > 0) {
          refreshSession();
        }
      }
    };

    window.addEventListener('mousemove', handleUserActivity);
    window.addEventListener('keypress', handleUserActivity);

    const checkInactivity = setInterval(() => {
      const currentTime = Date.now();
      const expirationTime = getTokenExpirationTime();
      const timeRemaining = expirationTime - currentTime;

      if (timeRemaining <= 1000 * 20 && !showModal && timeRemaining > 0) {
        setShowModal(true);
        setCounter(20);
      }

      if (timeRemaining <= 0) {
        setShowModal(false);
        signOut();
        navigate('/');
        clearInterval(checkInactivity);
        window.removeEventListener('mousemove', handleUserActivity);
        window.removeEventListener('keypress', handleUserActivity);
      }
    }, 1000);

    return () => {
      clearInterval(checkInactivity);
      window.removeEventListener('mousemove', handleUserActivity);
      window.removeEventListener('keypress', handleUserActivity);
    };
  }, [refreshSession, showModal, navigate, signOut, getTokenExpirationTime]);

  return (
    <AuthContext.Provider
      value={{
        ...state,
        issuer: Issuer.JWT,
        initialize,
        signIn,
        signUp,
        signOut,
        refreshSession,
      }}
    >
      {children}

      <SessionManager
        showModal={showModal}
        signOut={signOut}
        counter={counter}
        extendSession={extendSession}
      />
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
