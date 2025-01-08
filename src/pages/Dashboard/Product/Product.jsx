import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { HiViewGridAdd } from 'react-icons/hi';
import { useAuth } from '../../../context/AuthContext';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]); 
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { authState } = useAuth();
  const token = authState.token;
  const admin_id = authState.admin_id;
  const navigate = useNavigate(); 

  // Fetch products with pagination
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get('https://homeworkdashboardbackend.vercel.app/dashboard/products', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          params: {
            admin_id: admin_id,
            page: currentPage,
            limit: 10,
          }
        });

        setProducts(response.data.products);
        setTotalPages(response.data.totalPages);
      } catch (error) {
        setError('Error fetching products');
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await axios.get('https://homeworkdashboardbackend.vercel.app/dashboard/category/all', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          params: {
            admin_id: admin_id  
          }
        });

        setCategories(response.data); 
      } catch (error) {
        setError('Error fetching categories');
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories(); 
    fetchProducts();
  }, [currentPage, token]);

  
  const handleCategoryChange = async (event) => {
    const selectedCategory = event.target.value;
    console.log('Selected category ID:', selectedCategory);
    console.log(token);
    try {
      
      setLoading(true);
      setError(null);
      const response = await axios.get('https://homeworkdashboardbackend.vercel.app/dashboard/products/by-category', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        params: {
          admin_id: admin_id,
          category_id: selectedCategory, 
          page: currentPage,
          limit: 10,
        },
      });

      setProducts(response.data.products);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      setError('Error fetching products by category');
      console.error('Error fetching products by category:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle page change
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Handle product deletion
  const handleDelete = async (productId) => {
    try {
      await axios.delete(`https://homeworkdashboardbackend.vercel.app/dashboard/product/delete/${productId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      setProducts(products.filter(product => product._id !== productId));
    } catch (error) {
      setError('Error deleting product');
      console.error('Error deleting product:', error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-semibold mb-4">Product Dashboard</h1>
      
      {error && <p className="text-red-500">{error}</p>}

      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <Link to="/dashboard/product/create" className="flex items-center space-x-2 text-lg hover:bg-gray-700 p-2 rounded">
            <HiViewGridAdd size={24} />
            <span>Create Product</span>
          </Link>

          {/* Category Dropdown */}
          <div className="my-4">
            <select className="p-2 border rounded" onChange={handleCategoryChange}>
              <option value="">All Categories</option>
              {categories.length > 0 ? (
                categories.map(category => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))
              ) : (
                <option>No categories available</option>
              )}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.length > 0 ? (
              products.map((product) => (
                <div key={product._id} className="border p-4 rounded shadow-lg">
                  <h2 className="font-bold text-lg">{product.name}</h2>
                  <p className="text-gray-700">{product.description}</p>
                  <p className="text-gray-500">Price: ${product.price}</p>
                  <p className="text-gray-500">Category: {product.category?.name}</p> {/* Display category name */}
                  <p className="text-gray-500">Color: {product.color}</p>

                  {/* Edit and Delete Buttons */}
                  <div className="mt-2">
                    <button
                      onClick={() => navigate(`/dashboard/product/edit/${product._id}`)} 
                      className="px-4 py-2 bg-yellow-500 text-white rounded mr-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(product._id)}
                      className="px-4 py-2 bg-red-500 text-white rounded"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p>No products available</p>
            )}
          </div>

          {/* Pagination */}
          <div className="flex justify-between items-center mt-4">
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <span className="text-lg">{currentPage} / {totalPages}</span>
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ProductList;
