import React, { useState } from 'react';
import styled from 'styled-components';

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 50;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalContent = styled.div`
  position: relative;
  background-color: white;
  padding: 20px;
  width: 400px;
  max-width: 100%;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 60;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 24px;
  cursor: pointer;
  color: #999;
  &:hover {
    color: #333;
  }
`;

// Placeholder styling for inputs
const Input = styled.input`
  width: 100%;
  padding: 10px;
  margin-top: 5px;
  border: 1px solid #ccc;
  border-radius: 5px;

  /* Placeholder styles */
  &::placeholder {
    font-size: 14px; /* Set font size to 10px */
    font-style: italic; /* Set placeholder text to italics */
    color: #888; /* Light grey color for placeholder */
  }
`;

interface ModalProps {
  isOpen: boolean;
  closeModal: () => void;
}

const Modal: React.FC<ModalProps> = ({ isOpen, closeModal }) => {
  const [formData, setFormData] = useState({
    productName: '',
    frontImage: '',
    backImage: '',
    createdBy: '',
    pvcPrice: '',
    metalPrice: '',
    woodPrice: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form data submitted:', formData);
    closeModal(); // Close the modal after form submission
  };

  if (!isOpen) return null;

  return (
    <ModalOverlay>
      <ModalContent>
        <CloseButton onClick={closeModal}>&times;</CloseButton>
        <h2 className="text-2xl font-bold mb-5 text-center">Add New Product</h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium">Product Name</label>
            <Input
              type="text"
              name="productName"
              value={formData.productName}
              onChange={handleChange}
              required
              placeholder="Enter product name"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium">Front Image URL</label>
            <Input
              type="url"
              name="frontImage"
              value={formData.frontImage}
              onChange={handleChange}
              required
              placeholder="Enter front image URL"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium">Back Image URL</label>
            <Input
              type="url"
              name="backImage"
              value={formData.backImage}
              onChange={handleChange}
              required
              placeholder="Enter back image URL"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium">Created By (Admin ID)</label>
            <Input
              type="text"
              name="createdBy"
              value={formData.createdBy}
              onChange={handleChange}
              required
              placeholder="Enter Admin ID"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium">Materials</label>
            <div className="flex gap-4">
              <div className="w-1/3">
                <label className="block text-sm">PVC Price</label>
                <Input
                  type="number"
                  name="pvcPrice"
                  value={formData.pvcPrice}
                  onChange={handleChange}
                  required
                  placeholder="₱0.00"
                />
              </div>

              <div className="w-1/3">
                <label className="block text-sm">Metal Price</label>
                <Input
                  type="number"
                  name="metalPrice"
                  value={formData.metalPrice}
                  onChange={handleChange}
                  required
                  placeholder="₱0.00"
                />
              </div>

              <div className="w-1/3">
                <label className="block text-sm">Wood Price</label>
                <Input
                  type="number"
                  name="woodPrice"
                  value={formData.woodPrice}
                  onChange={handleChange}
                  required
                  placeholder="₱0.00"
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="mb-4">
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
            >
              <span className="text-lg font-bold">+</span> Add Product
            </button>
          </div>
        </form>
      </ModalContent>
    </ModalOverlay>
  );
};

export default Modal;
