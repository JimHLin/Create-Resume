import React, { useState } from 'react';
import {Button, Modal, Form, CloseButton} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/CreateSidebar.css';
import { v4 as uuidv4 } from 'uuid';

function SaveModal(props){
    return (
      <>
        <Modal className='Create-Modal' show={props.show} >
          <Modal.Header closeButton>
          </Modal.Header>
          <Modal.Body>Do you want to save before exiting? You will lose unsaved progress.<br/>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={props.onIgnore}>
              Ignore
            </Button>
            <Button variant="primary" onClick={props.onSave}>
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    )
}

function AddModal(props){
  const [name,setName] = useState('');
  return (
    <>
      <Modal className='Create-Modal' show={props.show} onHide={props.onHide}>
        <Modal.Header closeButton>
        </Modal.Header>
        <Modal.Body>
          {props.showError?<div className='Error'>Try a different name!<br/></div>: <></>}
        <input type="text" name="ItemName" placeholder='Enter name' value={name} onChange={(e) => {setName(e.target.value)}}/>  
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={()=>{props.onAdd(name);setName('')}}>
            Add
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

function Item(props){
    return(
      <div className="Side-button Create-sidebutton" onClick={() => {props.onClick(props.id)}} style={
        {backgroundColor: props.id === props.selected?'lightgreen':''}}>
          <div className="Arrow-up" onClick={props.onMoveUp(props.id)}/>
          <div className='Arrow-down'onClick={props.onMoveDown(props.id)}/>
          <CloseButton className='Side-delete' onClick={props.onDelete(props.id)}/>
        <div className='Side-itemname'>{props.name}</div>
      </div>
    )
  }
  
  function SaveButton(props){
    const [show, setShow] = useState(false);
  
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
  
    return (
      <>
        <Button variant="primary" className='Save-button' onClick={handleShow}>
          Save Resume
        </Button>
  
        <Modal className='Save-Modal' show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Save Changes?</Modal.Title>
          </Modal.Header>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button variant="primary" onClick={()=>{handleClose(); props.onSave();}}>
              Save 
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    )
  }

  function AddButton(props){
    return(<Button className='Create-addbutton' onClick={props.onClick}>+</Button>)
  }
  
  
  export function CreateSidebar(props) {
    const [show, setShow] = useState(false);
    const [link, setLink] = useState();
    const [saved, setSaved] = useState(true);
    const [showAdd, setShowAdd] = useState(false);
    const [showError, setShowError] = useState(false);

    const handleClick = (e) => {
        if(saved){
            props.setPage(e);
        }else{
            setLink(e);
            setShow(true);
        }
    }

    const onIgnore = () => {
        setShow(false);
        props.setPage(link);
    }

    const onSave = () => {
        setSaved(true);
        console.log('onSave');
        props.onSave();
    }

    function arraymove(arr, fromIndex, toIndex) {
      var element = arr[fromIndex];
      arr.splice(fromIndex, 1);
      arr.splice(toIndex, 0, element);
    }

    const onMoveUp = (id) => (e) => {
      const newPages = [...props.pages];
      for(var i = 1; i < newPages.length; i++){
        if(newPages[i].uuid === id){
          arraymove(newPages, i, i-1);
          props.setPages(newPages);
        }
      }
      e.stopPropagation();
    }

    const onMoveDown = (id) => (e) => {
      const newPages = [...props.pages];
      for(var i = 0; i < newPages.length-1; i++){
        if(newPages[i].uuid === id){
          arraymove(newPages, i, i+1);
          props.setPages(newPages);
          break;
        }
      }
      e.stopPropagation();
    }

    function getIntro(){
      for(var i = 0; i < props.pages.length; i++){
        if(props.pages[i].name === 'Introduction'){
          return props.pages[i];
        }
      }
    }

    const onDelete = (id) => (e) => {
      if(id === getIntro().uuid){
        e.stopPropagation();
        return;
      }
      const newPages = [...props.pages];
      for(var i = 0; i < newPages.length; i++){
        if(newPages[i].uuid === id){
          newPages.splice(i, 1);
          props.setPages(newPages);
          break;
        }
      }
      e.stopPropagation();
    }

    const onAdd = (name) => {
      if(name !== 'Introduction'){
        const newPages = [...props.pages];
        newPages.push({uuid: uuidv4(), name:name, content:[]});
        props.setPages(newPages)
        setShowAdd(false);
        setShowError(false);
      }else{
        setShowError(true);
      }
    }



    const onIntroChange = (type, value) => {
      const newPages = [...props.pages];
      for(var i = 0; i < props.pages.length; i++){
        if(props.pages[i].name === 'Introduction'){
          if(type === 'name'){
            newPages[i].content.name = value;
          }else if(type === 'title'){
            newPages[i].content.title = value;
          }
        }
      }
      props.setPages(newPages);
    }

    return(
      <div className="Sidebar">
        {props.mobile?<></>:<>
        <Form.Control type="text" placeholder="Full name" className="Form-center, Create-form" value={getIntro().content.name} onChange={
            e => onIntroChange('name', e.target.value)
            }/>
        <br/>
        <Form.Control type="text" placeholder="Job Title" className="Form-center, Create-form" value={getIntro().content.title} onChange={
            e => onIntroChange('title', e.target.value)
            }/>
            </>
        }
        <AddButton onClick={() => {setShowAdd(true)}}></AddButton>
        {props.pages.map((pages)=> {
          return(<Item 
          key={pages.uuid} id={pages.uuid} name={pages.name} selected={props.selected} onClick={handleClick}
          onMoveUp={onMoveUp} onMoveDown={onMoveDown} onDelete={onDelete}
          >
          </Item>)
        })}
        <SaveButton onSave={onSave}></SaveButton>
        <AddModal show={showAdd} onHide={()=>{setShowAdd(false); setShowError(false)}} onAdd={onAdd} showError={showError}/>
        <SaveModal show={show} onIgnore={onIgnore} onSave={onSave}></SaveModal>
      </div>
      
    );
  }