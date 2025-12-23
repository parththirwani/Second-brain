import React, { useState } from 'react';
import { FileText } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';

export const AuthScreen: React.FC = () => {
  const [isSignup, setIsSignup] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signin, signup } = useAuth();

  const handleSubmit = async () => {
    setError('');
    setLoading(true);

    try {
      if (isSignup) {
        await signup(username, password);
        setIsSignup(false);
        setPassword('');
        alert('Signup successful! Please sign in.');
      } else {
        await signin(username, password);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-block p-3 bg-blue-600 rounded-2xl mb-4">
            <FileText size={32} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Second Brain</h1>
          <p className="text-gray-400">Your personal knowledge management system</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{isSignup ? 'Create Account' : 'Welcome Back'}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                minLength={5}
                maxLength={30}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                minLength={8}
              />
            </div>

            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 text-sm">
                {error}
              </div>
            )}

            <Button 
              onClick={handleSubmit} 
              className="w-full" 
              disabled={loading}
            >
              {loading ? 'Processing...' : isSignup ? 'Sign Up' : 'Sign In'}
            </Button>

            <div className="text-center">
              <button
                onClick={() => {
                  setIsSignup(!isSignup);
                  setError('');
                }}
                className="text-blue-400 hover:text-blue-300 text-sm transition-colors"
              >
                {isSignup ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
