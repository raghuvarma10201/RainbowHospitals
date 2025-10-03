import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {
  ImageResizeMode,
  StatusBarStyle,
  StyleProp,
  TextStyle,
  ViewStyle,
} from 'react-native';
import {MainStackParamList} from './navigation';

type NavProp = NativeStackNavigationProp<MainStackParamList>;

interface BannerProps {
  images: any[];
  activeindex: number;
  setActiveindex: (index: number) => void;
  height: number;
  width: number;
  marginVertical?: number;
  resizeMode?: ImageResizeMode | undefined;
  autoScrollEnabled?: boolean;
  itemWidth?: number;
}

interface CustomStatusBarProps {
  backgroundColor: string;
  barStyle?: StatusBarStyle;
}

interface DoctorDetail {
  name?: string;
  designation?: string;
  small_image?: string;
  experience?: number;
  short_info?: string;
  physical_consultation_fee?: string | undefined;
  video_consultation_fee?: string | undefined;
  pay_hospital?: any;
  pay_now?: any;
}

interface DoctorDetailsCardProps {
  doctorDetail: DoctorDetail;
  doctorSpecialitites: string;
  appointmentType: string;
  about?: boolean;
  onConsultationPress: (type: any) => void;
}

type FooterIcon = 'home' | 'calendar' | 'call' | 'reports';

interface FooterProps {
  activeIcon?: FooterIcon;
}

interface FooterButtonProps {
  icon: FooterIcon;
  onPress?: () => void;
  source: any;
}

interface NotFoundProps {
  text: string;
  margin: any;
  change?: any;
  hideBtn?: any;
}

interface HeaderProps {
  title?: string;
  showLocation?: boolean;
  showBack?: boolean;
  showModal?: boolean;
}

interface LoaderProps {
  fullScreen?: boolean;
}

interface PaginationDotsProps {
  data: any[];
  activeIndex: number;
}

interface SearchLocationBlockProps {
  style?: any;
  searchFn: (query: string) => void;
  results?: any[];
  navigation?: any;
}

interface LocationOptionsProps {
  value: string;
  label: string;
}

interface ShortInfoTextProps {
  text: string;
  maxChars?: number;
  containerStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

export type {
  NavProp,
  BannerProps,
  CustomStatusBarProps,
  DoctorDetailsCardProps,
  FooterIcon,
  FooterProps,
  FooterButtonProps,
  NotFoundProps,
  HeaderProps,
  LoaderProps,
  PaginationDotsProps,
  SearchLocationBlockProps,
  LocationOptionsProps,
  ShortInfoTextProps,
};
