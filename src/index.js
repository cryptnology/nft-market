import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import App from './App';
import store from './redux/store';
import './index.css';
// import 'bootstrap/dist/css/bootstrap.css';
// import './styles/reset.css';
// import './styles/theme.css';

ReactDOM.render(
  <Provider store={store}>
    <Router>
      <App />
    </Router>
  </Provider>,
  document.getElementById('root')
);
