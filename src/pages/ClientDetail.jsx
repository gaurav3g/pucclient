import { isEmpty } from 'lodash';
import moment from 'moment';
import React, { useEffect, useState, useContext } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useParams } from 'react-router-dom';
import { AccountContext } from '../components/Account';
import Loader from '../components/Loader';

const VALIDITY_OPTIONS = [
    {
        label: '10 days (trail)',
        value: 10,
    },
    {
        label: '1 month',
        value: 30,
    },
    {
        label: '3 months (quarter)',
        value: 90,
    },
    {
        label: '6 months',
        value: 180,
    },
    {
        label: '1 year',
        value: 365,
    },
]

function ClientDetail(props) {
    const { id } = useParams();

    const [portList, setPortList] = useState([]);
    const [configKey, setConfigKey] = useState('');
    const [loading, setLoading] = useState(false);
    const [expiresAt, setExpiresAt] = useState(null);
    const { user, clientList, idToken, setClientList } = useContext(AccountContext);

    const { register, handleSubmit, setValue, getValues } = useForm();

    const copyHandler = () => navigator.clipboard.writeText(configKey)

    const onSubmit = data => {
        setLoading(true)
        fetch("https://xjoexzabe3.execute-api.ap-south-1.amazonaws.com/stage/v2/client/update", {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                'Authorization': idToken,
            },
            body: JSON.stringify({
                "port1": data?.port1,
                "port2": data?.port2,
                "key": id,
                "admin": user?.email,
                "expires_at": moment().add(data?.validFor, 'days').format('YYYY-MM-DD')
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

    useEffect(() => {
        if(!isEmpty(clientList[id])){
            const client = clientList[id];

            client?.expires_at && setExpiresAt(client?.expires_at)

            const ports = (client?.machine_api || '5555_5555').split('_').map(it => parseInt(it));
            console.log(ports);
            setValue('port1', ports[0]);
            setValue('port2', ports[1]);
        }
    }, [clientList, id, setValue])

    useEffect(() => {
        if(isEmpty(clientList[id])){
            fetch("https://xjoexzabe3.execute-api.ap-south-1.amazonaws.com/stage/v2/client/get",{
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': idToken,
                },
                body: JSON.stringify({
                    "key": id,
                }),
            })
            .then(response => response.json())
            .then(({status, data, message}) => {
                status === 200
                    ? setClientList({
                        [data.key]: data,
                    })
                    : alert(message);
            })
        }
    }, [])

    useEffect(()=>{
        fetch("https://xjoexzabe3.execute-api.ap-south-1.amazonaws.com/stage/get-port",{
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                'Authorization': idToken,
            },
        })
        .then(response => response.json())
        .then(({status, data}) => {
            status && setPortList(data)
        })
    }, [idToken]);

    return (
        <>
            <Link to='/client' style={{fontSize: 12}}>New Client</Link>
            <hr />
            <div>
                Key: {clientList[id]?.key}
            </div>
            <div>
                Name: {clientList[id]?.username}
            </div>
            <hr style={{margin: '12px 0'}} />
            <form onSubmit={handleSubmit(onSubmit)}>
                {loading && <Loader />}
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
                <label>Valid for: </label>
                    <select {...register("validFor", {
                        onChange: (e) => setExpiresAt(moment().add(e.target.value, 'days').format('YYYY-MM-DD'))
                    })}>
                        {VALIDITY_OPTIONS.map(item => (
                            <option
                                key={item.value}
                                label={item.label}
                                value={item.value}
                            />
                        ))}
                    </select>
                </div>
                <div style={{color: "#aaa"}}>
                    <label>Expires At: </label> {moment(expiresAt).format("DD MMM, YYYY")}
                </div>
                <button type='submit'>Update</button>
            </form>
            {!isEmpty(configKey) &&
                (<>
                    <hr />
                    <div style={{ padding: '12px 0', borderWidth: 1, fontSize: 12, color: "#aaa" }}>
                        {!loading && configKey}
                    </div>
                    <button onClick={copyHandler}>Copy to Clipboard</button>
                </>)
            }
        </>
    );
}

export default ClientDetail;