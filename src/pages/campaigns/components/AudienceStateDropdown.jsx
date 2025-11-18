import React, { useRef, useState } from "react";
import useAxios from "../../../hooks/useAxios";

const AudienceStateDropdown = ({ onChange, onSelectCity }) => {
  const [selectedLocation, setSelectedLocation] = useState(""); // Selected state or empty for "Any"
  const [searchQuery, setSearchQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [locData, setLocData] = useState([]);
  const axios = useAxios();
  const debounce = useRef(null);

  React.useEffect(() => {
    clearTimeout(debounce.current);
    if (!searchQuery.trim()) {
      // clear data;
      return;
    }
    debounce.current = setTimeout(async () => {
      const result = await axios({
        url: "/locations/cities/search",
        params: {
          q: searchQuery.trim(),
        },
      });
      setLocData(result.data);
    }, 400);
  }, [searchQuery]);

  // Toggle dropdown
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
    if (!isOpen) setSearchQuery(""); // Clear search when opening
  };

  // Select state
  const selectLocation = (location) => {
    setSelectedLocation(location.display_name);
    setIsOpen(false);
    setSearchQuery("");
    onChange(location);
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
          value={selectedLocation || "Any"}
        ></select>
        <button
          className="btn form-control b-select-btn text-ellipsis"
          aria-expanded={isOpen}
          onClick={toggleDropdown}
        >
          {selectedLocation || "Any"}
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
                {locData.length > 0 ? (
                  locData.map((stateItem, index) => (
                    <React.Fragment
                      key={`${stateItem.state.id}${stateItem?.city?.id ?? ""}`}
                    >
                      <li
                        className={`b-select-option ${
                          selectedLocation === stateItem.display_name
                            ? "selected"
                            : ""
                        }`}
                        onClick={() => selectLocation(stateItem)}
                        role="option"
                        aria-selected={
                          selectedLocation === stateItem.display_name
                        }
                      >
                        {stateItem.display_name}
                      </li>
                    </React.Fragment>
                  ))
                ) : searchQuery.length ? (
                  <li className="b-select-option" role="option">
                    No states or cities found
                  </li>
                ) : (
                  ""
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
