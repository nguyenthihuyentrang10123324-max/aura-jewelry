import { productAPI } from '../utils/api';
import { useState, useEffect } from 'react';

const useProducts = (initialParams = {}) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);
        const res = await productAPI.getAll(initialParams);
        if (res.data.success) {
          setProducts(res.data.data.products);
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  return { products, loading };
};

export default useProducts;
