import React, { useContext } from 'react'
import { Container, Navbar, Nav, Button, NavDropdown } from 'react-bootstrap'
import { BsCart3 } from 'react-icons/bs'
import { Link } from 'react-router-dom'
import { Store } from '../context/Store'

const Header = () => {
  const { state, dispatch } = useContext(Store);
  const { cart, userInfo } = state;

  const signoutHandler = () => {
    dispatch({type: "USER_SIGNOUT"});
    localStorage.removeItem('userInfo');
    localStorage.removeItem('shippingAddress');
    localStorage.removeItem('paymentMethod');
    window.location.replace('/signin');
  }
  return (
    <div>
        <Navbar bg="dark" variant="dark" expand="lg">
            <Container>
                <Navbar.Brand href="#home">
                  Amazon
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                  <div className="d-flex w-100 justify-content-end">
                    <Nav className="align-items-center">
                      <Link className="m-3 text-decoration-none text-white" to="/">Home</Link>
                      {userInfo ? 
                      <NavDropdown title={userInfo.name} id="basic-nav-dropdown">
                        <Link className='link d-block ps-3 pb-3' to="/profile">User Profile</Link>
                        <Link className='link d-block ps-3 pb-3' to="/orderhistory">Order History</Link>
                        <NavDropdown.Divider />
                        <Link className='link ps-3' to="/signin" onClick={signoutHandler}>Sign Out</Link>
                      </NavDropdown>
                      :
                        <Link to='/signin' className='link text-white mx-5'>Sign In</Link>
                      }
                      <Link className="m-3" to="/cart">
                        <Button variant='primary' className="position-relative">
                          <BsCart3 /> 
                          <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                            {cart?.cartItems.length > 0 ?
                              cart?.cartItems.reduce((total, num) => total+num.quantity, 0) :
                              0
                            }
                            <span className="visually-hidden">unread messages</span>
                          </span>
                        </Button>
                      </Link>
                    </Nav>
                  </div>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    </div>
  )
}

export default Header