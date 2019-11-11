import { reactBundle } from 'funky-react-dom/dist/ReactBundleDOM';
import App from 'funky-react/dist/mvc/App';
import React from 'react';
import ReactDOM from 'react-dom';
import './global/global.scss';
import First from './routes/First/First';

ReactDOM.render(<App bundle={reactBundle} first={First}/>, document.getElementById("root"));