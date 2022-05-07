import React, { useContext, useEffect, useState } from 'react'
import { Button, Container, Form } from 'react-bootstrap';
import { Helmet } from 'react-helmet-async';
import { Link, useLocation, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { Store } from '../context/Store';
import { toast } from 'react-toastify';

const SignIn = () => {
    const navigate = useNavigate();
    const {search} = useLocation();
    const redirectInUrl = new URLSearchParams(search).get('redirect');
    const redirect = redirectInUrl ? redirectInUrl : '/'

    const [password, setPassword] = useState("");
    const [email, setEamil] = useState("");
    
    const {state, dispatch: ctxDispatch} = useContext(Store);
    const { userInfo } = state;

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            const {data} = await axios.post('http://localhost:5000/api/users/signin', {
                email,
                password
            })
            localStorage.setItem("userInfo", JSON.stringify(data))
            ctxDispatch({
                type: "USER_SIGNIN",
                payload: data
            })
        } catch (err) {
            toast.error("Invalid password or email")
        }
    }

    useEffect(() => {
        if(userInfo) {
            navigate(redirect);
        }
    },[redirect, userInfo, navigate])

  return (
    <Container className='d-flex justify-content-center'>
        <div className='w-50'>
            <Helmet>
                <title>Sign In</title>
            </Helmet>
            <h2 className='my-5'>Sign In</h2>
            <Form className='border rounded p-3 shadow' onSubmit={submitHandler}>

                <Form.Group className="mb-3" controlId='email'>
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                        value={email}
                        onChange={(e) => setEamil(e.target.value)}
                        type='email' 
                        placeholder='Your Email'
                    ></Form.Control>
                </Form.Group>

                <Form.Group className="mb-3" controlId='password'>
                    <Form.Label>Password</Form.Label>
                    <Form.Control 
                        value={password}
                        onChange={(e)=> setPassword(e.target.value)}
                        type='password' 
                        placeholder='Your Password'
                    ></Form.Control>
                </Form.Group>

                <Button className='mb-3' variant='primary' type="submit">Sign In</Button>
                <p>
                    New Customer?{' '}
                    <Link to={`/signup?redirect=${redirect}`}>Create Your Account</Link>
                </p>
            </Form>
        </div>
    </Container>
  )
}

export default SignIn