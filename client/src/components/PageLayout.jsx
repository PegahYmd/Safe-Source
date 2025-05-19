import { React, useEffect, useState } from 'react';
import { Row, Col, Button, Form } from 'react-bootstrap';
import { useNavigate, Link, useParams, useLocation, Outlet, redirect } from 'react-router-dom';
import PageTable from './PageTable';
import PageTableProfile from './PageTableProfile';
import PageShow from './PageShow';
import { LoginForm, RegisterForm } from './Auth';
import { ProposeForm } from './Propose';
import Contacts from './Contacts';
import { VerifierForm } from './VerifierApply';
import API from '../API';
import VerifierInfo from './VerifierInfo';
import { Block, Site } from '../PageModel';
import Faq from './FAQ';


function DefaultLayout() {

  return (
    <Row className="vh-100">
      <Col className="below-nav">
        <Outlet />
      </Col>
    </Row>
  );
}


function MainLayout(props) {
  const [pages, setPages] = useState([]);
  const [siteTitle, setSiteTitle] = useState('Welcome to TrustTogether');
  const [showForm, setShowForm] = useState(false);
  const pr = useParams();
  const [tittleSearch, setTittleSearch] = useState('');
  const [categorySearch, setCategorySearch] = useState('0');
  const [datePublicationSearch, setDatePublicationSearch] = useState('');
  const [urlSearch, setUrlSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    props.changeDirty(false);
    if (Object.keys(pr).length !== 0) {
      let u = pr['searchParam'].split("&");
      setTittleSearch(u[0]);
      setCategorySearch(u[1]);
      setDatePublicationSearch(u[2]);
      setUrlSearch(pr['searchParam']);
    }
  }, [])

  useEffect(() => {
    // get all the pages from API
    if (props.dirty) {
      let url = (Object.keys(pr).length === 0) ? '-' : pr['searchParam'];
      const getPages = async () => {
        const returnedPages = await API.getAllPages(url);
        setPages(returnedPages);
        // console.log(returnedPages);
        props.changeDirty(false);
      }
      getPages();
    }

  }, [props.dirty, pr]);

  const deletePage = (pageId) => {
    setPages(pages.filter((p) => p.IdPage !== pageId));
    API.deletePage(pageId)
      .then(() => { })
      .catch(e => console.log(e));
  }

  useEffect(() => {
    props.changeDirty(true)
    API.getSiteById(1)
      .then((s) => { setSiteTitle(s.Name) })
      .catch((err) => console.log(err));
  }, []);

  const handleFormSubmit = (event) => {
    event.preventDefault();
    API.updateSiteTitle(siteTitle)
      .then(() => { })
      .catch(e => console.log(e));
    setShowForm(false);
  }
  const handleCategorySearchChange = (ev) => {
    // Update the state with the selected value
    setCategorySearch(ev.target.value);
  };
  const handleDateChange = (event) => {
    setDatePublicationSearch(event.target.value);
  };
  const handleSearch = (event) => {
    if (event) {
      event.preventDefault();
    }

    let url = tittleSearch + "&" + categorySearch + "&" + datePublicationSearch;
    navigate('/search/' + url);
  }
  const handleReset = () => {
    setTittleSearch('');
    setCategorySearch('0');
    setDatePublicationSearch('');
    handleSearch();
  };

  return (
    <>
      <h1 className="text-center pb-3 title-css" >{siteTitle}</h1>
      <p className='text-center mb-3'>
        We are a community providing resources aiming to help students with anxiety. <br />
        We have {pages.length} different resources available
      </p>
      {
        props.loggedIn && props.user && props.user.level == 'Admin' ?
          <Row>
            <Col className='text-center'>
              <p>
                Hey verifier! Do you have resouces to verify? Check it out: <Button className='login-btn'
                  onClick={() => {
                    props.changeDirty(true)
                    navigate('/profile')
                  }}
                >
                  Resources to Verify</Button>
              </p>
            </Col>
          </Row>
          :
          props.loggedIn && props.user && props.user.level == 'User' ?
            <Row>
              <Col className='text-center'>
                <p>
                  Hey, do you want to see the resources you liked? Check them out: <Button className='login-btn'
                    onClick={() => {
                      props.changeDirty(true)
                      navigate('/profile')
                    }}
                  >
                    Liked Resources</Button>
                </p>
              </Col>
            </Row>
            :
            <></>
      }

      <div className='container search-box'>
        <Form onSubmit={handleSearch}>
          <Row className='justify-content-center mb-2'>
            <Col sm={3}>
              <input type='text' value={tittleSearch}
                onChange={ev => setTittleSearch(ev.target.value)} placeholder='Search by Title' />
            </Col>
            <Col sm={3}>
              <Form.Select value={categorySearch} onChange={ev => handleCategorySearchChange(ev)}>
                <option value="0" disabled>Search by Category</option>
                <option value="1">Emotional</option>
                <option value="2">Cognitive bias</option>
                <option value="3">Depression</option>
                <option value="4">Memory</option>
                <option value="5">Happiness</option>
              </Form.Select>
            </Col>
            <Col sm={3}>
              <input type='date' value={datePublicationSearch} onChange={handleDateChange || ''}
                placeholder='Search by Date' />
            </Col>
            <Col sm={3} className='text-center'>
              <Button className="mx-2 login-btn btn btn-primary search-btns" onClick={handleSearch}>Search</Button>
              <Button className='mx-2 reset-btn btn btn-secondary search-btns' onClick={handleReset}>Reset</Button>
            </Col>
          </Row>
        </Form>
      </div>


      <div className='container main-table'>
        <PageTable user={props.user} loggedIn={props.loggedIn} pages={pages} deletePage={deletePage} changeDirty={props.changeDirty} />
      </div>
    </>
  )
}

