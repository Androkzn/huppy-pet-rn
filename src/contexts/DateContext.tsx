/**
 * Date Context
 *
 * The selected diary date. On the web this lived in data.context alongside the
 * user and profiles, because the NavBar's date picker and the Home/Training
 * pages all read and write it.
 */

import React, { createContext, useContext, useState } from 'react';

interface DateContextType {
  currentDate: Date;
  setCurrentDate: (date: Date) => void;
}

const DateContext = createContext<DateContextType | undefined>(undefined);

export const DateProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  return (
    <DateContext.Provider value={{ currentDate, setCurrentDate }}>
      {children}
    </DateContext.Provider>
  );
};

export const useCurrentDate = () => {
  const context = useContext(DateContext);
  if (context === undefined) {
    throw new Error('useCurrentDate must be used within a DateProvider');
  }
  return context;
};
