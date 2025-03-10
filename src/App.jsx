import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginForm from "./components/auth/LoginForm";
import RegisterForm from "./components/auth/RegisterForm";
import NoteList from "./components/notes/NoteList";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import PublicRoute from "./components/auth/PublicRoute";
import { Toaster } from "sonner";

export default function App() {
  return (
    <div className="h-screen w-full flex items-center justify-center bg-gray-100">
      <Toaster />
      <BrowserRouter>
        <Routes>
          <Route 
            path="/" 
            element={
              <PublicRoute>
                <LoginForm />
              </PublicRoute>
            } 
          />
          <Route 
            path="/register" 
            element={
              <PublicRoute>
                <RegisterForm />
              </PublicRoute>
            } 
          />
          <Route 
            path="/notes" 
            element={
              <ProtectedRoute>
                <NoteList />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}
