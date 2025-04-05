import { useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { Helmet } from 'react-helmet';
import RegisterForm from '@/components/auth/RegisterForm';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/lib/context/AuthContext';

const Register = () => {
  const { isAuthenticated } = useAuth();
  const [location, navigate] = useLocation();
  
  // Check if user wants to register as farmer
  const searchParams = new URLSearchParams(location.split('?')[1] || '');
  const isFarmer = searchParams.get('farmer') === 'true';

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="container mx-auto px-4 py-16 max-w-2xl">
      <Helmet>
        <title>{isFarmer ? 'Become a Seller' : 'Create Account'} - FarmFresh Market</title>
        <meta 
          name="description" 
          content={isFarmer 
            ? "Register as a farmer and sell your products on FarmFresh Market" 
            : "Create an account to start shopping at FarmFresh Market"} 
        />
      </Helmet>

      <Card>
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            {isFarmer ? 'Become a Seller' : 'Create an Account'}
          </CardTitle>
          <CardDescription className="text-center">
            {isFarmer 
              ? "Register as a farmer to start selling your products on FarmFresh Market"
              : "Enter your details to create your FarmFresh Market account"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RegisterForm defaultFarmer={isFarmer} />
        </CardContent>
        <CardFooter className="flex flex-col space-y-4 border-t pt-6">
          <div className="text-sm text-center text-neutral-600">
            Already have an account?{' '}
            <Link href="/login" className="text-primary hover:underline font-medium">
              Login here
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Register;
