import React, { useState } from 'react'
import { Form, InputGroup, Button, FormControl } from 'react-bootstrap'
import { BiSearch } from 'react-icons/bi'
import { useNavigate } from 'react-router-dom'

const Searchbox = () => {
    const navigate = useNavigate();
    
    const [query, setQuery] = useState('');
    const searchHandler = (e) => {
        e.preventDefault();
        navigate(query ? `/search/?query=${query}` : '/search');
        setQuery('')
    }
  return (
    <div>
        <Form onSubmit={searchHandler}>
            <InputGroup>
                <FormControl
                    type="text"
                    name="q"
                    id="q"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search Product..."
                    aria-label="Search Product"
                    aria-describedby="button-search"
                />
                <Button type="submit"><BiSearch/></Button>
            </InputGroup>
        </Form>
    </div>
  )
}

export default Searchbox