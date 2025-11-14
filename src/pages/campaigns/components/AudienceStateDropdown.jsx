import React, { useState } from "react";

// Fake API data: States with nested cities
const FAKE_API_DATA = [
  {
    country_name: "United States",
    country_id: 233,
    state_name: "Arizona",
    state_id: 1434,
    cities: [
      { city_name: "Chandler", city_id: 113731 },
      { city_name: "Mesa", city_id: 121720 },
      { city_name: "Phoenix", city_id: 124148 },
      { city_name: "Scottsdale", city_id: 126063 },
      { city_name: "Tucson", city_id: 127874 },
    ],
  },
  {
    country_name: "United States",
    country_id: 233,
    state_name: "California",
    state_id: 1435,
    cities: [
      { city_name: "Los Angeles", city_id: 12345 },
      { city_name: "San Francisco", city_id: 12346 },
    ],
  },
  // Add more states...
];

const AudienceStateDropdown = ({ onSelectState, onSelectCity }) => {
  const [selectedState, setSelectedState] = useState(""); // Selected state or empty for "Any"
  const [searchQuery, setSearchQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [filteredData, setFilteredData] = useState(FAKE_API_DATA);

  // Filter states and cities on search (cross-search)
  React.useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredData(FAKE_API_DATA);
      return;
    }

    const queryLower = searchQuery.toLowerCase();
    const filtered = FAKE_API_DATA.map((stateItem) => {
      // Check state match
      const stateMatches = stateItem.state_name
        .toLowerCase()
        .includes(queryLower);
      // Check city matches
      const matchingCities = stateItem.cities.filter((city) =>
        city.city_name.toLowerCase().includes(queryLower)
      );
      // Include if state or any city matches
      if (stateMatches || matchingCities.length > 0) {
        return {
          ...stateItem,
          cities: matchingCities, // Only show matching cities
        };
      }
      return null;
    }).filter(Boolean); // Remove non-matches

    setFilteredData(filtered);
  }, [searchQuery]);

  // Toggle dropdown
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
    if (!isOpen) setSearchQuery(""); // Clear search when opening
  };

  // Select state
  const selectState = (state) => {
    setSelectedState(state.state_name);
    setIsOpen(false);
    setSearchQuery("");
    onSelectState?.(state); // Callback with full state object
  };

  // Select city (appends state name)
  const selectCity = (city, stateName) => {
    const displayText = `${city.city_name}, ${stateName}`; // "city_name, state_name"
    onSelectCity?.({ ...city, displayText, state_name: stateName });
    setSelectedState(displayText); // Update button to show "Phoenix, Arizona"
    setIsOpen(false);
    setSearchQuery("");
  };

  // Close on outside click
  React.useEffect(() => {
    const handleClickOutside = (e) => {
      if (isOpen && !e.target.closest(".b-select")) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  return (
    <div className="mb-3">
      <label>Audience State</label>
      <div className="b-select">
        <select
          className="form-select border-0"
          disabled
          value={selectedState || "Any"}
        ></select>
        <button
          className="btn form-control b-select-btn text-ellipsis"
          aria-expanded={isOpen}
          onClick={toggleDropdown}
        >
          {selectedState || "Any"}
        </button>
        {isOpen && (
          <div className="b-select-container">
            <div className="b-select-searchbox">
              <input
                type="text"
                className="form-control b-select-search"
                placeholder="Search states or cities..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                role="combobox"
                aria-label="Search states or cities"
                autoFocus
              />
            </div>
            <div className="b-select-options-container">
              <ul className="b-select-options" role="listbox">
                {filteredData.length > 0 ? (
                  filteredData.map((stateItem, index) => (
                    <React.Fragment key={stateItem.state_id}>
                      {/* State at top */}
                      <li
                        className={`b-select-option state-option ${
                          selectedState === stateItem.state_name
                            ? "selected"
                            : ""
                        }`}
                        onClick={() => selectState(stateItem)}
                        role="option"
                        aria-selected={selectedState === stateItem.state_name}
                      >
                        {stateItem.state_name}
                      </li>
                      {/* Matching cities below: "city_name, state_name" indented */}
                      {stateItem.cities &&
                        stateItem.cities.length > 0 &&
                        stateItem.cities.map((city) => (
                          <li
                            key={city.city_id}
                            className="b-select-option city-option" // Indented
                            onClick={() =>
                              selectCity(city, stateItem.state_name)
                            }
                            role="option"
                            aria-selected={false}
                          >
                            {city.city_name}, {stateItem.state_name}
                          </li>
                        ))}
                    </React.Fragment>
                  ))
                ) : (
                  <li className="b-select-option" role="option">
                    No states or cities found
                  </li>
                )}
              </ul>
            </div>
          </div>
        )}
      </div>
      <small id="state_id_error" className="text-danger error"></small>
    </div>
  );
};

export default AudienceStateDropdown;
