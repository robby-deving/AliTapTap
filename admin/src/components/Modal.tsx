import React, { useState } from 'react';
import { ModalOverlay, ModalContent, CloseButton, ModalTitle, Input, Button, Dropzone, ImagePreview, UploadText, SuccessModalContent } from './ModalDesign';
import { uploadImageToCloudinary } from '../hooks/cloudinary'; // Assuming you have the uploadImageToCloudinary function in a separate file

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
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

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
    setError('');
    setIsSuccess(false);

    let frontImageUrl = '';
    let backImageUrl = '';

    try {
      if (frontImageFile) {
        frontImageUrl = await uploadImageToCloudinary(frontImageFile);
        if (!frontImageUrl) throw new Error('Failed to upload front image');
      }

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
        setIsSuccess(true);
      } else {
        throw new Error(`Error creating product: ${data.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error:', error);
      setError(error instanceof Error ? error.message : 'Something went wrong');
    }
  };

  const handleCloseSuccessModal = () => {
    setIsSuccess(false);
    closeModal();
  };

  if (!isOpen) return null;

  return (
    <>
      {isSuccess && (
        <ModalOverlay zIndex={100}>
          <SuccessModalContent>
            <h2>Success!</h2>
            <p>Your product has been successfully added.</p>
            <Button
              onClick={handleCloseSuccessModal}
              className="custom-close-btn"
            >
              Close
            </Button>
          </SuccessModalContent>
        </ModalOverlay>
      )}


      <ModalOverlay zIndex={50}>
        <ModalContent>
          <CloseButton onClick={closeModal}>&times;</CloseButton>
          <ModalTitle>Add New Card</ModalTitle>

          {/* PRODUCT INFORMATION */}
          <div className="mb-4">
            <h3 className="text-[13px] text-[#949494] font-medium">PRODUCT INFORMATION</h3>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Product Name</label>
              <Input
                type="text"
                name="productName"
                value={formData.productName}
                onChange={handleChange}
                required
                placeholder="Enter product name"
                className="focus:border-yellow-500 focus:ring-yellow-500"
              />
            </div>

            {/* Front and Back Image Fields in Two Columns */}
            <div className="mb-4 flex gap-4">
              <div className="w-1/2">
                <label className="block text-sm font-medium mb-2">Front Image</label>
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

              <div className="w-1/2">
                <label className="block text-sm font-medium mb-2">Back Image</label>
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
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Created By (Admin ID)</label>
              <Input
                type="text"
                name="createdBy"
                value={formData.createdBy}
                onChange={handleChange}
                required
                placeholder="Enter Admin ID"
                className="focus:border-yellow-500 focus:ring-yellow-500"
              />
            </div>

            {/* PRODUCT PRICING */}
            <div className="mb-4">
              <h3 className="text-[13px] text-[#949494] font-medium">PRODUCT PRICING</h3>
            </div>

            {/* Materials Pricing Section */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Materials</label>
              <div className="flex gap-4">
                <div className="w-1/3">
                  <label className="block text-sm text-[#949494]">PVC Price</label>
                  <Input
                    type="number"
                    name="pvcPrice"
                    value={formData.pvcPrice}
                    onChange={handleChange}
                    required
                    placeholder="₱0.00"
                    className="focus:border-yellow-500 focus:ring-yellow-500"
                  />
                </div>

                <div className="w-1/3">
                  <label className="block text-sm text-[#949494]">Metal Price</label>
                  <Input
                    type="number"
                    name="metalPrice"
                    value={formData.metalPrice}
                    onChange={handleChange}
                    required
                    placeholder="₱0.00"
                    className="focus:border-yellow-500 focus:ring-yellow-500"
                  />
                </div>

                <div className="w-1/3">
                  <label className="block text-sm text-[#949494]">Wood Price</label>
                  <Input
                    type="number"
                    name="woodPrice"
                    value={formData.woodPrice}
                    onChange={handleChange}
                    required
                    placeholder="₱0.00"
                    className="focus:border-yellow-500 focus:ring-yellow-500"
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
