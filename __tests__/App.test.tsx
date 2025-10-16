import React from 'react';
import {render, waitFor} from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {getToken} from '@react-native-firebase/messaging';
import dayjs from 'dayjs';

// ---------------------------
// Mocks
// ---------------------------

// Mock theme
jest.mock('../src/config/theme', () => ({
  AppTheme: {
    colors: {
      primary: '#6200ee',
      background: '#ffffff',
      surface: '#ffffff',
      accent: '#03dac4',
      error: '#B00020',
      text: '#000000',
      onSurface: '#000000',
      disabled: '#f0f0f0',
      placeholder: '#a0a0a0',
      backdrop: '#000000',
      notification: '#f50057',
    },
  },
}));

// Mock i18n
jest.mock('../src/i18n', () => ({
  initReactI18next: jest.fn(),
}));

// Mock react-native-localize
jest.mock('react-native-localize', () => ({
  getLocales: () => [{languageTag: 'en-US', isRTL: false}],
  findBestAvailableLanguage: () => ({languageTag: 'en-US', isRTL: false}),
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
}));

// Mock react-navigation
jest.mock('@react-navigation/native', () => ({
  NavigationContainer: ({children}: any) => <>{children}</>,
  useNavigation: jest.fn(),
}));

// Mock react-native-paper
jest.mock('react-native-paper', () => ({
  Provider: ({children}: any) => <>{children}</>,
}));

// Mock context providers
jest.mock('../src/context', () => {
  const React = require('react');
  return {
    AppProvider: ({children}: any) => <>{children}</>,
    AuthContext: React.createContext({}),
    TimerProvider: ({children}: any) => <>{children}</>,
    JitsiProvider: ({children}: any) => <>{children}</>,
    SettingsProvider: ({children}: any) => <>{children}</>,
  };
});

// Mock navigation stacks
jest.mock('../src/navigation/navigation', () => {
  const React = require('react');
  const {Text} = require('react-native');
  return {
    AuthStack: () => <Text>Auth Stack</Text>,
    MainStack: () => <Text>Main Stack</Text>,
    navigationRef: jest.fn(),
  };
});

// Mock service handlers
jest.mock('../src/utils/service-handlers', () => ({
  requestUserPermission: jest.fn(() => Promise.resolve(true)),
  setupNotificationListeners: jest.fn(),
}));

// Mock fetchSettings
jest.mock('../src/services/common', () => ({
  fetchSettings: jest.fn(() => Promise.resolve({status: 200})),
}));

// ---------------------------
// Mock Toast with forwardRef to suppress ref warning
// ---------------------------
jest.mock('react-native-toast-message', () => {
  const React = require('react');
  return {
    __esModule: true,
    default: React.forwardRef(() => <></>),
    show: jest.fn(),
    hide: jest.fn(),
  };
});

// ---------------------------
// Mock SafeAreaView and SafeAreaProvider
// ---------------------------
jest.mock('react-native-safe-area-context', () => {
  const React = require('react');
  return {
    SafeAreaView: ({children}: any) => <>{children}</>,
    SafeAreaProvider: ({children}: any) => <>{children}</>,
  };
});

// ---------------------------
// Mock notifee with AndroidImportance
// ---------------------------
jest.mock('@notifee/react-native', () => ({
  __esModule: true,
  default: {
    createChannel: jest.fn(),
  },
  AndroidImportance: {
    HIGH: 4,
    DEFAULT: 3,
    LOW: 2,
    MIN: 1,
    NONE: 0,
  },
}));

// Silence warnings about not wrapped in act()
jest.useFakeTimers();

// ---------------------------
// Import App after mocks
// ---------------------------
import App from '../App';
import notifee from '@notifee/react-native';

// ---------------------------
// Tests
// ---------------------------
describe('App.tsx', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading spinner initially', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(null);
    const {getByTestId} = render(<App />);
    await waitFor(() => {
      expect(getByTestId('ActivityIndicator')).toBeTruthy();
    });
  });

  it('renders AuthStack when not logged in', async () => {
    (AsyncStorage.getItem as jest.Mock)
      .mockResolvedValueOnce(null) // token
      .mockResolvedValueOnce(null); // expiry

    const {getByText} = render(<App />);
    await waitFor(() => {
      expect(getByText('Auth Stack')).toBeTruthy();
    });
  });

  it('renders MainStack when logged in and token is valid', async () => {
    const validExpiry = dayjs().add(1, 'day').toISOString();
    (AsyncStorage.getItem as jest.Mock)
      .mockResolvedValueOnce('mock-token') // token
      .mockResolvedValueOnce(validExpiry); // expiry

    const {getByText} = render(<App />);
    await waitFor(() => {
      expect(getByText('Main Stack')).toBeTruthy();
    });
  });

  it('creates notification channels on mount', async () => {
    (AsyncStorage.getItem as jest.Mock)
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce(null);

    render(<App />);

    await waitFor(() => {
      expect(notifee.createChannel).toHaveBeenCalledTimes(3); // depends on how many channels App creates
    });
  });

  it('stores FCM token in AsyncStorage', async () => {
    (AsyncStorage.getItem as jest.Mock)
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce(null);

    (getToken as jest.Mock).mockResolvedValueOnce('mocked-fcm-token');

    render(<App />);

    await waitFor(() => {
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        'FcmTtoken',
        'mocked-fcm-token',
      );
    });
  });
});
