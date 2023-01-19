import '../css/App.css';
import React, { useState, useEffect} from 'react';
import {CreateSidebar} from '../components/CreateSidebar';
import { FaPhone, FaEnvelope } from 'react-icons/fa';
import {Button, Form, Modal, CloseButton, Accordion} from 'react-bootstrap'
import CreateList from '../components/CreateList'
import CreateParagraph from '../components/CreateParagraph'
import CreateEntry from '../components/CreateEntry'
import 'bootstrap/dist/css/bootstrap.min.css';
import db from '../FirebaseInit.js';
import { v4 as uuidv4 } from 'uuid';
import {
  useParams
} from "react-router-dom";

import {ref, child, push, update, onValue } from "firebase/database";


function AddButton(props){
  
  return(<Button className='Created-add' onClick={props.onClick}>+</Button>)
}


function IntroductionPage(props){
  return(
    <div className="Page">
      <div className='Profile'>
        <div className='Profile-info'>
          <h1 className='Profile-name'>      
          <Form.Control type="text" placeholder="Full name" className="Form-center, Create-form" value={props.data.content.name} onChange={
            e => props.onChange('name', e.target.value)
            }/>
        </h1>
          <div className='Profile-contact'>
            <FaPhone/>
            <Form.Control type="text" placeholder="Phone Number" className="Form-center, Create-form" value={props.data.content.number} onChange={
            e => props.onChange('number', e.target.value)
            }/>
            <br/>
            <FaEnvelope/>
            <Form.Control type="text" placeholder="Email" className="Form-center, Create-form" value={props.data.content.email} onChange={
            e => props.onChange('email', e.target.value)
            }/>
          </div>
        </div>
        <div className='Skills'>
        <Form.Control type="text" placeholder="List Title" className="Form-center, Create-form" value={props.data.content.listhead} onChange={
            e => props.onChange('listhead', e.target.value)
            }/>
        <Button className="Intro-addbutton" onClick={props.onAdd}>Add Item</Button>
        {props.data.content.list?props.data.content.list.map((item, index) => {
           return <div key={index}>
            <CloseButton onClick={()=>{props.onRemoveItem(index)}}/>
           <Form.Control className="Form-center, Create-form" placeholder="List item" type='text' value={item} onChange={(e) => {
            props.onChange('list', e.target.value, index)}}/>
            </div>
        }):<></>}
        
      </div>
        </div>
        <div className='Introduction'>
        <Form.Control as="textarea"placeholder="Write a short introduction!" rows={3} value={props.data.content.desc} onChange={
            e => props.onChange('desc', e.target.value)
            }/>
        </div>
      
    </div>
  );
}

