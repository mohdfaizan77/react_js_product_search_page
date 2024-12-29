import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search } from 'lucide-react';
// import './URLSearchTable.css';  // Make sure to create this CSS file

const App = () => {
  const [url, setUrl] = useState('https://m.media-amazon.com/images/I/51JbreBubML._AC_UY327_FMwebp_QL65_.jpg');
  const [showTable, setShowTable] = useState(false);
  const [urlError, setUrlError] = useState('');
  const [isSearchClicked, setIsSearchClicked] = useState(false);
  const [data, setData] = useState([]);

  const dummyData = [
    { id: 1, name: "Product 1", url: "https://example.com/image1.jpg", price: 29.99 },
    { id: 2, name: "Product 2", url: "https://example.com/image2.jpg", price: 39.99 },
    { id: 3, name: "Product 3", url: "https://example.com/image3.jpg", price: 49.99 },
  ];

  useEffect(() => {
    let timer;
    if (isSearchClicked) {
      setShowTable(true);
      fetchData(url); 
      timer = setTimeout(() => {
        setShowTable(false);
        setIsSearchClicked(false);
      }, 10000);
    }
    return () => clearTimeout(timer);
  }, [isSearchClicked, url]);

  const validateUrl = (inputUrl) => {
    const urlPattern = /^https?:\/\/.+\.(jpg|jpeg)$/i;
    return urlPattern.test(inputUrl);
  };

  const handleUrlChange = (e) => {
    const inputUrl = e.target.value;
    setUrl(inputUrl);
    
    if (inputUrl && !validateUrl(inputUrl)) {
      setUrlError('Please enter a valid JPG image URL (http:// or https://)');
    } else {
      setUrlError('');
    }
  };

  const handleSearch = () => {
    if (!url) {
      setUrlError('Please enter a URL');
      return;
    }
    
    if (!validateUrl(url)) {
      setUrlError('Please enter a valid JPG image URL');
      return;
    }
    
    setIsSearchClicked(true);
  };

  const fetchData = async (inputUrl) => {
    try {
      const response = await axios.post('', { url: inputUrl });
      setData(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      setData(dummyData); // Set dummy data if API call fails
    }
  };

  return (
    <div className="container">
      <div className="header">
        <h1>Image URL Search</h1>
        <p>Enter a JPG image URL to search</p>
      </div>

      <div className="search-section">
        <div className="search-container">
          <input
            type="text"
            value={url}
            onChange={handleUrlChange}
            placeholder="Enter JPG image URL"
            className="search-input"
          />
          <button onClick={handleSearch} className="search-button">
            <Search size={20} />
            Search
          </button>
        </div>

        {urlError && (
          <div className="error-message">
            {urlError}
          </div>
        )}
      </div>

      {showTable && (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>URL</th>
                <th>Price</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item) => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{item.name}</td>
                  <td className="url-cell">{item.url}</td>
                  <td>${item.price.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default App;
