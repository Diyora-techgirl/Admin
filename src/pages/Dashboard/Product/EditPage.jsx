import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom'; 
import { useAuth } from '../../../context/AuthContext';

const EditProduct = () => {
  const { productId } = useParams();
  console.log('Product ID:', productId);
  const { authState } = useAuth();
  const token = authState.token;
  const navigate = useNavigate(); 

  const [product, setProduct] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    color: '',
  });

  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`https://homeworkdashboardbackend.vercel.app/dashboard/product/${productId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        setProduct(response.data);
      } catch (error) {
        console.error('Error fetching product:', error);
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
            admin_id: authState.admin_id,
          },
        });
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchProduct();
    fetchCategories();
  }, [productId, token]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.put(`https://homeworkdashboardbackend.vercel.app/dashboard/product/edit/${productId}`, product, {
        headers: {
          "Authorization": `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      navigate('/dashboard/product');
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-semibold mb-4">Edit Product</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-lg">Name</label>
          <input
            type="text"
            value={product.name}
            onChange={(e) => setProduct({ ...product, name: e.target.value })}
            className="w-full p-2 border"
          />
        </div>
        <div className="mb-4">
          <label className="block text-lg">Description</label>
          <textarea
            value={product.description}
            onChange={(e) => setProduct({ ...product, description: e.target.value })}
            className="w-full p-2 border"
          />
        </div>
        <div className="mb-4">
          <label className="block text-lg">Price</label>
          <input
            type="number"
            value={product.price}
            onChange={(e) => setProduct({ ...product, price: e.target.value })}
            className="w-full p-2 border"
          />
        </div>
        <div className="mb-4">
          <label className="block text-lg">Category</label>
          <select
            value={product.category}
            onChange={(e) => setProduct({ ...product, category: e.target.value })}
            className="w-full p-2 border"
          >
            <option value="">Select Category</option>
            {categories.length > 0 ? (
              categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))
            ) : (
              <option>No categories available</option>
            )}
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-lg">Color</label>
          <input
            type="text"
            value={product.color}
            onChange={(e) => setProduct({ ...product, color: e.target.value })}
            className="w-full p-2 border"
          />
        </div>
        <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">Update Product</button>
      </form>
    </div>
  );
};

export default EditProduct;
