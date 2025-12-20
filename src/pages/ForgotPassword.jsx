import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { TextField, Button, Container, Box, Avatar, Typography, CssBaseline, Grid, Snackbar, Alert, CircularProgress } from '@mui/material';
import { LockReset } from '@mui/icons-material';
import { CognitoUser } from 'amazon-cognito-identity-js';
import UserPool from '../utils/UserPool';

function ForgotPassword(props) {
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [loading, setLoading] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [showError, setShowError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [submittedEmail, setSubmittedEmail] = useState('');

    const onSubmit = ({ email }) => {
        console.log('Submitting forgot password for:', email);
        setLoading(true);
        setShowError(false);
        setSubmittedEmail(email);
        
        const cognitoUser = UserPool.getCurrentUser();
        if (cognitoUser) {
            cognitoUser.signOut();
        }

        const userData = {
            Username: email,
            Pool: UserPool
        };

        const cognitoForgotUser = new CognitoUser(userData);
        
        cognitoForgotUser.forgotPassword({
            onSuccess: (data) => {
                console.log('Forgot password success:', data);
                setLoading(false);
                setShowSuccess(true);
                // Redirect to reset password page after 2 seconds
                setTimeout(() => {
                    navigate('/reset-password', { 
                        state: { email: email } 
                    });
                }, 2000);
            },
            onFailure: (err) => {
                console.error('Forgot password error:', err);
                setLoading(false);
                setErrorMessage(err.message || 'Failed to send reset code. Please try again.');
                setShowError(true);
            },
            inputVerificationCode: () => {
                console.log('Input verification code callback - redirecting to reset page');
                setLoading(false);
                setShowSuccess(true);
                // Redirect to reset password page after 2 seconds
                setTimeout(() => {
                    navigate('/reset-password', { 
                        state: { email: email } 
                    });
                }, 2000);
            }
        });
    };

    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Avatar sx={{ m: 1, bgcolor: 'info.main' }}>
                    <LockReset />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Reset Password
                </Typography>
                <Typography variant="body2" color="textSecondary" sx={{ mt: 1, textAlign: 'center' }}>
                    Enter your email address and we'll send you a verification code to reset your password.
                </Typography>
                <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 3 }}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Email Address"
                        name="email"
                        autoComplete="email"
                        autoFocus
                        {...register("email", { 
                            required: "Email is required",
                            pattern: {
                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                message: "Invalid email address"
                            }
                        })}
                        error={!!errors.email}
                        helperText={errors.email?.message}
                        disabled={loading}
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                        disabled={loading}
                    >
                        {loading ? <CircularProgress size={24} /> : 'Send Verification Code'}
                    </Button>
                    <Grid container justifyContent="center">
                        <Grid item>
                            <Link to="/login" style={{ textDecoration: 'none' }}>
                                {"Remember your password? Login"}
                            </Link>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
            
            <Snackbar 
                open={showSuccess} 
                autoHideDuration={6000}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert severity="success" sx={{ width: '100%' }}>
                    Verification code has been sent to your email! Redirecting to reset page...
                </Alert>
            </Snackbar>
            
            <Snackbar 
                open={showError} 
                autoHideDuration={6000}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert severity="error" sx={{ width: '100%' }}>
                    {errorMessage}
                </Alert>
            </Snackbar>
        </Container>
    );
}

export default ForgotPassword;
