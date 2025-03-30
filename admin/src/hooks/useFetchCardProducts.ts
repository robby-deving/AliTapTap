import { useState, useEffect } from "react";
import axios from "axios";
import io from "socket.io-client";
import { CardDesign } from "@/pages/Products"; // Adjust the import path as necessary
const useFetchCardProducts = () => {
  const [data, setData] = useState<CardDesign[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:4000/api/v1/card-designs/admin/get-card-products");

        const cleanedData = response.data.data.map((product: CardDesign) => {
          const { deleted_at, ...rest } = product; 
          return rest; 
        });

        setData(cleanedData); 
        setLoading(false);
      } catch (err: any) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();


    const socket = io("http://localhost:4000"); 
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

    return () => {
      socket.disconnect();
    };
  }, []); 

  return { data, loading, error };
};

export default useFetchCardProducts;
