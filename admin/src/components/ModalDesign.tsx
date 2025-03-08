import React, { useState } from 'react';
import styled from 'styled-components';

// Cloudinary Upload Function
const uploadImageToCloudinary = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', 'robert');  // Add upload preset

  try {
    const response = await fetch('https://api.cloudinary.com/v1_1/ddye8veua/image/upload', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorMessage = `Failed to upload image. Status: ${response.status}`;
      console.error(errorMessage);  // Log status code and details
      throw new Error(errorMessage);
    }

    const data = await response.json();
    console.log('Cloudinary Response:', data);  // Log full response for debugging

    if (data.secure_url) {
      return data.secure_url;  // Return the image URL
    } else {
      const errorMessage = 'Failed to upload image. Response did not include secure_url.';
      console.error(errorMessage);
      throw new Error(errorMessage);
    }
  } catch (error) {
    console.error('Error uploading image to Cloudinary:', error);
    return '';  // Return an empty string in case of error
  }
};

// Modal Components
const Dropzone = styled.div`
  border: 2px dashed #ddd;
  border-radius: 10px;
  padding: 20px;
  text-align: center;
  cursor: pointer;
  background-color: #f9f9f9;
  transition: border-color 0.3s;
  &:hover {
    border-color: #007bff;
  }
`;

const ImagePreview = styled.img`
  max-width: 100px;
  height: auto;
  margin-top: 10px;
`;

const UploadText = styled.p`
  color: #555;
  font-size: 14px;
  margin-top: 5px;
`;

const ModalOverlay = styled.div<{ zIndex: number }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.6);
  z-index: ${(props) => props.zIndex};
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all 0.3s ease-in-out;
`;

const ModalContent = styled.div`
  position: relative;
  background-color: white;
  padding: 30px;
  width: 600px;
  max-width: 100%;
  border-radius: 15px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15);
  z-index: 60;
  transform: scale(0.9);
  opacity: 0;
  animation: fadeIn 0.3s ease-in-out forwards;

  @keyframes fadeIn {
    0% {
      opacity: 0;
      transform: scale(0.9);
    }
    100% {
      opacity: 1;
      transform: scale(1);
    }
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 15px;
  right: 15px;
  font-size: 24px;
  cursor: pointer;
  color: #888;
  background-color: transparent;
  border: none;
  &:hover {
    color: #333;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  margin-top: 8px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #f9f9f9;
  font-size: 14px;
  color: #333;

  &::placeholder {
    color: #aaa;
  }

  &:focus {
    outline: none;
    border-color: #007bff;
    background-color: #fff;
  }
`;

const Button = styled.button`
  width: 100%;
  padding: 12px;
  font-size: 16px;
  color: white;
  background-color: #007bff;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s ease;
  margin-top: 20px;

  &:hover {
    background-color: #0056b3;
  }
`;

const ModalTitle = styled.h2`
  font-size: 24px;
  font-weight: 600;
  color: #333;
  text-align: center;
  margin-bottom: 20px;
`;

const SuccessModalContent = styled.div`
  position: relative;
  background-color: white;
  padding: 30px;
  width: 400px;
  max-width: 100%;
  border-radius: 15px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15);
  z-index: 60;
  text-align: center;
`;

interface ModalProps {
  isOpen: boolean;
  closeModal: () => void;
}

const Modal: React.FC<ModalProps> = ({ isOpen, closeModal }) => {
  const [formData, setFormData] = useState({
    productName: '',
    createdBy: '',
    pvcPrice: '',
    metalPrice: '',
    woodPrice: '',
  });

  const [frontImageFile, setFrontImageFile] = useState<File | null>(null);
  const [backImageFile, setBackImageFile] = useState<File | null>(null);
  const [error, setError] = useState<string>('');
  const [isSuccess, setIsSuccess] = useState<boolean>(false);  // New state for success modal

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, type: 'front' | 'back') => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      if (type === 'front') {
        setFrontImageFile(file);
      } else {
        setBackImageFile(file);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); // Reset any previous error messages
    setIsSuccess(false);  // Reset success state

    let frontImageUrl = '';
    let backImageUrl = '';

    try {
      // Upload front image if selected
      if (frontImageFile) {
        frontImageUrl = await uploadImageToCloudinary(frontImageFile);
        if (!frontImageUrl) throw new Error('Failed to upload front image');
      }

      // Upload back image if selected
      if (backImageFile) {
        backImageUrl = await uploadImageToCloudinary(backImageFile);
        if (!backImageUrl) throw new Error('Failed to upload back image');
      }

      const productData = {
        name: formData.productName,
        front_image: frontImageUrl,
        back_image: backImageUrl,
        created_by: formData.createdBy,
        materials: {
          PVC: {
            value: formData.pvcPrice,
            price_per_unit: formData.pvcPrice,
          },
          Metal: {
            value: formData.metalPrice,
            price_per_unit: formData.metalPrice,
          },
          Wood: {
            value: formData.woodPrice,
            price_per_unit: formData.woodPrice,
          },
        },
      };

      // Submit product data to API
      const response = await fetch('http://localhost:4000/api/v1/card-designs/admin/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });

      const data = await response.json();

      if (response.ok) {
        console.log('Product created successfully:', data);
        setIsSuccess(true); // Show success modal
      } else {
        throw new Error(`Error creating product: ${data.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error:', error);
      setError(error instanceof Error ? error.message : 'Something went wrong');
    }
  };

  const handleCloseSuccessModal = () => {
    setIsSuccess(false);  // Close success modal
    closeModal();  // Close the main modal
  };

  if (!isOpen) return null;

  return (
    <>
      {isSuccess && (
        <ModalOverlay zIndex={100}>
          <SuccessModalContent>
            <h2>Success!</h2>
            <p>Your product has been successfully added.</p>
            <Button onClick={handleCloseSuccessModal}>Close</Button>
          </SuccessModalContent>
        </ModalOverlay>
      )}

      <ModalOverlay zIndex={50}>
        <ModalContent>
          <CloseButton onClick={closeModal}>&times;</CloseButton>
          <ModalTitle>Add New Product</ModalTitle>

          {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}

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
              <label className="block text-sm font-medium">Front Image</label>
              <Dropzone>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, 'front')}
                  style={{ display: 'none' }}
                  id="front-upload"
                />
                <label htmlFor="front-upload">
                  {frontImageFile ? (
                    <ImagePreview src={URL.createObjectURL(frontImageFile)} alt="Front Preview" />
                  ) : (
                    <UploadText>Click to upload or drag an image</UploadText>
                  )}
                </label>
              </Dropzone>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium">Back Image</label>
              <Dropzone>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, 'back')}
                  style={{ display: 'none' }}
                  id="back-upload"
                />
                <label htmlFor="back-upload">
                  {backImageFile ? (
                    <ImagePreview src={URL.createObjectURL(backImageFile)} alt="Back Preview" />
                  ) : (
                    <UploadText>Click to upload or drag an image</UploadText>
                  )}
                </label>
              </Dropzone>
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

            <Button type="submit">Add Product</Button>
          </form>
        </ModalContent>
      </ModalOverlay>
    </>
  );
};

export default Modal;
