import React, { useEffect, useState } from 'react';
import {Button, Form, CloseButton} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function CreateList(props){

    const addButton = <Button onClick={() => {props.onAdd(props.index)}} className='Created-listadd'>Add Item</Button>
    const removeButton = <CloseButton className='Close-button' onClick={() => {props.onRemove(props.index)}}></CloseButton>
    return(
        <div className='Created-item'>
            {removeButton}
            <div>
        <Form.Control type="text" placeholder="List title" className="Form-center, Create-form" value={props.data.content.listhead} onChange={
            e => props.onChange(props.index, 'listhead', 0, e.target.value)
            }/>
            
        {addButton}
        
        {props.data.content.list?props.data.content.list.map((item, index) => {
           return <div key={index}>
            <CloseButton onClick={()=>{props.onRemoveItem('list', props.index, index)}}/>
            <Form.Control type='text' className="Form-center, Create-form" value={item} onChange={
                (e) => {props.onChange(props.index, 'list', index, e.target.value)}}/>
                
            </div>
        }):<></>}
        </div>
        </div>
    )
}