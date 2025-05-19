import { useEffect, useState } from "react";
import { Card, Container, Row, Col, Button } from "react-bootstrap";
import { Link, useNavigate, useParams } from "react-router-dom";
import API from '../API';

function ShowPage(props) {

  const content_list = props.blocks;
  const navigate = useNavigate()
  const page = props.page;
  const pageParamId = parseInt(useParams()['pageId'], 10);


  return (
    <>
      <Row>
        <Col>
          {
            content_list.map((el) => {
              if (el.Type === 'Header') {
                return <HeaderBlock key={el.IdBlock} loggedIn={props.loggedIn} content={el.Content} page={page} user={props.user}
                  changeDirty={props.changeDirty}
                  handleLikeAction={props.handleLikeAction} />;
              }
              else if (el.Type === 'Paragraph') {
                return <ParagraphBlock key={el.IdBlock} content={el.Content} />;
              }
              else if (el.Type === 'Image') {
                return <ImageBlock key={el.IdBlock} content={el.Content} />
              }
            })
          }
        </Col>
      </Row>
      <Row className="justify-content-center pb-3 mt-4">
        <Col className="text-center">
          <Link className="back-btn" onClick={() => {
            props.changeDirty(true)
            navigate(-1)
          }}>
            <i className='bi bi-chevron-left'></i>
            Back
          </Link>
        </Col>
      </Row>
    </>
  );
}

function HeaderBlock(props) {
  const navigate = useNavigate();
  const [user, setUser] = useState(props.user);
  const [hovered, setHovered] = useState(false);
  const like = user?.Likes != undefined ? Array.from(user.Likes).includes(props.page.IdPage) : false;
  const [liked, setLiked] = useState(props.user?.Likes?.includes(props.page.IdPage));

  useEffect(() => {
    setLiked(user?.Likes?.includes(props.page.IdPage));
  }, [user, props.page.IdPage]);

  const handleLikeClick = () => {
    const isLiked = !liked;
    setLiked(isLiked);
    props.handleLikeAction(isLiked);
  };

  const handleMouseEnter = () => {
    setHovered(true);
  };

  const updateUser = () => {
    // console.log("UPDATE USER")
    API.getUserInfo(props.user.id)
      .then((user) => {
        // console.log(user)
        setUser(user);
      })
      .catch((err) => {
        console.error(err);
      }
      );
  }

  const handleMouseLeave = () => {
    setHovered(false);
  };

  // console.log(props)

  return (
    <>
      <h3 className="fs-4 text-center">{props.content}</h3>

      {props.user ? (
        <div className="container">
          <Row>
            {/* <Col xs lg="2"></Col> */}
            <Col xs lg="4">
              <Row className="mb-2">
                <span className="">Category: {props.page.category}</span>
              </Row>
              <Row className="mb-2">
                <span className="g">Author: {props.page.Name}</span>
              </Row>
              <Row className="mb-2">
                <span className="">
                  Publication date: {props.page.DatePublication}
                </span>
              </Row>
            </Col>
            <Col className="text-right">

              <Button
                variant="primary"
                onClick={handleLikeClick}
              >
                {liked ? (
                  <i className={"bi bi-hand-thumbs-up-fill"} />
                ) : (
                  <i className={"bi bi-hand-thumbs-up"} />
                )}
              </Button>

            </Col>
            <Col xs lg="2"></Col>
          </Row>
        </div>

      ) : (
        <div className="container">
          <Row>
            {/* <Col xs lg="2"></Col> */}
            <Col xs lg="4">
              <Row className="mb-2">
                <span className="">Category: {props.page.category}</span>
              </Row>
              <Row className="mb-2">
                <span className="g">Author: {props.page.Name}</span>
              </Row>
              <Row className="mb-2">
                <span className="">
                  Publication date: {props.page.DatePublication}
                </span>
              </Row>
            </Col>
          </Row>
        </div>

      )}
    </>
  );
}

function ParagraphBlock(props) {
  const [hovered, setHovered] = useState(false);

  const handleMouseEnter = () => {
    setHovered(true);
  };

  const handleMouseLeave = () => {
    setHovered(false);
  };

  return (
    // <Card>
    <div className="container source-text">
      <p className="fw-light">{props.content}</p >
    </div>

    // </Card>
  );
}

function ImageBlock(props) {
  const [hovered, setHovered] = useState(false);

  const handleMouseEnter = () => {
    setHovered(true);
  };

  const handleMouseLeave = () => {
    setHovered(false);
  };

  return (
    // <Card>
    <img src={props.content} className="img-show pb-3 mx-auto d-block" alt="Img" />
    // </Card>

  );
}


export default ShowPage;
export { HeaderBlock, ParagraphBlock, ImageBlock };