function Profile(props) {
  // console.log(props)

  const [pages, setPages] = useState([]);
  const [siteTitle, setSiteTitle] = useState('Welcome to TrustTogether');
  const [showForm, setShowForm] = useState(false);
  const pr = useParams();
  const [tittleSearch, setTittleSearch] = useState('');
  const [categorySearch, setCategorySearch] = useState('0');
  const [datePublicationSearch, setDatePublicationSearch] = useState('');
  const [urlSearch, setUrlSearch] = useState('');
  const [ver, setVer] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    // get all the pages from API
    if (props.dirty) {
      const getPages = async () => {
        const returnedPages = await API.getAllPages('-');
        setPages(returnedPages);
        // console.log(returnedPages);
        props.changeDirty(false);
      }
      getPages();
    }

  }, [props.dirty]);

  useEffect(() => {
    // get all the pages from API
    if (props.dirty) {
      const getVer = async () => {
        const returnedPages = await API.getVerify();
        setVer(returnedPages);
        // console.log(returnedPages)
        props.changeDirty(false);
      }
      getVer();
    }

  }, [props.dirty]);

  const deletePage = (pageId) => {
    setPages(pages.filter((p) => p.IdPage !== pageId));
    API.deletePage(pageId)
      .then(() => { })
      .catch(e => console.log(e));
  }

  useEffect(() => {
    API.getSiteById(1)
      .then((s) => { setSiteTitle(s.Name) })
      .catch((err) => console.log(err));
  }, []);

  const handleFormSubmit = (event) => {
    event.preventDefault();
    API.updateSiteTitle(siteTitle)
      .then(() => { })
      .catch(e => console.log(e));
    setShowForm(false);
  }
  const handleCategorySearchChange = (ev) => {
    // Update the state with the selected value
    setCategorySearch(ev.target.value);
  };
  const handleDateChange = (event) => {
    setDatePublicationSearch(event.target.value);
  };

  return (
    <>
      <PageTableProfile ver={ver} user={props.user} loggedIn={props.loggedIn} pages={pages} deletePage={deletePage} changeDirty={props.changeDirty} />
    </>
  )
}

