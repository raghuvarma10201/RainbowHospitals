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
      <Text style={styles.headingAppointment}>Appointment</Text>
      <View style={styles.imageDetailsWrapper}>
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
          <Text numberOfLines={4} style={styles.specialities}>
            {doctorSpecialitites}
          </Text>
          <Text style={styles.experience}>
            {`Experience ${doctorDetail?.experience ?? 0} Years`}
          </Text>
          {about && (
            <>
              {/* Consultation Buttons */}
              <View style={styles.consultBtnsContainer}>
                <TouchableOpacity
                  disabled={!doctorDetail?.pay_hospital}
                  style={[
                    styles.consultBtn,
                    {
                      backgroundColor: doctorDetail?.pay_hospital
                        ? appointmentType == 'Physical'
                          ? pallette.teal
                          : pallette.pale_turquoise
                        : pallette.dark_grey,
                    },
                  ]}
                  onPress={() => onConsultationPress('Physical')}>
                  <View style={[styles.iconContainer]}>
                    <Image
                      source={images.physical}
                      style={[
                        styles.consultBtnImg,
                        {
                          tintColor: doctorDetail?.pay_hospital
                            ? appointmentType == 'Physical'
                              ? pallette.white
                              : pallette.black
                            : pallette.white,
                        },
                      ]}
                    />
                  </View>

                  <Text
                    style={[
                      styles.consultBtnTxt,
                      {
                        color: doctorDetail?.pay_hospital
                          ? appointmentType == 'Physical'
                            ? pallette.white
                            : pallette.black
                          : pallette.white,
                      },
                    ]}>
                    Physical Consultation
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  disabled={!doctorDetail?.pay_now}
                  style={[
                    styles.consultBtn,
                    {
                      backgroundColor: doctorDetail?.pay_now
                        ? appointmentType == 'Video'
                          ? pallette.teal
                          : pallette.pale_turquoise
                        : pallette.dark_grey,
                    },
                  ]}
                  onPress={() => onConsultationPress('Video')}>
                  <View style={[styles.iconContainer]}>
                    <Image
                      source={images.video}
                      style={[
                        styles.consultBtnImg,
                        {
                          tintColor: doctorDetail?.pay_now
                            ? appointmentType == 'Video'
                              ? pallette.white
                              : pallette.black
                            : pallette.white,
                        },
                      ]}
                    />
                  </View>

                  <Text
                    style={[
                      styles.consultBtnTxt,
                      {
                        color: doctorDetail?.pay_now
                          ? appointmentType == 'Video'
                            ? pallette.white
                            : pallette.black
                          : pallette.white,
                      },
                    ]}>
                    Video Consultation
                  </Text>
                </TouchableOpacity>
              </View>
              {/* About Section */}
              {/* <View style={styles.divider} />
                <Text style={styles.aboutTitle}>About</Text>
                <ShortInfoText text={doctorDetail?.short_info || ''} /> */}
            </>
          )}
        </View>
      </View>
    </View>
  );
};

export default memo(DoctorDetailsCard);

// ---------- STYLES ----------
const styles = StyleSheet.create({
  headingAppointment: {
    fontSize: adjust(13),
    color: pallette.rainbow,
    fontFamily: 'ProximaNovaA-Bold',
    marginBottom: w * 0.02,
    textAlign: 'center',
    paddingVertical: h * 0.02,
    textTransform: 'uppercase',
    letterSpacing: 5,
  },
  container: {
    backgroundColor: pallette.white,
    paddingHorizontal: w * 0.02,
    width: '90%',
    alignSelf: 'center',
    borderTopLeftRadius: w * 0.1,
    borderTopRightRadius: w * 0.1,
  },

  imageDetailsWrapper: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    gap: w * 0.02,
  },

  imageWrapper: {
    height: h * 0.22,
    width: h * 0.17,
    backgroundColor: pallette.white,
    borderWidth: 4,
    borderColor: '#EBECEC',
    padding: 5,
    overflow: 'hidden',
    borderRadius: 0,
  },
  docImg: {
    height: h * 0.22,
    width: '100%',
    borderRadius: 0,
    resizeMode: 'cover',
  },
  dotWrapper: {
    height: w * 0.05,
    width: w * 0.05,
    borderRadius: w * 0.1,
    backgroundColor: pallette.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dot: {
    height: w * 0.035,
    width: w * 0.035,
    backgroundColor: pallette.medium_turquoise,
  },
  detailsWrapper: {
    backgroundColor: pallette.white,
    gap: w * 0.005,
    width: w * 0.5,
  },
  doctorName: {
    fontSize: adjust(14),
    color: pallette.rainbow,
    fontFamily: 'ProximaNovaA-Bold',
  },
  designation: {
    fontSize: adjust(12),
    marginTop: 3,
    color: pallette.black,
    fontFamily: 'ProximaNovaA-Regular',
  },
  specialities: {
    fontSize: adjust(12),
    color: pallette.black,
    fontFamily: 'ProximaNovaA-Regular',
  },
  experience: {
    fontSize: adjust(12),
    color: pallette.black,
    marginTop: 3,
    marginBottom: 5,
    fontFamily: 'ProximaNovaA-Regular',
  },
  consultBtnsContainer: {},
  consultBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginVertical: h * 0.003,
    borderRadius: w * 0.05,
    borderWidth: 1,
    borderColor: pallette.teal,
    paddingHorizontal: w * 0.08,
  },
  consultBtnTxt: {
    fontSize: adjust(12),
    color: pallette.black,

    fontFamily: 'ProximaNovaA-Semibold',
    paddingLeft: 10,
  },
  iconContainer: {
    height: h * 0.05,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  consultBtnImg: {
    resizeMode: 'contain',
    width: w * 0.05,
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
