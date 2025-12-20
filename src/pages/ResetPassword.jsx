import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { TextField, Button, Container, Box, Avatar, Typography, CssBaseline, Grid, Snackbar, Alert, CircularProgress, InputAdornment, IconButton, List, ListItem, ListItemIcon, ListItemText, Collapse, Fade } from '@mui/material';
import { LockReset, CheckCircle, Cancel, Visibility, VisibilityOff } from '@mui/icons-material';
import { CognitoUser } from 'amazon-cognito-identity-js';
import UserPool from '../utils/UserPool';

function ResetPassword(props) {
    const navigate = useNavigate();
    const location = useLocation();
    const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm();
    const [loading, setLoading] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [showError, setShowError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [passwordFocused, setPasswordFocused] = useState(false);
    const email = location.state?.email || '';
    const password = watch('password', '');

    useEffect(() => {
        if (email) {
            setValue('email', email);
        } else {
            // No email provided, redirect back to forgot password
            navigate('/forgot-password');
        }
    }, [email, setValue, navigate]);

    // Password validation checks
    const passwordChecks = {
        length: password.length >= 8,
        hasNumber: /\d/.test(password),
        hasUppercase: /[A-Z]/.test(password),
        hasLowercase: /[a-z]/.test(password)
    };

    const isPasswordValid = Object.values(passwordChecks).every(check => check);

    const handleClickShowPassword = () => setShowPassword(!showPassword);
    const handleMouseDownPassword = (event) => event.preventDefault();
    const handleClickShowConfirmPassword = () => setShowConfirmPassword(!showConfirmPassword);
    const handleMouseDownConfirmPassword = (event) => event.preventDefault();

    const onSubmit = ({ email, verificationCode, password }) => {
        if (!isPasswordValid) {
            setErrorMessage('Password must meet all requirements');
            setShowError(true);
            return;
        }

        setLoading(true);
        setShowError(false);

        const userData = {
            Username: email,
            Pool: UserPool
        };

        const cognitoUser = new CognitoUser(userData);

        cognitoUser.confirmPassword(verificationCode, password, {
            onSuccess: (data) => {
                console.log('Password reset success:', data);
                setLoading(false);
                setShowSuccess(true);
                // Redirect to login after 3 seconds
                setTimeout(() => {
                    navigate('/login', { 
                        state: { 
                            message: 'Password reset successful! Please login with your new password.' 
                        } 
                    });
                }, 3000);
            },
            onFailure: (err) => {
                console.error('Password reset error:', err);
                setLoading(false);
                setErrorMessage(err.message || 'Failed to reset password. Please check your verification code and try again.');
                setShowError(true);
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
                <Avatar sx={{ m: 1, bgcolor: 'success.main' }}>
                    <LockReset />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Reset Password
                </Typography>
                <Typography variant="body2" color="textSecondary" sx={{ mt: 1, textAlign: 'center' }}>
                    Enter the verification code from your email and your new password.
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
                        {...register("email", { required: "Email is required" })}
                        error={!!errors.email}
                        helperText={errors.email?.message}
                        disabled={true}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="verificationCode"
                        label="Verification Code"
                        name="verificationCode"
                        autoComplete="one-time-code"
                        autoFocus
                        {...register("verificationCode", { required: "Verification code is required" })}
                        error={!!errors.verificationCode}
                        helperText={errors.verificationCode?.message}
                        disabled={loading}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="New Password"
                        type={showPassword ? 'text' : 'password'}
                        id="password"
                        autoComplete="new-password"
                        {...register("password", { 
                            required: "Password is required",
                            validate: () => isPasswordValid || "Password must meet all requirements"
                        })}
                        error={!!errors.password}
                        helperText={errors.password?.message}
                        onFocus={() => setPasswordFocused(true)}
                        onBlur={() => setPasswordFocused(false)}
                        disabled={loading}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={handleClickShowPassword}
                                        onMouseDown={handleMouseDownPassword}
                                        edge="end"
                                    >
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />
                    
                    <Collapse in={passwordFocused || !!errors.password}>
                        <Box sx={{ mt: 1, mb: 2 }}>
                            <Typography variant="caption" color="textSecondary">
                                Password must contain:
                            </Typography>
                            <List dense>
                                <ListItem>
                                    <ListItemIcon sx={{ minWidth: 32 }}>
                                        <Fade in={true}>
                                            {passwordChecks.length ? (
                                                <CheckCircle sx={{ color: 'success.main', fontSize: 16 }} />
                                            ) : (
                                                <Cancel sx={{ color: 'error.main', fontSize: 16 }} />
                                            )}
                                        </Fade>
                                    </ListItemIcon>
                                    <ListItemText 
                                        primary="At least 8 characters" 
                                        sx={{ 
                                            color: passwordChecks.length ? 'success.main' : 'text.secondary',
                                            '& .MuiListItemText-primary': {
                                                fontSize: '0.75rem'
                                            }
                                        }}
                                    />
                                </ListItem>
                                <ListItem>
                                    <ListItemIcon sx={{ minWidth: 32 }}>
                                        <Fade in={true}>
                                            {passwordChecks.hasNumber ? (
                                                <CheckCircle sx={{ color: 'success.main', fontSize: 16 }} />
                                            ) : (
                                                <Cancel sx={{ color: 'error.main', fontSize: 16 }} />
                                            )}
                                        </Fade>
                                    </ListItemIcon>
                                    <ListItemText 
                                        primary="At least 1 number" 
                                        sx={{ 
                                            color: passwordChecks.hasNumber ? 'success.main' : 'text.secondary',
                                            '& .MuiListItemText-primary': {
                                                fontSize: '0.75rem'
                                            }
                                        }}
                                    />
                                </ListItem>
                                <ListItem>
                                    <ListItemIcon sx={{ minWidth: 32 }}>
                                        <Fade in={true}>
                                            {passwordChecks.hasUppercase ? (
                                                <CheckCircle sx={{ color: 'success.main', fontSize: 16 }} />
                                            ) : (
                                                <Cancel sx={{ color: 'error.main', fontSize: 16 }} />
                                            )}
                                        </Fade>
                                    </ListItemIcon>
                                    <ListItemText 
                                        primary="At least 1 uppercase letter" 
                                        sx={{ 
                                            color: passwordChecks.hasUppercase ? 'success.main' : 'text.secondary',
                                            '& .MuiListItemText-primary': {
                                                fontSize: '0.75rem'
                                            }
                                        }}
                                    />
                                </ListItem>
                                <ListItem>
                                    <ListItemIcon sx={{ minWidth: 32 }}>
                                        <Fade in={true}>
                                            {passwordChecks.hasLowercase ? (
                                                <CheckCircle sx={{ color: 'success.main', fontSize: 16 }} />
                                            ) : (
                                                <Cancel sx={{ color: 'error.main', fontSize: 16 }} />
                                            )}
                                        </Fade>
                                    </ListItemIcon>
                                    <ListItemText 
                                        primary="At least 1 lowercase letter" 
                                        sx={{ 
                                            color: passwordChecks.hasLowercase ? 'success.main' : 'text.secondary',
                                            '& .MuiListItemText-primary': {
                                                fontSize: '0.75rem'
                                            }
                                        }}
                                    />
                                </ListItem>
                            </List>
                        </Box>
                    </Collapse>

                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                        disabled={loading}
                    >
                        {loading ? <CircularProgress size={24} /> : 'Reset Password'}
                    </Button>
                    <Grid container justifyContent="center">
                        <Grid item>
                            <Link to="/forgot-password" style={{ textDecoration: 'none' }}>
                                {"Didn't receive the code? Try again"}
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
                    Password reset successful! Redirecting to login...
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

export default ResetPassword;
