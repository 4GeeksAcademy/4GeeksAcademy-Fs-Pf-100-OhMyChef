import React from "react";
import { Modal } from "react-bootstrap";
import { ProveedorForm } from "../shared/ProveedorForm";

export const ProveedorModal = ({ show, onHide, onSuccess }) => {
  return (
    <Modal show={show} onHide={onHide} backdrop="static" centered>
      <Modal.Header closeButton>
        <Modal.Title>Nuevo proveedor</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <ProveedorForm onSuccess={onSuccess} onCancel={onHide} />
      </Modal.Body>
    </Modal>
  );
};