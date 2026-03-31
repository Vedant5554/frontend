import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { FormField } from '../components/ui/FormField';
import { Button } from '../components/ui/Button';
import { ArrowRight } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');
    try {
      await login(email, password);

      queryClient.invalidateQueries();

      toast.success('Successfully logged in!');
      navigate('/dashboard');
    } catch (error) {
      console.error('Login error:', error.response?.data);
      const msg = error.response?.data?.message || 'Login failed. Please check your credentials.';
      setErrorMsg(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen app-bg flex flex-col justify-center items-center py-12 px-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-[40%] -right-[10%] w-[800px] h-[800px] bg-white/[0.015] rounded-full blur-3xl opacity-50" />
        <div className="absolute -bottom-[40%] -left-[10%] w-[800px] h-[800px] bg-white/[0.015] rounded-full blur-3xl opacity-50" />
      </div>

      <div className="relative z-10 sm:mx-auto sm:w-full sm:max-w-[420px]">
        {/* Brand */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-white rounded-2xl shadow-[0_0_30px_rgba(255,255,255,0.15)] mb-6 transition-transform hover:scale-105">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L2 22H22L12 2Z" fill="#000000" />
            </svg>
          </div>
          <h1 className="text-3xl font-display font-bold text-white tracking-tighter">
            uams.
          </h1>
          <p className="mt-2 text-sm text-[#888888] font-medium tracking-wide">
            University Accommodation System
          </p>
        </div>

        {/* Card */}
        <div className="bg-card rounded-2xl border border-subtle p-8 shadow-2xl relative">
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#555] to-transparent opacity-50"></div>
          
          {errorMsg && (
            <div className="mb-6 bg-[#220000] border border-[#ff0000]/50 text-[#ff0000] px-4 py-3 rounded-xl text-sm text-center font-medium">
              {errorMsg}
            </div>
          )}
          
          <form className="space-y-6" onSubmit={handleLogin}>
            <FormField
              label="Email address"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@uams.edu"
            />
            
            <FormField
              label="Password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />

            <Button type="submit" disabled={isLoading} className="w-full py-3 text-sm mt-2 font-display tracking-wide" isLoading={isLoading}>
              Sign in to Workspace 
              {!isLoading && <ArrowRight className="w-4 h-4 ml-2" />}
            </Button>
          </form>
        </div>

        {/* Footer */}
        <p className="mt-8 text-center text-[11px] text-[#666666] uppercase tracking-widest font-semibold">
          Secure System Environment &copy; {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
}
