import React from 'react';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Row, Col } from 'react-bootstrap';


function Contacts(props) {
	const navigate = useNavigate()
    return (
        <>

            <div className='container'>
                <h1 className='text-center mt-4 mb-5'>Contacts</h1>

                <Row>

                    <Col xs={3}>
                        <h3>Alessandro Masala</h3>
                        <ul>
                            <li>Phone: 3982367464</li>
                            <li>Email: alessan.masala@gmail.com</li>
                            <li>Instagram: alessandro_masala_</li>
                        </ul>
                    </Col>

                    <Col xs={3}>
                        <h3>Pegah Yarahmadi</h3>
                        <ul>
                            <li>Phone: 3982367464</li>
                            <li>Email: pegah.yarahmadi@gmail.com</li>
                            <li>Instagram: pegah_yarahmadi_</li>
                        </ul>
                    </Col>

                    <Col xs={3}>
                        <h3>Soona Neisi</h3>
                        <ul>
                            <li>Phone: 3982367464</li>
                            <li>Email: soona.neisi@gmail.com</li>
                            <li>Instagram: soona_neisi_</li>
                        </ul>
                    </Col>

                    <Col xs={3}>
                        <h3>Ibrahim Taib</h3>
                        <ul>
                            <li>Phone: 3982367464</li>
                            <li>Email: ibrahim.taib@gmail.com</li>
                            <li>Instagram: ibrahim_tahib_</li>
                        </ul>
                    </Col>
                </Row>
                <Row className='pb-3 mt-5'>
                    <Col className='text-center'>
	    <Button className='back-btn my-2 mx-2' onClick={() => { props.changeDirty(true); navigate('/') }}>
	    <i className='bi bi-chevron-left'></i>
	    Back
	    </Button>
                    </Col>
                </Row>
            </div>

        </>
    );
}

export default Contacts;
