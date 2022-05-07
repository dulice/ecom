import React from 'react'
import { Row, Col } from 'react-bootstrap'

const CheckoutStep = (props) => {
  return (
    <Row className='checkout-step my-5'>
        <Col className={props.step1? 'active': ''}>Sign in</Col>
        <Col className={props.step2? 'active': ''}>Shipping</Col>
        <Col className={props.step3? 'active': ''}>Payment</Col>
        <Col className={props.step4? 'active': ''}>Place Order</Col>
    </Row>
  )
}

export default CheckoutStep