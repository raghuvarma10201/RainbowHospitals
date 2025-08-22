import React, {createContext, useContext, useEffect, useState} from 'react';
import {fetchSettings} from '../services/common';

type Settings = {
  physicalBookingInterval: number;
  onlineBookingInterval: number;
  joinEnableOffsetSeconds: number;
  doctorSessionCount: number;
};

type SettingsContextType = {
  settings: Settings | null;
  refreshSettings: () => Promise<void>;
};

const SettingsContext = createContext<SettingsContextType | undefined>(
  undefined,
);

const SettingsProvider = ({children}: {children: React.ReactNode}) => {
  const [settings, setSettings] = useState<Settings | null>(null);

  const loadSettings = async () => {
    const res = await fetchSettings();
    if (res && res.status === 200) {
      const physicalInterval = res.data.find(
        (item: {key: string}) => item.key === 'pay_hospital_cutoff_time',
      )?.value;

      const onlineInterval = res.data.find(
        (item: {key: string}) => item.key === 'pay_online_cutoff_time',
      )?.value;

      const joinOffset = res.data.find(
        (item: {key: string}) => item.key === 'join_enable_offset_seconds',
      )?.value;

      const doctorSessionCount = res.data.find(
        (item: {key: string}) => item.key === 'doctor_sessions_count',
      )?.value;

      setSettings({
        physicalBookingInterval: Number(physicalInterval) || 0,
        onlineBookingInterval: Number(onlineInterval) || 0,
        joinEnableOffsetSeconds: Number(joinOffset) || 0,
        doctorSessionCount: Number(doctorSessionCount) || 0,
      });
    } else {
      console.error('❌ Failed to fetch settings.');
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  return (
    <SettingsContext.Provider value={{settings, refreshSettings: loadSettings}}>
      {children}
    </SettingsContext.Provider>
  );
};

export default SettingsProvider;

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context)
    throw new Error('useSettings must be used within SettingsProvider');
  return context;
};
