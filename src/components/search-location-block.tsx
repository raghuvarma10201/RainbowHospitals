import React, {useState, memo} from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {TextInput} from 'react-native-paper';
import {h, w, pallette} from '../constants/constants';
import {adjust} from '../utils/common-functions';
import {
  LocationOptionsProps,
  SearchLocationBlockProps,
} from '../types/components';
import {routes} from '../utils';
import {MainStackParamList} from '../types/navigation';
import {useApp} from '../context/app-context';

// ---------- STATIC DATA (memoized outside component) ----------
const location_options: LocationOptionsProps[] = [
  {value: '1', label: 'Location'},
  {value: '2', label: 'Location 2'},
];

// ---------- COMPONENT ----------
const SearchLocationBlock: React.FC<SearchLocationBlockProps> = ({
  style,
  searchFn,
  results,
  navigation,
}) => {
  const [search, setSearch] = useState('');
  const [country, setCountry] = useState('1');
  const [showResults, setShowResults] = useState(true);
  const {branch} = useApp();

  const groupedResults =
    results?.reduce((acc: any, item: any) => {
      if (!acc[item.type]) acc[item.type] = [];
      acc[item.type].push(item);
      return acc;
    }, {}) || {};

  const goToScreen = (item: any) => {
    if (item.type.toUpperCase() == 'DOCTOR') {
      navigation.navigate(routes.DoctorSlots as keyof MainStackParamList, {
        doctorId: item.id,
        appointmentType: 'Physical',
        OrganisationID: branch?.organisation?.organisationid,
      });
    } else {
      navigation.navigate('DoctorsList', {
        specialityId: item.id,
        specialityName: item.name,
        appointmentType: 'Physical',
      });
    }
    setSearch('');
    setShowResults(false);
  };

  return (
    <View style={style}>
      <View style={styles.container}>
        <View style={styles.iconContainer}>
          <Image
            source={require('../../assets/images/search-icon.png')}
            style={styles.icon}
          />
        </View>
        <TextInput
          mode="flat"
          style={styles.input}
          placeholder="Search"
          value={search}
          onChangeText={val => {
            searchFn(val), setSearch(val), setShowResults(val.length > 3);
          }}
          placeholderTextColor={pallette.dark_grey}
          textColor={pallette.black}
          contentStyle={styles.input}
          underlineColor="transparent"
          activeUnderlineColor="transparent"
        />
      </View>

      {showResults && Object.keys(groupedResults).length > 0 && (
        <View style={styles.dropdown}>
          <ScrollView nestedScrollEnabled showsVerticalScrollIndicator={true}>
            {Object.keys(groupedResults).map(type => (
              <View key={type} style={styles.group}>
                <Text style={styles.groupTitle}>{type.toUpperCase()}</Text>
                {groupedResults[type].map((item: any) => (
                  <TouchableOpacity
                    key={item.id}
                    style={styles.item}
                    onPress={() => goToScreen(item)}>
                    <Text style={styles.itemText}>{item.name}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );
};
export default memo(SearchLocationBlock); // ✅ Memoized for performance

// ---------- STYLES ----------
const styles = StyleSheet.create({
  container: {
    backgroundColor: pallette.white,
    flexDirection: 'row',
    borderRadius: w * 0.1,
    borderWidth: 0.3,
    borderColor: pallette.light_grey,
    paddingRight: w * 0.03,
    alignItems: 'center',
  },
  iconContainer: {
    backgroundColor: pallette.white,
    width: w * 0.1,
    height: h * 0.03,
    borderRadius: w * 0.1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    height: '60%',
    width: '50%',
    resizeMode: 'contain',
    tintColor: pallette.medium_turquoise,
  },
  input: {
    height: h * 0.04,
    width: w * 0.77,
    color: pallette.black,
    backgroundColor: pallette.white,
    borderRadius: w * 0.1,
    fontSize: adjust(10),
    marginVertical: h * 0.002,
    fontFamily: 'ProximaNovaA-Regular',
  },
  dropdownSelect: {
    height: h * 0.04,
    width: w * 0.2,
    marginLeft: w * 0.01,
  },
  placeholderCountry: {
    fontFamily: 'ProximaNovaA-Regular',
    fontSize: adjust(11),
    color: pallette.light_grey,
  },
  selectedTextCountry: {
    fontSize: adjust(10),
    color: pallette.dark_grey,
    fontFamily: 'ProximaNovaA-Regular',
  },
  dropdownList: {
    fontFamily: 'ProximaNovaA-Regular',
    fontSize: adjust(11),
    width: w * 0.3,
    marginLeft: -(w * 0.1),
  },
  dropDownIcon: {
    height: h * 0.02,
    width: w * 0.02,
  },
  dropdown: {
    position: 'absolute',
    width: w * 0.8,
    top: h * 0.05,
    left: w * 0.05,
    right: 0,
    maxHeight: h * 0.25, // fixed height (adjust as you like)
    backgroundColor: pallette.white,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 10,
    zIndex: 1000,
    padding: 10,
  },

  group: {
    marginBottom: 10,
  },
  groupTitle: {
    fontWeight: 'bold',
    fontSize: adjust(11),
    color: pallette.black,
    marginBottom: 4,
  },
  item: {
    paddingVertical: h * 0.01,
    borderBottomWidth: 0.5,
    borderBottomColor: pallette.light_grey,
  },
  itemText: {
    fontSize: adjust(10),
    color: pallette.black,
  },
});
