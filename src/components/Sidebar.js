import React, { useState } from 'react';
import {Button, Form, Modal} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { ref, onValue } from "firebase/database";
import db from '../FirebaseInit.js'


function Item(props){
    return(
      <div className="Side-button" onClick={props.change} style={
        {backgroundColor: props.selected?'lightgreen':''}
      }>{props.name}</div>
    )
  }
  
  function CreateButton(props){
    const [show, setShow] = useState(false);
  
    const handleClose = () => {setShow(false);setShowMessage(false);}
    const handleShow = () => setShow(true);
    const [code, setCode] = useState('');
    const [showMessage, setShowMessage] = useState(false);

    const onSubmit = () => {
      onValue(ref(db, '/EditCode/'+code), (snapshot) => {
        const edit = snapshot.val();
        if(!edit){
          setShowMessage(true);
        }else{
          window.location.href= 'https://resume-c3e28.web.app/'+'Create/'+code;
        }
        // ...
      }, {
        onlyOnce: true
      });
      console.log('onSubmit')
    }
  
    return (
      <>
        <Button variant="primary" className="Sidebar-create" onClick={handleShow}>
          Create Resume
        </Button>
  
        <Modal className='Create-Modal' show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Create/Edit a resume:</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {showMessage?<p className='Error'>Code not found!</p>:<></>}
            <Form.Control type='text' placeholder='Enter edit code:' value={code} onChange={(e) => {setCode(e.target.value)}}/>
          <Button className='Button-edit' onClick={onSubmit}>Edit existing resume</Button>
            <br/>
          <Button className='Button-create' onClick={()=>{window.location.href= 'https://resume-c3e28.web.app/'+'Create'}}>Create new</Button>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    )
  }
  
  export default function Sidebar(props) {
    const changePage = (id) =>{
      props.setPage(id);
    }

    function getIntro(){
      for(var i = 0; i < props.pages.length; i++){
        if(props.pages[i].name === 'Introduction'){
          return props.pages[i];
        }
      }
    }
    const items = 
    props.pages.map((pages, index)=> {
      return(<Item key={index} name={pages.name} change={()=>changePage(pages.uuid)} selected={props.selected===pages.uuid}></Item>)
    });
    console.log(props.mobile);
    return(
      <div className="Sidebar">
        {props.mobile?<></>:
        <>
        <h3 className='Sidebar-name'>{getIntro().content.name}</h3>
        <h3 className='Sidebar-title'>{getIntro().content.title}</h3>
        </>
        }
        {items}
        <CreateButton/>
      </div>
      
    );
  }
