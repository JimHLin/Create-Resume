import React, { useEffect, useState } from 'react';
import {Button, Form, CloseButton} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function CreateEntry(props){
    const addButton = <Button onClick={() => {props.onAdd(props.index)}} className='Created-entryadd'>Add Item</Button>
    const removeButton = <CloseButton className='Close-button' onClick={() => {props.onRemove(props.index)}}></CloseButton>

        const entrysumm = props.data.content.summ?props.data.content.summ.map((summ, index)=>{
            return <div key={index}>
              <CloseButton onClick={()=>{props.onRemoveItem('entry', props.index, index)}}/> 
            <Form.Control className='Create-form' placeholder='Entry points' key={index} type='text' value={summ} onChange={
                (e) => {props.onChange(props.index, 'li', index, e.target.value)}}/>
                </div>
        }):<></>
      
      return(
        <div className='Created-item'>
          {removeButton}
          <div className='Created-entryintro'>
            <div className='Created-entrynamedesc'>
                <Form.Control type='text' className='Created-entryname' value={props.data.content.name} onChange={
                (e) => {props.onChange(props.index, 'name', 0, e.target.value)}} placeholder='Entry name'/>
                 | 
                 <Form.Control type='text' className='Created-entrydesc' value={props.data.content.desc} onChange={
                (e) => {props.onChange(props.index, 'desc', 0, e.target.value)}} placeholder='Entry description'/>
            </div>
            <Form.Control className='Created-entrytime' type='text' value={props.data.content.time} onChange={
                (e) => {props.onChange(props.index, 'time', 0, e.target.value)}} placeholder='Entry time period'/>
          </div>
          <div className='Created-entrysumm'>
            {addButton}
            {entrysumm}
          </div>
        </div>
      )
}