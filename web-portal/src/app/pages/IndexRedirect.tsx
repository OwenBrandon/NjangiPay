import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../contexts/AuthContext';

export default function IndexRedirect() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser) {
      switch (currentUser.role) {
        case 'super_admin':
          navigate('/super-admin', { replace: true });
          break;
        case 'tax_admin':
          navigate('/tax-admin', { replace: true });
          break;
        case 'accountant':
          navigate('/accountant', { replace: true });
          break;
        case 'auditor':
          navigate('/auditor', { replace: true });
          break;
        case 'support_staff':
          navigate('/support', { replace: true });
          break;
        case 'content_manager':
          navigate('/content', { replace: true });
          break;
        case 'taxpayer':
          navigate('/taxpayer', { replace: true });
          break;
        default:
          navigate('/login', { replace: true });
      }
    } else {
      navigate('/login', { replace: true });
    }
  }, [currentUser, navigate]);

  return null;
}
