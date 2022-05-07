import React, { useContext, useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { Button, Container, Form } from 'react-bootstrap'
import { Store } from '../context/Store'
import { useNavigate } from 'react-router-dom'
import CheckoutStep from '../components/CheckoutStep'

const PaymentMethod = () => {
  const navigate = useNavigate();
  const { state, dispatch } = useContext(Store);
  const { cart: { paymentMethod, shippingAddress }} = state
  const [paymentMethodName, setPaymentMethodName] = useState(paymentMethod || 'PayPal');

  useEffect(() => {
    if(!shippingAddress.address) {
      navigate('/shipping');
    }
  },[navigate, shippingAddress])

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch({
      type: "PAYMENT_METHOD_SAVE",
      payload: paymentMethodName
    })
    localStorage.setItem('paymentMethod', JSON.stringify(paymentMethodName));
    navigate('/placeorder');
  }
  return (
    <Container className='small-container d-flex justify-content-center'>
      <div >
        <Helmet>
          <title>Payment Method</title>
        </Helmet>
        <CheckoutStep step1 step2 step3 />
        <h2 className='my-5'>Payment Method</h2>
        <Form onSubmit={submitHandler}>
          <Form.Check
            type='radio'
            id='PayPal'
            className='mb-3'
            label='PayPal'
            value='PayPal'
            checked={paymentMethodName === 'PayPal'}
            onChange={(e) => setPaymentMethodName(e.target.value)}
          />
          <Form.Check
            type='radio'
            label='Kpay'
            id='Kpay'
            className='mb-3'
            value='Kpay'
            checked={paymentMethodName === 'Kpay'}
            onChange={(e) => setPaymentMethodName(e.target.value)}
          />
          <Button variant='primary' type="submit">Continue</Button>
        </Form>

      </div>
    </Container>
  )
}

export default PaymentMethod