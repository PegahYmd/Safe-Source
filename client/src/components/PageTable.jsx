import dayjs from 'dayjs';
import { useEffect, useRef, useState } from 'react';
import { Table, Form, Button } from 'react-bootstrap/'
import { Link, useLocation } from 'react-router-dom';

function PageTable(props) {

  const [sortByLikes, setSortByLikes] = useState(null);

  const handleSortByLikes = () => {
    setSortByLikes((prevSort) => (prevSort === 'asc' ? 'desc' : 'asc'));
  };

  const sortedPages = () => {
    if (sortByLikes === 'asc') {
      return [...props.pages].sort((a, b) => a.LikesSum - b.LikesSum);
    } else if (sortByLikes === 'desc') {
      return [...props.pages].sort((a, b) => b.LikesSum - a.LikesSum);
    } else {
      return props.pages;
    }
  };

  return (
    <>
      <Table striped className='source-table'>
        <thead className='text-left'>
          <tr>
            <th>Title</th>
            <th>Author</th>
            <th>Category</th>
            <th>Date</th>
            <th onClick={handleSortByLikes}>
              {sortByLikes == 'asc' ? <i className={'bi bi-sort-up'} /> : <i className={'bi bi-sort-down'} />} Likes
            </th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody className='text-left'>
          {
            sortedPages().map((page) =>
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
      <td>
        <p>
          <small>{props.page.LikesSum}</small>
        </p>
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

export default PageTable;