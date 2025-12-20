import { isEmpty } from 'lodash';
import moment from 'moment';
import React, { useEffect, useState, useContext } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useParams } from 'react-router-dom';
import { AccountContext } from '../components/Account';
import Loader from '../components/Loader';
import { TextField } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';


function ClientDetail(props) {
    const { id } = useParams();

    const [portList, setPortList] = useState([]);
    const [configKey, setConfigKey] = useState('');
    const [loading, setLoading] = useState(false);
    const [expiresAt, setExpiresAt] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);
    const { user, clientList, idToken, setClientList } = useContext(AccountContext);

    const { register, handleSubmit, setValue, getValues } = useForm();

    const copyHandler = () => navigator.clipboard.writeText(configKey)

    const onSubmit = data => {
        setLoading(true)
        fetch("/stage/v2/client/update", {
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
                "expires_at": selectedDate ? selectedDate.format('YYYY-MM-DD') : moment().add(30, 'days').format('YYYY-MM-DD')
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

            if (client?.expires_at) {
                setExpiresAt(client?.expires_at);
                setSelectedDate(moment(client?.expires_at));
            }

            const ports = (client?.machine_api || '5555_5555').split('_').map(it => parseInt(it));
            console.log(ports);
            setValue('port1', ports[0]);
            setValue('port2', ports[1]);
        }
    }, [clientList, id, setValue])

    useEffect(() => {
        if(isEmpty(clientList[id])){
            fetch("/stage/v2/client/get",{
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
        fetch("/stage/get-port",{
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
        <LocalizationProvider dateAdapter={AdapterMoment}>
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
                        <label>Expiration Date: </label>
                        <DatePicker
                            value={selectedDate}
                            onChange={(newValue) => {
                                setSelectedDate(newValue);
                                setExpiresAt(newValue?.format('YYYY-MM-DD'));
                            }}
                            renderInput={(params) => <TextField {...params} size="small" />}
                            minDate={moment()}
                        />
                    </div>
                    <div style={{color: "#aaa", marginTop: '8px'}}>
                        <label>Expires At: </label> {selectedDate ? selectedDate.format("DD MMM, YYYY") : 'Not selected'}
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
        </LocalizationProvider>
    );
}

export default ClientDetail;