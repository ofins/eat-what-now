import { useQuery } from "@tanstack/react-query";
import "./About.css";

export type UserProfileResponse = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any;
};

const About = () => {
  const { data, isLoading, error } = useQuery<UserProfileResponse>({
    queryKey: ["users/profile"], // Path matches API endpoint
  });

  if (isLoading) {
    return (
      <div className="about-container">
        <div className="about-card">
          <div className="about-loading">Loading your profile...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="about-container">
        <div className="about-card">
          <div className="about-error">Unable to load profile data</div>
        </div>
      </div>
    );
  }

  return (
    <div className="about-container">
      <div className="about-card">
        <div className="about-header">
          <h2 className="about-title">Your Profile</h2>
          <p className="about-subtitle">Manage your account information</p>
        </div>

        <div className="about-content">
          <div className="about-section">
            <h3 className="about-section-title">Personal Information</h3>
            <div className="about-info-grid">
              <div className="about-info-item">
                <span className="about-label">Full Name</span>
                <span className="about-value">
                  {data?.data.full_name || "Not provided"}
                </span>
              </div>
              <div className="about-info-item">
                <span className="about-label">Email</span>
                <span className="about-value">
                  {data?.data.email || "Not provided"}
                </span>
              </div>
            </div>
          </div>

          <div className="about-section">
            <h3 className="about-section-title">Account Status</h3>
            <div className="about-info-grid">
              <div className="about-info-item">
                <span className="about-label">Account Status</span>
                <span
                  className={`about-status ${data?.data.is_active ? "active" : "inactive"}`}
                >
                  {data?.data.is_active ? "Active" : "Inactive"}
                </span>
              </div>
              <div className="about-info-item">
                <span className="about-label">Email Verified</span>
                <span
                  className={`about-status ${data?.data.is_verified ? "verified" : "unverified"}`}
                >
                  {data?.data.is_verified ? "Verified" : "Unverified"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
