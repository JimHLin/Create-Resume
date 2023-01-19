import Sidebar from './components/Sidebar';
import CreateResume from './pages/CreateResume';
import './css/App.css';
import React, { useState, useEffect} from 'react';
import { FaPhone, FaEnvelope } from 'react-icons/fa';
import { Accordion } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import db from './FirebaseInit.js';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import {
  useParams
} from "react-router-dom";
import {ref, onValue } from "firebase/database";


function DataItem(props){
  function EntrySumm () {
    if(!!props.entry.summ){
      const entrysumm = props.entry.summ.map((summ, index)=>{return <li className='Entry-summitem' key={index}>{summ}</li>})
    return entrysumm
    }
    return <></>
  }
  return(
    <div className='Created-entry'>
      <div className='Entry-intro'>
        <p className='Entry-name'>{props.entry.name} | {props.entry.desc}</p>
        {props.entry.time?<p className='Entry-time'>{props.entry.time}</p>:<></>}
      </div>
      <ul className='Entry-summ'>
        {EntrySumm()}
      </ul>
    </div>
  )
}

function IntroductionPage(props){
  return(
    <div className="Page">
      <div className='Profile'>
        <div className='Profile-info'>
          <h1 className='Profile-name'>      
            {props.data.content.name}
          </h1>
          <h3 className='Profile-title'>
            {props.data.content.title}
          </h3>
          <div className='Profile-contact'>
            <FaPhone className='Profile-icon'/>
            <p>{props.data.content.number}</p>
            <FaEnvelope className='Profile-icon'/>
            <p>{props.data.content.email}</p>
          </div>
        </div>
        <div className='Skills'>
        <h2 className="Intro-listhead">
        {props.data.content.listhead}
        </h2>
        <ul className='Intro-list'>
          {props.data.content.list?props.data.content.list.map((item, index) => {
            return <li key={index}>{item}</li>
          }):<></>}
        </ul>
      </div>
        </div>
        <div className='Introduction' style={{whiteSpace: 'pre-wrap', overflowWrap: 'break-word'}}>
        {props.data.content.desc}
        </div>  
    </div>
  );
}

function ProcessCreatedPage(props){
  //main content mapped
  const content = typeof(props.data.content)==='undefined'? <></> : props.data.content.map((data, index)=>{
    switch(data.type){
      case('list') : return <div className='Created-list' key={index}>
        <h2>{data.content.listhead}</h2>
        <ul>
          {data.content.list?data.content.list.map((value, index)=>{return <li key={index}>{value}</li>}):<></>}
        </ul>
        </div>
      case('paragraph') : return <p style={{whiteSpace: 'pre-wrap', overflowWrap: 'break-word'}} className='Created-paragraph' key={index}>{data.content}</p>
      case('entry') : return <DataItem key={index} entry={data.content}/>
      default : return <></>
    }

  })

  //Return statement for ProcessCreatedPage
  return <div className='Page'>
    {content}
  </div>
}

//Process a page into readable components
function ProcessPage(props){
  switch (props.prePage.name){
    case "Introduction": return(<IntroductionPage data={props.prePage}/>);
    default : return(<ProcessCreatedPage pages={props.pages} setPages={props.setPages} data={props.prePage}/>);
  }
}

