import { RouterProvider } from 'react-router';
import { AuthProvider } from './contexts/AuthContext';
import { MockDataProvider } from './contexts/MockDataContext';
import { router } from './routes';
import { Toaster } from 'sonner';

export default function App() {
  return (
    <AuthProvider>
      <MockDataProvider>
        <RouterProvider router={router} />
        <Toaster position="top-right" richColors />
      </MockDataProvider>
    </AuthProvider>
  );
}
