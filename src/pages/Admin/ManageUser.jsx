import React, { useContext } from 'react';
import { Button, FormControl, FormHelperText, Input, InputLabel } from '@mui/material';
import { useForm } from 'react-hook-form';
import { AccountContext } from '../../components/Account';

function ManageUser(props) {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const { idToken, accessToken } = useContext(AccountContext);

    const onSubmit = ({email}) => {
        fetch("https://xjoexzabe3.execute-api.ap-south-1.amazonaws.com/stage/v2/admin/reset-user", {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                'Authorization': idToken,
            },
            body: JSON.stringify({
                email,
                accessToken,
            }),
        })
        .then(response => response.json())
        .then(({status, data}) => {
            if(status === 200) {
                console.log(data)
            }
        })
        .catch(err => console.log(err))
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <FormControl error={!!errors.email}>
                <InputLabel htmlFor="my-input">User Email</InputLabel>
                <Input {...register('email', { required: true })} />
                {errors.email && <FormHelperText id="my-helper-text" >Required</FormHelperText>}
            </FormControl>
            <br/>
            <Button variant="outlined" type="submit" sx={{ mt: 2 }}>
                Reset
            </Button>
        </form>
    );
}

export default ManageUser;