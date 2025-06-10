

import { useState } from "react";
const AdminSettingsRestaurantePestania = () => {


    const [formData, setFormData] = useState({
        companyName: "",
        businessAddress: "",
        address: "",
        phoneNumber: "",
        responsible: "Encargado",
        chef: "Nombre del chef",
    });

    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Formulario enviado:", formData);
        console.log("Imagen subida:", image);
        // Aquí podrías enviar formData + image a una API
    };

    return (
        <div className="card p-4">
            <h5 className="mb-4">Perfil de Restaurante</h5>
            <form onSubmit={handleSubmit}>
                <div className="row mb-3">
                    <div className="col-12 col-md-2 d-flex flex-column align-items-center mb-3 mb-md-0">
                        <div className="border rounded p-2 text-center mb-2 w-100 bg-light">
                            {preview ? (
                                <img src={preview} alt="Preview" className="img-fluid rounded" />
                            ) : (
                                <i className="bi bi-building" style={{ fontSize: "2rem" }}></i>
                            )}
                        </div>

                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="form-control form-control-sm"
                        />
                    </div>

                    <div className="col-12 col-md-10">
                        <div className="mb-3">
                            <label className="form-label">Company Name</label>
                            <input
                                type="text"
                                className="form-control"
                                name="companyName"
                                value={formData.companyName}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Business Address</label>
                            <textarea
                                className="form-control"
                                name="businessAddress"
                                rows="2"
                                value={formData.businessAddress}
                                onChange={handleChange}
                                required
                            ></textarea>
                        </div>

                        <div className="row">
                            <div className="col-12 col-md-6 mb-3">
                                <label className="form-label">Adress</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="col-12 col-md-6 mb-3">
                                <label className="form-label">Phone Number</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="phoneNumber"
                                    value={formData.phoneNumber}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-12 col-md-6 mb-3">
                                <label className="form-label">Responsible</label>
                                <select
                                    className="form-select"
                                    name="responsible"
                                    value={formData.responsible}
                                    onChange={handleChange}
                                >
                                    <option>Encargado</option>
                                    <option>Subencargado</option>
                                </select>
                            </div>
                            <div className="col-12 col-md-6 mb-3">
                                <label className="form-label">Chef</label>
                                <select
                                    className="form-select"
                                    name="chef"
                                    value={formData.chef}
                                    onChange={handleChange}
                                >
                                    <option>Nombre del chef</option>
                                    <option>Otro chef</option>
                                </select>
                            </div>
                        </div>

                        <div className="d-grid w-50 ms-auto">
                            <button type="submit" className="btn bg-orange text-white px-4">
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    )

}

export default AdminSettingsRestaurantePestania;