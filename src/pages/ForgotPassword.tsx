import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { ArrowLeft, Mail, KeyRound, CheckCircle } from 'lucide-react';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { Checkbox } from '@/components/ui/checkbox';

type Step = 'email' | 'otp' | 'password' | 'success';

const ForgotPassword: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const passwordRequirements = {
    minLength: password.length >= 8,
    hasUppercase: /[A-Z]/.test(password),
    hasNumber: /\d/.test(password),
    hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(password)
  };

  const isPasswordValid = Object.values(passwordRequirements).every(Boolean);
  const passwordsMatch = password === confirmPassword;

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Check if email exists in the system
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('email')
        .eq('email', email)
        .maybeSingle();

      if (!profile) {
        toast({
          title: "Account not found",
          description: "No account exists with this email address. Please register first.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      // Send OTP using Supabase's built-in email OTP
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          shouldCreateUser: false,
        }
      });

      if (error) {
        toast({
          title: "Failed to send OTP",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "OTP Sent",
          description: "Please check your email for the verification code.",
        });
        setStep('otp');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.verifyOtp({
        email,
        token: otp,
        type: 'email',
      });

      if (error) {
        toast({
          title: "Invalid OTP",
          description: "The verification code is incorrect or expired. Please try again.",
          variant: "destructive",
        });
      } else if (data.session) {
        toast({
          title: "OTP Verified",
          description: "Please enter your new password.",
        });
        setStep('password');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isPasswordValid) {
      toast({
        title: "Invalid password",
        description: "Please meet all password requirements.",
        variant: "destructive",
      });
      return;
    }

    if (!passwordsMatch) {
      toast({
        title: "Passwords don't match",
        description: "Please ensure both password fields match.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: password
      });

      if (error) {
        toast({
          title: "Failed to reset password",
          description: error.message,
          variant: "destructive",
        });
      } else {
        // Sign out after password reset
        await supabase.auth.signOut();
        setStep('success');
        toast({
          title: "Password Reset Successful",
          description: "Your password has been changed. Please login with your new password.",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          shouldCreateUser: false,
        }
      });

      if (error) {
        toast({
          title: "Failed to resend OTP",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "OTP Resent",
          description: "Please check your email for the new verification code.",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar onSearch={(query) => navigate(`/products?search=${encodeURIComponent(query)}`)} />
      <main className="flex-grow pt-24 pb-16 flex items-center justify-center">
        <div className="container mx-auto px-4">
          <Card className="w-full max-w-md mx-auto">
            <CardHeader>
              <CardTitle className="text-2xl text-center flex items-center justify-center gap-2">
                {step === 'email' && <Mail className="h-6 w-6" />}
                {step === 'otp' && <KeyRound className="h-6 w-6" />}
                {step === 'password' && <KeyRound className="h-6 w-6" />}
                {step === 'success' && <CheckCircle className="h-6 w-6 text-green-500" />}
                {step === 'email' && 'Forgot Password'}
                {step === 'otp' && 'Verify OTP'}
                {step === 'password' && 'Reset Password'}
                {step === 'success' && 'Password Reset'}
              </CardTitle>
              <CardDescription className="text-center">
                {step === 'email' && 'Enter your email address to receive a verification code.'}
                {step === 'otp' && `Enter the 6-digit code sent to ${email}`}
                {step === 'password' && 'Create a new password for your account.'}
                {step === 'success' && 'Your password has been successfully reset.'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {step === 'email' && (
                <form onSubmit={handleSendOTP} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder="Enter your registered email"
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? 'Sending OTP...' : 'Send OTP'}
                  </Button>
                </form>
              )}

              {step === 'otp' && (
                <form onSubmit={handleVerifyOTP} className="space-y-4">
                  <div className="flex flex-col items-center space-y-4">
                    <InputOTP
                      maxLength={6}
                      value={otp}
                      onChange={(value) => setOtp(value)}
                    >
                      <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                      </InputOTPGroup>
                    </InputOTP>
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading || otp.length !== 6}>
                    {isLoading ? 'Verifying...' : 'Verify OTP'}
                  </Button>
                  <div className="text-center">
                    <Button
                      type="button"
                      variant="link"
                      onClick={handleResendOTP}
                      disabled={isLoading}
                      className="text-sm"
                    >
                      Didn't receive the code? Resend OTP
                    </Button>
                  </div>
                </form>
              )}

              {step === 'password' && (
                <form onSubmit={handleResetPassword} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="password">New Password</Label>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      placeholder="Enter new password"
                    />
                    
                    <div className="space-y-2 mt-2">
                      <p className="text-sm font-medium">Password Requirements:</p>
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <Checkbox checked={passwordRequirements.minLength} disabled />
                          <span className={`text-xs ${passwordRequirements.minLength ? 'text-green-600' : 'text-muted-foreground'}`}>
                            Minimum 8 characters
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox checked={passwordRequirements.hasUppercase} disabled />
                          <span className={`text-xs ${passwordRequirements.hasUppercase ? 'text-green-600' : 'text-muted-foreground'}`}>
                            One uppercase letter
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox checked={passwordRequirements.hasNumber} disabled />
                          <span className={`text-xs ${passwordRequirements.hasNumber ? 'text-green-600' : 'text-muted-foreground'}`}>
                            One number
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox checked={passwordRequirements.hasSpecial} disabled />
                          <span className={`text-xs ${passwordRequirements.hasSpecial ? 'text-green-600' : 'text-muted-foreground'}`}>
                            One special character
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      placeholder="Confirm new password"
                    />
                    {confirmPassword && !passwordsMatch && (
                      <p className="text-xs text-destructive">Passwords do not match</p>
                    )}
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={isLoading || !isPasswordValid || !passwordsMatch}
                  >
                    {isLoading ? 'Resetting Password...' : 'Reset Password'}
                  </Button>
                </form>
              )}

              {step === 'success' && (
                <div className="text-center space-y-4">
                  <p className="text-muted-foreground">
                    You can now login with your new password.
                  </p>
                  <Button onClick={() => navigate('/login')} className="w-full">
                    Go to Login
                  </Button>
                </div>
              )}

              <div className="mt-4 text-center">
                <Link to="/login" className="text-sm text-primary hover:underline inline-flex items-center gap-1">
                  <ArrowLeft className="h-4 w-4" />
                  Back to Login
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ForgotPassword;
