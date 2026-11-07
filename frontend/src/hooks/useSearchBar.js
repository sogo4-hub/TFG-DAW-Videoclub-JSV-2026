import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const useSearchBar = () => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setQuery(params.get('search') || '');
  }, [location.search]);

  const handleSearch = (e) => {
    if (e.key !== 'Enter') return;

    const params = new URLSearchParams(location.search);
    const value = query.trim();

    if (value) {
      params.set('search', value);
    } else {
      params.delete('search');
    }

    params.set('page', '0');

    navigate(`/catalogo?${params.toString()}`);
  };

  return { query, setQuery, handleSearch };
};

export default useSearchBar;