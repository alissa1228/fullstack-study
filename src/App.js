import React from 'react'
import './App.css';

import { withAuthenticator} from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css'

const App = () =>{
  return (
    <div>
      <h1>Hello World!</h1>
    </div>
  );
}

export default withAuthenticator(App);
