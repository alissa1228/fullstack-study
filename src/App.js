import React, { useEffect, useState, useReducer } from "react";
import "./App.css";
import {List, Input, Button} from 'antd';
import "antd/dist/antd.min.css";
import {listNotes} from './graphql/queries';
import {
  createNote as CreateNote, 
  deleteNote as DeleteNote,
  updateNote as UpdateNote
}from './graphql/mutations';
import "@aws-amplify/ui-react/styles.css";

//AppSync 엔드포인트와 통신하기 위해 사용할 GraphQL 클라이언트. fetch, axios와 유사.
import { API } from "aws-amplify";

//클라이언트에 대한 고유한 식별자 만들기(서브스크립션 구현시 클라이언트 식별에 필요.)
import {v4 as uuid} from 'uuid';
const CLIENT_ID = uuid();
  /*
  - 애플리케이션 초기 상태 저장 변수. 여러 상태 저장, 사용을 위해 useReducer 사용.
  - useReducer는 함수타입의 (state, action) => newState와 initialState를 인자로 받음. 
  - useReducer Hook 호출 -> 애플리케이션의 상태  / 애플리케이션 상태를 업데이트할 수 있는 dispatch 함수
  */

  const initialState = {
    note : [], // 노트 리스트
    loading: true, 
    error : false,
    form : {name: '', description : ''} //노트 속성들
  }

  /*
  함수 추가
  1. 로컬 상태에 새 노트 추가
  2. form을 지워서 초기화
  3. 사용자가 입력할 때 form 상태 변경
  */
  const reducer = (state, action) => {
   // console.log(state, action)
    switch(action.type) {
      case 'SET_NOTES' :
        return {...state, notes: action.notes , loading: false}
      case 'ERROR':
        return {...state, loading: false, error: true}
      case 'ADD_NOTE' :
        return {...state, notes: [action.note, ...state.notes]}
      case 'RESET_FORM' :
        return {...state, form : initialState.form}
      case 'SET_INPUT' :
        return {...state, form: {...state.form, [action.name]: action.value}}
      default:
        return state
    }
  }

const App = () => {


  //useReducer 사용
  const [state, dispatch] = useReducer(reducer, initialState);

  const createNote = async() => {
    const {form } = state;
    if(!form.name || !form.description) {
     alert('plase enter the name and description')
    }

    //API 호출이 성공하기 전에 로컬의 상태 수정. = optimistic response
    //사용자가 새 노트를 추가하는 즉시 UI가 빠르게 업데이트. API 호출에 실패하면 catch 블록에서 기능 구현해 사용자에게 오류를 알릴 수 있음. 
   
    /*optimistic response : 서버에서 응답을 받기 전에 응답 결과를 예상해 뮤테이션과 결과에 반영하고 
    서버로부터 실제 응답을 받으면 낙관적으로 예쌍한 결과는 버리고 실제 값을 사용. 사용자에게 애플리케이션이 더 빠르게 반응하는 경험 제공.
    */

    const note = {...form, clientId : CLIENT_ID, completed: false, id: uuid()}
    dispatch({type:'ADD_NOTE', note})
    dispatch({type:'RESET_FORM'})


    try {
      await API.graphql({
        query: CreateNote,
        variables: {input: note}
      })
    }
    catch(err) {
      console.log('error', err);
    }

  }

  const deleteNote = async({id}) => {
    //노트의 인덱스를 찾아 삭제된 노트를 제외한 노트 리스트 만듦.
    const index = state.notes.findIndex(item => item.id === id);
    const notes = [
      ...state.notes.slice(0, index),
      ...state.notes.slice(index +1)
    ]
    //새 노트를 전달해 로컬 상태 업데이트
    dispatch({type: 'SET_NOTES', notes})
    try {
      await API.graphql({
        query: DeleteNote,
        variables: {input: {id}}
      })
    }
    catch(err) {
      console.log('error:', err);
    }
  }

  const updateNote = async(note) => {
    //선택된 노트의 인덱트 찾기 -> 노트 리스트의 복사본 만듦
    const index = state.notes.findIndex(item => item.id === note.id);
    const notes = [...state.notes];

    //노트 리스트 복사본에서 선택한 노트의 completed 값을 현재 값의 반대값으로 수정
    //해당 수정 내용이 반영된 노트 리스트를 로컬에 반영 -> API 호출 후 반영.
    notes[index].completed = !note.completed;
    dispatch({type:'SET_NOTES', notes});
    try{
      await API.graphql({
        query:UpdateNote,
        variables: {input: {id:note.id, completed: notes[index].completed}}
      })
    }
    catch(err) {
      console.log('error:', err);
    }

  }

  const onChange = (e) => {
    dispatch({type:'SET_INPUT', name: e.target.name, value: e.target.value})
  }
  
  //fetch note 리스트
  const FetchNotes = async() => {
    try {
      const notesData = await API.graphql({
        query: listNotes
      })
      dispatch({type: 'SET_NOTES', notes:notesData.data.listNotes.items})
    }
    catch(err) {
      console.log('error:',err);
      dispatch({type: 'ERROR'})
    }
  }
  
  const renderItem = (item) => {
    return(
      <List.Item 
      style={styles.item}
      actions={[
      <p style={styles.p} onClick={()=> deleteNote(item)}>Delete</p>,
      <p style={styles.p} onClick={()=> updateNote(item)}>{item.completed ? 'completed': 'mark completed'}</p>
    ]}
      >
        <List.Item.Meta
        title={item.name}
        description={item.description}
        />
      </List.Item>
    )
  
    }

  useEffect(()=>{
    FetchNotes();
  },[])

 

  return (
    <div style={styles.container}>
      <Input
      onChange={onChange}
      value={state.form.name}
      placeholder='Note name'
      name='name'
      style={styles.input}
      />
      <Input
      onChange={onChange}
      value={state.form.description}
      placeholder='Note description'
      name='description'
      style={styles.input}
      />
    <Button
      onClick={createNote}
      type='primary'
    >Create Note</Button>
     <List
     loading={state.loading}
     dataSource={state.notes}
     renderItem={renderItem}
     />

    </div>
  );
};



export default App;

const styles =  {
  container :  {padding : 20},
  input : {marginBottom : 10},
  item: {textAlign: 'left'},
  p: {color : '#1890ff', cursor:'pointer'}
}