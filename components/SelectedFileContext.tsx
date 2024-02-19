import React, { createContext, useContext, ReactNode, useState } from 'react';

interface SelectedFileContextProps {
  selectedFile: any | null;
  setSelectedFile: (file: any | null) => void;
}

const SelectedFileContext = createContext<SelectedFileContextProps | undefined>(undefined);

export const SelectedFileProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [selectedFile, setSelectedFile] = useState<any | null>(null);

  return (
    <SelectedFileContext.Provider value={{ selectedFile, setSelectedFile }}>
      {children}
    </SelectedFileContext.Provider>
  );
};

export const useSelectedFile = () => {
  const context = useContext(SelectedFileContext);

  if (!context) {
    throw new Error('useSelectedFile must be used within a SelectedFileProvider');
  }

  return context;
};
