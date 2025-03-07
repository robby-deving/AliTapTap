import { useState, useEffect } from "react";

interface FetchDataState<T> {
    data: T | null;
    loading: boolean;
    error: string | null;
}

const useFetchData = <T>(endpoint: string): FetchDataState<T> => {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`http://localhost:4000/api/v1/${endpoint}`);
                if (!response.ok) throw new Error("Failed to fetch data");
                const result = await response.json();
                setData(result.data);  // Set result.data instead of result
            } catch (err) {
                setError(err instanceof Error ? err.message : "Unknown error");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [endpoint]);

    return { data, loading, error };
};

export default useFetchData;
