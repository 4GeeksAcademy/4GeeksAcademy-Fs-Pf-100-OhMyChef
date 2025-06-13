import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../../styles/ProveedorRestauranteDetail.css';
import proveedorServices from '../../services/proveedorServices';
import { ProveedorForm } from '../../components/shared/ProveedorForm';

export const ProveedorRestauranteDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [proveedores, setProveedores] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [modalAbierto, setModalAbierto] = useState(false);
    const [proveedorEditando, setProveedorEditando] = useState(null);

    const mockRestaurantes = [
        { id: '1', name: 'RESTAURANTE # 1', city: 'Valencia', zone: 'zona 1', percentage: 27, status: 'Activo', description: 'Detalles completos del restaurante número 1 en Valencia.' },
        { id: '2', name: 'RESTAURANTE # 2', city: 'Barcelona', zone: 'zona 2', percentage: 27, status: 'Activo', description: 'Información detallada del restaurante número 2 en Barcelona.' },
        { id: '3', name: 'RESTAURANTE # 3', city: 'Valencia', zone: 'zona 2', percentage: 27, status: 'Activo', description: 'Detalles del restaurante número 3, también en Valencia.' },
        { id: '4', name: 'RESTAURANTE # 4', city: 'Valencia', zone: 'zona 3', percentage: 27, status: 'Activo', description: 'Aquí encontrarás toda la información sobre el restaurante 4.' },
    ];

    const restaurante = mockRestaurantes.find(r => r.id === id);

    const cargarProveedores = async () => {
        try {
            setLoading(true);
            const lista = await proveedorServices.getProveedores(id);
            setProveedores(lista);
        } catch (err) {
            setError('Error al cargar los proveedores.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        cargarProveedores();
    }, [id]);

    const eliminarProveedor = async (proveedorId) => {
        if (!window.confirm('¿Estás seguro de eliminar este proveedor?')) return;
        try {
            await proveedorServices.eliminarProveedor(proveedorId);
            setSuccess('Proveedor eliminado correctamente.');
            cargarProveedores();
        } catch (err) {
            setError('Error al eliminar el proveedor.');
        }
    };

    const editarProveedor = async (proveedorId) => {
        try {
            const proveedor = await proveedorServices.getProveedor(proveedorId);
            setProveedorEditando(proveedor);
            setModalAbierto(true);
        } catch (err) {
            setError('No se pudo cargar el proveedor para editar.');
        }
    };

    const cerrarModal = () => {
        setModalAbierto(false);
        setProveedorEditando(null);
        setSuccess('');
        setError('');
    };

    const handleSuccess = () => {
        cerrarModal();
        setSuccess('Proveedor actualizado correctamente.');
        cargarProveedores();
    };

    if (!restaurante) {
        return (
            <div className="detail-container">
                <h1>Restaurante no encontrado</h1>
                <button onClick={() => navigate('/admin/proveedores')} className="back-button">
                    Volver al Dashboard
                </button>
            </div>
        );
    }

    return (
        <div className="detail-container">
            <button onClick={() => navigate('/admin/proveedores')} className="back-button">
                ← Volver a Proveedores
            </button>

            <h1>Detalles de {restaurante.name}</h1>
            <p><strong>Ciudad:</strong> {restaurante.city}</p>
            <p><strong>Zona:</strong> {restaurante.zone}</p>
            <p><strong>Porcentaje:</strong> {restaurante.percentage}%</p>
            <p><strong>Estado:</strong> <span className="status-detail">{restaurante.status}</span></p>
            <p><strong>Descripción:</strong> {restaurante.description}</p>

            <hr />

            <h2>Proveedores Asociados</h2>

            {error && <div className="alert alert-danger">{error}</div>}
            {success && <div className="alert alert-success">{success}</div>}

            {loading ? (
                <p>Cargando proveedores...</p>
            ) : proveedores.length === 0 ? (
                <p>No hay proveedores registrados para este restaurante.</p>
            ) : (
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>Categoría</th>
                            <th>Teléfono</th>
                            <th>Email</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {proveedores.map((p) => (
                            <tr key={p.id}>
                                <td>{p.nombre}</td>
                                <td>{p.categoria}</td>
                                <td>{p.telefono}</td>
                                <td>{p.email}</td>
                                <td>
                                    <button
                                        className="btn btn-sm btn-outline-warning me-2"
                                        onClick={() => editarProveedor(p.id)}
                                    >
                                        Editar
                                    </button>
                                    <button
                                        className="btn btn-sm btn-outline-danger"
                                        onClick={() => eliminarProveedor(p.id)}
                                    >
                                        Eliminar
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            {modalAbierto && (
                <div className="modal d-block" style={{ backgroundColor: "#00000088" }}>
                    <div className="modal-dialog">
                        <div className="modal-content p-3">
                            <ProveedorForm
                                proveedor={proveedorEditando}
                                onSuccess={handleSuccess}
                                onCancel={cerrarModal}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
