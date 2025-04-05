import { useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { Helmet } from 'react-helmet';
import LoginForm from '@/components/auth/LoginForm';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/lib/context/AuthContext';

const Login = () => {
  const { isAuthenticated } = useAuth();
  const [location, navigate] = useLocation();
  
  // Get redirect path from URL query params if present
  const searchParams = new URLSearchParams(location.split('?')[1] || '');
  const redirectPath = searchParams.get('redirect');

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate(redirectPath || '/');
    }
  }, [isAuthenticated, navigate, redirectPath]);

  return (
    <div className="container mx-auto px-4 py-16 max-w-md">
      <Helmet>
        <title>Login - FarmFresh Market</title>
        <meta name="description" content="Login to your FarmFresh Market account" />
      </Helmet>

      <Card>
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Login</CardTitle>
          <CardDescription className="text-center">
            Enter your email and password to access your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LoginForm redirectPath={redirectPath || undefined} />
        </CardContent>
        <CardFooter className="flex flex-col space-y-4 border-t pt-6">
          <div className="text-sm text-center text-neutral-600">
            Don't have an account?{' '}
            <Link href="/register" className="text-primary hover:underline font-medium">
              Create an account
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;
