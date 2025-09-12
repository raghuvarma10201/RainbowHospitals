import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {h, pallette, w} from '../constants/constants';
import {adjust} from '../utils';
import {useApp} from '../context/app-context';

const images = {
  childCare: require('../../assets/images/child-care.png'),
  womenCare: require('../../assets/images/women-care.png'),
  fertility: require('../../assets/images/fertility.png'),
};

const CategorySelection = () => {
  const {updateCategory, category, branch} = useApp();
  return (
    <View style={styles.categoryContainer}>
      <TouchableOpacity
        onPress={() => updateCategory('Child Care')}
        style={[
          styles.category,
          {borderBottomWidth: category == 'Child Care' ? 4 : 0},
        ]}>
        <View
          style={[
            styles.categoryImgContainer,
            {
              backgroundColor:
                category == 'Child Care'
                  ? pallette.medium_turquoise
                  : pallette.dark_purple,
            },
          ]}>
          <Image source={images.childCare} style={styles.categoryImg} />
        </View>
        <Text style={styles.categoryTxt}>Child Care</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => updateCategory('Women Care')}
        style={[
          styles.category,
          {borderBottomWidth: category == 'Women Care' ? 4 : 0},
        ]}>
        <View
          style={[
            styles.categoryImgContainer,
            {
              backgroundColor:
                category == 'Women Care'
                  ? pallette.amethyst
                  : pallette.dark_purple,
            },
          ]}>
          <Image source={images.womenCare} style={styles.categoryImg} />
        </View>
        <Text style={styles.categoryTxt}>Women Care</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => updateCategory('Fertility')}
        style={[
          styles.category,
          {borderBottomWidth: category == 'Fertility' ? 4 : 0},
        ]}>
        <View
          style={[
            styles.categoryImgContainer,
            {
              backgroundColor:
                category == 'Fertility'
                  ? pallette.amethyst
                  : pallette.dark_purple,
            },
          ]}>
          <Image source={images.fertility} style={styles.categoryImg} />
        </View>
        <Text style={styles.categoryTxt}>Fertility Care</Text>
      </TouchableOpacity>
    </View>
  );
};

export default CategorySelection;

const styles = StyleSheet.create({
  categoryContainer: {
    height: h * 0.08,
    width: w * 0.9,
    alignSelf: 'center',
    flexDirection: 'row',
    borderBottomWidth: 0.7,
    borderColor: pallette.light_grey,
  },
  category: {
    height: '100%',
    width: w * 0.3,
    justifyContent: 'space-between',
    alignItems: 'center',
    borderColor: pallette.medium_turquoise,
  },
  categoryImgContainer: {
    height: w * 0.1,
    width: w * 0.1,
    backgroundColor: pallette.dark_purple,
    borderRadius: w,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryImg: {
    height: '80%',
    width: '80%',
    resizeMode: 'contain',
  },
  categoryTxt: {
    fontSize: adjust(12),
    color: pallette.dark_purple,
    fontFamily: 'ProximaNova-Regular',
  },
});
