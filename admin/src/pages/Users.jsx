import { useState, useEffect } from 'react';
import axios from 'axios';
import { User as UserIcon } from 'lucide-react';

export default function Users({ token }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/admin/users', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUsers(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [token]);

  if (loading) return <div>Loading users...</div>;

  return (
    <div>
      <h1 style={{ fontFamily: 'var(--font-headings)', marginBottom: '32px' }}>User Profiles</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
        {users.map(user => (
          <div key={user._id} style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
            <div style={{ backgroundColor: 'var(--bg-primary)', padding: '16px', borderRadius: '50%', color: 'var(--accent-primary)' }}>
              <UserIcon size={32} />
            </div>
            <div>
              <h3 style={{ margin: '0 0 4px', color: 'var(--text-dark)' }}>{user.name}</h3>
              <p style={{ margin: '0 0 4px', fontSize: '14px', color: 'var(--text-muted)' }}>{user.email}</p>
              <p style={{ margin: '0 0 8px', fontSize: '14px', color: 'var(--text-muted)' }}>{user.phone}</p>
              <div style={{ fontSize: '12px', padding: '8px', backgroundColor: 'var(--bg-primary)', borderRadius: '4px' }}>
                <strong>Address:</strong><br/>
                {user.address || 'No address provided'}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