function ShowLayout(props) {
  const [page, setPage] = useState({});
  const [blocks, setBlocks] = useState([]);

  const navigate = useNavigate();
  const { pageId } = useParams();

  useEffect(() => {
    fetchPageData(); // Fetch page data when component mounts or pageId changes
  }, [pageId]);


  const fetchPageData = () => {
    // Fetch page details
    API.getPageById(pageId)
      .then((p) => { setPage(p); props.changeDirty(true) })
      .catch((err) => console.log(err));

    // Fetch page blocks
    API.getAllBlocks(pageId)
      .then((bs) => { setBlocks(bs); props.changeDirty(true) })
      .catch((err) => console.log(err));
  };

  const handleLikeAction = (isLike) => {
    // Perform the like action
    isLike ?
      API.addLike({ IdPage: pageId, IdUser: props.user.id, IsLike: 1 })
        .then(() => {
          // Fetch updated data after like action
          fetchPageData();
          props.changeDirty(true);
        })
        .catch((err) => console.log(err))
      :
      API.deleteLike(pageId, props.user.id)
        .then(() => {
          // Fetch updated data after like action
          fetchPageData();
          props.changeDirty(true);
        })
        .catch((err) => console.log(err));
  };

  // console.log(props.user)

  return (
    <>
      <PageShow user={props.user} page={page} blocks={blocks} changeDirty={props.changeDirty} handleLikeAction={handleLikeAction} />
    </>
  );
}

function VerifierInfoLayout(props) {
  return (
    <VerifierInfo user={props.user} loggedIn={props.loggedIn} changeDirty={props.changeDirty} />
  );
}


function NotFoundLayout(props) {
  return (
    <>
      <Row>
        <h2 className='text-center'>This is not the route you are looking for!</h2>
      </Row>
      <Row className='justify-content-center'>
        <Col className='text-center'>
          <Link className='btn btn-primary' to='/' onClick={() => props.changeDirty(true)}>
            HOME </Link>
        </Col>
      </Row>
    </>
  );
}


function LoginLayout(props) {
  return (
    <Row className="vh-100">
      <Col md={12} className="below-nav">
        <LoginForm loginSuccessful={props.loginSuccessful} changeDirty={props.changeDirty} />
      </Col>
    </Row>
  );
}

function RegisterLayout(props) {
  return (
    <Row className="vh-100">
      <Col md={12} className="below-nav">
        <RegisterForm loginSuccessful={props.loginSuccessful} changeDirty={props.changeDirty} />
      </Col>
    </Row>
  );
}

function VerifierApplyLayout(props) {
  return (
    <Row className="vh-100">
      <Col md={12} className="below-nav">
        <VerifierForm loginSuccessful={props.loginSuccessful} changeDirty={props.changeDirty} />
      </Col>
    </Row>
  );
}

function VerifierOkLayout(props) {
  return (
    <>
      <h3 className='text-center'>
        Thanks for joining the community. <br />
        We will check your application and get back to you soon.
      </h3>
      <Row className='justify-content-center'>
        <Col className='text-center'>
          <Link className='btn-apply' to='/' onClick={() => props.changeDirty(true)}>
            HOME </Link>
        </Col>
      </Row>
    </>
  );
}


function LikedOkLayout(props) {
  const navigate = useNavigate();

  return (
    <>
      <h3 className='text-center'>
        Resource liked correctly! <br />
      </h3>
      <Row className='justify-content-center'>
        <Col className='text-center'>
          <Button className='back-btn my-2 mx-2' onClick={() => { props.changeDirty(true); navigate('/') }}>
            <i className='bi bi-chevron-left'></i>
            Back
          </Button>
        </Col>
      </Row>
    </>
  );
}

function ProposeLayout(props) {
  return (
    <ProposeForm loggedIn={props.loggedIn} changeDirty={props.changeDirty} />
  );
}

function ProposeOkLayout(props) {
  return (
    <>
      <h3 className='text-center result-msg'>
        Thanks for adding resource for the community. <br />

        community verifiers will evaluate your resource and notify you.
      </h3>
      <Row className='justify-content-center mt-4'>
        <Col className='text-center'>
          <Link className='login-btn' to='/' onClick={() => props.changeDirty(true)}>
            HOME </Link>
        </Col>
      </Row>
    </>
  );
}

