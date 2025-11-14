import React, { useContext, useState } from "react";
import "../../App.scss";
import { Link, useNavigate } from "react-router-dom";
import CampaignForm from "./CampaignForm"; // Adjust path as needed for your CampaignForm.jsx
import AdCampaignContext from "../../context/AdCampaignProvider";

const CreateCampaign = () => {
  const [step, setStep] = useState(1);

  const { data, loading } = useContext(AdCampaignContext);
  const [selectedType, setSelectedType] = useState(""); // Reset on init; set during step 1
  const navigate = useNavigate();

  // Campaign data for step 1
  const campaignTypes = [
    {
      id: "instagram",
      name: "Instagram",
      bullets: [
        "Amplify the reach of your already existing brand content, Influencer created content, or user generated content",
        "Get Instagram API-level audience targeting & post-campaign analytics",
        "Same-day content publishing possible",
      ],
    },
    {
      id: "tiktok",
      name: "Tiktok",
      bullets: [
        "Amplify the reach of your already existing brand content, Influencer created content, or user generated content",
        "Get Tiktok API-level audience targeting & post-campaign analytics",
        "Same-day content publishing possible",
      ],
    },
  ];

  // Click handler for platform selection
  const handleSelect = (typeId) => {
    setSelectedType(typeId);
  };

  // Next handler: Advance steps
  const handleNext = () => {
    if (step === 1) {
      if (selectedType) {
        setStep(2);
      } else {
        console.log("Please select a platform first");
        // Optional: Show toast/error UI here
      }
    } else if (step === 2) {
      console.log("Submit form data"); // Integrate with API/submit logic
      // e.g., handleFormSubmit(formData);
    }
  };

  // Back handler: Return to previous step or redirect
  const handleBack = () => {
    if (step === 2) {
      setStep(1);
    } else if (step === 1) {
      navigate("/adcampaigns"); // Redirect to /adcampaigns from step 1
    }
  };

  return (
    <div className="container create-campaign-p">
      <div className="row justify-content-center">
        <div className="col-md-8 col-12">
          <div className="nav-section d-flex justify-content-between pt-4">
            <button onClick={handleBack} className="btn btn-link">
              <i className="back-btn-icon mr-2"></i>
              <span>Back</span>
            </button>
          </div>
        </div>
      </div>
      <div
        className="row justify-content-center"
        id="ad-campaign-form-app"
        data-v-app=""
      >
        <div className="col-md-8 col-12 mb-5">
          <div className="">
            <div className="card-body p-0">
              <div className="page-header">
                {step === 1 && (
                  <div className="d-flex flex-column">
                    <h5>Create Campaign</h5>
                    <p>Choose your platform to launch your campaign!</p>
                  </div>
                )}
              </div>
              {step === 1 ? (
                // Step 1: Platform Selection
                campaignTypes.map((campaign) => (
                  <div
                    key={campaign.id}
                    className={`card campaign-card mb-3 ${
                      selectedType === campaign.id ? "selected" : ""
                    }`}
                  >
                    <div
                      className="card-body"
                      onClick={() => handleSelect(campaign.id)}
                    >
                      <h5>{campaign.name}</h5>
                      {/* Description Bullets */}
                      <ul>
                        {campaign.bullets.map((bullet, index) => (
                          <li key={index}>{bullet}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))
              ) : (
                // Step 2: Campaign Form
                <CampaignForm
                  selectedPlatform={selectedType}
                  onBack={handleBack}
                  onSubmit={handleNext}
                />
              )}
            </div>
          </div>
          {/* Next Button (conditional text/action) */}
          <div className="text-center">
            <button
              className="btn btn-next btn-secondary-outline"
              onClick={handleNext}
              type="button"
              disabled={step === 1 && !selectedType} // Disable if no selection in step 1
            >
              {step === 1 ? "NEXT" : "CREATE CAMPAIGN"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateCampaign;
