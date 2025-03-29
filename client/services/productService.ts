import axios from "axios";

const API_URL = "http://192.168.231.87:4000/api/v1/card-designs/admin/get-card-products";

export const fetchProducts = async () => {
  try {
    const response = await axios.get(API_URL);
    let fetchedProducts = response.data.data || [];

    // Ensure "Upload your own design" option is included dynamically
    const uploadOption = {
      id: "upload",
      name: "Upload your own design",
      price: "₱ 1200.00",
      isUploadOption: true,
    };

    if (!fetchedProducts.find((p: any) => p.isUploadOption)) {
      fetchedProducts = [uploadOption, ...fetchedProducts]; // Add upload option at the beginning
    }

    return fetchedProducts;
  } catch (error) {
    throw new Error("Failed to load products");
  }
};
