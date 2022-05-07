import React, { useContext, useEffect, useState } from 'react'
import { Container, Form, Button } from 'react-bootstrap'
import { Helmet } from 'react-helmet-async'
import { useLocation, useNavigate, Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import { Store } from '../context/Store'
import axios from 'axios'

const Signup = () => {
    const { state, dispatch } = useContext(Store);
    const { userInfo } = state;
    const navigate = useNavigate();
    const { search } = useLocation();
    console.log(search);
    const redirectUrl = new URLSearchParams(search).get('redirect');
    const redirect = redirectUrl ? redirectUrl : '/';

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const submitHandler = async (e) => {
        e.preventDefault();
        if(password !== confirmPassword) return toast.error("Password do not match");
        try {
            const {data} = await axios.post('http://localhost:5000/api/users/signup', {
                name,
                email,
                password
            })
            dispatch({
                type: "USER_SIGNIN",
                payload: data
            })
            localStorage.setItem('userInfo', JSON.stringify(userInfo))
        } catch (err) {
            toast.error(err.message);
        }
    }

    useEffect(() => {
        if(userInfo) {
            navigate(redirect);
        }
    }, [userInfo, navigate]);

  return (
    <Container className="small-container d-flex justify-content-center">
        <div>
            <Helmet>
                <title>Sign Up</title>
            </Helmet>
            <h1 className="my-3">Sign Up</h1>
            <Form onSubmit={submitHandler}>
                <Form.Group className="mb-3" controlId="name">
                <Form.Label>Name</Form.Label>
                <Form.Control onChange={(e) => setName(e.target.value)} required />
                </Form.Group>

                <Form.Group className="mb-3" controlId="email">
                <Form.Label>Email</Form.Label>
                <Form.Control
                    type="email"
                    required
                    onChange={(e) => setEmail(e.target.value)}
                />
                </Form.Group>
                <Form.Group className="mb-3" controlId="password">
                <Form.Label>Password</Form.Label>
                <Form.Control
                    type="password"
                    required
                    onChange={(e) => setPassword(e.target.value)}
                />
                <Form.Group className="mb-3" controlId="confirmPassword">
                    <Form.Label>Confirm Password</Form.Label>
                    <Form.Control
                    type="password"
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    />
                </Form.Group>
                </Form.Group>
                <div className="mb-3">
                <Button type="submit">Sign Up</Button>
                </div>
                <div className="mb-3">
                Already have an account?{' '}
                <Link to={`/signin?redirect=${redirect}`}>Sign-In</Link>
                </div>
            </Form>
        </div>
    </Container>
  )
}

export default Signup