function ProcessCreatedPage(props){
  const [formType, setFormType] = useState('list');
  var thisIndex = 0;
  for(var i=0; i<props.pages.length; i++){
    if(props.pages[i].uuid === props.data.uuid){
      thisIndex = i;
      break;
    }else if(i === props.pages.length-1){
      throw new Error('custom page not found!');
    }
  }
  
  //onChange function on created forms
  const onChange = (index, type, index2, content) => {
    const newPages = [...props.pages];
    switch(type){
      case 'list' : 
        if(newPages[thisIndex].content[index].content.list.length <= index2){
          newPages[thisIndex].content[index].content.list.push(content);
        }else{
          newPages[thisIndex].content[index].content.list[index2] = content;
        }
        break;
      case 'listhead' : 
        newPages[thisIndex].content[index].content.listhead = content;
        break;
      case 'paragraph' :
        newPages[thisIndex].content[index].content = content;
        break;
      case 'li' : 
        newPages[thisIndex].content[index].content.summ[index2] = content;
        break;
      case 'name' : 
        newPages[thisIndex].content[index].content.name = content;
        break;
      case 'desc' : 
        newPages[thisIndex].content[index].content.desc = content;
        break;
      case 'time' : 
        newPages[thisIndex].content[index].content.time = content;
        break;
      default: 
    }
    props.setPages(newPages);
  }
  //onRemove function for created forms
  const onRemove = (index) => {
    const newPages = [...props.pages];
    newPages[thisIndex].content.splice(index, 1);
    props.setPages(newPages);
  }
  //onRemove function for created list items
  const onRemoveItem = (type, index, index2) => {
    const newPages = [...props.pages];
    if(type === 'list'){
      newPages[thisIndex].content[index].content.list.splice(index2, 1);
      props.setPages(newPages);
    }else if(type === 'entry'){
      newPages[thisIndex].content[index].content.summ.splice(index2, 1);
      props.setPages(newPages);
    }
    
  }
  //onAdd function for created lists
  const onListAdd = (index) => {
    const newPages = [...props.pages];
    newPages[thisIndex].content[index].content.list.push('');
    props.setPages(newPages);
  }
  //onAdd function for created entries
  const onEntryAdd = (index) => {
    const newPages = [...props.pages];
    newPages[thisIndex].content[index].content.summ.push('');
    props.setPages(newPages);
  }
  //main content mapped
  const content = typeof(props.data.content)==='undefined'? <></> : props.data.content.map((data, index)=>{
    switch(data.type){
      case('list') : return <CreateList data={data} onChange={onChange} index={index} key={index} onAdd={onListAdd} onRemove={onRemove} onRemoveItem={onRemoveItem} showRemove={true}/>
      case('paragraph') : return <CreateParagraph data={data} onChange={onChange} index={index} key={index} onRemove={onRemove}/>
      case('entry') : return <CreateEntry data={data} onChange={onChange} index={index} key={index} onAdd={onEntryAdd} onRemoveItem={onRemoveItem} onRemove={onRemove}/>
      default : return <></>
    }

  })
  //handles onClick of Add button
  const onAdd = () => {
    const newPages = [...props.pages];
    switch(formType){
      case('list') : newPages[thisIndex].content.push({type:'list', content:{listhead: '', list:[]}});
      break;
      case('paragraph') : newPages[thisIndex].content.push({type:'paragraph', content: ''})
      break;
      case('entry') : newPages[thisIndex].content.push({type: 'entry', content: {name: '', desc: '', time: '', summ: []}})
      break;
      default:
    }
    props.setPages(newPages);
  }
  const radio = <Form>
  {['list', 'entry', 'paragraph'].map((type) => (
    <div key={type} className="mb-3, Create-radio">
      <Form.Check 
        type={'radio'}
        value={type}
        label={type}
        onChange={()=>{setFormType(type)}}
        checked={type===formType}
      />
    </div>
  ))}
</Form>
  const addContent = <AddButton onClick={onAdd}/>

  //Return statement for ProcessCreatedPage
  return <div className='Page'>
    {radio}
    {addContent}
    {content}
  </div>
}

//Process a page into readable components
function ProcessPage(props){

  const onIntroListAdd = () => {
    var intro;
    const newPages = [...props.pages];
    for(var i = 0; i < newPages.length; i++){
      if(newPages[i].name === 'Introduction'){
        intro = newPages[i]
      }
    }
    intro.content.list.push('');
    props.setPages(newPages);
  }

  const onRemoveItem = (index) => {
    var intro;
    const newPages = [...props.pages];
    for(var i = 0; i < newPages.length; i++){
      if(newPages[i].name === 'Introduction'){
        intro = newPages[i]
      }
    }
    intro.content.list.splice(index, 1);
    props.setPages(newPages);
  }

  const onIntroChange = (type, value, index=0) => {
    const newPages = [...props.pages];
    var intro;
    for(var i = 0; i < newPages.length; i++){
      if(newPages[i].name === 'Introduction'){
        intro = newPages[i]
      }
    }
    switch(type){
      case 'name' : intro.content.name = value;
        break;
      case 'number' : intro.content.number = value;
        break;
      case 'email' : intro.content.email = value;
        break;
      case 'desc' : intro.content.desc = value;
        break;
      case 'listhead' : intro.content.listhead = value;
        break;
      case 'list' : intro.content.list[index] = value;
      break;
      default:
    }
    
    props.setPages(newPages);
  } 
  switch (props.prePage.name){
    case "Introduction": return(<IntroductionPage onChange={onIntroChange} onRemoveItem={onRemoveItem} onAdd={onIntroListAdd} data={props.prePage}/>);
    case "comments": return(<CommentsPage></CommentsPage>);
    default : return(<ProcessCreatedPage pages={props.pages} setPages={props.setPages} data={props.prePage}/>);
  }
}

