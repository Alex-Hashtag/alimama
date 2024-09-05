import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { Item } from '../../types.tsx';

interface ItemModalProps {
  show: boolean;
  onHide: () => void;
  onSave: (item: Partial<Item>) => void;
}

const ItemModal: React.FC<ItemModalProps> = ({ show, onHide, onSave }) => {
  const [newItem, setNewItem] = useState<Partial<Item>>({
    productName: '',
    numInStock: 0,
    price: 0,
    tags: [],
    ratingAvgTotal: 0,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewItem({ ...newItem, [name]: value });
  };

  const handleSave = () => {
    onSave(newItem);
    setNewItem({
      productName: '',
      numInStock: 0,
      price: 0,
      tags: [],
      ratingAvgTotal: 0,
    });
    onHide();
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Create New Item</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="productName">
            <Form.Label>Product Name</Form.Label>
            <Form.Control
              type="text"
              name="productName"
              value={newItem.productName || ''}
              onChange={handleInputChange}
            />
          </Form.Group>

          <Form.Group controlId="numInStock">
            <Form.Label>Number in Stock</Form.Label>
            <Form.Control
              type="number"
              name="numInStock"
              value={newItem.numInStock || 0}
              onChange={handleInputChange}
            />
          </Form.Group>

          <Form.Group controlId="price">
            <Form.Label>Price (TRY)</Form.Label>
            <Form.Control
              type="number"
              name="price"
              value={newItem.price || 0}
              onChange={handleInputChange}
            />
          </Form.Group>

          <Form.Group controlId="pictures">
            <Form.Label>Upload Pictures (Max 3)</Form.Label>
            <Form.Control type="file" name="pictures" multiple />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
        <Button variant="primary" onClick={handleSave}>
          Save Item
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ItemModal;
