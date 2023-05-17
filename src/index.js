/* eslint-disable no-unused-vars */
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

// 스크롤바 css
import 'simplebar/src/simplebar.css';

// third-party
import { Provider as ReduxProvider } from 'react-redux';

// 프로젝트 가져오기
import App from './App';
import { store } from 'store';
import reportWebVitals from './reportWebVitals';
// ==============================|| MAIN - REACT DOM RENDER ||============================== //

const container = document.getElementById('root');
const root = createRoot(container); // TypeScript를 사용하는 경우 createRoot(컨테이너)

root.render(
    <ReduxProvider store={store}>
        <BrowserRouter basename="/">
            <App />
        </BrowserRouter>
    </ReduxProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
