import React, { useState } from 'react';
import { ModalOverlay, ModalContent, CloseButton, ModalTitle, Input, Button, UploadText, SuccessModalContent } from './AddModalDesign';
import { Dropzone, ImagePreview } from "@/components/ui/dropzone";
import { uploadImageToCloudinary } from '../hooks/cloudinary'; 
import productSuccessImage from '../assets/productsuccess.svg'; 

interface ModalProps {
  isOpen: boolean;
  closeModal: () => void;
}

const Modal: React.FC<ModalProps> = ({ isOpen, closeModal }) => {
  const [formData, setFormData] = useState({
    productName: '',
    pvcPrice: '',
    metalPrice: '',
    woodPrice: '',
  });

  const [frontImageFile, setFrontImageFile] = useState<File | null>(null);
  const [backImageFile, setBackImageFile] = useState<File | null>(null);
  const [error, setError] = useState<string>('');
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false); 

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
    setLoading(true);  

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
        setIsSuccess(true);
      } else {
        throw new Error(`Error creating product: ${data.message || 'Unknown error'}`);
      }
    } catch (err: any) {
      console.error('Error uploading product:', err);
      setError('Error uploading the product');  
    } finally {
      setLoading(false);  
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
            <img
              src={productSuccessImage}
              alt="Product Success"
              style={{ width: '1190px', height: '115px', marginBottom: '50px', marginTop: '50px'}} 
            />
            <Button
              onClick={handleCloseSuccessModal}
              className="custom-close-btn"
              style={{
                backgroundColor: '#E4E4E7',
                color: '#FFFFFF',
                transition: 'background-color 0.3s ease',
              }}
              onMouseEnter={(e: React.MouseEvent<HTMLButtonElement>) => {
                e.currentTarget.style.backgroundColor = '#333'; 
              }}
              onMouseLeave={(e: React.MouseEvent<HTMLButtonElement>) => {
                e.currentTarget.style.backgroundColor = '#E4E4E7'; 
              }}
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

            {/* Front and Back Image Fields */}
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

            {/* MATERIALS PRICING */}
            <div className="mb-4">
              <h3 className="text-[13px] text-[#949494] font-medium">PRODUCT PRICING</h3>
            </div>

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

            <Button 
              type="submit" 
              disabled={loading} 
              className="flex justify-center items-center" 
            >
              {loading ? (
                <span className="flex items-center">
                  <svg 
                    aria-hidden="true" 
                    role="status" 
                    className="inline w-4 h-4 me-3 text-white animate-spin" 
                    viewBox="0 0 100 101" 
                    fill="none" 
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path 
                      d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" 
                      fill="#E5E7EB"
                    />
                    <path 
                      d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" 
                      fill="currentColor"
                    />
                  </svg>
                  Adding Product...
                </span>
              ) : (
                'Add Product'
              )}
            </Button>
          </form>
        </ModalContent>
      </ModalOverlay>
    </>
  );
};

export default Modal;
