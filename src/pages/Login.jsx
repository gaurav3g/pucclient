import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Box, Modal, Typography, TextField, Button, Container, Paper, Avatar, CssBaseline, Grid, Snackbar, Alert, InputAdornment, IconButton } from '@mui/material';
import { LockOutlined, Visibility, VisibilityOff } from '@mui/icons-material';
import { AccountContext } from '../components/Account';
import { jwtDecode3g } from '../utils';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
};

function Login(props) {
    const navigate = useNavigate();
    const location = useLocation();
    const { register, handleSubmit, setValue, formState: { errors } } = useForm();
    const [openModal, toggleModal] = useState(false);
    const [showMessage, setShowMessage] = useState(false);
    const [message, setMessage] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const { authenticate } = useContext(AccountContext);

    useEffect(() => {
        // Auto-fill email and password if coming from signup
        if (location.state?.email) {
            setValue('email', location.state.email);
            setValue('password', location.state.password);
            if (location.state.message) {
                setMessage(location.state.message);
                setShowMessage(true);
            }
        }
    }, [location.state, setValue]);
    
    const handleClickShowPassword = () => setShowPassword(!showPassword);
    const handleMouseDownPassword = (event) => event.preventDefault();

    const onSubmit = ({email, password}) => {
        // if(jwtDecode3g(localStorage.getItem('securityKey'))['key'] === email){
            authenticate(email, password)
            .then((data) => {
                // console.log("Logged in!", data);
                if((data?.accessToken?.payload?.['cognito:groups'] || []).includes('Admin'))
                    navigate('/admin/manage-user');
                else
                    navigate('/');
            })
            .catch((err) => {
                // console.error("Failed to login", err.message);
                if(err.message === 'Unrecognizable lambda output'){
                    alert('Contact to your Admin to reset your key.');
                }else{
                    alert(err.message);
                }
            });
        // }else{
        //     toggleModal(true);
        // }
    }

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
                <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
                    <LockOutlined />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Login
                </Typography>
                <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 1 }}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Email Address"
                        name="email"
                        autoComplete="email"
                        autoFocus
                        {...register("email", { required: "Email is required" })}
                        error={!!errors.email}
                        helperText={errors.email?.message}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type={showPassword ? 'text' : 'password'}
                        id="password"
                        autoComplete="current-password"
                        {...register("password", { required: "Password is required" })}
                        error={!!errors.password}
                        helperText={errors.password?.message}
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
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                    >
                        Login
                    </Button>
                    <Grid container>
                        <Grid item xs>
                            <Link to="/forgot-password" style={{ textDecoration: 'none' }}>
                                {"Forgot password?"}
                            </Link>
                        </Grid>
                        <Grid item>
                            <Link to="/signup" style={{ textDecoration: 'none' }}>
                                {"Don't have an account? Register"}
                            </Link>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
            
            <Snackbar 
                open={showMessage} 
                autoHideDuration={6000}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                onClose={() => setShowMessage(false)}
            >
                <Alert severity="info" sx={{ width: '100%' }}>
                    {message}
                </Alert>
            </Snackbar>
            <Modal
                open={openModal}
                onClose={() => toggleModal(false)}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        Invalid Security Key
                    </Typography>
                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                        This machine is not registered. <Link to={'/security-key/register'}>Click here</Link> to generate security key.
                    </Typography>
                </Box>
            </Modal>
        </Container>
    );
}

export default Login;