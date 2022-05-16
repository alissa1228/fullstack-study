//내비게이션
//antd + react router 라이브러리 활용. 
//현재 경로 이름을 나타내는 current가 props로 전달. 
//current 값은 메뉴 컴포넌트의 selectedKeys 속성에전 달되어 현재 경로 강조.

import React from "react";
import { Link } from 'react-router-dom'
import {Menu} from 'antd';
import {HomeOutlined, ProfileOutlined, FileProtectOutlined} from '@ant-design/icons'
import "antd/dist/antd.min.css";

const Nav = (props) => {
    const {current} = props;

    return(
        <div>
            <Menu selectedKeys={[current]} mode='horizontal'>
                <Menu.Item key='home'>
                    <Link to='/'><HomeOutlined/> Home</Link>
                </Menu.Item>
                <Menu.Item key='profile'>
                    <Link to='/profile'><ProfileOutlined/> Profile</Link>
                </Menu.Item>
                <Menu.Item key='protected'>
                    <Link to='/protected'><FileProtectOutlined/> Protected</Link>
                </Menu.Item>
            </Menu>
        </div>

    )
}

export default Nav;