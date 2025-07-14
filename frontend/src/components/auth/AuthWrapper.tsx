import React, { useState } from "react";
import Login from "./Login.tsx";
import Register from "./Register.tsx";

const AuthWrapper: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <>
      {isLogin ? (
        <Login onSwitchToRegister={() => setIsLogin(false)} />
      ) : (
        <Register onSwitchToLogin={() => setIsLogin(true)} />
      )}
    </>
  );
};

export default AuthWrapper;
