// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

const isTokenExpired = (token) => {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.exp < Date.now() / 1000;
  } catch {
    return true;
  }
};

export const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);
  const [token, setToken] = useState(null);
  const [cargando, setCargando] = useState(true);

  // Al montar, recupera sesión guardada en localStorage
  useEffect(() => {
    const tokenGuardado = localStorage.getItem("token");
    const usuarioGuardado = localStorage.getItem("usuario");

    if (tokenGuardado && usuarioGuardado) {
      if (isTokenExpired(tokenGuardado)) {
        localStorage.removeItem("token");
        localStorage.removeItem("usuario");
      } else {
        setToken(tokenGuardado);
        try {
          setUsuario(JSON.parse(usuarioGuardado));
        } catch {
          localStorage.removeItem("usuario");
        }
      }
    }

    setCargando(false);
  }, []);

  const login = (usuarioData, tokenData) => {
    setUsuario(usuarioData);
    setToken(tokenData);
    localStorage.setItem("token", tokenData);
    localStorage.setItem("usuario", JSON.stringify(usuarioData));
  };

  const logout = () => {
    setUsuario(null);
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
  };

  const esAdmin = usuario?.rol === "ADMIN_ROLE";
  const estaLogueado = !!token;

  return (
    <AuthContext.Provider
      value={{ usuario, token, cargando, login, logout, esAdmin, estaLogueado }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);