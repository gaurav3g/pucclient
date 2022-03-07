import React, { useEffect, useState, useContext } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { AccountContext } from '../components/Account';

function GetConfig(props) {
    const [portList, setPortList] = useState([]);
    const [configKey, setConfigKey] = useState('');
    const [loading, setLoading] = useState(false);
    const { user } = useContext(AccountContext);
    console.log(user);
    const { register, handleSubmit, watch, formState: { errors } } = useForm();
    const onSubmit = data => {
        setLoading(true)
        fetch("https://xjoexzabe3.execute-api.ap-south-1.amazonaws.com/stage/user/register", {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                'authtoken': 'helloworld',
            },
            body: JSON.stringify({
                "port1": data?.port1,
                "port2": data?.port2,
                "key": data?.machineKey,
                "username": data?.username,
                "admin": user?.email,
            }),
        })
        .then(response => response.json())
        .then(({status, data}) => {
            status && setConfigKey(data);
        })
        .finally(() => {
            setLoading(false)
        })
    };

    const copyHandler = () => navigator.clipboard.writeText(configKey)

    useEffect(()=>{
        fetch("https://xjoexzabe3.execute-api.ap-south-1.amazonaws.com/stage/get-port",{
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                'authtoken': 'helloworld',
            },
        })
        .then(response => response.json())
        .then(({status, data}) => {
            status && setPortList(data)
        })
    },[]);

    return (
        /* "handleSubmit" will validate your inputs before invoking "onSubmit" */
        <>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div>
                    <label>Port 1: </label>
                    <select {...register("port1")}>
                        <option
                            label={'Select a port'}
                            value={''}
                        />
                        {portList.map(item => (
                            <option
                                key={item.id}
                                label={`${item.id} (${item.port})`}
                                value={item.port}
                            />
                        ))}
                    </select>
                </div>
                <div>
                    <label>Port 2: </label>
                    <select {...register("port2")}>
                        <option
                            label={'Select a port'}
                            value={''}
                        />
                        {portList.map(item => (
                            <option
                                key={item.id}
                                label={`${item.id} (${item.port})`}
                                value={item.port}
                            />
                        ))}
                    </select>
                </div>
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
                <input type="submit" />
            </form>
            <hr />
            <div style={{ padding: 12, borderWidth: 1 }}>
                {loading ? 'loading...' : configKey}
            </div>
            <button onClick={copyHandler}>Copy to Clipboard</button>
            {/* <Link to={"/"}>Home</Link> */}
        </>
    );
}

export default GetConfig;