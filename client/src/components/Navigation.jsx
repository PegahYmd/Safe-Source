import React from 'react';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { Navbar, Nav, Button, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';

function Navigation(props) {

  const navigate = useNavigate();
  const name = props.user && props.user.name;
  const level = props.user && props.user.level;
  const l = level == 'Admin' ? 'Verifier' : 'User';

  return (
    <Navbar bg="success" expand="sm" variant="dark" fixed="top" className="navbar-padding">
      <Link to="/" className='no-line' onClick={() => props.changeDirty(true)}>
        <Navbar.Brand>
          <i className="bi bi-heart-fill red" /> TrustTogether
        </Navbar.Brand>
      </Link>
      <Nav className='mr-auto menu-links'>
        {props.loggedIn ?
          <Link className='white-link' to="propose">
            Propose resources
          </Link>
          :
          <Link className='white-link' onClick={() => {
            alert("You must login to propose new resources.")
            navigate('/')
          }}>
            Propose resources
          </Link>
        }
        <Link className='white-link' to="verifierInfo">
          Verifier Info
        </Link>
        <Link className='white-link' to="faq">
          FAQ
        </Link>
        <Link className='white-link' to="contacts">
          Contacts
        </Link>
      </Nav>
      <Nav className="ms-auto">
        <Nav.Item>
          {name ?
            <>
              <Link className='indianred' to={'/profile'} state={{ nextpage: location.pathname }}>
                {name + " (" + l + " Profile)"}
              </Link>
              <Link className='mx-2 btn login-btn' to={'/'} onClick={props.logout}>
                Logout <i className='bi bi-box-arrow-right' />
              </Link>
            </> :
            <Button className='mx-2 login-btn' onClick={() => navigate('login')}>
              Login <i className='bi bi-person-fill' />
            </Button>
          }
        </Nav.Item>
      </Nav>
    </Navbar>
  );
}

export default Navigation;
