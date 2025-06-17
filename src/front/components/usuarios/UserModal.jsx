import React, { useState, useEffect } from 'react';
import '../../styles/UserModal.css'; 

const UserFormModal = ({ user, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '', 
    role: 'viewer', 
    status: 'active', 
    restaurant: '', 
  });

  useEffect(() => {
    if (user) {
      setFormData(user);
    } else {
      setFormData({
        name: '',
        email: '',
        role: 'viewer',
        status: 'active',
        restaurant: '',
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.restaurant) {
      alert('Por favor, completa todos los campos requeridos: Nombre, Email y Restaurante.');
      return;
    }
    onSave(formData);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>{user ? 'Editar Usuario' : 'Añadir Nuevo Usuario'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Nombre:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email" 
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="role">Rol:</label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
            >
              <option value="admin">Admin</option>
              <option value="chef">Chef</option>
              <option value="viewer">Viewer</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="status">Estado:</label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="active">Activo</option>
              <option value="inactive">Inactivo</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="restaurant">Restaurante:</label>
            <input
              type="text"
              id="restaurant"
              name="restaurant"
              value={formData.restaurant}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="save-button">Guardar</button>
            <button type="button" className="cancel-button" onClick={onClose}>Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserFormModal;