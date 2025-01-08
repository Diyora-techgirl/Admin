import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../../context/AuthContext';

const CategoryPage = () => {
  const [categories, setCategories] = useState([]);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [editCategoryId, setEditCategoryId] = useState(null);
  const [editCategoryName, setEditCategoryName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { authState } = useAuth();
  const token = authState.token;
  const admin_id = authState.admin_id;



  useEffect(() => {
    const fetchCategories = async () => {
      if (!token) {
        alert('Authentication token is missing.');
        return;
      }

      try {
        setIsLoading(true);
        const response = await axios.get('https://homeworkdashboardbackend.vercel.app/dashboard/category/all', {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          params: {
            admin_id: admin_id,
            page: page,
            limit: 10, 
          },
        });
        setCategories(response.data.categories);
        setTotalPages(response.data.totalPages);
        setError(null); 
      } catch (err) {
        console.error('Error fetching categories:', err);
        setError('Failed to load categories.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, [token, page]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  const handleCreateCategory = async (e) => {
    e.preventDefault();
    if (!token) {
      alert('Authentication token is missing.');
      return;
    }

    if (!newCategoryName.trim()) {
      alert('Category name is required');
      return;
    }

    const isDuplicate = categories.some(
      (cat) => cat.name.toLowerCase() === newCategoryName.toLowerCase()
    );
    if (isDuplicate) {
      alert('Category with this name already exists.');
      return;
    }

    try {
      setIsLoading(true);
      const response = await axios.post(
        'https://homeworkdashboardbackend.vercel.app/dashboard/category/create',
        { name: newCategoryName, admin_id: admin_id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      setCategories([...categories, response.data.category]);
      setNewCategoryName('');
      alert('Category created successfully!');
    } catch (error) {
      console.error('Error creating category:', error);
      if (error.response?.data?.error) {
        alert(error.response.data.error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 bg-gray-100 ">
      <h2 className="text-2xl font-bold text-gray-700 mb-6">Category Management</h2>

      {error && <div className="text-red-500 mb-4">{error}</div>}

      {/* Category Creation Form */}
      <form onSubmit={handleCreateCategory} className="mb-8 flex gap-4 items-center">
        <input
          type="text"
          value={newCategoryName}
          onChange={(e) => setNewCategoryName(e.target.value)}
          placeholder="Enter new category"
          className="p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          type="submit"
          disabled={isLoading}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-600 transition"
        >
          {isLoading ? 'Creating...' : 'Create Category'}
        </button>
      </form>

      {/* Categories Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-4 text-gray-600 font-medium">Name</th>
              <th className="p-4 text-gray-600 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => (
              <tr key={category._id} className="border-t">
                <td className="p-4">
                  {editCategoryId === category._id ? (
                    <input
                      type="text"
                      value={editCategoryName}
                      onChange={(e) => setEditCategoryName(e.target.value)}
                      className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                  ) : (
                    <span className="text-gray-800">{category.name}</span>
                  )}
                </td>
                <td className="p-4 space-x-2">
                  {editCategoryId === category._id ? (
                    <>
                      <button
                        onClick={handleEditCategory}
                        className="bg-green-500 text-white px-3 py-1 rounded-lg shadow hover:bg-green-600 transition"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => {
                          setEditCategoryId(null);
                          setEditCategoryName('');
                        }}
                        className="bg-gray-500 text-white px-3 py-1 rounded-lg shadow hover:bg-gray-600 transition"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => {
                          setEditCategoryId(category._id);
                          setEditCategoryName(category.name);
                        }}
                        className="bg-yellow-500 text-white px-3 py-1 rounded-lg shadow hover:bg-yellow-600 transition"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteCategory(category._id)}
                        className="bg-red-500 text-white px-3 py-1 rounded-lg shadow hover:bg-red-600 transition"
                      >
                        Delete
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-center mt-6">
        <button
          onClick={() => handlePageChange(page - 1)}
          disabled={page === 1}
          className="bg-gray-500 text-white px-4 py-2 rounded-lg shadow hover:bg-gray-600 transition"
        >
          Previous
        </button>
        <span className="mx-4 text-gray-700">
          Page {page} of {totalPages}
        </span>
        <button
          onClick={() => handlePageChange(page + 1)}
          disabled={page === totalPages}
          className="bg-gray-500 text-white px-4 py-2 rounded-lg shadow hover:bg-gray-600 transition"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default CategoryPage;
