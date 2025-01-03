import store from './redux/store/store';
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';

createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <BrowserRouter>
       <App />
    </BrowserRouter>
  </Provider>
)