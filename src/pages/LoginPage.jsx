import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../context/authStore';
import { Button, Input } from '@/components/ui/input';

export default function LoginPage() {
  const { login } = useAuthStore();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleLogin = async () => {
    try {
      await login(formData.email, formData.password);
      navigate('/notes');
    } catch (error) {
      alert('Invalid Credentials');
    }
  };

  return (
    <div className="flex flex-col space-y-4 p-10">
      <h2>Login</h2>
      <Input
        type="email"
        placeholder="Email"
        onChange={(e) =>
          setFormData({ ...formData, email: e.target.value })
        }
      />
      <Input
        type="password"
        placeholder="Password"
        onChange={(e) =>
          setFormData({ ...formData, password: e.target.value })
        }
      />
      <Button onClick={handleLogin}>Login</Button>
    </div>
  );
}
