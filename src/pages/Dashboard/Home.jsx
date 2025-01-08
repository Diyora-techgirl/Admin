import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { MdIncompleteCircle, MdOutlineManageHistory } from 'react-icons/md';
import { HiViewGridAdd } from 'react-icons/hi';
import { useAuth } from '../../context/AuthContext';

const Home = () => {
  const { logout } = useAuth();

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="bg-gray-800 text-white w-64 p-6 flex flex-col">
        <div className="text-2xl font-bold mb-8">Dashboard</div>
        <nav className="flex flex-col space-y-4">
          <Link to="/dashboard/category" className="flex items-center space-x-2 text-lg hover:bg-gray-700 p-2 rounded">
            <MdIncompleteCircle size={24} />
            <span>Category</span>
          </Link>
          <Link to="/dashboard/product" className="flex items-center space-x-2 text-lg hover:bg-gray-700 p-2 rounded">
            <HiViewGridAdd size={24} />
            <span>Product</span>
          </Link>
          <Link to="/manage" className="flex items-center space-x-2 text-lg hover:bg-gray-700 p-2 rounded">
            <MdOutlineManageHistory size={24} />
            <span>Manage</span>
          </Link>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-gray-100">
        {/* Header */}
        <header className="bg-white shadow-md p-4">
          <div className="flex justify-between items-center">
            <div className="text-xl font-semibold">Welcome to the Dashboard</div>
            <div className="flex items-center space-x-4">
              <button className="bg-blue-500 text-white px-4 py-2 rounded">Profile</button>
              <button onClick={() => logout()} className="bg-red-500 text-white px-4 py-2 rounded">Logout</button>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="p-6">
          {/* The content will change based on the selected route */}
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Home;