function CommentsPage(props){
  return(
    <div className="Page">Give this man a job. </div>
  )
}

function EditCodeModal(props){
  return (
    <>
      <Modal className='Create-Modal' show={props.show} onHide={props.onHide}>
        <Modal.Header closeButton>
        </Modal.Header>
        <Modal.Body>
          <h3>Your sharable resume link:<br/>
          https://resume-c3e28.web.app/{props.resumeId}</h3>
          <br/>
          <h3>Your Edit Code will be: <br/>{props.editCode}</h3>
          <p>Remember your edit code if you want to return to edit your resume!</p>
          
          
        </Modal.Body>
        <Modal.Footer>
        <Button variant="secondary" onClick={props.onHide}>
            Close
        </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

function CreateResume(){
  const {editCode} = useParams();
  const introductionId = uuidv4();
  const [valid, setValid] = useState(false);
  const [show, setShow] = useState(false);
  const [edit, setEdit] = useState('');
  const [resumeId, setResumeId] = useState('');

  const pageData = [{
    uuid: introductionId,
    name: "Introduction",
    content: {
      name: '',
      number: '',
      email: '',
      desc: '',
      listhead:'',
      list: [],
      title: ''
    }
  }];

  const [pages, setPages] = useState(pageData);
  const [page,setPage] = useState(pages[0].uuid);
  const [mobile, setMobile] = useState(false);
  

  function handleScreenChange(e) {
    if (e.matches) {
      setMobile(true);
    }else{
      setMobile(false);
    }
  }
  
  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 768px)');
    mediaQuery.addEventListener("change", (e)=>{handleScreenChange(e)});
    handleScreenChange(mediaQuery);
    setEdit(push(child(ref(db), 'EditCode')).key);
    setResumeId(push(child(ref(db), 'Resumes')).key);
    if(!!editCode){
      onValue(ref(db, '/EditCode/'+editCode), (snapshot) => {
        const edit = snapshot.val();
        if(!edit){
        }else{
          onValue(ref(db, '/Resumes/'+edit.resume), (snapshot) => {
            const resume = snapshot.val();
            if(!resume){
            }else{
              setPages(resume);
              setPage(resume[0].uuid);
              setResumeId(edit.resume);
              setEdit(editCode);
              setValid(true);
            }
            // ...
          }, {
            onlyOnce: true
          });
        }
        // ...
      }, {
        onlyOnce: true
      });
    }
}, [editCode]);

  const onSave = () => {
    if(valid){
      // Write the new post's data simultaneously in the posts list and the user's post list.
      const updates = {};
      updates['/Resumes/' + resumeId] = pages;
      setShow(true);
      return update(ref(db), updates);
    }else{
      // Write the new post's data simultaneously in the posts list and the user's post list.
      const updates = {};
      updates['/Resumes/' + resumeId] = pages;
      updates['/EditCode/' + edit] = {resume: resumeId};
      setShow(true);
      return update(ref(db), updates);
    }
  }



  function getProcessedPage(name){
    for(var i = 0; i < resultPages.length; i++){
      if(resultPages[i].props.prePage.uuid === page){
        return resultPages[i];
      }
    }
    
  }
  
  const resultPages = pages.map(i => <ProcessPage key={i.uuid} pages={pages} setPages={setPages} prePage={i}/>);

  return (
    <div className="App">
      {mobile?<Accordion className='Accordion'>
        <Accordion.Item eventKey="0">
          <Accordion.Header>
            Menu
          </Accordion.Header>
          <Accordion.Body>
          <CreateSidebar mobile={mobile} pages={pages} selected={page} setPage={setPage} setPages={setPages} onSave={onSave}/>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>:
        <CreateSidebar mobile={mobile} pages={pages} selected={page} setPage={setPage} setPages={setPages} onSave={onSave}/>
      }
        {getProcessedPage(page)}
        <EditCodeModal show={show} onHide={() => {setShow(false)}} editCode={edit} resumeId={resumeId}/>
    </div>
  );
}


export default CreateResume;
