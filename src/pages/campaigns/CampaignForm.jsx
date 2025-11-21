import React, { useState, useRef, useEffect, useContext } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css"; // Quill styles
import AudienceStateDropdown from "./components/AudienceStateDropdown";
import Icon from "../../components/Icon";
import AdCampaignContext from "../../context/AdCampaignProvider";

const CampaignForm = ({ selectedPlatform, onBack, onSubmit, platform }) => {
  const [useGender, setUseGender] = useState(true);
  const [genderRatio, setGenderRatio] = useState(50);

  const [form, setForm] = useState({
    platform: platform,
    name: "",
    demographics: { age_range_ids: [], use_gender: true },
    follower_min: 0,
    likes_min: 0,
    story_impressions_min: 0,
    ad_campaign_engagement_range_id: 1, //Any
    draft_date: "",
    is_approval_required: false,
    publish_from: "",
    publish_until: "",
    published: false,
    is_test: false,
    ad_campaign_deliverable_id: "",
    price: "",
    description: "",
    link: "",
  });
  const [errors, setErrors] = useState({});
  const quillRef = useRef(null);
  const quillContainerRef = useRef(null);
  const { data } = useContext(AdCampaignContext);

  // Quill setup
  useEffect(() => {
    let quill;
    if (quillContainerRef.current && !quillRef.current) {
      quill = new Quill(quillContainerRef.current, {
        theme: "snow",
        modules: {
          toolbar: [["bold", "italic"], [{ list: "bullet" }]],
        },
        placeholder: "Enter campaign description...",
      });
      quillRef.current = quill;

      const textChangeHandler = () => {
        if (quill) {
          if (!quill.getText().trim()) {
            handleInputChange("description", "");
          } else {
            const content = quill.root.innerHTML;
            handleInputChange("description", content);
            setErrors((prev) => ({ ...prev, description: "" }));
          }
        }
      };

      quill.on("text-change", textChangeHandler);
    }

    var tooltipTriggerList = [].slice.call(
      document.querySelectorAll('[data-bs-toggle="tooltip"]')
    );
    tooltipTriggerList.map(function (tooltipTriggerEl) {
      return new bootstrap.Tooltip(tooltipTriggerEl);
    });

    return () => {
      if (quillRef.current) {
        quillRef.current = null;
      }
      if (quillContainerRef.current) {
        quillContainerRef.current = null;
      }
      if (quill) {
        quill.off("text-change");
      }
    };
  }, []);

  // Generic input change
  const handleInputChange = (field, value) => {
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  // Age change
  const handleAgeChange = (ageId) => {
    setForm((prev) => ({
      ...prev,
      demographics: {
        ...prev.demographics,
        age_range_ids: prev.demographics.age_range_ids.includes(ageId)
          ? prev.demographics.age_range_ids.filter((id) => id !== ageId)
          : [...prev.demographics.age_range_ids, ageId],
      },
    }));
    setErrors((prev) => ({ ...prev, demographics: "" }));
  };

  // Location change
  const handleLocationChange = (loc) => {
    setForm((prev) => ({
      ...prev,
      locations: [
        {
          city_id: loc.city?.id ?? null,
          state_id: loc.state?.id,
          country_id: loc.state?.country_id,
          radius_miles: 5, //default
        },
      ],
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
    setForm((prev) => ({
      ...prev,
      demographics: {
        ...prev.demographics,
        use_gender: !useGender,
      },
    }));
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

  useEffect(() => {
    setForm((prev) => ({
      ...prev,
      demographics: {
        ...prev.demographics,
        percent_male: genderRatio == 50 ? 50 : Math.abs(75 - genderRatio),
        percent_female: genderRatio == 50 ? 50 : Math.abs(25 - genderRatio),
      },
    }));
  }, [genderRatio]);

  // Validation
  const validateForm = () => {
    const newErrors = {};

    // Name: required and non-empty after trim
    if (!form.name.trim()) {
      newErrors.name = "Campaign title is required";
    }

    // Demographic: at least one age range selected
    if (form.demographics.age_range_ids.length === 0) {
      newErrors.demographics = "At least one age range must be selected";
    }

    // Follower min: >= 0
    if (form.follower_min < 0) {
      newErrors.follower_min = "Minimum followers must be at least 0";
    }

    // Likes min: >= 0
    if (form.likes_min < 0) {
      newErrors.likes_min = "Minimum likes must be at least 0";
    }

    // Story impressions min: >= 0
    if (form.story_impressions_min < 0) {
      newErrors.story_impressions_min =
        "Minimum story impressions must be at least 0";
    }

    // Engagement range: required
    if (!form.ad_campaign_engagement_range_id) {
      newErrors.ad_campaign_engagement_range_id =
        "Engagement range is required";
    }

    // Draft date: required and valid date
    if (form.draft_date) {
      const draftDate = new Date(form.draft_date);
      if (isNaN(draftDate.getTime())) {
        newErrors.draft_date = "Draft date must be a valid date";
      }
    }

    // Approval required: boolean, no validation needed

    // Publish from: required and valid date
    if (!form.publish_from) {
      newErrors.publish_from = "Publish from date is required";
    } else {
      const fromDate = new Date(form.publish_from);
      if (isNaN(fromDate.getTime())) {
        newErrors.publish_from = "Publish from must be a valid date";
      } else if (form.draft_date && new Date(form.draft_date) > fromDate) {
        newErrors.publish_from = "Publish from cannot be before draft date";
      }
    }

    // Publish until: required if from is set, valid date, and >= from (can be same)
    if (!form.publish_until) {
      newErrors.publish_until = "Publish until date is required";
    } else {
      const untilDate = new Date(form.publish_until);
      if (isNaN(untilDate.getTime())) {
        newErrors.publish_until = "Publish until must be a valid date";
      } else if (form.publish_from && untilDate < new Date(form.publish_from)) {
        newErrors.publish_until =
          "Publish until must be on or after publish from";
      } else if (form.draft_date && untilDate < new Date(form.draft_date)) {
        newErrors.publish_until = "Publish until cannot be before draft date";
      }
    }

    // Deliverable: required
    if (!form.ad_campaign_deliverable_id) {
      newErrors.ad_campaign_deliverable_id = "Deliverable is required";
    }

    // Price: min $25 unless showImpressionsCap, and >=0
    const priceNum = parseFloat(form.price);
    if (isNaN(priceNum) || priceNum < 0) {
      newErrors.price = "Price must be a valid number >= 0";
    } else if (priceNum < 25 && !showImpressionsCap) {
      newErrors.price = "$25 minimum";
    }

    // Description: required and min length (e.g., 10 chars)
    if (!form.description.trim()) {
      newErrors.description = "Description is required 1";
    } else if (form.description.trim().length < 10) {
      newErrors.description = "Description must be at least 10 characters";
    }

    // Link: required and valid URL format
    if (!form.link.trim()) {
      newErrors.link = "Link is required";
    } else {
      try {
        new URL(form.link.trim());
      } catch {
        newErrors.link = "Link must be a valid URL (e.g., https://example.com)";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit
  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(form);
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
    console.log(form, errors);
  }, [form]);

  return (
    <>
      <form onSubmit={handleSubmit} id="campaign-form" method="POST">
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

        {/* Audience Age */}
        <div className="mb-3">
          <label>Audience Age</label>
          <br />
          <small id="age_range_ids_error" className="text-danger error">
            {errors.demographics}
          </small>
          <div className="row">
            {data?.age_ranges?.map((age) => (
              <div key={age.id} className="col-3">
                <div className="form-check">
                  <input
                    className="form-check-input age_range_ids"
                    type="checkbox"
                    checked={form.demographics.age_range_ids.includes(age.id)}
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
        <AudienceStateDropdown onChange={(loc) => handleLocationChange(loc)} />

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
                  handleInputChange("likes_min", parseInt(e.target.value) || 0)
                }
                className="form-control outline-0"
                type="number"
                min="0"
                placeholder="0"
                id="likes_min"
                name="likes_min"
              />
              <small id="likes_min_error" className="text-danger error"></small>
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
              >
                {errors.ad_campaign_engagement_range_id}
              </small>
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
                    handleInputChange("is_approval_required", e.target.checked)
                  }
                />
              </div>
            </div>
          </div>
        </div>

        {/* Publishing Date */}
        <div className="mb-3">
          <div className="row">
            <div className="col-12 col-md-6">
              <label>Publish from</label>
              <input
                value={form.publish_from}
                onChange={(e) =>
                  handleInputChange("publish_from", e.target.value)
                }
                type="date"
                className="form-control outline-0"
                id="date_range"
                name="publish_from"
              />
              <small id="publish_from_error" className="text-danger error">
                {errors.publish_from}
              </small>
            </div>
            <div className="col-12 col-md-6">
              <label>Publish until</label>
              <input
                value={form.publish_until}
                onChange={(e) =>
                  handleInputChange("publish_until", e.target.value)
                }
                type="date"
                className="form-control outline-0"
                id="date_range"
                name="publish_until"
              />
              <small id="publish_until_error" className="text-danger error">
                {errors.publish_until}
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
                    parseInt(e.target.value) || null
                  )
                }
                className="form-control outline-0"
              >
                <option value="" hidden disabled>
                  Select Deliverable
                </option>
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
            onChange={() => {}}
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

        <div className="text-center">
          <button
            className="btn btn-next btn-secondary-outline"
            type="submit"
            form="campaign-form"
          >
            CREATE CAMPAIGN
          </button>
        </div>
      </form>
    </>
  );
};

export default CampaignForm;
