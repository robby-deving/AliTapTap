import { useState, useEffect } from "react";
import axios from "axios";

// Custom hook to fetch card products
const useFetchCardProducts = () => {
  const [data, setData] = useState<CardDesign[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:4000/api/v1/card-designs/admin/get-card-products");
        setData(response.data.data);
        setLoading(false);
      } catch (err: any) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []); // Empty dependency array to fetch data once on mount

  return { data, loading, error };
};

export default useFetchCardProducts;
