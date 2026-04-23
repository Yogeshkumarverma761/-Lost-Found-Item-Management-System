import React, { useState, useEffect, useContext } from 'react';
import API from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import { Search, Plus, Trash2, Edit } from 'lucide-react';

const Dashboard = () => {
    const [items, setItems] = useState([]);
    const [search, setSearch] = useState('');
    const [showAddForm, setShowAddForm] = useState(false);
    const [newItem, setNewItem] = useState({
        itemName: '', description: '', type: 'Lost', location: '', contactInfo: ''
    });
    const { user } = useContext(AuthContext);

    useEffect(() => {
        fetchItems();
    }, []);

    const fetchItems = async () => {
        try {
            const { data } = await API.get('/items');
            setItems(data);
        } catch (err) {
            console.error('Error fetching items');
        }
    };

    const handleSearch = async (e) => {
        setSearch(e.target.value);
        if (e.target.value.length > 2) {
            const { data } = await API.get(`/items/search?name=${e.target.value}`);
            setItems(data);
        } else if (e.target.value === '') {
            fetchItems();
        }
    };

    const handleAddItem = async (e) => {
        e.preventDefault();
        try {
            await API.post('/items', newItem);
            setShowAddForm(false);
            setNewItem({ itemName: '', description: '', type: 'Lost', location: '', contactInfo: '' });
            fetchItems();
        } catch (err) {
            console.error('Error adding item');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this entry?')) {
            try {
                await API.delete(`/items/${id}`);
                fetchItems();
            } catch (err) {
                alert('Unauthorized or error deleting item');
            }
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <div className="search-container">
                <div className="search-bar" style={{ flex: 1 }}>
                    <Search className="search-icon" size={20} />
                    <input 
                        type="text" 
                        placeholder="Search items by name..." 
                        value={search}
                        onChange={handleSearch}
                    />
                </div>
                <button 
                    className="btn-primary" 
                    style={{ marginLeft: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}
                    onClick={() => setShowAddForm(!showAddForm)}
                >
                    <Plus size={20} /> {showAddForm ? 'Close' : 'Report Item'}
                </button>
            </div>

            {showAddForm && (
                <div className="glass-card" style={{ maxWidth: '600px', margin: '0 auto 40px', padding: '30px' }}>
                    <h3>Report an Item</h3>
                    <form onSubmit={handleAddItem} style={{ marginTop: '20px' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                            <input placeholder="Item Name" value={newItem.itemName} onChange={(e) => setNewItem({...newItem, itemName: e.target.value})} required />
                            <select value={newItem.type} onChange={(e) => setNewItem({...newItem, type: e.target.value})}>
                                <option value="Lost">Lost</option>
                                <option value="Found">Found</option>
                            </select>
                        </div>
                        <input placeholder="Location (e.g. Library, Cafe)" value={newItem.location} onChange={(e) => setNewItem({...newItem, location: e.target.value})} required />
                        <textarea placeholder="Detailed Description" rows="3" value={newItem.description} onChange={(e) => setNewItem({...newItem, description: e.target.value})} required />
                        <input placeholder="Contact Info (e.g. Phone or Email)" value={newItem.contactInfo} onChange={(e) => setNewItem({...newItem, contactInfo: e.target.value})} required />
                        <button type="submit" className="btn-primary" style={{ width: '100%' }}>Submit Report</button>
                    </form>
                </div>
            )}

            <div className="dashboard-grid">
                {items.map((item) => (
                    <div key={item._id} className="glass-card item-card">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                            <span className={`item-badge badge-${item.type.toLowerCase()}`}>{item.type}</span>
                            {user && user._id === item.userId && (
                                <button onClick={() => handleDelete(item._id)} style={{ background: 'none', color: '#f87171' }}>
                                    <Trash2 size={18} />
                                </button>
                            )}
                        </div>
                        <h3 style={{ marginTop: '10px' }}>{item.itemName}</h3>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{item.description}</p>
                        <div style={{ marginTop: 'auto', paddingTop: '15px', fontSize: '0.85rem' }}>
                            <p>📍 <strong>{item.location}</strong></p>
                            <p>📞 <strong>{item.contactInfo}</strong></p>
                            <p style={{ marginTop: '5px', opacity: 0.6 }}>{new Date(item.date).toLocaleDateString()}</p>
                        </div>
                    </div>
                ))}
            </div>
            {items.length === 0 && (
                <div style={{ textAlign: 'center', marginTop: '100px', color: var(--text-muted) }}>
                    <p>No items reported yet. Be the first to report!</p>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
