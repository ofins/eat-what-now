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
      <div className="auth-container">
        <div className="auth-card">
          <div className="loading-spinner">Loading your profile...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-error">
            Error loading profile: {error.message}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2 className="auth-title">Your Profile</h2>
          <p className="auth-subtitle">Manage your account information</p>
        </div>

        <div className="profile-content">
          <div className="profile-section">
            <h3 className="profile-section-title">Personal Information</h3>
            <div className="profile-info-grid">
              <div className="profile-info-item">
                <span className="profile-label">Full Name</span>
                <span className="profile-value">
                  {data?.data.full_name || "Not provided"}
                </span>
              </div>
              <div className="profile-info-item">
                <span className="profile-label">Email</span>
                <span className="profile-value">
                  {data?.data.email || "Not provided"}
                </span>
              </div>
            </div>
          </div>

          <div className="profile-section">
            <h3 className="profile-section-title">Account Status</h3>
            <div className="profile-info-grid">
              <div className="profile-info-item">
                <span className="profile-label">Account Status</span>
                <span
                  className={`profile-status ${data?.data.is_active ? "active" : "inactive"}`}
                >
                  {data?.data.is_active ? "Active" : "Inactive"}
                </span>
              </div>
              <div className="profile-info-item">
                <span className="profile-label">Email Verified</span>
                <span
                  className={`profile-status ${data?.data.is_verified ? "verified" : "unverified"}`}
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
