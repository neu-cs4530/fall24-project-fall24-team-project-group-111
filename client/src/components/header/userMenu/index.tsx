import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './index.css';

/**
 * Interface represents the props for the UserMenu.
 *
 * username - The user's username to display
 * onLogout - The function to call when the user logs out
 */
interface UserMenuProps {
  username: string;
  onLogout: () => void;
}

/**
 * A UserMenu component that displays a dropdown menu for the user,
 * containing options to navigate to the settings page or to log out.
 *
 * @param username - The user's username to display
 * @param onLogout - The function to call when the user logs out
 */
const UserMenu = ({ username, onLogout }: UserMenuProps) => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  /**
   * Function to handle navigation to the settings page.
   */
  const handleNavigateSettings = () => {
    navigate('/settings');
    setIsOpen(false);
  };

  /**
   * Function to toggle the dropdown menu open or closed.
   */
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className='dropdown'>
      <button className='menubtn' onClick={toggleDropdown}>
        Hi, {username} <span className={`caret ${isOpen ? 'open' : ''}`}></span>
      </button>
      {isOpen && (
        <div className='dropdown-content'>
          <a onClick={handleNavigateSettings}>Settings</a>
          <a onClick={onLogout}>Logout</a>
        </div>
      )}
    </div>
  );
};

export default UserMenu;
