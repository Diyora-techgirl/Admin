import { createBrowserRouter } from 'react-router-dom';
import App from '../App';
import Admin from '../pages/adminLogin';
import Home from '../pages/Dashboard/Home';
import ProductPage from '../pages/Dashboard/Product/Product';
import CategoryPage from '../pages/Dashboard/Category/Category';
import EditProduct from '../pages/Dashboard/Product/EditPage';
import ProtectedRoute from './ProtectedRoute';
import ProductCreate from '../pages/Dashboard/Product/create';
const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: 'admin',
        element: <Admin />,
      },
      {
        path: 'dashboard',
        element: (
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        ),
        children: [
          {
            path: 'product',
            element: (
              <ProtectedRoute>
                <ProductPage />
              </ProtectedRoute>
            ),
          },
          {
            path: 'product/create',
            element: (
              <ProtectedRoute>
                <ProductCreate />
              </ProtectedRoute>
            ),
          },
          {
            path: 'product/edit/:productId',
            element: (
              <ProtectedRoute>
                <EditProduct />
              </ProtectedRoute>
            ),
          },
          {
            path: 'category',
            element: (
              <ProtectedRoute>
                <CategoryPage />
              </ProtectedRoute>
            ),
          },
        ],
      },
    ],
  },
]);

export default router;
