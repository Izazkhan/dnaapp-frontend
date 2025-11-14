import React, { useState, useRef, useEffect, useContext } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css"; // Quill styles
import AudienceStateDropdown from "./components/AudienceStateDropdown";
import Icon from "../../components/Icon";
import AdCampaignContext from "../../context/AdCampaignProvider";

const CampaignForm = ({ selectedPlatform, onBack, onSubmit }) => {
  const [useGender, setUseGender] = useState(true);
  const [genderRatio, setGenderRatio] = useState(50);

  const [form, setForm] = useState({
    name: "",
    demographic: { age_range_ids: [], use_gender: true },
    country_id: "",
    state_id: "",
    city_id: [],
    follower_min: 0,
    likes_min: 0,
    story_impressions_min: 0,
    ad_campaign_engagement_range_id: "",
    draft_date: "",
    is_approval_required: false,
    dates: "",
    ad_campaign_deliverable_id: "",
    impressions_cap: "",
    price: "",
    description: "",
    link: "",
    file_id: "",
  });
  const [errors, setErrors] = useState({});
  const [fileId, setFileId] = useState("");
  const quillRef = useRef(null);
  const quillContainerRef = useRef(null);
  const { data } = useContext(AdCampaignContext);

  // Sample data (fetch via API)
  const deliverables = [
    { id: 1, name: "Post" },
    { id: 2, name: "Story" },
  ];
  const countries = [{ id: 1, name: "United States" }];

  // Quill setup
  useEffect(() => {
    if (quillContainerRef.current && !quillRef.current) {
      quillRef.current = new Quill(quillContainerRef.current, {
        theme: "snow",
        modules: {
          toolbar: [["bold", "italic"], [{ list: "bullet" }]],
        },
        placeholder: "Enter campaign description...",
      });

      // Sync to state on change
      quillRef.current.on("text-change", () => {
        const content = quillRef.current.root.innerHTML;
        setForm((prev) => ({ ...prev, description: content }));
      });
    }

    var tooltipTriggerList = [].slice.call(
      document.querySelectorAll('[data-bs-toggle="tooltip"]')
    );
    tooltipTriggerList.map(function (tooltipTriggerEl) {
      return new bootstrap.Tooltip(tooltipTriggerEl);
    });

    return () => {
      if (quillRef.current) {
        quillRef.current = null; // Cleanup
      }
      if (quillContainerRef.current) {
        quillContainerRef.current = null; // Cleanup
      }
    };
  }, []);

  // Generic input change
  const handleInputChange = (name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // Age change
  const handleAgeChange = (ageId) => {
    setForm((prev) => ({
      ...prev,
      demographic: {
        ...prev.demographic,
        age_range_ids: prev.demographic.age_range_ids.includes(ageId)
          ? prev.demographic.age_range_ids.filter((id) => id !== ageId)
          : [...prev.demographic.age_range_ids, ageId],
      },
    }));
  };

  const getGenderLabel = () => {
    if (genderRatio === 0) return "More Male (75% Male / 25% Female)";
    if (genderRatio === 50) return "50-50";
    if (genderRatio === 100) return "More Female (75% Female / 25% Male)";
    return ""; // During drag
  };

  // Toggle gender spec
  const toggleGender = () => {
    setUseGender(!useGender);
    setGenderRatio(50); // Reset to center
  };

  // Gender slider snap to 3 points (smooth move, snap on release)
  const handleGenderSliderChange = (e) => {
    setGenderRatio(parseInt(e.target.value)); // Smooth during drag
  };

  const handleGenderSliderRelease = (e) => {
    const value = parseInt(e.target.value);
    // Snap to nearest: 0 (More Male), 50 (50-50), 100 (More Female)
    let snapped;
    if (value < 25) snapped = 0;
    else if (value < 75) snapped = 50;
    else snapped = 100;
    setGenderRatio(snapped);
  };

  // File upload
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // API call here
      setFileId("uploaded");
      handleInputChange("file_id", "uploaded_id");
    }
  };

  // Validation
  const validateForm = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = "Campaign title is required";
    if (form.follower_min < 0) newErrors.follower_min = "Must be at least 0";
    if (form.price < 25 && !showImpressionsCap) newErrors.price = "$25 minimum";
    // Expand as needed
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit
  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit({ ...form, description }); // Include Quill content
    }
  };

  // Conditionals
  const showAudienceSection = true;
  const showCitySection = true;
  const showCityRadius = true;
  const showImpressionsCap = false;
  const showLinkInput = true;
  const isCreateMode = true;
  const totalAmount =
    parseFloat(form.impressions_cap) * (parseFloat(form.price) / 1000) || 0;

  useEffect(() => {
    console.log(form);
  }, [form]);

  return (
    <form onSubmit={handleSubmit}>
      {/* Campaign Title */}
      <div className="mb-3">
        <label htmlFor="name">Campaign title</label>
        <input
          value={form.name}
          onChange={(e) => handleInputChange("name", e.target.value)}
          type="text"
          maxLength="70"
          className="form-control outline-0"
          id="name"
          name="name"
          placeholder="Name your campaign..."
        />
        <span className="error-message"></span>
        {errors.name && (
          <small id="name_error" className="text-danger error">
            {errors.name}
          </small>
        )}
      </div>

      {showAudienceSection && (
        <>
          {/* Audience Age */}
          <div className="mb-3">
            <label>Audience Age</label>
            <br />
            <small
              id="age_range_ids_error"
              className="text-danger error"
            ></small>
            <div className="row">
              {data?.age_ranges?.map((age) => (
                <div key={age.id} className="col-3">
                  <div className="form-check">
                    <input
                      className="form-check-input age_range_ids"
                      type="checkbox"
                      checked={form.demographic.age_range_ids.includes(age.id)}
                      onChange={() => handleAgeChange(age.id)}
                      id={`age-${age.id}`}
                    />
                    <label
                      className="form-check-label fw-normal"
                      htmlFor={`age-${age.id}`}
                    >
                      {age.name}
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Gender */}
          <div className="mb-3">
            <div className="audience-gender d-flex align-items-center">
              <label>Audience Gender</label>
              <div className="me-5 ms-3 d-inline-block form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  checked={!useGender}
                  onChange={toggleGender}
                  id="aGender"
                />
                <label className="form-check-label fw-normal" htmlFor="aGender">
                  I don't want to specify audience gender
                </label>
              </div>
            </div>
            {useGender && (
              <div className="gender-range d-flex">
                <div className="flex-grow-1 d-flex flex-wrap align-content-center">
                  <input
                    type="range"
                    className="w-100"
                    min="0"
                    max="100"
                    step="1"
                    value={genderRatio}
                    onChange={handleGenderSliderChange}
                    onMouseUp={handleGenderSliderRelease}
                    onTouchEnd={handleGenderSliderRelease}
                    id="gender-ratio"
                  />
                  <div className="d-flex labels w-100 justify-content-between">
                    <div>More Male</div>
                    <div>More Female</div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Country (simplified select for demo) */}
          <AudienceStateDropdown
            onSelectState={(state) => console.log("Selected:", state)}
          />

          {/* Follower Min */}
          <div className="mb-3">
            <label>Influencer Follower Range</label>
            <div className="row">
              <div className="col-12 col-md-6 position-relative">
                <small className="muted form-small-label">At least</small>
                <input
                  value={form.follower_min}
                  onChange={(e) =>
                    handleInputChange(
                      "follower_min",
                      parseInt(e.target.value) || 0
                    )
                  }
                  type="number"
                  min="0"
                  placeholder="0"
                  className="form-control outline-0"
                  id="follower_min"
                  name="follower_min"
                />
                <small id="follower_min_error" className="text-danger error">
                  {errors.follower_min}
                </small>
              </div>
            </div>
          </div>
          <div className="mb-3">
            <label>Influencer Average Number of Post Likes</label>
            <div className="row">
              <div className="col-12 col-md-6 position-relative">
                <small className="muted form-small-label">At least</small>
                <input
                  value={form.likes_min}
                  onChange={(e) =>
                    handleInputChange(
                      "likes_min",
                      parseInt(e.target.value) || 0
                    )
                  }
                  className="form-control outline-0"
                  type="number"
                  min="0"
                  placeholder="0"
                  id="likes_min"
                  name="likes_min"
                />
                <small
                  id="likes_min_error"
                  className="text-danger error"
                ></small>
              </div>
            </div>
          </div>

          <div className="mb-3">
            <label>Influencer average number of impressions per story</label>
            <div className="row">
              <div className="col-12 col-md-6 position-relative">
                <small className="muted form-small-label">At least</small>
                <input
                  value={form.story_impressions_min}
                  onChange={(e) =>
                    handleInputChange(
                      "story_impressions_min",
                      parseInt(e.target.value) || 0
                    )
                  }
                  className="form-control outline-0"
                  type="number"
                  min="0"
                  placeholder="0"
                  id="story_impressions_min"
                  name="story_impressions_min"
                />
                <small
                  id="story_impressions_min_error"
                  className="text-danger error"
                ></small>
              </div>
            </div>
          </div>

          {/* Engagement Rate */}
          <div className="mb-3">
            <label>Influencer Average Engagement Rate</label>
            <div className="row">
              <div className="col-12 col-md-6">
                <select
                  value={form.ad_campaign_engagement_range_id}
                  onChange={(e) =>
                    handleInputChange(
                      "ad_campaign_engagement_range_id",
                      parseInt(e.target.value) || null
                    )
                  }
                  name="ad_campaign_engagement_range_id"
                  className="form-control outline-0"
                >
                  {data?.engagement_ranges?.map((range) => (
                    <option key={range.id} value={range.id}>
                      {range.label}
                    </option>
                  ))}
                </select>
                <small
                  id="ad_campaign_engagement_range_id_error"
                  className="text-danger error"
                ></small>
              </div>
            </div>
          </div>
          {/* Likes, Story Impressions, Engagement – repeat pattern */}

          {/* Draft Date & Approval */}
          <div className="mb-3">
            <div className="row">
              <div className="col-md-6">
                <label htmlFor="draft_date">Draft Date (Optional)</label>
                <input
                  value={form.draft_date}
                  onChange={(e) =>
                    handleInputChange("draft_date", e.target.value)
                  }
                  type="date"
                  className="form-control outline-0"
                  id="draft_date"
                  name="draft_date"
                />
                <small id="draft_date_error" className="text-danger error">
                  {errors.draft_date}
                </small>
              </div>
              <div className="col-md-6 mt-2 mt-md-0">
                <label htmlFor="is_approval_required" className="ml-md-3">
                  Approve Each Influencer
                </label>
                <i
                  className="info-icon ms-2"
                  data-bs-toggle="tooltip"
                  data-bs-placement="top"
                  title="This allows you to approve each influencer that accepts your offer prior to allowing them to participate in your campaign"
                >
                  <Icon name="infoIcon" />
                </i>
                <div className="form-check form-switch mt-2">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="is_approval_required"
                    checked={form.is_approval_required}
                    onChange={(e) =>
                      handleInputChange(
                        "is_approval_required",
                        e.target.checked
                      )
                    }
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Publishing Date */}
          <div className="mb-3">
            <label>Publishing Date Range</label>
            <div className="row">
              <div className="col-12 col-md-6">
                <input
                  value={form.dates}
                  onChange={(e) => handleInputChange("dates", e.target.value)}
                  type="text"
                  className="form-control outline-0"
                  id="date_range"
                  name="dates"
                />
                <small id="dates_error" className="text-danger error">
                  {errors.dates}
                </small>
              </div>
            </div>
          </div>

          {/* Deliverable */}
          <div className="mb-3">
            <label>Deliverable Type</label>
            <div className="row">
              <div className="col-12 col-md-6">
                <select
                  value={form.ad_campaign_deliverable_id}
                  onChange={(e) =>
                    handleInputChange(
                      "ad_campaign_deliverable_id",
                      e.target.value
                    )
                  }
                  className="form-control outline-0"
                >
                  <option value="">Select Deliverable</option>
                  {data?.deliverables?.map((d_type) => (
                    <option key={d_type.id} value={d_type.id}>
                      {d_type.name}
                    </option>
                  ))}
                </select>
                <small
                  id="ad_campaign_deliverable_id_error"
                  className="text-danger error"
                >
                  {errors.ad_campaign_deliverable_id}
                </small>
              </div>
            </div>
          </div>

          {/* Price */}
          <div className="mb-3">
            <label>Price Per Post</label>
            <div className="row">
              <div className="col-12 col-md-6">
                <input
                  value={form.price}
                  onChange={(e) =>
                    handleInputChange("price", parseFloat(e.target.value) || "")
                  }
                  type="number"
                  className="form-control outline-0"
                  id="price"
                  name="price"
                  min={showImpressionsCap ? "" : "25"}
                  placeholder={showImpressionsCap ? "" : "$25 minimum"}
                />
                <small id="price_error" className="text-danger error">
                  {errors.price}
                </small>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="mb-3">
            <label>Campaign Description</label>
            <div className="editor">
              <div ref={quillContainerRef} />
            </div>
            <textarea
              value={form.description}
              className="d-none"
              id="description"
              name="description"
            />
            <small id="description_error" className="text-danger error">
              {errors.description}
            </small>
          </div>

          {/* Link */}
          {showLinkInput && (
            <div className="mb-3 permalink-section">
              <label>Provide Link to Content Below</label>
              <input
                value={form.link}
                onChange={(e) => handleInputChange("link", e.target.value)}
                type="text"
                className="form-control outline-0"
                id="link"
                name="link"
                placeholder="Insert link here"
              />
              <small id="link_error" className="text-danger error">
                {errors.link}
              </small>
            </div>
          )}

          {/* File Upload */}
          {isCreateMode && (
            <>
              {!!errors.file_id && (
                <div className="mb-2 text-center m-0">
                  <small id="file_id_error" className="text-danger error">
                    {errors.file_id}
                  </small>
                </div>
              )}
              <div
                className={`campaign-brief-file-upload-section text-center mb-2 ${
                  fileId ? "d-none" : ""
                }`}
              >
                <label
                  htmlFor="campaign-brief"
                  className="campaign-brief-label"
                >
                  <span className="upload-plus-icon">
                    <Icon name="uploadPlus"></Icon>
                  </span>
                  <span>Upload</span> Pdf for campaign brief (Optional)
                </label>
              </div>
              <input
                type="hidden"
                value={form.file_id}
                onChange={() => {}}
                name="file_id"
                id="file_id"
              />
              <div
                className={`p-2 align-items-center justify-content-center progress-bar-section ${
                  fileId ? "d-flex" : "d-none"
                }`}
              >
                <i className="file-icon"></i>
                <div className="flex-grow-1 m-3 progressbar">
                  <div id="file_name">Sample.pdf</div>
                  <div className="progress-line" style={{ width: "50%" }}></div>
                </div>
                <div id="progress-percentage">50%</div>
              </div>
              <div className="d-none">
                <input
                  type="file"
                  onChange={handleFileChange}
                  id="campaign-brief"
                  name="file"
                  accept="application/pdf"
                />
              </div>
            </>
          )}

          {/* Buttons */}
          <div className="text-center mb-3">
            <button
              type="button"
              onClick={onBack}
              className="btn btn-secondary mr-2"
            >
              Back
            </button>
            <button type="submit" className="btn btn-primary">
              Create Campaign
            </button>
          </div>
        </>
      )}

      {/* Form closes here */}
    </form>
  );
};

export default CampaignForm;
