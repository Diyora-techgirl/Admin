import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../../context/AuthContext';

const ProductCreate = () => {
  const { authState } = useAuth();
  const navigate = useNavigate();
  
  const [productData, setProductData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    color: '',
    admin_id: authState.admin_id,
  });
  
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const token = authState.token;

  useEffect(() => {
 
    const fetchCategories = async () => {
      try {
        const response = await axios.get('https://homeworkdashboardbackend.vercel.app/dashboard/category/all', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          params: {
            admin_id: authState.admin_id,
          },
        });
        setCategories(response.data); 
        console.log(response.data)
      } catch (error) {
        console.error('Error fetching categories:', error);
        setError('Failed to load categories.');
      }
    };
    
    fetchCategories();
  }, [token, authState.admin_id]); 

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData({
      ...productData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        'https://homeworkdashboardbackend.vercel.app/dashboard/product/create',
        productData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      console.log('Product created:', response.data);
      navigate('/dashboard/product'); 
    } catch (error) {
      console.error('Error creating product:', error);
      setError('Failed to create product. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Create New Product</h2>
      {error && <p className="text-red-500">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium">Product Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={productData.name}
            onChange={handleChange}
            required
            className="mt-1 p-2 border border-gray-300 rounded w-full"
          />
        </div>
        
        <div>
          <label htmlFor="description" className="block text-sm font-medium">Description</label>
          <textarea
            id="description"
            name="description"
            value={productData.description}
            onChange={handleChange}
            required
            className="mt-1 p-2 border border-gray-300 rounded w-full"
            rows="4"
          />
        </div>
        
        <div>
          <label htmlFor="price" className="block text-sm font-medium">Price</label>
          <input
            type="number"
            id="price"
            name="price"
            value={productData.price}
            onChange={handleChange}
            required
            className="mt-1 p-2 border border-gray-300 rounded w-full"
          />
        </div>
        
        <div>
          <label htmlFor="category" className="block text-sm font-medium">Category</label>
          <select
            id="category"
            name="category"
            value={productData.category}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md"
            required
          >
            <option value="">Select Category</option>
            {categories && categories.length > 0 ? (
              categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))
            ) : (
              <option value="">No categories available</option>
            )}
          </select>
        </div>

        <div>
          <label htmlFor="color" className="block text-sm font-medium">Color</label>
          <input
            type="text"
            id="color"
            name="color"
            value={productData.color}
            onChange={handleChange}
            required
            className="mt-1 p-2 border border-gray-300 rounded w-full"
          />
        </div>

        <div className="flex justify-between items-center">
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded"
            disabled={loading}
          >
            {loading ? 'Creating...' : 'Create Product'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/dashboard/product')}
            className="bg-gray-500 text-white px-4 py-2 rounded"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductCreate;
