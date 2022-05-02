import React,{ StrictMode }  from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';

import {Amplify} from 'aws-amplify';
import config from './aws-exports';

Amplify.configure(config);

ReactDOM.render(
  <StrictMode>
    <App />
  </StrictMode>,
  document.getElementById('root')
);

