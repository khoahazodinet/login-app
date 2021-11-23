import React, {ChangeEvent, FormEvent, useCallback, useEffect, useState} from 'react';
import {useGoogleReCaptcha} from 'react-google-recaptcha-v3';
import axios from "axios";


function App() {
    const {executeRecaptcha} = useGoogleReCaptcha();
    const [data, setData] = useState<{
        userName: string, password: string, recaptcha: string|null}>(
            {
        userName: '',
        password: '',
        recaptcha: null
    })

    useEffect(()=>{
        if(!data.recaptcha) return;

        console.log(data);
        axios.post('https://loginapizodinet.herokuapp.com/api/recaptcha/login',
            data , {
                headers: {
                    'Content-Type': 'application/json',
                }
            }
        ).then((res) => {
            console.log(res)
        }).catch((req) => {
            console.log(req)
        })
    },[data.recaptcha])

    const fetchData = useCallback(() => {
        if (!executeRecaptcha) {
            console.log('recaptcha can not use');
            return;
        }
        executeRecaptcha('SignIn').then((result)=>{
            console.log(result);
            setData({
                ...data,
                recaptcha: result
            })
        }).catch(req=>{
            console.log('error', req)
        })
    },[])

    const handleSubmit = (e: FormEvent<HTMLFormElement>)=>{
        e.preventDefault();
        fetchData();
    }

    const handleChange = (e: ChangeEvent<HTMLInputElement>)=>{
        setData({
            ...data,
            [e.target.name]: e.target.value
        })
    }

    return (
        <div style={{
            width: '100%',
            height: '100vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
        }}>
            <form
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    height: 200,
                    justifyContent: 'space-between'
                }}
                onSubmit={handleSubmit}>
                <p >
                    User Name: <input type={'text'} name={'userName'} onChange={handleChange} />
                </p>
                <p>
                    Password: &nbsp;&nbsp; <input type={'password'} name={'password'} onChange={handleChange} />
                </p>
                <button type={'submit'} >submit</button>
            </form>
        </div>

    );
}

export default App;
