import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchUsers } from '../../redux/slices/adminSlice';

export default function AdminPanel() {
  const dispatch = useDispatch();
  const { isAdmin } = useSelector((state) => state.auth);
  const { users, loading } = useSelector((state) => state.admin);

  useEffect(() => {
    if (isAdmin) {
      dispatch(fetchUsers());
    }
  }, [dispatch, isAdmin]);

  if (!isAdmin) return <div>Access denied</div>;
  if (loading) return <div>Loading...</div>;

  return <div>...</div>;
}
