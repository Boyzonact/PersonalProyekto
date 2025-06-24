import { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [menu, setMenu] = useState([]);
  const [form, setForm] = useState({ name: '', price: '' });
  const [editId, setEditId] = useState(null);

  const fetchMenu = async () => {
    const res = await axios.get('http://localhost:8081/menu');
    setMenu(res.data);
  };

  useEffect(() => {
    fetchMenu();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editId) {
      await axios.put(`http://localhost:8081/menu/${editId}`, form);
      setEditId(null);
    } else {
      await axios.post('http://localhost:8081/menu', form);
    }
    setForm({ name: '', price: '' });
    fetchMenu();
  };

  const handleEdit = (item) => {
    setForm({ name: item.name, price: item.price });
    setEditId(item.id);
  };

  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:8081/menu/${id}`);
    fetchMenu();
  };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '2rem' }}>
      <h1 style={{ textAlign: 'center', fontSize: '2rem', marginBottom: '1rem' }}>🍔 Restaurant Menu Manager</h1>

      {/* Form */}
      <form onSubmit={handleSubmit}>
  <div style={{
    display: 'flex',
    gap: '10px',
    marginBottom: '2rem',
    justifyContent: 'center'
  }}>
    <input
      type="text"
      name="name"
      placeholder="Dish Name"
      value={form.name}
      onChange={handleChange}
      required
      style={{ flex: '2', padding: '10px', fontSize: '1rem' }}
    />
    <input
      type="number"
      step="0.01"
      name="price"
      placeholder="Price"
      value={form.price}
      onChange={handleChange}
      required
      style={{ flex: '1', padding: '10px', fontSize: '1rem' }}
    />
    <button
      type="submit"
      style={{
        flex: 'none',
        padding: '10px 20px',
        fontSize: '1rem',
        backgroundColor: '#4CAF50',
        color: 'white',
        border: 'none',
        cursor: 'pointer',
        whiteSpace: 'nowrap'
      }}
    >
      {editId ? 'Update' : 'Add'} Item
    </button>
  </div>
</form>


      {/* Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
        gap: '1.5rem'
      }}>
        {menu.map(item => (
          <div key={item.id} style={{
            border: '1px solid #ddd',
            padding: '1.5rem',
            borderRadius: '12px',
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
            textAlign: 'center',
            transition: 'transform 0.2s'
          }}>
            <h2 style={{ marginBottom: '0.5rem' }}>{item.name}</h2>
            <p style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>₱{item.price}</p>
            <button onClick={() => handleEdit(item)} style={{ marginRight: '0.5rem', padding: '8px 12px' }}>Edit</button>
            <button onClick={() => handleDelete(item.id)} style={{ padding: '8px 12px', backgroundColor: 'red', color: 'white' }}>Delete</button>
          </div>
        ))}
      </div>

    </div>
  );
}

export default App;
