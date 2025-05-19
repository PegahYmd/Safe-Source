import { Form, Button, Alert, Container, Row, Col } from 'react-bootstrap';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../API';

function LoginForm(props) {
  const [username, setUsername] = useState();
  const [password, setPassword] = useState();
  const [errorMessage, setErrorMessage] = useState('');

  const navigate = useNavigate();

  const doLogIn = (credentials) => {
    API.logIn(credentials)
      .then(user => {
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
    if (username === '' || password === '')
      valid = false;

    if (valid) {
      doLogIn(credentials);
    } else {
      setErrorMessage('Form error')
    }
  };

  return (
    <Container className='mt-4'>
      <Row className='justify-content-center mb-3'>
        <Col xs={6} className='text-center'>
          <h2>Login</h2>
        </Col>
      </Row>
      <Form onSubmit={handleSubmit}>
        <Row className='justify-content-center mb-2'>
          <Col xs={6} className='text-center'>
            <Form.Group controlId='username'>
              <Form.Label>Email</Form.Label>
              <Form.Control placeholder='Type the email here' className='text-center' type='email' value={username} onChange={ev => setUsername(ev.target.value)} />
            </Form.Group>
          </Col>
        </Row>
        <Row className='justify-content-center mb-2'>
          <Col xs={6} className='text-center'>
            <Form.Group controlId='password'>
              <Form.Label>Password</Form.Label>
              <Form.Control placeholder='Type the password here' className='text-center' type='password' value={password} onChange={ev => setPassword(ev.target.value)} />
            </Form.Group>
          </Col>
        </Row>
        <Row className='justify-content-center mb-2 mt-2'>
          <Col xs={6} className='text-center'>
            {errorMessage ? <Alert variant='danger' dismissible onClick={() => setErrorMessage('')}>{errorMessage}</Alert> : ''}
          </Col>
        </Row>
        <Row className='justify-content-center mb-3'>
          <Col xs={6} className='text-center'>
            <Button className='back-btn my-2 mx-2' onClick={() => { props.changeDirty(true); navigate(-1) }}>
              <i className='bi bi-chevron-left'></i>
              Back
            </Button>
            <Button className='my-2 btn-apply' type='submit'>Login</Button>
          </Col>
        </Row>
        <Row className='justify-content-center'>
          <Col xs={6} className='text-center'>
            <p className='mb-1'>Don't have an account?</p>
            <Link className='no-line' to='/register'>Register here</Link>
          </Col>
        </Row>
      </Form>

    </Container>
  )
}

function RegisterForm(props) {
  const [username, setUsername] = useState();
  const [name, setName] = useState();
  const [surname, setSurname] = useState();
  const [password, setPassword] = useState();
  const [errorMessage, setErrorMessage] = useState('');

  const navigate = useNavigate();

  const doLogIn = (credentials) => {
    API.logIn(credentials)
      .then(user => {
        setErrorMessage('');
        props.loginSuccessful(user);
      })
      .catch(err => {
	console.error(err)
        setErrorMessage('Wrong username or password');
      })
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    setErrorMessage('');
    const credentials = { username, password };

    let valid = true;
    if (username === '' || password === '')
      valid = false;

    if (valid) {
      doLogIn(credentials);
    } else {
      setErrorMessage('Form error')
    }
  };

  return (
    <Container className='mt-4'>
      <Row className='justify-content-center mb-3'>
        <Col xs={6} className='text-center'>
          <h2>Register</h2>
        </Col>
      </Row>
      <Form onSubmit={handleSubmit}>
        <Row className='justify-content-center mb-2'>
          <Col xs={6} className='text-center'>
            <Form.Group controlId='username'>
              <Form.Label>Name</Form.Label>
              <Form.Control placeholder='' className='text-center' type='text' value={name} onChange={ev => setName(ev.target.value)} />
            </Form.Group>
          </Col>
        </Row>
        <Row className='justify-content-center mb-2'>
          <Col xs={6} className='text-center'>
            <Form.Group controlId='username'>
              <Form.Label>Surname</Form.Label>
              <Form.Control placeholder='' className='text-center' type='text' value={surname} onChange={ev => setSurname(ev.target.value)} />
            </Form.Group>
          </Col>
        </Row>
        <Row className='justify-content-center mb-2'>
          <Col xs={6} className='text-center'>
            <Form.Group controlId='username'>
              <Form.Label>Email</Form.Label>
              <Form.Control placeholder='' className='text-center' type='email' value={username} onChange={ev => setUsername(ev.target.value)} />
            </Form.Group>
          </Col>
        </Row>
        <Row className='justify-content-center mb-2'>
          <Col xs={6} className='text-center'>
            <Form.Group controlId='password'>
              <Form.Label>Password</Form.Label>
              <Form.Control placeholder='Type the password here' className='text-center' type='password' value={password} onChange={ev => setPassword(ev.target.value)} />
            </Form.Group>
          </Col>
        </Row>
        <Row className='justify-content-center mb-2 mt-2'>
          <Col xs={6} className='text-center'>
            {errorMessage ? <Alert variant='danger' dismissible onClick={() => setErrorMessage('')}>{errorMessage}</Alert> : ''}
          </Col>
        </Row>
        <Row className='justify-content-center mb-3'>
          <Col xs={6} className='text-center'>
            <Button className='back-btn my-2 mx-2' onClick={() => { props.changeDirty(true); navigate(-1) }}>
              <i className='bi bi-chevron-left'></i>
              Back
            </Button>
            <Button className='my-2 btn-apply' type='submit'>Register</Button>
          </Col>
        </Row>
        <Row className='justify-content-center'>
          <Col xs={6} className='text-center'>
            <p className='mb-1'>Already have an account?</p>
            <Link className='no-line' to='/login'>Sign In here</Link>
          </Col>
        </Row>
      </Form>

    </Container>
  )
}

export { LoginForm, RegisterForm };
