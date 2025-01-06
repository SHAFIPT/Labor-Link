import store from './redux/store/store';
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import { BrowserRouter } from 'react-router-dom';
import { Provider as ReduxProvider } from "react-redux";
import { Provider as ChakraProvider } from "./components/ui/provider";


createRoot(document.getElementById('root')!).render(
  <ReduxProvider store={store}>
    <BrowserRouter>
      <ChakraProvider>
        <App />
        </ChakraProvider>
      </BrowserRouter>
  </ReduxProvider>
)
    