function AccOkLayout(props) {
  return (
    <>
      <h3 className='text-center result-msg'>
        Thanks for evaluating the resources. <br />

        The resource will be added soon.
      </h3>
      <Row className='justify-content-center mt-4'>
        <Col className='text-center'>
          <Link className='login-btn' to='/' onClick={() => props.changeDirty(true)}>
            HOME </Link>
        </Col>
      </Row>
    </>
  );
}

function RejOkLayout(props) {
  return (
    <>
      <h3 className='text-center result-msg'>
        Thanks for evaluating the resources. <br />

        The resource will be removed soon.
      </h3>
      <Row className='justify-content-center mt-4'>
        <Col className='text-center'>
          <Link className='login-btn' to='/' onClick={() => props.changeDirty(true)}>
            HOME </Link>
        </Col>
      </Row>
    </>
  );
}


function FaqLayout(props) {
  return (
    <Faq changeDirty={props.changeDirty} />
  );
}

function ContactsLayout(props) {
  return (
    <Contacts changeDirty={props.changeDirty} />
  );
}

function ToVerifyLayout(props) {
  const navigate = useNavigate();
  const [ver, setVer] = useState({});

  const { Id } = useParams();


  useEffect(() => {
    getVer(); // Fetch page data when component mounts or pageId changes
  }, [Id]);


  const getVer = () => {
    // Fetch page details
    API.getVerifyById(Id)
      .then((p) => { setVer(p); props.changeDirty(true); })
      .catch((err) => console.log(err));
  };

  // console.log(ver)

  return (
    <>
      <div className='container'>
        <h1 className='text-center mb-5 mt-4'>Resource to verify: {ver.Title}</h1>
        <Row className='justify text-left mb-3'>
          <Col><b>Link:</b> <a href={ver.Link} target="_blank" rel="noopener noreferrer"><small>{ver.Link}</small></a></Col>
          <Col><b>Author:</b> <small>{ver.Author}</small></Col>
        </Row>
        <Row className='justify text-left mb-5'>
          <Col><b>Given Feedback:</b> <small>{ver.Feedback}</small></Col>
          <Col><b>Title:</b> <small>{ver.Title}</small></Col>
        </Row>
        <h4 className='text-left'>Briefly comment the resource</h4>

        <Row>
          <Col className='text-left' sm={4}>
            <Form.Label><b>Please assign a Label</b></Form.Label>
            <Form.Select>
              <option value="0" disabled>Search by Category</option>
              <option value="1">Emotional</option>
              <option value="2">Cognitive bias</option>
              <option value="3">Depression</option>
              <option value="4">Memory</option>
              <option value="5">Happiness</option>
            </Form.Select>
          </Col>
        </Row>

        <Row className='mb-2 mt-4'>
          <Col className='text-left' xs={8}>
            <Form.Group controlId=''>
              <Form.Label><b>Why do you think it is useful?</b></Form.Label>
              <Form.Control placeholder='Write your personal opinion here' type='text' as="textarea" />
            </Form.Group>
          </Col>
        </Row>



        <Row className='justify-content-center'>
          <Col className='text-center'>
            <Button className='back-btn my-2 mx-2' onClick={() => { props.changeDirty(true); navigate(-1) }}>
              <i className='bi bi-chevron-left'></i>
              Back
            </Button>
            <Link className='btn rej-btn my-2 mx-2' to='/rejOk' onClick={() => { props.changeDirty(true); }}>
              Reject
            </Link>
            <Link className='btn acc-btn my-2 mx-2' to='/accOk' onClick={() => { props.changeDirty(true); }}>
              Accept
            </Link>
          </Col>
        </Row>
      </div>

    </>
  );
}


export {
  DefaultLayout, MainLayout, ShowLayout, LoginLayout, RegisterLayout, NotFoundLayout,
  VerifierInfoLayout, VerifierApplyLayout, VerifierOkLayout, ProposeLayout, ProposeOkLayout,
  ContactsLayout, FaqLayout, Profile, LikedOkLayout, ToVerifyLayout, AccOkLayout, RejOkLayout
}; 
