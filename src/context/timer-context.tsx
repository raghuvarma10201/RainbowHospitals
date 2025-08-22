import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import {useNavigation, NavigationProp} from '@react-navigation/native';
import {useSettings} from './settings-context';

type TimerContextType = {
  secondsLeft: number;
  startTimer: () => void;
  clearTimers: () => void;
  physicalInterval: number | null;
  joinEnableOffsetSeconds: number | null;
};

const TimerContext = createContext<TimerContextType | undefined>(undefined);

const TimerProvider = ({children}: {children: React.ReactNode}) => {
  const [secondsLeft, setSecondsLeft] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const navigation = useNavigation<NavigationProp<any>>();

  const {settings} = useSettings();

  const startTimer = () => {
    clearTimers();

    if (settings && settings.physicalBookingInterval > 0) {
      setSecondsLeft(settings.physicalBookingInterval);

      intervalRef.current = setInterval(() => {
        setSecondsLeft(prev => prev - 1);
      }, 1000);

      timeoutRef.current = setTimeout(() => {
        clearTimers();
        navigation.navigate('Home' as never);
      }, settings.physicalBookingInterval * 1000);
    } else {
      console.warn('⚠️ Invalid timer value. Timer not started.');
    }
  };

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
      value={{
        secondsLeft,
        startTimer,
        clearTimers,
        physicalInterval: settings?.physicalBookingInterval ?? null,
        joinEnableOffsetSeconds: settings?.joinEnableOffsetSeconds ?? null,
      }}>
      {children}
    </TimerContext.Provider>
  );
};

export default TimerProvider;

export const useTimer = () => {
  const context = useContext(TimerContext);
  if (!context) throw new Error('useTimer must be used within TimerProvider');
  return context;
};
