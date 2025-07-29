import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import type { NavigationProp } from '@react-navigation/native';
import { fetchSettings } from '../services/common';
import { SettingsResponse } from '../utils/types';

type TimerContextType = {
  secondsLeft: number;
  startTimer: () => void;
  clearTimers: () => void;
  physicalInterval: number | null;
  joinEnableOffsetSeconds: number | null;
  setPhysicalInterval: (value: number | null) => void;
};

const TimerContext = createContext<TimerContextType | undefined>(undefined);

export const TimerProvider = ({ children }: { children: React.ReactNode }) => {
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [physicalInterval, setPhysicalInterval] = useState<number | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [joinEnableOffsetSeconds, setJoinEnableOffsetSeconds] = useState<number | null>(null);
  const navigation = useNavigation<NavigationProp<any>>();

  const startTimer = async () => {
    clearTimers();

    const settings = await getSettings();

    if (settings) {
      const { joinEnableOffsetSeconds, physicalBookingInterval } = settings;

      console.log('✅ Settings fetched:', settings);

      if (joinEnableOffsetSeconds) {
        setJoinEnableOffsetSeconds(joinEnableOffsetSeconds);
      }

      if (physicalBookingInterval && physicalBookingInterval > 0) {
        setPhysicalInterval(physicalBookingInterval);
        setSecondsLeft(physicalBookingInterval);

        intervalRef.current = setInterval(() => {
          setSecondsLeft(prev => prev - 1);
        }, 1000);

        timeoutRef.current = setTimeout(() => {
          clearTimers();
          navigation.navigate('Home' as never);
        }, physicalBookingInterval * 1000); // ✅ correct timeout here
      } else {
        console.warn('⚠️ Invalid timer value. Timer not started.');
      }
    } else {
      console.error('❌ Failed to fetch settings.');
    }
  };

  const getSettings = async () => {
    const settings = await fetchSettings();

    if (settings && settings.status == 200) {

      const physicalInterval = settings.data.find(
        (item: { key: string }) =>
          item.key === 'physical_appointment_booking_slot_interval',
      )?.value;

      const joinOffset = settings.data.find(
        (item: { key: string }) => item.key === 'join_enable_offset_seconds',
      )?.value;

      const doctorSessionCount = settings.data.find(
        (item: { key: string }) => item.key === 'doctor_sessions_count',
      )?.value;

      return {
        physicalBookingInterval: Number(physicalInterval) || 0,
        joinEnableOffsetSeconds: Number(joinOffset) || 0,
        doctorSessionCount: Number(doctorSessionCount) || 0,
      };
    } else {
      console.error('❌ Failed to fetch settings.');
    }
  }

  const clearTimers = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    intervalRef.current = null;
    timeoutRef.current = null;
    setSecondsLeft(0);
  };

  useEffect(() => {
    if (secondsLeft <= 0 && intervalRef.current) {
      clearTimers();
    }
  }, [secondsLeft]);

  return (
    <TimerContext.Provider
      value={{ secondsLeft, startTimer, clearTimers, physicalInterval, setPhysicalInterval, joinEnableOffsetSeconds, }}
    >
      {children}
    </TimerContext.Provider>
  );
};

export const useTimer = () => {
  const context = useContext(TimerContext);
  if (!context) {
    throw new Error('useTimer must be used within TimerProvider');
  }
  return context;
};
