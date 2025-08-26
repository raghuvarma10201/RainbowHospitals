// ---------- MODULE IMPORTS ----------
import React, {FC, memo} from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ImageSourcePropType,
} from 'react-native';

// ---------- TYPE IMPORTS ----------
import {DoctorDetailsCardProps} from '../types/components';

// ---------- COMPONENT IMPORTS ----------
import ShortInfoText from './short-info-text';

// ---------- UTILITY IMPORTS ----------
import {IMG_BASE_URL} from '../utils/enums';
import {adjust} from '../utils/common-functions';

// ---------- VALUE IMPORTS ----------
import {doctor_img, h, pallette, w} from '../constants/constants';

// ---------- STATIC DATA OUTSIDE COMPONENT ----------
const images = {
  physical: require('../../assets/images/physical-consultation-icon.png'),
  video: require('../../assets/images/video-consultation-icon.png'),
};

// ---------- COMPONENT ----------
const DoctorDetailsCard: FC<DoctorDetailsCardProps> = ({
  doctorDetail,
  doctorSpecialitites,
  appointmentType,
  about = false,
  onConsultationPress,
}) => {
  // ---------- FALLBACK ----------
  const doctorImage: ImageSourcePropType = doctorDetail?.small_image
    ? {uri: `${IMG_BASE_URL}${doctorDetail.small_image}`}
    : {
        uri: doctor_img,
      };

  // ---------- RENDER ----------
  return (
    <View style={styles.container}>
      {/* Doctor Image */}
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
                        ? pallette.teal
                        : pallette.pale_turquoise
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
                        ? pallette.teal
                        : pallette.dark_grey,
                    },
                  ]}>
                  <Image
                    source={images.physical}
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
                        ? pallette.teal
                        : pallette.pale_turquoise
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
                        ? pallette.teal
                        : pallette.dark_grey,
                    },
                  ]}>
                  <Image source={images.video} style={styles.consultBtnImg} />
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

// ---------- STYLES ----------
const styles = StyleSheet.create({
  container: {
    backgroundColor: pallette.dark_purple,
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
    backgroundColor: pallette.medium_turquoise,
  },
  detailsWrapper: {
    padding: 8,
    backgroundColor: pallette.dark_purple,
    width: '100%',
    gap: h * 0.005,
  },
  doctorName: {
    fontSize: adjust(14),
    color: pallette.medium_turquoise,
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
    color: pallette.medium_turquoise,
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
    backgroundColor: pallette.medium_turquoise,
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
    color: pallette.medium_turquoise,
    marginBottom: 5,
    fontFamily: 'ProximaNovaA-Regular',
  },
});
