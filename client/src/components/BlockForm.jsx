import { useState } from 'react';
import { Form, Button, Row, Col, Alert } from 'react-bootstrap';
import dayjs from 'dayjs';
import { Block } from '../PageModel';
import ImageSelector from './ImageSelector';

function BlockForm(props) {
  const [id, setId] = useState(props.block ? props.block.IdBlock : props.lastId + 1);
  const [typeB, setType] = useState(props.block ? props.block.Type : '');
  const [content, setContent] = useState(props.block ? props.block.Content : '');
  const [position, setPosition] = useState(props.block ? props.block.Position : props.lastPos+1);
  const [imgName, setImageName] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const ChangeName = (newName) => {
    setImageName(newName);
  }

  const handleSubmit = (event) => {
    event.preventDefault();

    let cValue = '';

    if (typeB == '')
          setErrorMsg('You must select the type');
      else if (typeB == "Image") {
          if (imgName == '')
              setErrorMsg('Image not found');
          else
              cValue = imgName;
      } else {
          if (content == '')
              setErrorMsg('You must fill the block');
          else
              cValue = content;
    }

    if(errorMsg === ''){
      
      const b = {
        // IdBlock: id,
        Type: typeB,
        Content: cValue,
        Position: 0
      }

      if(props.block) {
        b.Position = props.block.Position;
        // b.IdBlock = props.block.IdBlock;
        props.updateBlock(b);
      }
      else {
        props.addBlock(b);
      }
    }
  }

  return (
    <Form onSubmit={handleSubmit}>
      <Row className='border border-warning rounded block-padding'>
        <Col xs={2}>
          <Form.Group className="mb-3 text-center">
              <Form.Select required={true} value={typeB} className='text-center' aria-label="Default select example" onChange={(event) => setType(event.target.value)}>
                  <option value="" disabled>Choose the type</option>
                  <option value="Header">Header</option>
                  <option value="Paragraph">Paragraph</option>
                  <option value="Image">Image</option>
              </Form.Select>
          </Form.Group>
        </Col>
        <Col xs={7}>
          <Form.Group className='mb-3'>
            {typeB=="Image" ? 
                  <ImageSelector ChangeName={ChangeName}/>
                : 
                  <Form.Control placeholder="Write the content here" type="type" required={true} value={content} onChange={(event) => setContent(event.target.value)}></Form.Control>
            }            
          </Form.Group>
        </Col>
        <Col xs={3}>
          <Button variant="dark" type='submit'>
            Add <i className='bi bi-building-add'></i>
          </Button> 
          &nbsp;
          <Button variant="danger" onClick={props.cancel}>
            Cancel <i className='bi bi-trash'></i>
          </Button>
        </Col>
      </Row>
    </Form>
  );
}

export default BlockForm;