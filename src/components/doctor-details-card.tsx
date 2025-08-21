import React, {memo} from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ImageSourcePropType,
} from 'react-native';
import {IMG_BASE_URL} from '../utils/environment';
import {h, pallette, w} from '../Constants/Constant';
import ShortInfoText from './ShortInfoText';
import {adjust} from '../utils/commonFunctions';

/**
 * Types for Doctor Details
 */
interface DoctorDetail {
  name?: string;
  designation?: string;
  small_image?: string;
  experience?: number;
  short_info?: string;
  physical_consultation_fee?: string | undefined;
  video_consultation_fee?: string | undefined;
}

interface Props {
  doctorDetail: DoctorDetail;
  doctorSpecialitites: string;
  appointmentType: string;
  about?: boolean;
  onConsultationPress: (type: string) => void;
}

const DoctorDetailsCard: React.FC<Props> = ({
  doctorDetail,
  doctorSpecialitites,
  appointmentType,
  about = false,
  onConsultationPress,
}) => {
  // Fallback doctor profile image
  const doctorImage: ImageSourcePropType = doctorDetail?.small_image
    ? {uri: `${IMG_BASE_URL}${doctorDetail.small_image}`}
    : {
        uri: 'https://cdn-icons-png.flaticon.com/512/387/387561.png',
      };

  return (
    <View style={styles.container}>
      {/* Doctor Image with Status Dot */}
      <View style={styles.imageWrapper}>
        <Image source={doctorImage} style={styles.docImg} />
        <View style={styles.dotWrapper}>
          <View style={styles.dot} />
        </View>
      </View>

      {/* Doctor Information */}
      <View style={styles.detailsWrapper}>
        <Text style={styles.doctorName}>{doctorDetail?.name}</Text>
        <Text style={styles.designation}>{doctorDetail?.designation}</Text>
        <Text style={styles.specialities}>{doctorSpecialitites}</Text>
        <Text style={styles.experience}>
          {`Experience ${doctorDetail?.experience ?? 0} Years`}
        </Text>

        {about && (
          <>
            {/* Consultation Buttons */}
            <View style={styles.consultBtnsContainer}>
              <TouchableOpacity
                disabled={!doctorDetail?.physical_consultation_fee}
                style={[
                  styles.consultBtn,
                  {
                    backgroundColor: doctorDetail?.physical_consultation_fee
                      ? appointmentType == 'Physical'
                        ? pallette.app_green
                        : pallette.app_light_green
                      : pallette.dark_grey,
                  },
                ]}
                onPress={() => onConsultationPress('Physical')}>
                <Text
                  style={[
                    styles.consultBtnTxt,
                    {
                      color: doctorDetail?.physical_consultation_fee
                        ? appointmentType == 'Physical'
                          ? pallette.white
                          : pallette.black
                        : pallette.white,
                    },
                  ]}>
                  Physical Consultation
                </Text>
                <View
                  style={[
                    styles.iconContainer,
                    {
                      backgroundColor: doctorDetail?.physical_consultation_fee
                        ? pallette.app_green
                        : pallette.dark_grey,
                    },
                  ]}>
                  <Image
                    source={require('../../assets/images/physical-consultation-icon.png')}
                    style={styles.consultBtnImg}
                  />
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                disabled={!doctorDetail?.video_consultation_fee}
                style={[
                  styles.consultBtn,
                  {
                    backgroundColor: doctorDetail?.video_consultation_fee
                      ? appointmentType == 'Video'
                        ? pallette.app_green
                        : pallette.app_light_green
                      : pallette.dark_grey,
                  },
                ]}
                onPress={() => onConsultationPress('Video')}>
                <Text
                  style={[
                    styles.consultBtnTxt,
                    {
                      color: doctorDetail?.video_consultation_fee
                        ? appointmentType == 'Video'
                          ? pallette.white
                          : pallette.black
                        : pallette.white,
                    },
                  ]}>
                  Video Consultation
                </Text>
                <View
                  style={[
                    styles.iconContainer,
                    {
                      backgroundColor: doctorDetail?.video_consultation_fee
                        ? pallette.app_green
                        : pallette.dark_grey,
                    },
                  ]}>
                  <Image
                    source={require('../../assets/images/video-consultation-icon.png')}
                    style={styles.consultBtnImg}
                  />
                </View>
              </TouchableOpacity>
            </View>

            {/* About Section */}
            <View style={styles.divider} />
            <Text style={styles.aboutTitle}>About</Text>
            <ShortInfoText text={doctorDetail?.short_info || ''} />
          </>
        )}
      </View>
    </View>
  );
};

