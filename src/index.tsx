import React, { Component } from 'react';
import ReactDOM from 'react-dom/client';
import './style.css';
import App from './App';

export default class RootComponent extends Component {
  render() {
    return (
      <App/>
    )
  }
};

const root = ReactDOM.createRoot(document.getElementById('root') as Element);

root.render(<RootComponent />);