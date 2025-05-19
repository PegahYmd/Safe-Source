import React, { useState } from 'react';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Row, Col, Toast } from 'react-bootstrap';



function Faq(props) {
    const [showA, setShowA] = useState(false);
    const [showB, setShowB] = useState(false);
    const [showC, setShowC] = useState(false);
    const [showD, setShowD] = useState(false);

    const toggleShowA = () => setShowA(!showA);
    const toggleShowB = () => setShowB(!showB);
    const toggleShowC = () => setShowC(!showC);
    const toggleShowD = () => setShowD(!showD);

    const navigate = useNavigate();
    return (
        <>
            <div className='container'>
                <h1 className='text-center mt-5 mb-5'>FAQ</h1>
                <Row>
                    <div className='all-faqs'>
                        <Col xs={12} className="mb-2">
                            <Button onClick={toggleShowA} className="mb-2 q-box">
                                What certifications do I need to become a verifier?
                                <i className='bi bi-caret-down-fill'></i>
                            </Button>
                            <Toast show={showA} onClose={toggleShowA} className='mx-auto abox'>
                                <Toast.Header className='text-center'>
                                    <img
                                        src="holder.js/20x20?text=%20"
                                        className="rounded me-2"
                                        alt=""
                                    />
                                    <strong className="me-auto">Answer</strong>
                                </Toast.Header>
                                <Toast.Body>
                                    You need to have some certifications related to the Anxiety topic
                                    such as a degree in psychology or a certified course.
                                </Toast.Body>
                            </Toast>
                        </Col>
                        <Col xs={12} className="mb-2">
                            <Button onClick={toggleShowB} className="mb-2 q-box">
                                To propose a new resource do I need to login or register?
                                <i className='bi bi-caret-down-fill'></i>
                            </Button>
                            <Toast show={showB} onClose={toggleShowB} className='mx-auto abox'>
                                <Toast.Header className='text-center'>
                                    <img
                                        src="holder.js/20x20?text=%20"
                                        className="rounded me-2"
                                        alt=""
                                    />
                                    <strong className="me-auto">Answer</strong>
                                </Toast.Header>
                                <Toast.Body>
                                    Yes, it is mandatory to register or login to propose a new resource.
                                </Toast.Body>
                            </Toast>
                        </Col>
                        <Col xs={12} className="mb-2">
                            <Button onClick={toggleShowC} className="mb-2 q-box">
                                What do I have to write in the motivations for a new resource?
                                <i className='bi bi-caret-down-fill'></i>
                            </Button>
                            <Toast show={showC} onClose={toggleShowC} className='mx-auto abox'>
                                <Toast.Header className='text-center'>
                                    <img
                                        src="holder.js/20x20?text=%20"
                                        className="rounded me-2"
                                        alt=""
                                    />
                                    <strong className="me-auto">Answer</strong>
                                </Toast.Header>
                                <Toast.Body>
                                    Tell us why you think the resource can be useful for the community.
                                    One of out verifier will then check if the resource is useful or not.
                                </Toast.Body>
                            </Toast>
                        </Col>
                        <Col xs={12} className="mb-5">
                            <Button onClick={toggleShowD} className="mb-2 q-box">
                                How many resources can I propose?
                                <i className='bi bi-caret-down-fill'></i>
                            </Button>
                            <Toast show={showD} onClose={toggleShowD} className='mx-auto abox'>
                                <Toast.Header className='text-center'>
                                    <img
                                        src="holder.js/20x20?text=%20"
                                        className="rounded me-2"
                                        alt=""
                                    />
                                    <strong className="me-auto">Answer</strong>
                                </Toast.Header>
                                <Toast.Body>
                                    You can propose as many resources as you want, just remember that
                                    people are checking them manually, so put something that you think is
                                    really useful.
                                </Toast.Body>
                            </Toast>
                        </Col>
                    </div>
                </Row>
                <Row className='pb-3'>
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

export default Faq;
