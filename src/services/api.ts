import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import dayjs from 'dayjs';
import RNFS from 'react-native-fs';

import { API_BASE_URL } from '../utils/environment';
import { ENABLE_API_LOGGING } from '../utils/environment';

const downloadApiLog = async (msg: string) => {
  if (!ENABLE_API_LOGGING) return;
  try {
    const timestamp = new Date().toISOString();
    const logText = `${timestamp}  ${msg}\n`;

    const fileName = `aber-api-log-${dayjs().format('YYYY-MM-DD')}.txt`;
    const filePath = RNFS.DownloadDirectoryPath + '/' +fileName;
    const exists = await RNFS.exists(filePath);
     if (!exists) {
      await RNFS.writeFile(filePath, logText, 'utf8');
     }
      else {
      await RNFS.appendFile(filePath, logText, 'utf8');
    }
    console.log('Log written to:', filePath);
  } catch (e) {
    console.warn('Failed to download log:', e);
  }
};

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

/* -------- 1. Refresh helper -------- */
const refreshToken = async () => {
  const rt = await AsyncStorage.getItem('refreshToken');
  if (!rt) return null;

  try {
    const { data } = await axios.post(`${API_BASE_URL}/login/refresh`, {
      refreshToken: rt,
    });

    await AsyncStorage.multiSet([
      ['accessToken', data.AccessToken],
      ['refreshToken', data.RefreshToken],
      ['tokenExpiry', data.Expires],
    ]);

    return data.AccessToken;
  } catch (err: any) {
    console.log('[TOKEN REFRESH FAILED]', err?.response?.data);
    await AsyncStorage.clear();
    return null;
  }
};

/* -------- 2. Request interceptor -------- */
api.interceptors.request.use(async config => {
  (config as any).metadata = { start: Date.now() };
  let accessToken = await AsyncStorage.getItem('accessToken');
  const expiry     = await AsyncStorage.getItem('tokenExpiry');

  /* 🔄 Expired? Try refresh right before the request */
  if (expiry && dayjs().isAfter(dayjs(expiry))) {
    console.log('[🔁] AccessToken expired → refreshing');
    accessToken = await refreshToken();
  }

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

/* -------- 3. Response interceptor -------- */
api.interceptors.response.use(
  async response => {
    const { config } = response;
    const ms = Date.now() - (config as any).metadata.start;
    const msg = `[OK] ${config.method?.toUpperCase()} ${config.url} ${response.status} ${ms}ms`;

    downloadApiLog(msg); // 👈 auto-download to Downloads
    return response;
  },
  async error => {
    const { config } = error;
    const ms = Date.now() - (config as any).metadata?.start;
    const status = error.response?.status ?? 'ERR';
    const msg = `[FAIL] ${config?.method?.toUpperCase()} ${config?.url} ${status} ${ms}ms`;

    downloadApiLog(msg); // 👈 still download even if it fails
    return Promise.reject(error);
  }
);

export default api;
