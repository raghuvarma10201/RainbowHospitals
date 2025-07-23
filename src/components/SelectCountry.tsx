import React, { useState } from 'react';
import { View, StyleSheet,} from 'react-native';

const local_data = [  {
    value: '1',
    lable: 'EN',
    image: {
      uri: 'https://www.vigcenter.com/public/all/images/default-image.jpg',
    },
  },
  {
    value: '2',
    lable: 'AE',
    image: {
      uri: 'https://www.vigcenter.com/public/all/images/default-image.jpg',
    },
  },
];

const SelectCountry: React.FC<any> = () => {
      const [country, setCountry] = useState('1');
  return (

           <SelectCountry
              style={styles.countryDropdown}
              selectedTextStyle={styles.selectedTextContry}
              placeholderStyle={styles.placeholderCountry}
              imageStyle={styles.imageCountry}
              // inputSearchStyle={styles.inputSearchCountry}
              iconStyle={styles.iconCountry}
              // search
              maxHeight={200}
              value={country}
              data={local_data}
              valueField="value"
              labelField="lable"
              imageField="image"
              placeholder="Select country"
              containerStyle={styles.dropdownList}
              activeColor="#333333"
              // searchPlaceholder="Search..."
              onChange={(e:any) => {
                setCountry(e.value);
              }}
            />
  );
    };

export default SelectCountry;

const styles = StyleSheet.create({
 countryDropdown: {
    width: 90,
    marginBottom: 20,
    marginHorizontal: 20,
    height: 30,
    backgroundColor: '#000000',
    borderRadius: 30,
    color: '#fff',
    paddingHorizontal: 12,
    alignSelf: 'flex-end'



  },
  imageCountry: {
    width: 16,
    height: 16,
    color: '#fff',
  },
  placeholderCountry: {
    fontSize: 14,
    color: '#fff',
  },
  selectedTextContry: {
    fontSize: 12,
    marginLeft: 8,
    color: '#fff',


  },
  iconCountry: {
    width: 13,
    height: 13,
    backgroundColor: '#000',

  },
  inputSearchCountry: {
    height: 40,
    fontSize: 16,
    backgroundColor: '#000',

  },

  dropdownList: {
    backgroundColor: '#000',
    color: '#fff',
    borderColor: '#000',
    borderRadius: 4,

  },
});