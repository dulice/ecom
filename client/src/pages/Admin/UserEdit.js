import axios from 'axios';
import React, { useContext, useEffect, useReducer, useState } from 'react'
import { Container, Form, Button } from 'react-bootstrap'
import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Store } from '../../context/Store';

const Reducer = (state, action) => {
    switch(action.type) {
        case "FETCH_REQUEST":
            return { ...state, loading: true};

        case "FETCH_SUCCESS":
            return { ...state, loading: false, user: action.payload };

        case "FETCH_FAIL":
            return { ...state, error: action.payload};

        case "UPDATE_REQUEST":
            return { ...state, loadingUpdate: true};

        case "UPDATE_SUCCESS":
            return { ...state, loadingUpdate: false};

        case "UPDATE_FAIL":
            return { ...state, error: action.payload};

        default:
            return state;
    }
}

const UserEdit = () => {

    const {id: userId} = useParams();
    const { state } = useContext(Store);
    const { userInfo } = state;

    const [{loading, error, user}, dispatch] = useReducer(Reducer, {
        loading: true,
        error: ''
    })

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            dispatch({type: "FETCH_REQUEST"});
            try {
                const { data } = await axios.get(`http://localhost:5000/api/users/${userId}`, {
                    headers: {
                        authorization: `Bearer ${userInfo.token}`
                    }
                });
                dispatch({type: "FETCH_SUCCESS", payload: data});
                setName(data.name);
                setEmail(data.email);
                setIsAdmin(data.isAdmin);
                console.log(data);
            } catch (err) {
                dispatch({type: "FETCH_FAIL"});
                toast.error(error);
            }
        }
        fetchData();
    },[userInfo, userId]);

    const submitHandler = async (e) => {
        e.preventDefault();
        dispatch({type: "UPDATE_REQUEST"});
        try {
            const { data } = await axios.put(`http://localhost:5000/api/users/${userId}`, {
                name,
                email,
                isAdmin
            }, {
                headers: {
                    authorization: `Bearer ${userInfo.token}`
                }
            })
            dispatch({type: "FETCH_SUCCESS"});
            toast.success("Update Successfully");
            console.log(data);
        } catch (err) {
            dispatch({type: "FETCH_FAIL"});
            toast.error(error);
        }
    }
  return (
    <Container>
        <div>
            <Helmet>
                <title>User Profile</title>
            </Helmet>
            <h2 className='my-5'>User Profile</h2>
            { loading ? <div>Loading...</div>
            :
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
                    
                    <Form.Check
                        className="my-3"
                        type="checkbox"
                        id="isAdmin"
                        label="is Admin"
                        checked={isAdmin}
                        onChange={(e) => setIsAdmin(e.target.checked)}
                    />
                    <Button variant='primary' type='submit'>Update</Button>
                </Form>
            }
        </div>
    </Container>
  )
}

export default UserEdit