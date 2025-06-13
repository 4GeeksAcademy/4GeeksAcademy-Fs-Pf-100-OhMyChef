import React from "react";
import { Form, Card, Row, Col, Button } from "react-bootstrap";

const AdminVentasCalendario = ({ buttons, fromDate, toDate, selectLabel, selectOptions }) => {
    return (
        <Card className="p-3 shadow-sm border-0">
            
            <Row className="mb-3">
                <Col xs={12} md="auto" className="mb-2 mb-md-0">
                    <Button variant="light" className="border d-flex align-items-center gap-2">
                        <i className="bi bi-search"></i>
                        {buttons[0]}
                    </Button>
                </Col>
                <Col xs={12} md="auto">
                    <Button variant="light" className="border d-flex align-items-center gap-2">
                        <i className="bi bi-search"></i>
                        {buttons[1]}
                    </Button>
                </Col>
            </Row>

            <Row className="align-items-end">
                <Col xs={12} md={4} className="mb-3 mb-md-0">
                    <Form.Label>Date</Form.Label>
                    <Form.Control type="date" defaultValue={fromDate} />
                </Col>
                <Col xs={12} md={4} className="mb-3 mb-md-0">
                    <Form.Label>to</Form.Label>
                    <Form.Control type="date" defaultValue={toDate} />
                </Col>
                <Col xs={12} md={4}>
                    <Form.Label>{selectLabel}</Form.Label>
                    <Form.Select>
                        <option>{selectOptions[0]}</option>
                        <option>{selectOptions[1]}</option>
                        <option>{selectOptions[2]}</option>
                    </Form.Select>
                </Col>
            </Row>
        </Card>
    );
};

export default AdminVentasCalendario;
