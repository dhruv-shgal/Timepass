import React, { createContext, useContext, useState } from 'react';

// Create a context for app state
const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [credits, setCredits] = useState(200);
  const [uploads, setUploads] = useState([]);
  const [roadmaps, setRoadmaps] = useState([]);

  return (
    <AppContext.Provider value={{
      user,
      setUser,
      credits,
      setCredits,
      uploads,
      setUploads,
      roadmaps,
      setRoadmaps
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppStore = () => {
  const context = useContext(AppContext);
  if (!context) {
    // Return default values if context is not available
    return {
      user: null,
      setUser: () => {},
      credits: 200,
      setCredits: () => {},
      uploads: [],
      setUploads: () => {},
      roadmaps: [],
      setRoadmaps: () => {}
    };
  }
  return context;
};