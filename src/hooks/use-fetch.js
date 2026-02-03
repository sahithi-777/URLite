import {useState} from "react";

const useFetch = (cb, options = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(null);
  const [error, setError] = useState(null);
  
  const fn = async (...args) => {
    setLoading(true);
    setError(null);
    try {
      // FIXED: If args are provided when calling fn(), use those
      // Otherwise use the options passed to useFetch
      const response = args.length > 0 ? await cb(...args) : await cb(options);
      setData(response);
      setError(null);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };
  
  return {data, loading, error, fn};
};

export default useFetch;
