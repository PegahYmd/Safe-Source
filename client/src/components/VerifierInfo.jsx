import React from 'react';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Row, Col } from 'react-bootstrap';


function VerifierInfo(props) {
    const navigate = useNavigate();
    return (
        <>
            <div className='container'>
                <h1 className='text-center'>Verifier Info</h1>
                <h3>What is a verifier?</h3>
                <p>
                    A verifier plays a crucial role in our community-driven platform, contributing to the
                    evaluation and validation of resources submitted by users.
                    This pivotal responsibility helps maintain the integrity and quality of content on our website.
                </p>
                <h3>Send your application</h3>
                <p>
                    To apply for the verifier role, you must be logged in and then you have to
                    complete a form with accurate personal information:<br />
                </p>
                <b>Personal Information</b>
                <ul>
                    <li>Name: Provide your first and last name.</li>
                    <li>Surname: Enter your surname.</li>
                    <li>Email: Share a valid email address.</li>
                </ul>

                <b>Certifications</b>
                <ul>
                    <li>Certifications: Attach any relevant certifications that highlight your expertise.</li>
                </ul>

                <b>Previous Experiences</b>
                <ul>
                    <li>Previous Experiences: Describe your previous experiences, emphasizing relevant qualifications.</li>
                </ul>


                <b>Motivation</b>
                <ul>
                    <li>
                        Why Verifier? Share your motivation for becoming a verifier.
                        Explain your passion for community contribution, commitment to upholding
                        quality standards, and dedication to fostering a positive online environment.
                    </li>
                </ul>

                <h3>Waiting for your application!</h3>
                <p>
                    Thank you for considering joining us as a verifier. If you have any questions or concerns, feel free to reach out
                    using the Contact section.
                    We appreciate your thoughtful responses and look forward to reviewing your application.
                </p>
                {
                    props.loggedIn && props.user.level == 'User' ?
                        <Row className='pb-3'>
                            <Col className='text-center'>
                                <Link className='btn-apply' to='/verifierApply'
                                    onClick={() => props.changeDirty(true)}>
                                    Apply to become a verifier
                                </Link>
	    <Button className='back-btn my-2 mx-2' onClick={() => { props.changeDirty(true); navigate('/') }}>
	    <i className='bi bi-chevron-left'></i>
	    Back
	    </Button>
                            </Col>
                        </Row>
                        :
                        props.loggedIn && props.user.level == 'Admin' ?
                            <Row className='pb-3'>
                                <Col className='text-center'>
                                    <h3 className='mb-4'>You are already a verifier!</h3>
	    <Button className='back-btn my-2 mx-2' onClick={() => { props.changeDirty(true); navigate('/') }}>
	    <i className='bi bi-chevron-left'></i>
	    Back
	    </Button>
                                </Col>
                            </Row>
                            :
                            <Row className='pb-3 mb-3'>
                                <Col className='text-center'>
                                <Button className='back-btn my-2 mx-2' onClick={() => { props.changeDirty(true); navigate('/') }}>
                        <i className='bi bi-chevron-left'></i>
                        Back
                        </Button>
                        <Link className='btn btn-apply' to='/verifierInfo'
                            onClick={() => alert("You must login first to fill the application form.")}>
                            Apply to become a verifier
                        </Link>
                        

                        </Col>
                    </Row>
                }
            </div>

        </>
    );
}

export default VerifierInfo;