export default memo(DoctorDetailsCard);

/**
 * Styles
 */
const styles = StyleSheet.create({
  container: {
    backgroundColor: pallette.app_purple,
    paddingTop: h * 0.1,
    paddingHorizontal: w * 0.02,
    width: '90%',
    alignSelf: 'center',
    marginTop: h * 0.12,
    borderTopLeftRadius: w * 0.1,
    borderTopRightRadius: w * 0.1,
  },
  imageWrapper: {
    height: h * 0.2,
    width: h * 0.2,
    backgroundColor: pallette.white,
    position: 'absolute',
    borderRadius: h * 0.1,
    top: -(h * 0.1),
    left: w * 0.2,
    borderWidth: 0.3,
    borderColor: 'grey',
    padding: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  docImg: {
    height: h * 0.19,
    width: h * 0.19,
    borderRadius: h * 0.1,
    resizeMode: 'cover',
  },
  dotWrapper: {
    height: w * 0.05,
    width: w * 0.05,
    borderRadius: w * 0.1,
    backgroundColor: pallette.white,
    position: 'absolute',
    right: w * 0.02,
    top: h * 0.15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dot: {
    height: w * 0.035,
    width: w * 0.035,
    borderRadius: w * 0.1,
    backgroundColor: pallette.app_medium_green,
  },
  detailsWrapper: {
    padding: 8,
    backgroundColor: pallette.app_purple,
    width: '100%',
    gap: h * 0.005,
  },
  doctorName: {
    fontSize: adjust(14),
    color: pallette.app_medium_green,
    fontFamily: 'ProximaNovaA-Semibold',
  },
  designation: {
    fontSize: adjust(10),
    marginTop: 3,
    color: pallette.white,
    fontFamily: 'ProximaNovaA-Regular',
  },
  specialities: {
    fontSize: adjust(9),
    color: pallette.white,
    fontFamily: 'ProximaNovaA-Regular',
  },
  experience: {
    fontSize: adjust(12),
    color: pallette.app_medium_green,
    marginTop: 3,
    marginBottom: 5,
    fontFamily: 'ProximaNovaA-Regular',
  },
  consultBtnsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
  },
  consultBtn: {
    paddingVertical: w * 0.02,
    paddingHorizontal: w * 0.02,
    justifyContent: 'center',
    width: '48%',
    marginVertical: h * 0.01,
  },
  consultBtnTxt: {
    fontSize: adjust(10),
    color: pallette.black,
    textAlign: 'left',
    fontFamily: 'ProximaNovaA-Regular',
    paddingLeft: 32,
  },
  iconContainer: {
    height: h * 0.05,
    width: 30,
    position: 'absolute',
    backgroundColor: pallette.app_medium_green,
    left: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  consultBtnImg: {
    height: '80%',
    width: '80%',
    resizeMode: 'contain',
    tintColor: 'white',
  },
  divider: {
    height: 1,
    width: '100%',
    backgroundColor: '#b6e7e6ff',
    marginVertical: 10,
  },
  aboutTitle: {
    fontSize: adjust(14),
    color: pallette.app_medium_green,
    marginBottom: 5,
    fontFamily: 'ProximaNovaA-Regular',
  },
});
