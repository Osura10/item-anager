import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

const API_URL = "http://localhost:5001/api/items";

function App() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    category: ""
  });
  const [editingId, setEditingId] = useState(null);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const response = await axios.get(API_URL);
      setItems(response.data);
    } catch (error) {
      console.error("Error fetching items:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingId) {
        await axios.put(`${API_URL}/${editingId}`, formData);
        setEditingId(null);
      } else {
        await axios.post(API_URL, formData);
      }

      setFormData({
        name: "",
        price: "",
        category: ""
      });

      fetchItems();
    } catch (error) {
      console.error("Error saving item:", error);
      alert("Failed to save item. Check if backend is running on port 5001.");
    }
  };

  const handleEdit = (item) => {
    setFormData({
      name: item.name,
      price: item.price,
      category: item.category
    });
    setEditingId(item._id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    
    try {
      await axios.delete(`${API_URL}/${id}`);
      fetchItems();
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  return (
    <div className="container">
      <h1>Item Manager</h1>

      <form onSubmit={handleSubmit} className="form">
        <input
          type="text"
          name="name"
          placeholder="Item Name"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <input
          type="number"
          name="price"
          placeholder="Price ($)"
          value={formData.price}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="category"
          placeholder="Category"
          value={formData.category}
          onChange={handleChange}
          required
        />

        <button type="submit">
          {editingId ? "Update Item" : "Add New Item"}
        </button>
      </form>

      <div className="item-list">
        {loading ? (
          <div className="no-items">Loading items...</div>
        ) : items.length === 0 ? (
          <div className="no-items">No items found. Start by adding one above!</div>
        ) : (
          items.map((item) => (
            <div key={item._id} className="item-card">
              <h3>{item.name}</h3>
              <p><strong>Price:</strong> ${item.price}</p>
              <p><strong>Category:</strong> {item.category}</p>

              <div className="button-group">
                <button className="btn-edit" onClick={() => handleEdit(item)}>Edit</button>
                <button className="btn-delete" onClick={() => handleDelete(item._id)}>Delete</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default App;
