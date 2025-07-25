// import React from 'react';
// import ReactDOM from 'react-dom/client';
// import App from './App';
// import { Provider } from 'react-redux';
// import store  from './store';
// import { BrowserRouter } from 'react-router-dom';
// import './index.css';
// // Removed react-resizable CSS and custom style

// import { HTML5Backend } from 'react-dnd-html5-backend';
// import { DndProvider } from 'react-dnd';

// ReactDOM.createRoot(document.getElementById('root')).render(
// <React.StrictMode>
//   <Provider store={store}>
//     <BrowserRouter
//       future={{
//         v7_startTransition: true,
//         v7_relativeSplatPath: true,
//       }}
//     >
//       <DndProvider backend={HTML5Backend}>
//         <App />
//       </DndProvider>
//     </BrowserRouter>
//   </Provider>
// </React.StrictMode>
// );
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { Provider } from 'react-redux';
import store from './store';
import { BrowserRouter } from 'react-router-dom';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { StoreProvider } from './context/StoreContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <DndProvider backend={HTML5Backend}>
          <StoreProvider>
            <App />
            <ToastContainer position="top-right" autoClose={3000} />
          </StoreProvider>
        </DndProvider>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
