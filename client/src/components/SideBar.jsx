import React, { useEffect, useState } from 'react'
import { Button, Offcanvas } from 'react-bootstrap'
import { RiBarChartHorizontalLine } from 'react-icons/ri'
import { Link } from 'react-router-dom'
import axios from 'axios'

const SideBar = () => {
      const [show, setShow] = useState(false);
      const [categories, setCategories] = useState([]);
      useEffect(() => {
          const fetchCategory = async () => {
              const {data} = await axios.get('http://localhost:5000/api/products/categories');
              setCategories(data);
          }
          fetchCategory();
      },[])
  return (
    <div>
        <Button variant="primary" onClick={()=>setShow(true)}>
            <RiBarChartHorizontalLine/>
            </Button>

            <Offcanvas show={show} onHide={()=>setShow(false)}>
            <Offcanvas.Header closeButton>
                <Offcanvas.Title>Category</Offcanvas.Title>
            </Offcanvas.Header>
            {categories.map((category) => (
                <p className=' m-3' key={category}>
                    <Link to={`/search/?category=${category}`} className="link">{category}</Link>
                </p>
            ))}
        </Offcanvas>
    </div>
  )
}

export default SideBar