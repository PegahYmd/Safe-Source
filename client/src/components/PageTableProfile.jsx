import dayjs from 'dayjs';
import { useEffect, useRef, useState } from 'react';
import { Table, Form, Button, Row, Col } from 'react-bootstrap/'
import { Link, useLocation, useNavigate } from 'react-router-dom';

function PageTableProfile(props) {
  const navigate = useNavigate();

  return (
    <>
      {
        props.loggedIn && props.user.level === 'Admin' ?
          <>

            <div className='container main-table mt-4'>
              <h2 className='text-left'>Resources waiting to be verified</h2>
              <Table striped>
                <thead className='text-left'>
                  <tr>
                    <th>Title</th>
                    <th>Author</th>
                    <th className='text-center'>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    props.ver.map((page) =>
                      <PageRowResources
                        key={page.Id}
                        page={page}
                        loggedIn={props.loggedIn}
                        user={props.user}
                      />
                    )
                  }
                </tbody>
              </Table>
            </div>

            <br></br>
            <br></br>

            <div className='container main-table'>
              <h2 className='text-left'>Liked Articles</h2>
              <Table striped>
                <thead className='text-left'>
                  <tr>
                    <th>Title</th>
                    <th>Author</th>
                    <th>Category</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody className='text-left'>
                  {
                    props.pages
                      .filter(page => props.user.Likes.includes(page.IdPage))
                      .map((page) =>
                        <PageRow
                          key={page.IdPage}
                          page={page}
                          deletePage={props.deletePage}
                          loggedIn={props.loggedIn}
                          user={props.user}
                        />
                      )
                  }
                </tbody>
              </Table>
            </div>

            <Row className='pb-3 mt-5'>
              <Col className='text-center'>
                <Button className='back-btn my-2 mx-2' onClick={() => { props.changeDirty(true); navigate(-1) }}>
                  <i className='bi bi-chevron-left'></i>
                  Back
                </Button>
              </Col>
            </Row>
          </>
          :
          <>
            <h2 className='text-center'>Liked Articles</h2>
            <Table striped className='source-table'>
              <thead className='text-center'>
                <tr>
                  <th>Title</th>
                  <th>Author</th>
                  <th>Category</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody className='text-center'>
                {
                  props.pages
                    .filter(page => props.user.Likes.includes(page.IdPage))
                    .map((page) =>
                      <PageRow
                        key={page.IdPage}
                        page={page}
                        deletePage={props.deletePage}
                        loggedIn={props.loggedIn}
                        user={props.user}
                      />
                    )
                }
              </tbody>
            </Table>
            <Row className='pb-3 mt-5'>
              <Col className='text-center'>
                <Button className='back-btn my-2 mx-2' onClick={() => { props.changeDirty(true); navigate(-1) }}>
                  <i className='bi bi-chevron-left'></i>
                  Back
                </Button>
              </Col>
            </Row>
          </>
      }
    </>
  );
}

function PageRow(props) {

  // location is used to pass state to the edit (or add) view so that we may be able to come back to the last filter view
  const location = useLocation();

  const showAllButtons = props.loggedIn && props.user.level === 'Admin';
  const showPartialButtons = props.loggedIn && (props.user.level === 'User' && props.user.id === props.page.IdAuthor);

  return (
    <tr>
      <td>
        <p>
          <small>{props.page.Title}</small>
        </p>
      </td>
      <td>
        <p>
          <small>{props.page.Name}</small>
        </p>
      </td>
      <td>
        <p>
          <small>{props.page.category}</small>
        </p>
      </td>
      <td>
        <small>{props.page.DatePublication != undefined && props.page.DatePublication != 'Invalid Date' ? props.page.DatePublication : <p className='red'>Draft</p>}</small>
      </td>
      {
        showAllButtons ?
          <>
            <td>
              <Link className="btn-view" to={"/show/" + props.page.IdPage} state={{ nextpage: location.pathname }}>
                View
              </Link>
              {/* &nbsp;
              <Button variant='danger' onClick={() => { props.deletePage(props.page.IdPage) }}>
                <i className="bi bi-trash" />
              </Button> */}
            </td>
          </>
          :
          showPartialButtons ?
            <>
              <td>
                <Link className="btn-view" to={"/show/" + props.page.IdPage} state={{ nextpage: location.pathname }}>
                  View
                </Link>
                {/* &nbsp;
                <Button variant='danger' onClick={() => { props.deletePage(props.page.IdPage) }}>
                  <i className="bi bi-trash" />
                </Button> */}
              </td>
            </>
            :
            <td>
              <Link className="btn-view" to={"/show/" + props.page.IdPage} state={{ nextpage: location.pathname }}>
                View
              </Link>
              {/* &nbsp;
              <Button className='invisible disabled'><i className="bi bi-eye-fill" /></Button>
              &nbsp;
              <Button className='invisible disabled'><i className="bi bi-eye-fill" /></Button> */}
            </td>
      }
    </tr>
  );
}

function PageRowResources(props) {

  // location is used to pass state to the edit (or add) view so that we may be able to come back to the last filter view
  const location = useLocation();

  const showAllButtons = props.loggedIn && props.user.level === 'Admin';
  const showPartialButtons = props.loggedIn && (props.user.level === 'User' && props.user.id === props.page.IdAuthor);

  return (
    <tr>
      <td>
        <p>
          <small>{props.page.Title}</small>
        </p>
      </td>
      <td>
        <p>
          <small>{props.page.Author}</small>
        </p>
      </td>
      <td className='text-center'>
        <Link className="btn-view" to={"/toverify/" + props.page.Id} state={{ nextpage: location.pathname }}>
          Verify
        </Link>
        {/* &nbsp;
        <Button className='invisible disabled'><i className="bi bi-eye-fill" /></Button>
        &nbsp;
        <Button className='invisible disabled'><i className="bi bi-eye-fill" /></Button> */}
      </td>
    </tr>
  );
}

export default PageTableProfile;
