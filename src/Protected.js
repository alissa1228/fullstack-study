//보호된 경로를 생성. 사용자라 로그인하면 이 경로를 볼 수 있게.(로그인 X 리다이렉션)

import React, {useEffect} from 'react';
import { Auth } from 'aws-amplify';
import Container from './Container';

const Protected = (props) => {
    useEffect(()=>{
        //사용자 로그인 여부 확인. 아래 API 호출이 실패하면 로그인 되어 있지 않다는 의미라 리다이렉션
        Auth.currentAuthenticatedUser().catch(()=>{
            props.history.push('/profile');
        })
    },[]);

    return(
        <Container>
            <h1>Protected route</h1>
        </Container>
    )
}

export default Protected;