import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRegister } from "../../hooks/useRegister";

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const registerMutation = useRegister();

  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleRegister = () => {
    if (!email ||!username || !password || !confirmPassword) return;

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    registerMutation.mutate(
      { username, password },
      {
        onSuccess: () => {
          navigate("/login");
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
            type="text"
            placeholder="Username"
            className="w-full p-3 rounded-lg bg-gray-700 outline-none focus:ring-2 focus:ring-green-500"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        {/* Username */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Username"
            className="w-full p-3 rounded-lg bg-gray-700 outline-none focus:ring-2 focus:ring-green-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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

        {/* Confirm Password */}
        <div className="mb-4">
          <input
            type="password"
            placeholder="Confirm Password"
            className="w-full p-3 rounded-lg bg-gray-700 outline-none focus:ring-2 focus:ring-green-500"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>

        {/* Error */}
        {registerMutation.isError && (
          <div className="text-red-400 text-sm mb-3">
            Registration failed
          </div>
        )}

        {/* Button */}
        <button
          onClick={handleRegister}
          disabled={registerMutation.isPending}
          className="w-full bg-green-500 hover:bg-green-600 transition p-3 rounded-lg font-semibold"
        >
          {registerMutation.isPending ? "Creating account..." : "Register"}
        </button>

        {/* Footer */}
        <p
          className="text-gray-400 text-sm text-center mt-4 cursor-pointer"
          onClick={() => navigate("/login")}
        >
          Already have an account? Login
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;