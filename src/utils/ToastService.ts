import Toast from 'react-native-toast-message';

type ToastType = 'success' | 'error' | 'info';

const showToast = (
  type: ToastType,
  title: string,
  message?: string,
  position: 'top' | 'bottom' = 'top'
) => {
  Toast.show({
    type,
    position,
    text1: title,
    text2: message,
    visibilityTime: 3000,
    autoHide: true,
    topOffset: 50,
    bottomOffset: 50,
  });
};

export const ToastService = {
  success: (title: string, message?: string) => showToast('success', title, message),
  error: (title: string, message?: string) => showToast('error', title, message),
  info: (title: string, message?: string) => showToast('info', title, message),
};