function Home(){
  const {resumeId} = useParams();

  const pageData = [{
    uuid: uuidv4(),
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
    const staticPage = [{
      uuid: uuidv4(),
      name: "Introduction",
      content: {
        name: 'Jim Lin',
        number: '604-338-8859',
        email: 'jhlin5083@gmail.com',
        desc: "I am an software developer confident that my knowledge and skills can contribute to whetever I'm assigned toString.",
        listhead:'Technical Skills',
        list: ['Experienced in HTML, CSS, JavaScript',
         'Experienced in RESTful architecture, SQL & noSQL database structures ',
          'Experienced in Java, C++, OOP',
          'Working knowledge of Elixir, Dart, Go, C, PHP, .NET',
          'Experience working with Linus systems',
          'Web Dev frameworks such as JQuery, Node.js, React.js, Bootstrap',
          'Git version control and team Agile development',
          'Professional oral & written team communication skills'
        ],
        title: 'Software Developer'
      }
    },{
      uuid: uuidv4(),
      name: 'Work Experience',
      content:[
        {type: 'entry',
          content: {
            name: 'Unithai Thai food restaurant',
            desc: 'Taiwan',
            time: 'Aug-Feb, Jul-Oct, 2021-22',
            summ: ['Part-time restaurant job while awaiting military enrollment',
                  'Greet customers, operate register, take orders, and serve dishes',
                  'Operate under high pressure due to huge spike in timed takeout deliveries during COVID'  
          ]
          }},
          {type: 'entry',
          content: {
            name: 'ROC military',
            desc: 'Taiwan',
            time: 'Feb-Jun 2022',
            summ: ['Mandatory military service ',
                  'Learning basic arms operation and physical training',
                  'Strict on hierarchy and manners, especially strict on schedules and clothing',
                  'Live on camp with voluntary soldiers, need to gel with wildly different personalities'
          ]
          }}
      ]

  },{
      uuid: uuidv4(),
      name: "Education",
      content: [
        {type: 'entry',
          content: {
            name: 'Computer Systems Technology',
            desc: 'BCIT',
            time: 'Graduated 2021',
            summ:['Courses in Functional & Object-Oriented programming, Web development, UI/UX, Data communication, Relational databases, Mobile Development',
                  'Industry projects grouping students with startup business owners to develop working early prototypes of their ideas',
                'Team projects in software, web, and mobile development, group assignments for many others']
          }
        },
      ]
    },{
        uuid: uuidv4(),
        name: 'Projects',
        content: [
          {
            type: "entry",
          content: {
            name: '"Karm Well Health"',
            desc: 'React.js Web application',
            time: '',
            summ: ['Early version of site hosted on https://karmawellhealth.ca/', 
            'Functional company site that allows practitioners and patrons to connect, book appointments, as well as create/appoint/join custom sessions and bundles',
            'Connect with third-party APIs for better user experience',
            'Work with startup business owner and teammates meeting for the first time',
            'Follow a strict schedule in five weeks to finish development, with team meetings 	every day, client and instructor meetings every week']
          }},{
            type: "entry",
          content: {
            name: '“QiQuac Mobile”',
            desc: 'Team Industry project, Flutter Mobile application',
            time: '',
            summ: ['Mobile application assisting in the existing Qiquac hydro measurement equipment from the same company',
            'App that records data inputted from a bluetooth device, graphs it, allows for manipulation and calculations, then uploads it to company site',
            'Work with business owner and teammates meeting for the first time',
            'Juggle the project with ongoing courses throughout a semester']
          }},{
            type: "entry",
          content: {
            name: '“Resume Creator”',
            desc: 'Personal Project, React.js Web application',
            time: '',
            summ: ['Handle forms that allow users to build, edit, and share custom resumes',
            'Data storage from Google’s Realtime Database']
          }},{
            type: "entry",
          content: {
            name: '“BanterBar”',
            desc: 'Team Academic Project, Web application',
            time: '',
            summ: ['Web application capable of creating and joining rooms, adding and inviting friends, and starting video calls or chat using WebRTC ',
            'Authentication handled by Google’s FireStore',
            'Functioning web minigame and leaderboard',
            'Followed a scrum framework to assign tasks and deadlines for every feature']
          }},{
            type: "entry",
          content: {
            name: '“PHAN”',
            desc: 'Team Academic Project, Web application',
            time: '',
            summ: ['Web application that records time spent on apps in Javascript',
            'Followed a scrum framework to assign tasks and deadlines for every feature ']
          }},{
            type: "entry",
          content: {
            name: '“3D Chess”',
            desc: 'Academic Project, Java application',
            time: '',
            summ: ['Java application of a 3D chess game',
            'Simple gameplay loop with UI handled by JavaFX']
          }},{
            type: "entry",
          content: {
            name: '“Game of Life”',
            desc: 'Academic Project, C++ application',
            time: '',
            summ: ['C++ application of a 3D chess game',
            ' Customizable parameters to the game for different rulesets']
          }}
        ]
    }];
    const mediaQuery = window.matchMedia('(max-width: 768px)');
    mediaQuery.addEventListener("change", (e)=>{handleScreenChange(e)});
    handleScreenChange(mediaQuery);
    if(!!resumeId){
      onValue(ref(db, '/Resumes/'+resumeId), (snapshot) => {
        const resume = snapshot.val();
        if(!resume){
          setPages(staticPage);
        }else{
          setPages(resume);
          setPage(resume[0].uuid);
        }
      }, {
        onlyOnce: true
      });
    }else{
      setPages(staticPage);
      setPage(staticPage[0].uuid);
    }
}, [resumeId]);

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
        {mobile?
        <Accordion className='Accordion'>
          <Accordion.Item eventKey="0">
            <Accordion.Header>
            Menu
            </Accordion.Header>
            <Accordion.Body>
            <Sidebar mobile={mobile} pages={pages} selected={page} setPage={setPage}/> 
            </Accordion.Body>
          </Accordion.Item></Accordion>:
          <Sidebar mobile={mobile} pages={pages} selected={page} setPage={setPage}/>}
        {getProcessedPage(page)}
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/:resumeId" element={<Home />} />
        <Route path='/Create' element={<CreateResume/>}/>
        <Route path='/Create/:editCode' element={<CreateResume/>}/>
      </Routes>
    </Router>
  );
}

export default App;
