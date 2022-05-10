import axios from 'axios';
import React, { useContext, useEffect, useReducer } from 'react'
import { Container, Table, Button } from 'react-bootstrap';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import getError from '../../components/getError';
import { Store } from '../../context/Store';

const Reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true};

    case "FETCH_SUCCESS":
      return { ...state, loading: false, users: action.payload};

    case "FETCH_FAIL":
      return { ...state, error: action.payload};

    case "DELETE_REQUEST":
      return { ...state, loadingDelete: true};

    case "DELETE_SUCCESS":
      return { ...state, loadingDelete: false, successDelete: true};

    case "DELETE_FAIL":
      return { ...state, loadingDelete: false, successDelete: false};

    default:
      return state;
  }
}

const UserList = () => {

    const navigate = useNavigate();
  const { state } = useContext(Store);
  const { userInfo } = state;

  const [{loading, error, users, loadingDelete, successDelete}, dispatch ] = useReducer(Reducer, {
    loading: true,
    error: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      dispatch({type: "FETCH_REQUEST"});
      try {
        const { data } = await axios.get('http://localhost:5000/api/users', {
          headers: {
            authorization: `Bearer ${userInfo.token}`
          }
        });
        dispatch({type: "FETCH_SUCCESS", payload: data});
        // console.log(data);
      } catch (err) {
        dispatch({type: "FETCH_FAIL", payload: getError(err)});
        toast.error(error);
      }
    }
    fetchData();
  },[userInfo]);

  const deleteHandler = async (id) => {
    if(window.confirm("Are you sure you want to delete?")) {
      console.log("a");
      dispatch({type: "DELETE_REQUEST"});
      try {
        await axios.delete(`http://localhost:5000/api/users/${id}`, {
          headers: {
            authorization: `Bearer ${userInfo.token}`
          }
        })
        console.log("b");
        dispatch({type: "DELETE_SUCCESS"});
        toast.success("Delete Successfully!");
        setTimeout(() => {         
          window.location.reload();
        }, 1000);
      } catch (err) {
        console.log("c");
        dispatch({type: "DELETE_FAIL", payload: getError(err)});
        toast.error(error)
      }
    }
  }

  return (
    <Container>
      <div>
        <Helmet>
          <title>User</title>
        </Helmet>
        <h2>User</h2>
        {loading ? <div>Loading...</div>
        :
          <Table striped hover responsive>
            <thead>
              <tr>
                <th>ID</th>
                <th>NAME</th>
                <th>EMAIL</th>
                <th>IS ADMIN</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user._id}>
                  <td>{user._id}</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.isAdmin? "Yes" : "No"}</td>
                  <td>
                    <Button variant='primary' className='me-3' onClick={() => navigate(`/admin/user/${user._id}`)}>EDIT</Button>
                    <Button variant='danger' onClick={() => deleteHandler(user._id)}>DELETE</Button>                  
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        }
      </div>
    </Container>
  )
}

export default UserList