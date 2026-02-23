import { useSelector } from 'react-redux';

export default function Header() {
  const { username, isAdmin } = useSelector((state) => state.auth);

  return (
    <div>
      <p>User: {username}</p>
      {isAdmin && <p>Admin</p>}
    </div>
  );
}
