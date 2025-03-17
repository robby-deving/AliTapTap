import { useState, useEffect } from "react";
import axios from "axios";
import io from "socket.io-client";

// Custom hook to fetch card products
const useFetchCardProducts = () => {
  const [data, setData] = useState<CardDesign[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch data, ensure it includes `deleted_at` and `modified_at`
        const response = await axios.get("http://localhost:4000/api/v1/card-designs/admin/get-card-products");

        // Remove `deleted_at` from the fetched data
        const cleanedData = response.data.data.map((product: CardDesign) => {
          const { deleted_at, ...rest } = product; // Destructure to remove `deleted_at`
          return rest; // Return the remaining product without `deleted_at`
        });

        setData(cleanedData); // Set the cleaned data
        setLoading(false);
      } catch (err: any) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();

    // Set up the socket.io connection
    const socket = io("http://localhost:4000"); // Connect to the server
    socket.on("product_deleted", (deletedProduct) => {
      setData((prevData) =>
        prevData ? prevData.filter((product) => product._id !== deletedProduct._id) : prevData
      );
    });

    socket.on("product_modified", (modifiedProduct) => {
      setData((prevData) =>
        prevData
          ? prevData.map((product) =>
              product._id === modifiedProduct._id ? { ...product, ...modifiedProduct } : product
            )
          : prevData
      );
    });

    // Cleanup the socket connection when the component unmounts
    return () => {
      socket.disconnect();
    };
  }, []); // Fetch data once on mount

  return { data, loading, error };
};

export default useFetchCardProducts;
