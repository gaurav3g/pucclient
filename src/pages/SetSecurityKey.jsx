import { Button, FormControl, FormHelperText, Input, InputLabel } from '@mui/material';
import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { cloneAsObject } from '../utils';

function SetSecurityKey(props) {
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors } } = useForm();

    const onSubmit = ({email}) => {
        if('geolocation' in navigator){
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    fetch("https://xjoexzabe3.execute-api.ap-south-1.amazonaws.com/stage/v2/security-key/request", {
                        method: 'POST',
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            email,
                            content: cloneAsObject(position),
                        }),
                    })
                    .then(response => response.json())
                    .then(({status, data}) => {
                        if(status === 200) {
                            localStorage.setItem('securityKey', data);
                            navigate('/login');
                        }
                    })
                    .catch(err => console.log(err))
                }
            )
        }else{
            alert('Allow location access!!')
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <FormControl error={!!errors.email}>
                <InputLabel htmlFor="my-input">Email</InputLabel>
                <Input {...register('email', { required: true })} />
                {errors.email && <FormHelperText id="my-helper-text" >Required</FormHelperText>}
            </FormControl>
            <br/>
            <Button  variant="outlined" type="submit" sx={{ mt: 2 }}>
                Generate security key
            </Button>
        </form>
    );
}

export default SetSecurityKey;