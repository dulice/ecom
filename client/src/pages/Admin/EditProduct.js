import axios from 'axios';
import React, { useContext, useEffect, useReducer, useState } from 'react'
import { Container, Form, Button } from 'react-bootstrap';
import { Helmet } from 'react-helmet-async';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import getError from '../../components/getError';
import { Store } from '../../context/Store';

const Reducer = (state, action) => {
    switch(action.type) {
        case "FETCH_REQUEST":
            return { ...state, loading: true};

        case "FETCH_SUCCESS":
            return { ...state, loading: false};

        case "FETCH_FAIL":
            return { ...state, error: action.payload}

        case "UPDATE_REQUEST":
            return { ...state, loadingUpdate: true};

        case "UPDATE_SUCCESS":
            return { ...state, loadingUpdate: false};

        case "UPDATE_FAIL":
            return { ...state, errorUpdate: action.payload}

        case "UPLOAD_REQUEST":
            return { ...state, loadingUpload: true};

        case "UPLOAD_SUCCESS":
            return { ...state, loadingUpload: false};

        case "UPLOAD_FAIL":
            return { ...state, errorUpload: action.payload}

        default:
            return state;
    }
}

const EditProduct = () => {

    const params = useParams();
    const navigate = useNavigate();
    const { id: productId } = params;
    const { state } = useContext(Store);
    const { userInfo } = state;

    const [{loading, error, loadingUpload, loadingUpdate}, dispatch] = useReducer(Reducer, {
        loading: true,
        error: ''
    })

    const [name, setName] = useState('');
    const [slug, setslug] = useState('');
    const [price, setprice] = useState('');
    const [category, setcategory] = useState('');
    const [brand, setbrand] = useState('');
    const [countInStock, setcountInStock] = useState('');
    const [image, setimage] = useState('');
    const [description, setDescription] = useState('');

    useEffect(() => {
        dispatch({type: "FETCH_REQUEST"});
        const fetchData = async () => {
            try {
                const { data } = await axios.get(`http://localhost:5000/api/products/${productId}`);
                setName(data.name);
                setslug(data.slug);
                setprice(data.price);
                setcategory(data.category);
                setbrand(data.brand);
                setcountInStock(data.countInStock);
                setimage(data.image);
                setDescription(data.description);
                dispatch({type: "FETCH_SUCCESS"});
            } catch (err) {
                dispatch({type: "FETCH_FAIL", payload: getError(err)});
                toast.error(error);
            }
        }
        fetchData();
    },[setName, setslug, setprice, setcategory, setbrand, setcountInStock, setimage, setDescription, dispatch]);

    const updateHandler = async (e) => {
        e.preventDefault();
        dispatch({type: "UPDATE_REQUEST"});
        try {
            await axios.put(`http://localhost:5000/api/products/${productId}`, {
                _id: productId,
                name,
                slug,
                category,
                price,
                countInStock,
                description,
                brand,
                image
            }, {
                headers: {
                    authorization: `Bearer ${userInfo.token}`
                }
            })
            dispatch({type: "UPDATE_SUCCESS"});
            toast.success("Update Successfully");
            navigate('/admin/productsList');
        } catch (err) {
            dispatch({type: "UPDATE_FAIL", payload: getError(err)});
            toast.error(error);
        }
    }

    const uploadFileHandler = async (e) => {
        const file = e.target.files[0];
        const formData = new FormData();
        formData.append('file', file);
        dispatch({type: "UPLOAD_REQUEST"});
        try{
            const { data } = await axios.post('http://localhost:5000/api/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    authorization: `Bearer ${userInfo.token}`
                }
            })
            console.log(data);
            dispatch({type: "UPLOAD_SUCCESS"});
            toast.success("Image uploaded succesfully");
            setimage(data.secure_url);
        } catch (err) {
            dispatch({type: "UPLOAD_FAIL", payload: getError(err)});
            toast.error(error);
        }
    }

  return (
    <Container>
        <div>
            <Helmet>
                <title>Edit Product</title>
            </Helmet>
            <h2 className="my-3">Edit Product</h2>
            {loading ? <div>Loading...</div>
            :
                <Form onSubmit={updateHandler}>
                    <Form.Group className="mb-3" controlId="name">
                        <Form.Label>Name</Form.Label>
                        <Form.Control
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="slug">
                        <Form.Label>Slug</Form.Label>
                        <Form.Control
                        value={slug}
                        onChange={(e) => setslug(e.target.value)}
                        required
                        />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="price">
                        <Form.Label>price</Form.Label>
                        <Form.Control
                        value={price}
                        onChange={(e) => setprice(e.target.value)}
                        required
                        />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="category">
                        <Form.Label>Category</Form.Label>
                        <Form.Control
                        value={category}
                        onChange={(e) => setcategory(e.target.value)}
                        required
                        />
                    </Form.Group>

                        <Form.Group className="mb-3" controlId="image">
                            <Form.Label>Upload File</Form.Label>
                            <Form.Control
                            type='file'
                            onChange={uploadFileHandler} />
                            {loadingUpload && <div>Loading...</div>}
                        </Form.Group>

                    <Form.Group className="mb-3" controlId="brand">
                        <Form.Label>brand</Form.Label>
                        <Form.Control
                        value={brand}
                        onChange={(e) => setbrand(e.target.value)}
                        required
                        />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="countInStock">
                        <Form.Label>Count In Stock</Form.Label>
                        <Form.Control
                        value={countInStock}
                        onChange={(e) => setcountInStock(e.target.value)}
                        required
                        />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="description">
                        <Form.Label>description</Form.Label>
                        <Form.Control
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                        />
                    </Form.Group>
                    <div className="mb-3">
                        <Button variant="primary" type="submit">
                            Update
                        </Button>
                    </div>
                </Form>
            }
        </div>
    </Container>
  )
}

export default EditProduct