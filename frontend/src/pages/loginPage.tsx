import React, { useState } from "react";
import LoginForm from "../components/loginForm";

const LoginPage: React.FC = () => {
  const [token, setToken] = useState<string | null>(null);

  return (
    <div>
      {!token ? (
        <LoginForm onLoginSuccess={setToken} />
      ) : (
        <div className="flex flex-col items-center justify-center h-screen">
          <h2 className="text-2xl font-bold">Bienvenido 🎉</h2>
          <p className="text-gray-700 mt-2">Token: {token}</p>
        </div>
      )}
    </div>
  );
};

export default LoginPage;
