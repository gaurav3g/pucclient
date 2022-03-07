import React, { useContext } from 'react';
import { useForm } from 'react-hook-form';
import { Link, Navigate, unstable_HistoryRouter, useNavigate } from 'react-router-dom';
import { AccountContext } from '../components/Account';

function Login(props) {
    const navigate = useNavigate();
    const { register, handleSubmit, watch, formState: { errors } } = useForm();

    const { authenticate } = useContext(AccountContext);

    const onSubmit = ({email, password}) => {
        authenticate(email, password)
        .then((data) => {
            console.log("Logged in!", data);
            navigate('/')
        })
        .catch((err) => {
            console.error("Failed to login", err);
            alert(err.message);
        });
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
            </form>
            <hr />
            <div>New member? <Link to={'/signup'}>Sign up now</Link></div>
        </>
    );
}

export default Login;