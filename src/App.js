import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search } from 'lucide-react';

const App = () => {
  const [url, setUrl] = useState('https://m.media-amazon.com/images/I/61utX8kBDlL._SY695_.jpg');
  const [showTable, setShowTable] = useState(false);
  const [urlError, setUrlError] = useState('');
  const [isSearchClicked, setIsSearchClicked] = useState(false);
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const dummyData = {
    sample: [
      {
        productName: 'JioTag Air Blue Bluetooth Tracker Iteam Finder',
        price: '₹ 2,999.00 INR',
        retailer: 'Ajio.com',
        numberOfReviews: 'No reviews',
        stockStatus: 'Stock status unknown',
        brand: 'JioTag',
        url: 'https://www.ajio.com/jio-jiotag-air-blue-bluetooth-tracker-iteam-finder/p/493072393',
        imageUrl: 'Image not available'
      }
    ]
  };

  useEffect(() => {
    if (isSearchClicked) {
      setShowTable(true);
      fetchData(url); // Fetch data when search is clicked
    }
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

    // Disable the search button while loading
    setIsLoading(true);
    setIsSearchClicked(true);
  };

  const handleClear = () => {
    setData([]);
    setShowTable(false);
    setUrl('');
    setUrlError('');
  };

  const fetchData = async (inputUrl) => {
    try {
      const response = await axios.post('http://localhost:5000/searchproduct', { url: inputUrl });
      setData(response.data.sample);
    } catch (error) {
      console.error('Error fetching data:', error);
      setData(dummyData.sample); // Set dummy data if API call fails
    } finally {
      setIsLoading(false);
      setIsSearchClicked(false); // Reset search state after fetching data
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
          <button
            onClick={handleSearch}
            className="search-button"
            disabled={isLoading} // Disable the button while loading
          >
            <Search size={20} />
            {isLoading ? 'Searching...' : 'Search'}
          </button>
        </div>

        {urlError && (
          <div className="error-message">
            {urlError}
          </div>
        )}
      </div>

      {isLoading && (
        <div className="loading-message">
          Loading data, please wait...
        </div>
      )}

      {showTable && (
        <div className="table-container">
          <button onClick={handleClear} className="clear-button">
            Clear Table
          </button>
          <table>
            <thead>
              <tr>
                <th>Product Name</th>
                <th>Price</th>
                <th>Retailer</th>
                <th>Number of Reviews</th>
                <th>Stock Status</th>
                <th>Brand</th>
                <th>URL</th>
                <th>Image</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => (
                <tr key={index}>
                  <td>{item.productName}</td>
                  <td>{item.price}</td>
                  <td>{item.retailer}</td>
                  <td>{item.numberOfReviews}</td>
                  <td>{item.stockStatus}</td>
                  <td>{item.brand}</td>
                  <td className="url-cell">
                    <a href={item.url} target="_blank" rel="noopener noreferrer">View Product</a>
                  </td>
                  <td>
                    {item.imageUrl !== 'Image not available' ? (
                      <img src={item.imageUrl} alt={item.productName} width="100" />
                    ) : (
                      item.imageUrl
                    )}
                  </td>
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
