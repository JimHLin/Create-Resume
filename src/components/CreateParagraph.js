import React, { useEffect, useState } from 'react';
import {Form, CloseButton} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function CreateParagraph(props){
    const removeButton = <CloseButton className='Close-button' onClick={() => {props.onRemove(props.index)}}></CloseButton>

    return(
        <div className='Created-item'>
            {removeButton}
           <Form.Control as='textarea' className='Create-form' placeholder='Enter paragraph:' value={props.data.content} rows={3} onChange={(e) => {
            props.onChange(props.index, 'paragraph', 0, e.target.value)}}/>
           
        </div>
    )
}