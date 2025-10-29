 
import React, { useEffect, useState } from 'react';
import { Container, Card, Button, Table } from 'react-bootstrap';
import API from '../api/axios';

export default function AdminPanel(){
  const [overview, setOverview] = useState(null);
  const [users, setUsers] = useState([]);

  const loadOverview = async () => {
    const res = await API.get('/admin/overview');
    setOverview(res.data);
  };
  const loadUsers = async () => {
    const res = await API.get('/admin/users');
    setUsers(res.data);
  };

  useEffect(()=>{ loadOverview(); loadUsers(); }, []);

  const delUser = async (id) => {
    if(!window.confirm('Delete user?')) return;
    await API.delete(`/admin/users/${id}`); loadUsers(); loadOverview();
  };

  return (
    <Container>
      <h3 className="mb-3">Admin Panel</h3>
      <Card className="p-3 mb-3 shadow-sm">
        <h5>Overview</h5>
        {overview && <div>Users: {overview.usersCount} • Posts: {overview.postsCount}</div>}
      </Card>

      <Card className="p-3 shadow-sm">
        <h5>Users</h5>
        <Table striped bordered hover responsive>
          <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Action</th></tr></thead>
          <tbody>
            {users.map(u=>(
              <tr key={u._id}>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>{u.role}</td>
                <td><Button variant="danger" size="sm" onClick={()=>delUser(u._id)}>Delete</Button></td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card>
    </Container>
  );
}
