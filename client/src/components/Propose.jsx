import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom'; // Assuming you are using React Router
import API from '../API';
function ProposeForm(props) {
  const [formState, setFormState] = useState({
    title: '',
    author: '',
    category: '',
    link: '',
    comment: '',
    publicationDate: '',
  });

  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const doLogIn = (credentials) => {
    // Assuming you have an API object that handles login
    API.logIn(credentials)
      .then((user) => {
        setErrorMessage('');
        props.loginSuccessful(user);
      })
      .catch((err) => {
        setErrorMessage('Wrong username or password');
      });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setErrorMessage('');
    const { title, author, category, link, comment, publicationDate } = formState;

    let valid = true;
    if (title === '' || author === '' || category === '' || link === '' || comment === '' || publicationDate === '') {
      valid = false;
    }

    if (valid) {
      // Perform form submission logic here
      console.log('Form submitted:', formState);
      API.addToVerify({
        title: title,
        author: author,
        link: link,
        feedback: comment
      }).catch((err) => {
        setErrorMessage('There was an error');
        console.error(err)
      }).then(
        navigate('/proposeOk')
      )
      // Example: doLogIn(credentials);
    } else {
      setErrorMessage('Please fill every field');
    }
  };

  return (
    <Container className='mt-4 propose-form'>
      <Row className='justify-content-center mb-5'>
        <Col xs={6} className='text-center'>
          <h2>Propose a new resource</h2>
        </Col>
      </Row>
      <Form onSubmit={handleSubmit}>
        <Row className='justify-content-center mb-2'>
          <Col xs={4}>
            <Form.Group controlId='Title'>
              <Form.Label>Resource Title</Form.Label>
              <Form.Control
                placeholder='e.g. Anxiety symptoms'
                type='text'
                name='title'
                value={formState.title}
                onChange={handleInputChange}
              />
            </Form.Group>
          </Col>

          <Col xs={4}>
            <Form.Group controlId='Author'>
              <Form.Label>Author</Form.Label>
              <Form.Control
                placeholder='e.g. Alessandro Masala'
                type='text'
                name='author'
                value={formState.author}
                onChange={handleInputChange}
              />
            </Form.Group>
          </Col>

          <Col xs={4}>
            <Form.Group controlId='Category'>
              <Form.Label>Category</Form.Label>
              <Form.Select
                aria-label='Default select example'
                name='category'
                value={formState.category}
                onChange={handleInputChange}
              >
                <option disabled>Select Category</option>
                <option value='1'>Calm</option>
                <option value='2'>Disorder</option>
                <option value='3'>Depression</option>
              </Form.Select>
            </Form.Group>
          </Col>

          <Col xs={12} className='mt-4'>
            <Form.Group controlId='Link'>
              <Form.Label>Insert the link to the resource or you can paste the content here</Form.Label>
              <Form.Control
                placeholder='e.g. www.google.com'
                type='text'
                as='textarea'
                name='link'
                value={formState.link}
                onChange={handleInputChange}
              />
            </Form.Group>
          </Col>
        </Row>

        <Row className='justify-content-center mb-2 mt-4'>
          <Col xs={8}>
            <Form.Group controlId='Comment'>
              <Form.Label>Why do you think it is useful?</Form.Label>
              <Form.Control
                placeholder='Write your personal opinion here'
                type='text'
                as='textarea'
                name='comment'
                value={formState.comment}
                onChange={handleInputChange}
              />
            </Form.Group>
          </Col>
          <Col xs={4}>
            <Form.Group controlId='PublicationDate'>
              <Form.Label>Publication Date</Form.Label>
              <Form.Control
                placeholder='Enter the Publication Date'
                type='date'
                name='publicationDate'
                value={formState.publicationDate}
                onChange={handleInputChange}
              />
            </Form.Group>
          </Col>
        </Row>
        <Row className='justify-content-center mb-2 mt-2'>
          <Col xs={6}>
            {errorMessage ? (
              <Alert variant='danger' dismissible onClick={() => setErrorMessage('')}>
                {errorMessage}
              </Alert>
            ) : (
              ''
            )}
          </Col>
        </Row>
        <Row className='justify-content-center mb-3'>
          <Col xs={6} className='text-center mt-4'>
            <Button className='back-btn my-2 mx-2' onClick={() => { props.changeDirty(true); navigate('/') }}>
              <i className='bi bi-chevron-left'></i>
              Back
            </Button>
            <Button className='btn-apply' type='submit'>
              Propose the resource
            </Button>
          </Col>
        </Row>
      </Form>
    </Container>
  );
}

export {ProposeForm};
