//로그인한 사용자에 대한 프로필 정보 렌더링. 사용자 가입과 로그인을 위한 인증 컴포넌트 추가 
//사용자가 로그인 하지 않은 경우 인증 양식 렌더링 / 로그아웃 버튼 / 사용자 정보 UI 렌더링

import Amplify from 'aws-amplify';
import React, {useEffect, useState} from 'react';
import {Auth} from 'aws-amplify';
import { withAuthenticator, AmplifySignOut } from '@aws-amplify/ui-react';
import Container from './Container';


const Profile = () => {

    const [user, setUser] = useState({});
    const CheckUser = async() =>{
        try{
            const data = await Auth.currentUserPoolUser();
            const userInfo = {usename : data.username, ...data.attributes}
            setUser(userInfo);
        }
        catch(err){
            console.log('error:', err);
        }
    }

    useEffect(()=>{
        CheckUser();
    },[])

    return(
        <Container>
            <h1>Profile</h1>
            <h2>Username : {user.username}</h2>
            <h3>Email : {user.eamil}</h3>
            <h4>Phone : {user.phone_number}</h4>
            <AmplifySignOut/>
        </Container>
    )
    
}

export default withAuthenticator(Profile);
