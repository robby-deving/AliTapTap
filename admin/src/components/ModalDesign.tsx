// ModalDesign.tsx

import styled from 'styled-components';

export const Dropzone = styled.div`
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

export const ImagePreview = styled.img`
  max-width: 100px;
  height: auto;
  margin-top: 10px;
`;

export const UploadText = styled.p`
  color: #555;
  font-size: 14px;
  margin-top: 5px;
`;

export const ModalOverlay = styled.div<{ zIndex: number }>`
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

export const ModalContent = styled.div`
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

export const CloseButton = styled.button`
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

export const Input = styled.input`
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

export const Button = styled.button`
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

export const ModalTitle = styled.h2`
  font-size: 24px;
  font-weight: 600;
  color: #333;
  text-align: center;
  margin-bottom: 20px;
`;

export const SuccessModalContent = styled.div`
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
