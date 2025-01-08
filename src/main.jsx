import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'bootstrap/dist/css/bootstrap.min.css'
import './index.css';
import router from './Routes/routers.jsx'
import { RouterProvider } from 'react-router-dom'



createRoot(document.getElementById('root')).render(
  <RouterProvider router={router} />
)
