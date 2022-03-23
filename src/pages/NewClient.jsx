import React, { useState, useContext } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { AccountContext } from '../components/Account';
import Loader from '../components/Loader';

function NewClient() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const { user, idToken, setClientList } = useContext(AccountContext);

    const { register, handleSubmit, formState: { errors } } = useForm();

    const onSubmit = data => {
        setLoading(true)
        fetch("https://xjoexzabe3.execute-api.ap-south-1.amazonaws.com/stage/v2/client/register", {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "Authorization": idToken,
            },
            body: JSON.stringify({
                "key": data?.machineKey,
                "username": data?.username,
                "admin": user?.email,
            }),
        })
        .then(response => response.json())
        .then(({status, data: dt}) => {
            if(status) {
                setClientList({
                    [data?.machineKey]: dt,
                });
                navigate(`/client/${data?.machineKey}`);
            }
        })
        .finally(() => {
            setLoading(false)
        })
    };

    return (
        /* "handleSubmit" will validate your inputs before invoking "onSubmit" */
        <>
            <Link to='/' style={{fontSize: 12}}>go to older version</Link>
            <hr />
            <form onSubmit={handleSubmit(onSubmit)}>
                {loading && <Loader />}
                <div>
                    <label>Key</label>
                    <input {...register("machineKey", { required: true })} />
                    {errors.machineKey && <span style={{color: 'red'}}>This field is required</span>}
                </div>
                <div>
                    <label>Username</label>
                    <input {...register("username", { required: true })} />
                    {errors.username && <span style={{color: 'red'}}>This field is required</span>}
                </div>
                <button type="submit">Add user</button>
            </form>
        </>
    );
}

export default NewClient;