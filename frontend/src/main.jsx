import React, { StrictMode } from 'react';
import ReactDOM from 'react-dom/client'; 
import {
  createBrowserRouter,
  RouterProvider
} from "react-router-dom";
import './index.css';
import { AuthProvider } from './context/AuthContext';

// Routes
import Root from "./routes/root";
import Register from './routes/register';

// Router object, dictates paths for each route
const router = createBrowserRouter([
  {
    path: "/",
    element: <Root/>,
    children: [
      {
        path: "register",
        element: <Register/>
      }
    ]
  }
])


// Root of the app
ReactDOM.createRoot(document.getElementById("root")).render( 
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>
)
