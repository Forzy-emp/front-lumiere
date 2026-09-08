import { Navigate, useParams } from 'react-router-dom';

export default function RegisterNewInvoice() {
  const { id } = useParams();
  return <Navigate to={id ? `/dashboard/usina/info/${id}` : '/dashboard/usina'} replace />;
}
