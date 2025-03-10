import React, { useState } from "react";
import MyInput from "../ui/Input";
import MyButton from "../ui/Button";
import useAuthStore from "../../context/authStore";
import { useNavigate } from "react-router-dom";

export default function RegisterForm() {
  const { register } = useAuthStore();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    try {
      setLoading(true);
      await register(formData.email, formData.password);
      navigate("/notes");
    } catch (error) {
      // Error is already handled by the store
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleRegister();
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md space-y-6">
        <h2 className="text-2xl font-semibold text-navy text-center">Register</h2>
        
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
          <MyButton 
            onClick={handleRegister}
            className="w-full bg-ocean hover:bg-ocean/90 text-white"
            disabled={loading}
          >
            {loading ? 'Registering...' : 'Register'}
          </MyButton>
        </div>

        <p
          className="text-sm text-center text-ocean cursor-pointer hover:underline"
          onClick={() => navigate("/")}
        >
          Already have an account? Login
        </p>
      </div>
    </div>
  );
}
