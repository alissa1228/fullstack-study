import React,{ StrictMode }  from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import Router from './Router';

import {Amplify} from 'aws-amplify';
import config from './aws-exports';


Amplify.configure(config);

ReactDOM.render(
  <StrictMode>
    {/* <App /> */}
    <Router/>
  </StrictMode>,
  document.getElementById('root')
);

