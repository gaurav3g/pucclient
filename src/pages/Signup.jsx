import React from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import UserPool from '../utils/UserPool';

function Signup(props) {
    const { register, handleSubmit, watch, formState: { errors } } = useForm();

    const onSubmit = ({email, password}) => {
        UserPool.signUp(email, password, [], null, (err, data) => {
            err ? alert(err) : alert("Please click the activation link we sent to your email")
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
                <button type='submit'>submit</button>
            </form>
            <hr />
            <div>Already have account? <Link to={'/login'}>Log in</Link></div>
        </>
    );
}

export default Signup;