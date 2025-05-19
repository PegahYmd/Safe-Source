import { Form, Button, Alert, Container, Row, Col } from 'react-bootstrap';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../API';

function VerifierForm(props) {
  const [username, setUsername] = useState('alessan.masala@gmail.com');
  const [password, setPassword] = useState('Alessandro');
  const [errorMessage, setErrorMessage] = useState('') ;

  const navigate = useNavigate();

  const doLogIn = (credentials) => {
    API.logIn(credentials)
      .then( user => {
        setErrorMessage('');
        props.loginSuccessful(user);
      })
      .catch(err => {
        setErrorMessage('Wrong username or password');
      })
  }
  
  const handleSubmit = (event) => {
      event.preventDefault();
      setErrorMessage('');
      const credentials = { username, password };

      let valid = true;
      if(username === '' || password === '')
          valid = false;
      
      if(valid)
      {
        doLogIn(credentials);
      } else {
        setErrorMessage('Form error')
      }
  };

  return (
      <Container className='mt-4'>
          <Row className='justify-content-center mb-3'>
            <Col xs={6} className='text-center'>
              <h2>Verifier Application</h2>
            </Col>
          </Row>
            <Form onSubmit={handleSubmit}>
              <Row className='justify-content-center mb-2'>
                <Col xs={4} className='text-center'>
                  <Form.Group controlId=''>
                      <Form.Label>Name</Form.Label>
                      <Form.Control placeholder='e.g. Alessandro' className='text-center' type='text' />
                  </Form.Group>
                </Col>
                <Col xs={4} className='text-center'>
                  <Form.Group controlId=''>
                      <Form.Label>Surname</Form.Label>
                      <Form.Control placeholder='e.g. Masala' className='text-center' type='text' />
                  </Form.Group>
                </Col>
                <Col xs={4} className='text-center'>
                  <Form.Group controlId=''>
                      <Form.Label>Email</Form.Label>
                      <Form.Control placeholder='e.g. alessan.masala@gmail.com' className='text-center' type='email' onChange={ev => setUsername(ev.target.value)} />
                  </Form.Group>
                </Col>
              </Row>
              <Row className='justify-content-center mb-2'>
                <Col xs={4} className='text-center'>
                  <Form.Group controlId=''>
                      <Form.Label>Certifications</Form.Label>
                      <Form.Control placeholder='' className='text-center' type='file' />
                  </Form.Group>
                </Col>
                <Col xs={8} className='text-center'>
                  <Form.Group controlId=''>
                      <Form.Label>Previous experiences</Form.Label>
                      <Form.Control placeholder='Describe your previous experiences here' className='text-center' type='text' />
                  </Form.Group>
                </Col>
              </Row>
              <Row className='justify-content-center mb-2'>
                <Col xs={8} className='text-center'>
                  <Form.Group controlId=''>
                      <Form.Label>Why do you want to become a verifier?</Form.Label>
                      <Form.Control placeholder='Motivate your application' className='text-center' type='text' as="textarea" />
                  </Form.Group>
                </Col>
              </Row>
              <Row className='justify-content-center mb-2 mt-2'>
                <Col xs={6} className='text-center'>
                  {errorMessage ? <Alert variant='danger' dismissible onClick={()=>setErrorMessage('')}>{errorMessage}</Alert> : ''}
                </Col>  
              </Row>
              <Row className='justify-content-center mb-3'>
                <Col xs={6} className='text-center'>
                  <Button className='my-2 mx-2 back-btn' onClick={()=>{props.changeDirty(true); navigate('/verifierInfo')}}>
                    <i className='bi bi-chevron-left'></i>
                    Back
                  </Button>
                  <Button className='my-2 btn-apply' type='submit' onClick={()=>{props.changeDirty(true); navigate('/verifierOk')}}>
                    Send your application
                  </Button>
                </Col>  
              </Row>
            </Form>
          
      </Container>
    )
}

export { VerifierForm };