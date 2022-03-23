import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Box, Modal, Typography } from '@mui/material';
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
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [openModal,  toggleModal] = useState(false);
    const { authenticate } = useContext(AccountContext);

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
        <>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="form-control">
                    <label>Email</label>
                    <input {...register("email")} />
                </div>
                <div className="form-control">
                            <label>Password</label>
                            <input type='password' {...register("password")} />
                        </div>
                        <button type='submit'>LOGIN</button>
                {/* {jwtDecode3g(localStorage.getItem('securityKey'))?.['key'] || false ? (
                    <>
                        <div className="form-control">
                            <label>Password</label>
                            <input type='password' {...register("password")} />
                        </div>
                        <button type='submit'>LOGIN</button>
                    </>
                ) : (
                    <div>this machine is not registered. <Link to={'/security-key/register'}>Click here</Link> to generate security key.</div>
                )
                } */}
            </form>
            <hr />
            <div>New member? <Link to={'/signup'}>Sign up now</Link></div>
            {/* <Modal
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
            </Modal> */}
        </>
    );
}

export default Login;