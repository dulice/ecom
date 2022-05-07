import React, { useContext, useReducer, useState } from 'react'
import { Container, Form, Button } from 'react-bootstrap'
import { Helmet } from 'react-helmet-async'
import { toast } from 'react-toastify'
import { Store } from '../context/Store'
import axios from 'axios'

const Reducer = (state, action) => {
    switch(action.type) {
        case "FETCH_REQUEST":
            return {...state, loading: true}

        case "FETCH_SUCCESS":
            return { ...state, loading: false}

        case "FETCH_FAIL":
            return { ...state, loading: false}

        default:
            return state;
    }
}

const Profile = () => {
    const [{loading}, dispatch] = useReducer(Reducer, {
        loading: true
    })

    const { state } = useContext(Store)
    const { userInfo } = state;
    const [name, setName] = useState( userInfo.name || '');
    const [email, setEmail] = useState( userInfo.email || '');
    const [password, setPassword] = useState('');
    const [comfirmPassword, setComfirmPassword] = useState('');

    const submitHandler = async (e) => {
        e.preventDefault();
        dispatch({type: "FETCH_REQUEST"})
        try {
            const { data } = await axios.put('http://localhost:5000/api/users/profile', {
                name,
                email,
                password
            },
            { headers: {
                authorization: `Bearer ${userInfo.token}`
            }}
            )
            dispatch({type: "FETCH_SUCCESS"});
            dispatch({type: "USER_SIGNIN", payload: data})
            localStorage.setItem('userInfo', JSON.stringify(data));
            toast.success("Update Successfully!");
            setTimeout(() => {
                window.location.reload()
            }, 1000);
        } catch (err) {
            dispatch({type: "FETCH_FAIL"});
            toast.error("Can't Update Your Info")
        }
    }
  return (
    <Container>
        <div>
            <Helmet>
                <title>User Profile</title>
            </Helmet>
            <h2 className='my-5'>User Profile</h2>
            <Form onSubmit={submitHandler}>
                <Form.Group controlId='name'>
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </Form.Group>
                <Form.Group controlId='email'>
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </Form.Group>
                <Form.Group controlId='password'>
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        type='password'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </Form.Group>
                <Form.Group controlId='comfirmPassword'>
                    <Form.Label>Comfirm Password</Form.Label>
                    <Form.Control
                        type='password'
                        value={comfirmPassword}
                        onChange={(e) => setComfirmPassword(e.target.value)}
                    />
                </Form.Group>
                <Button variant='primary' type='submit'>Save Changes</Button>
            </Form>
        </div>
    </Container>
  )
}

export default Profile