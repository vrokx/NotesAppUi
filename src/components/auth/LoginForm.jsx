import React, { useState } from "react";
import MyInput from "../ui/Input";
import MyButton from "../ui/Button";
import useAuthStore from "../../context/authStore";
import { useNavigate } from "react-router-dom";

export default function LoginForm() {
  const { login } = useAuthStore();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    try {
      setLoading(true);
      await login(formData.email, formData.password, rememberMe);
      navigate("/notes");
    } catch (error) {
      // Error is already handled by the store
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md space-y-6">
        <h2 className="text-2xl font-semibold text-navy text-center">Login</h2>
        
        <div className="space-y-4">
          <MyInput
            placeholder="Email"
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            onKeyPress={handleKeyPress}
            disabled={loading}
          />
          <MyInput
            type="password"
            placeholder="Password"
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            onKeyPress={handleKeyPress}
            disabled={loading}
          />
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="rememberMe"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-4 h-4 text-ocean border-light-gray rounded focus:ring-ocean"
            />
            <label htmlFor="rememberMe" className="ml-2 text-sm text-navy">
              Remember me
            </label>
          </div>

          <MyButton 
            onClick={handleLogin}
            className="w-full bg-ocean hover:bg-ocean/90 text-white"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </MyButton>
        </div>

        <p
          className="text-sm text-center text-ocean cursor-pointer hover:underline"
          onClick={() => navigate("/register")}
        >
          Don't have an account? Register
        </p>
      </div>
    </div>
  );
}
