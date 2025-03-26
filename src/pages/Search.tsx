import { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/Search.css';

interface Dog {
  id: string;
  img: string;
  name: string;
  age: number;
  zip_code: string;
  breed: string;
}

function Search() {
  const [breeds, setBreeds] = useState<string[]>([]);
  const [selectedBreeds, setSelectedBreeds] = useState<string[]>(() => {
    const saved = sessionStorage.getItem('selectedBreeds');
    return saved ? JSON.parse(saved) : [];
  });
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>(() => {
    return (sessionStorage.getItem('sortOrder') as 'asc' | 'desc') || 'asc';
  });
  const [dogs, setDogs] = useState<Dog[]>([]);
  const [favorites, setFavorites] = useState<Set<string>>(() => {
    const saved = sessionStorage.getItem('favorites');
    return saved ? new Set(JSON.parse(saved)) : new Set();
  });
  const [matchedDog, setMatchedDog] = useState<Dog | null>(null);
  const [matchError, setMatchError] = useState<string>('');
  const [next, setNext] = useState<string | null>(null);
  const [prev, setPrev] = useState<string | null>(null);
  const [total, setTotal] = useState<number>(0);
  const [from, setFrom] = useState<string | null>(() => {
    return sessionStorage.getItem('from') || null;
  });
  const [showBreeds, setShowBreeds] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('darkMode') === 'true';
  });
  
  useEffect(() => {
    document.body.classList.toggle('dark', darkMode);
    localStorage.setItem('darkMode', String(darkMode));
  }, [darkMode]);  

  useEffect(() => {
    sessionStorage.setItem('selectedBreeds', JSON.stringify(selectedBreeds));
  }, [selectedBreeds]);

  useEffect(() => {
    sessionStorage.setItem('sortOrder', sortOrder);
  }, [sortOrder]);

  useEffect(() => {
    sessionStorage.setItem('favorites', JSON.stringify(Array.from(favorites)));
  }, [favorites]);

  useEffect(() => {
    if (from) {
      sessionStorage.setItem('from', from);
    } else {
      sessionStorage.removeItem('from');
    }
  }, [from]);

  useEffect(() => {
    const fetchBreeds = async () => {
      try {
        const response = await axios.get(
          'https://frontend-take-home-service.fetch.com/dogs/breeds',
          { withCredentials: true }
        );
        setBreeds(response.data);
      } catch (err) {
        console.error('Failed to fetch breeds:', err);
      }
    };

    fetchBreeds();
  }, []);

  useEffect(() => {
    const fetchDogs = async () => {
      const queryParams = new URLSearchParams();
      if (selectedBreeds.length > 0) {
        selectedBreeds.forEach((breed) => queryParams.append('breeds', breed));
      }
      queryParams.append('sort', `breed:${sortOrder}`);
      queryParams.append('size', '20');
      if (from) {
        queryParams.append('from', from);
      }

      try {
        const searchResponse = await axios.get(
          `https://frontend-take-home-service.fetch.com/dogs/search?${queryParams.toString()}`,
          { withCredentials: true }
        );

        const { resultIds, next, prev, total } = searchResponse.data;
        setNext(next || null);
        setPrev(prev || null);
        setTotal(total || 0);

        if (resultIds.length === 0) {
          setDogs([]);
          return;
        }

        const detailsResponse = await axios.post(
          'https://frontend-take-home-service.fetch.com/dogs',
          resultIds,
          { withCredentials: true }
        );

        setDogs(detailsResponse.data);
      } catch (err) {
        console.error('Failed to fetch dogs:', err);
      }
    };

    fetchDogs();
  }, [selectedBreeds, sortOrder, from]);

  const handleNext = () => {
    if (next) {
      const nextFrom = new URLSearchParams(next).get('from');
      setFrom(nextFrom || null);
    }
  };

  const handlePrev = () => {
    if (prev) {
      const prevFrom = new URLSearchParams(prev).get('from');
      setFrom(prevFrom || null);
    }
  };

  const handlePageClick = (pageNumber: number) => {
    const offset = (pageNumber - 1) * 20;
    setFrom(offset.toString());
  };

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => {
      const newSet = new Set(prev);
      newSet.has(id) ? newSet.delete(id) : newSet.add(id);
      return newSet;
    });
  };

  const handleMatchMe = async () => {
    if (favorites.size === 0) {
      setMatchError('Please select at least one favorite before matching.');
      return;
    }

    try {
      const response = await axios.post(
        'https://frontend-take-home-service.fetch.com/dogs/match',
        Array.from(favorites),
        { withCredentials: true }
      );
      const matchedId = response.data.match;

      const detailResponse = await axios.post(
        'https://frontend-take-home-service.fetch.com/dogs',
        [matchedId],
        { withCredentials: true }
      );

      setMatchedDog(detailResponse.data[0]);
      setMatchError('');
    } catch (err) {
      console.error('Error matching dog:', err);
      setMatchError('Something went wrong. Please try again.');
    }
  };

  const currentPage = from ? Math.floor(Number(from) / 20) + 1 : 1;
  const totalPages = Math.ceil(total / 20);

  const getPageNumbers = () => {
    const maxPagesToShow = 5;
    const pages: (number | string)[] = [];

    if (totalPages <= maxPagesToShow + 2) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      const left = Math.max(2, currentPage - 1);
      const right = Math.min(totalPages - 1, currentPage + 1);

      pages.push(1);
      if (left > 2) pages.push('...');
      for (let i = left; i <= right; i++) pages.push(i);
      if (right < totalPages - 1) pages.push('...');
      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <div className="search-page">
      <div className="search-controls">
        <div className="top-bar">
          <div className="sort-controls">
            <div className="sort-buttons">
              <label>Sort by Breed:</label>
              <button
                className="sort-toggle"
                onClick={() => {
                    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                    setFrom(null);
                }}
                >
                {sortOrder === 'asc' ? 'A-Z' : 'Z-A'}
              </button>
            </div>
          </div>
          
          <div className="match-wrapper">
            <button className="match-button" onClick={handleMatchMe}>
              Match Me with a Dog!
            </button>
            <span className="favorite-count">Favorited Count: {favorites.size}</span>
            <button className="dark-toggle" onClick={() => setDarkMode(!darkMode)}>
                {darkMode ? 'Light Mode UI' : 'Dark Mode UI'}
            </button>
          </div>
        </div>

        <div className="breed-filter">
          <div className="filter-header">
            <label className="filter-toggle" onClick={() => setShowBreeds(!showBreeds)}>
                Filter by Breed {showBreeds ? '▲' : '▼'}
            </label>
            <button className="clear-filters" onClick={() => { setSelectedBreeds([]); setSortOrder('asc'); setFrom(null);}}>
                Clear All Filters
            </button>
          </div>
          {showBreeds && (
            <div className="breed-options">
              {breeds.map((breed) => (
                <label key={breed}>
                  <input
                    type="checkbox"
                    value={breed}
                    checked={selectedBreeds.includes(breed)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedBreeds([...selectedBreeds, breed]);
                      } else {
                        setSelectedBreeds(selectedBreeds.filter((b) => b !== breed));
                      }
                      setFrom(null);
                    }}
                  />
                  {breed}
                </label>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="dog-grid">
        {dogs.map((dog) => (
          <div key={dog.id} className={`dog-card ${favorites.has(dog.id) ? 'favorited' : ''}`}>
            <img src={dog.img} alt={dog.name} />
            <h3>{dog.name}</h3>
            <p><strong>Breed:</strong> {dog.breed}</p>
            <p><strong>Age:</strong> {dog.age}</p>
            <p><strong>Zip:</strong> {dog.zip_code}</p>
            <button
              className="favorite-btn"
              onClick={() => toggleFavorite(dog.id)}
            >
              {favorites.has(dog.id) ? '★ Favorited' : '☆ Favorite'}
            </button>
          </div>
        ))}
      </div>

      <div className="pagination">
        <button disabled={!prev} onClick={handlePrev}>⬅ Prev</button>
        {getPageNumbers().map((page, i) => (
          <button
            key={i}
            disabled={page === '...'}
            className={page === currentPage ? 'active-page current' : 'active-page'}
            onClick={() => typeof page === 'number' && handlePageClick(page)}
          >
            {page}
          </button>
        ))}
        <button disabled={!next} onClick={handleNext}>Next ➡</button>
      </div>

      {(matchedDog || matchError) && (
        <div className="match-popup">
          <div className="match-card">
            {matchedDog ? (
              <>
                <h2>Your Match!</h2>
                <img src={matchedDog.img} alt={matchedDog.name} />
                <h3>{matchedDog.name}</h3>
                <p><strong>Breed:</strong> {matchedDog.breed}</p>
                <p><strong>Age:</strong> {matchedDog.age}</p>
                <p><strong>Zip:</strong> {matchedDog.zip_code}</p>
              </>
            ) : (
              <>
                <h2>Oops!</h2>
                <p>{matchError}</p>
              </>
            )}
            <button onClick={() => { setMatchedDog(null); setMatchError(''); }}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Search;