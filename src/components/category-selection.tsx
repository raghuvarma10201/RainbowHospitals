import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useCallback, useState} from 'react';
import {h, pallette, w} from '../constants/constants';
import {adjust, ToastService} from '../utils';
import {useApp} from '../context/app-context';
import {Category} from '../services/Region/api';
import {getCategories} from '../services/common';
import {useFocusEffect} from '@react-navigation/native';
import {string} from 'yup';

const images = {
  childCare: require('../../assets/images/child-care.png'),
  womenCare: require('../../assets/images/women-care.png'),
  fertility: require('../../assets/images/fertility.png'),
};

const CategorySelection = ({
  screen,
  changeCategory,
}: {
  screen?: string;
  changeCategory?: any;
}) => {
  const {category, updateCategory, branch} = useApp();
  const [categories, setCategories] = useState<Category[]>([]);

  const fetchCategries = useCallback(async () => {
    try {
      const {data} = await getCategories();
      console.log(data);
      setCategories(data);
    } catch (err) {
      console.error('Error fetching categories:', err);
      ToastService.error('Error', 'Unable to fetch categoriess');
      setCategories([]);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchCategries();
    }, [fetchCategries]),
  );
  return (
    <View style={styles.categoryContainer}>
      {categories.map((cat, index) => (
        <TouchableOpacity
          onPress={() => {
            screen == 'docList' ? changeCategory(cat) : updateCategory(cat);
          }}
          style={[
            styles.category,
            {
              borderBottomWidth: 4,
              borderColor:
                cat?.name == category?.name
                  ? pallette.medium_turquoise
                  : pallette.white,
            },
          ]}>
          <View
            style={[
              styles.categoryImgContainer,
              {
                backgroundColor:
                  cat?.name == category?.name
                    ? cat?.name != 'Child Care'
                      ? pallette.amethyst
                      : pallette.medium_turquoise
                    : pallette.dark_purple,
              },
            ]}>
            <Image
              source={
                cat?.name == 'Child Care'
                  ? images.childCare
                  : cat?.name == 'Women Care'
                  ? images.womenCare
                  : images.fertility
              }
              style={styles.categoryImg}
            />
          </View>
          <Text style={styles.categoryTxt}>{cat?.name}</Text>
        </TouchableOpacity>
      ))}
      {/* <TouchableOpacity
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
      </TouchableOpacity> */}
    </View>
  );
};

export default CategorySelection;

const styles = StyleSheet.create({
  categoryContainer: {
    height: w * 0.2,
    width: w * 0.9,
    alignSelf: 'center',
    flexDirection: 'row',
    borderBottomWidth: 0.7,
    borderColor: pallette.light_grey,
    marginTop: h * 0.02,
  },
  category: {
    height: '100%',
    width: w * 0.3,
    justifyContent: 'space-between',
    alignItems: 'center',
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
    paddingBottom: h * 0.012,
  },
});
