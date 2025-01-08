import { Outlet } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';

function App() {
  return (
    <AuthProvider>
      <main className='max-w-screen-2xl mx-auto  font-primary'>
        <Outlet />
      </main>
    </AuthProvider>
  );
}

export default App;