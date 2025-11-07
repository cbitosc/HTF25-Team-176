import { Outlet } from 'react-router-dom';
import ProfileSidebar from '../../components/profile/ProfileSidebar';

const ProfileLayout = () => {
  return (
    <div className="profile-layout">
      <div className="profile-container">
        <div className="profile-grid">
          <ProfileSidebar />
          <div className="profile-content">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileLayout;
