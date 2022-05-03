import React, { useEffect, useState, useReducer } from "react";
import "./App.css";
import {List} from 'antd';
import "antd/dist/antd.min.css";
import {listNotes} from './graphql/queries';
import "@aws-amplify/ui-react/styles.css";

//AppSync 엔드포인트와 통신하기 위해 사용할 GraphQL 클라이언트. fetch, axios와 유사.
import { API } from "aws-amplify";


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

  //reducer 함수
  const reducer = (state, action) => {
    switch(action.type) {
      case 'SET_NOTES' :
        return {...state, notes: action.notes , loading: false}
      case 'ERROR':
        return {...state, loading: false, error: true}
      default:
        return state
    }
  }

const App = () => {


  //useReducer 사용
  const [state, dispatch] = useReducer(reducer, initialState);
  
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
      <List.Item style={styles.item}>
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
  p: {color : '#1890ff'}
}