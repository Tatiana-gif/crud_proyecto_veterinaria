import React, { useState } from "react";
import { api } from "../services/api";
import '../components/styles/loginForm.css'
interface LoginFormProps {
  onLoginSuccess: (token: string) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLoginSuccess }) => {
  const [usuario, setUsuario] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await api.post<{ access_token: string }>("/login", {
        usuario,
        password,
      });

      onLoginSuccess(response.data.access_token);
    } catch (err) {
      setError("⚠️ Credenciales inválidas, intenta de nuevo.");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-r from-blue-200 to-blue-400">
      <div className="container">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-xl w-96 transform transition-all hover:scale-105"
      >
        <h2 className="text-3xl font-bold text-center mb-6 text-blue-700">
          Iniciar Sesión
        </h2>

        {error && (
          <p className="text-red-500 text-sm mb-4 text-center font-medium">
            {error}
          </p>
        )}

        <div className="mb-4">
          <label className="block text-gray-600 mb-2 font-semibold">
            Usuario
          </label>
          <input
            type="text"
            placeholder="Ingrese su usuario"
            value={usuario}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setUsuario(e.target.value)
            }
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            required
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-600 mb-2 font-semibold">
            Contraseña
          </label>
          <input
            type="password"
            placeholder="Ingrese su contraseña"
            value={password}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setPassword(e.target.value)
            }
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold shadow-md hover:bg-blue-700 hover:shadow-lg transition"
        >
          Ingresar
        </button>
      </form>
      </div>
    </div>
  );
};

export default LoginForm;
