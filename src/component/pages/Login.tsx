import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLogin } from "../../hooks/useLogin";
import { useAuthStore } from "../../hooks/useAuthStore";

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const loginMutation = useLogin();
  const loginStore = useAuthStore((state) => state.login);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    if (!username || !password) return;

    loginMutation.mutate(
      { username, password },
      {
        onSuccess: (data) => {
          loginStore(data.token);
          navigate("/");
        },
      }
    );
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-900">

      {/* Card */}
      <div className="w-full max-w-sm bg-gray-800 text-white p-6 rounded-2xl shadow-lg">

        {/* App Name */}
        <h1 className="text-2xl font-semibold text-center mb-6">
          Connectly Chats
        </h1>

        {/* Email */}
        <div className="mb-4">
          <input
            type="email"
            placeholder="Username"
            className="w-full p-3 rounded-lg bg-gray-700 outline-none focus:ring-2 focus:ring-green-500"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        {/* Password */}
        <div className="mb-4">
          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 rounded-lg bg-gray-700 outline-none focus:ring-2 focus:ring-green-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {/* Error */}
        {loginMutation.isError && (
          <div className="text-red-400 text-sm mb-3">
            Invalid credentials
          </div>
        )}

        {/* Button */}
        <button
          onClick={handleLogin}
          disabled={loginMutation.isPending}
          className="w-full bg-green-500 hover:bg-green-600 transition p-3 rounded-lg font-semibold"
        >
          {loginMutation.isPending ? "Logging in..." : "Login"}
        </button>

        {/* Footer */}
        <p
          className="text-gray-400 text-sm text-center mt-4 cursor-pointer"
          onClick={() => navigate("/register")}
        >
          Don’t have an account? Sign up
        </p>
      </div>
    </div>
  );
};

export default LoginPage;