//라우터와 현재 경로 이름을 결정하는 몇 가지 로직.
//window.location.href 속성에 따라 현재 경로 이름을 설정. 
//설정된 이름을 Nav 컴포넌트에 전달되어 현재 경로를 강조하는데 사용.

//HashRouter : URL 해시 부분을 사용해 UI를 URL과 일치되도록 유지하는 라우터.
//route : 경로 기반으로 렌더링할 컴포넌트 정의.

import React, {useState, useEffect} from 'react';
import { HashRouter, Route, Routes } from 'react-router-dom';

import Nav from './Nav';
import Public from './Public';
import Profile from './Profile';
import Protected from './Protected';

const Router = () => {
    const [current, setCurrent ] = useState('home');

    useEffect(()=>{
        setRoute();
        //경로가 바뀔 때마다 setRoute 호출
        window.addEventListener('hashchange', setRoute);
        return() => window.removeEventListener('hashchange', setRoute);
    },[])

    const setRoute = () => {
        //경로 설정
        const location = window.location.href.split('/');
        const pathname = location[location.length-1];
        setCurrent(pathname ? pathname : 'home');
    }

    return(
        <HashRouter>
            <Nav current={current}>
                <Routes>
                    <Router path='/' element={<Public/>}/>
                    <Router path='/profile' element={<Profile/>}/>
                    <Router path='/protected' element={<Protected/>}/>
                </Routes>
            </Nav>
        </HashRouter>
    )

}

export default Router;