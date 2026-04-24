import React, { useEffect, useState } from 'react';
import API from '../services/api';
import { UserCheck, UserX, Shield, Users, Search, Filter, Trash2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const AdminPanel: React.FC = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data } = await API.get('/auth');
      setUsers(data);
    } catch (error) {
      console.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (userId: string) => {
    try {
      await API.put(`/auth/approve/${userId}`);
      setUsers(users.map(u => u._id === userId ? { ...u, isApproved: true } : u));
    } catch (error) {
      alert('Approval failed');
    }
  };

  const handleDelete = async (userId: string) => {
    if (!window.confirm('Are you sure you want to remove this user? This action cannot be undone.')) return;
    try {
      await API.delete(`/auth/${userId}`);
      setUsers(users.filter(u => u._id !== userId));
    } catch (error) {
      alert('Deletion failed');
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesFilter = filter === 'all' || user.role === filter;
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          user.email.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  if (loading) return <div className="loading">Loading User Management...</div>;

  return (
    <div className="admin-panel animate-fade">
      <header className="admin-header">
        <div className="title-section">
          <h1><Shield size={32} /> User Management</h1>
          <p>Approve new students and manage platform access.</p>
        </div>
        
        <div className="admin-actions glass-card">
          <div className="search-box">
            <Search size={18} />
            <input 
              type="text" 
              placeholder="Search by name or email..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="filter-box">
            <Filter size={18} />
            <select value={filter} onChange={(e) => setFilter(e.target.value)}>
              <option value="all">All Roles</option>
              <option value="student">Students Only</option>
              <option value="teacher">Teachers Only</option>
            </select>
          </div>
        </div>
      </header>

      <div className="user-table-container glass-card">
        <table className="user-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Role</th>
              <th>Registered On</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user._id} className="user-row">
                <td>
                  <div className="user-info">
                    <div className="user-avatar">{user.name.charAt(0)}</div>
                    <div>
                      <div className="user-name">{user.name}</div>
                      <div className="user-email">{user.email}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <span className={`role-tag ${user.role}`}>{user.role}</span>
                </td>
                <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                <td>
                  <span className={`status-tag ${user.isApproved ? 'approved' : 'pending'}`}>
                    {user.isApproved ? 'Approved' : 'Pending'}
                  </span>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    {!user.isApproved ? (
                      <button 
                        onClick={() => handleApprove(user._id)}
                        className="btn-approve"
                        title="Approve User"
                      >
                        <UserCheck size={18} /> Approve
                      </button>
                    ) : (
                      <span className="text-success"><UserCheck size={18} /> Verified</span>
                    )}
                    
                    {currentUser?.role === 'admin' && (
                      <button 
                        onClick={() => handleDelete(user._id)}
                        className="btn-delete"
                        title="Remove User"
                      >
                        <Trash2 size={18} />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredUsers.length === 0 && (
          <div className="empty-state">No users found matching your criteria.</div>
        )}
      </div>

      <style>{`
        .admin-panel { max-width: 1200px; margin: 0 auto; padding: 4rem 2rem; }
        .admin-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 3rem; gap: 2rem; flex-wrap: wrap; }
        .title-section h1 { display: flex; align-items: center; gap: 15px; font-size: 2.5rem; margin-bottom: 0.5rem; }
        .title-section p { color: var(--text-muted); }

        .admin-actions { display: flex; gap: 2rem; padding: 1.5rem 2rem; align-items: center; }
        .search-box, .filter-box { display: flex; align-items: center; gap: 10px; background: rgba(255,255,255,0.05); padding: 8px 15px; border-radius: 8px; border: 1px solid var(--glass-border); }
        .search-box input, .filter-box select { background: none; border: none; color: white; outline: none; }
        .search-box input { width: 250px; }

        .user-table-container { padding: 1rem; overflow-x: auto; }
        .user-table { width: 100%; border-collapse: collapse; text-align: left; }
        .user-table th { padding: 1.5rem; color: var(--text-muted); font-size: 0.9rem; text-transform: uppercase; border-bottom: 1px solid var(--glass-border); }
        .user-table td { padding: 1.5rem; border-bottom: 1px solid rgba(255,255,255,0.02); }
        
        .user-info { display: flex; align-items: center; gap: 15px; }
        .user-avatar { width: 40px; height: 40px; border-radius: 50%; background: var(--primary); display: flex; align-items: center; justify-content: center; font-weight: 700; color: white; }
        .user-name { font-weight: 600; font-size: 1.05rem; }
        .user-email { font-size: 0.85rem; color: var(--text-muted); }

        .role-tag { padding: 4px 10px; border-radius: 50px; font-size: 0.75rem; font-weight: 700; text-transform: uppercase; }
        .role-tag.student { background: rgba(16, 185, 129, 0.1); color: #10b981; }
        .role-tag.teacher { background: rgba(99, 102, 241, 0.1); color: var(--primary); }

        .status-tag { font-size: 0.8rem; font-weight: 600; padding: 4px 10px; border-radius: 4px; }
        .status-tag.approved { color: #10b981; }
        .status-tag.pending { color: #f59e0b; background: rgba(245, 158, 11, 0.1); }

        .btn-approve { display: flex; align-items: center; gap: 8px; background: #10b981; color: white; border: none; padding: 8px 16px; border-radius: 6px; font-weight: 600; cursor: pointer; transition: var(--transition); }
        .btn-approve:hover { background: #059669; transform: translateY(-2px); }
        .btn-delete { background: rgba(239, 68, 68, 0.1); color: #ef4444; border: 1px solid rgba(239, 68, 68, 0.2); padding: 8px; border-radius: 6px; cursor: pointer; transition: var(--transition); display: flex; align-items: center; }
        .btn-delete:hover { background: #ef4444; color: white; transform: translateY(-2px); }
        .text-success { color: #10b981; display: flex; align-items: center; gap: 8px; font-weight: 600; }

        .empty-state { text-align: center; padding: 4rem; color: var(--text-muted); }

        @media (max-width: 768px) {
          .admin-header { flex-direction: column; align-items: flex-start; }
          .admin-actions { width: 100%; flex-direction: column; }
          .search-box, .filter-box { width: 100%; }
        }
      `}</style>
    </div>
  );
};

export default AdminPanel;
