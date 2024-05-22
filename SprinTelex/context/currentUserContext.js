import React, { createContext, useState, useContext } from 'react';

// Create a context for the current user's ID
export const CurrentUserContext = createContext({
  currentUserID: null,
  setCurrentUserID: () => {},
});

// Create a provider component for the CurrentUserContext
export const CurrentUserProvider = ({ children }) => {
  const [currentUserID, setCurrentUserID] = useState(null);

  // Function to update the current user ID in the context
  const updateCurrentUserID = (newUserID) => {
    console.log(`Updating current user ID to: ${newUserID}`);
    setCurrentUserID(newUserID);
  };

  const contextValue = {
    currentUserID: currentUserID,
    setCurrentUserID: updateCurrentUserID, // Make sure to use the correct function reference here
  };


  return (
    <CurrentUserContext.Provider value={contextValue}>
      {children}
    </CurrentUserContext.Provider>
  );
};

// Custom hook to use the CurrentUserContext
export const useCurrentUser = () => {
  const context = useContext(CurrentUserContext);
  if (context === undefined) {
    throw new Error('useCurrentUser must be used within a CurrentUserProvider');
  }
  return context;
};