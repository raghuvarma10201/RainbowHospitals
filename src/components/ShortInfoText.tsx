import React, {useState, useMemo} from 'react';
import {Text, View, TouchableOpacity, StyleSheet} from 'react-native';
import {pallette} from '../Constants/Constant';

const ShortInfoText: React.FC<{text: string}> = ({text}) => {
  const [expanded, setExpanded] = useState(false);

  // Clean the HTML tags using regex
  const cleanText = useMemo(() => {
    return text
      ?.replace(/<[^>]*>/g, '') // remove HTML tags
      .replace(/\s+/g, ' ') // collapse multiple spaces
      .trim(); // trim leading/trailing spaces
  }, [text]);

  const toggleExpanded = () => setExpanded(prev => !prev);

  return (
    <View>
      <Text style={styles.docName} numberOfLines={expanded ? undefined : 2}>
        {cleanText}
      </Text>
      {cleanText.length > 80 && ( // only show toggle if long text
        <TouchableOpacity onPress={toggleExpanded}>
          <Text style={styles.readMore}>
            {expanded ? 'Read less' : 'Read more'}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  docName: {
    fontSize: 12,
    color: pallette.white,
    fontFamily: 'ProximaNovaA-Regular',
    textAlign: 'justify',
  },
  readMore: {
    color: pallette.white,
    marginTop: 4,
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'right',
  },
});

export default ShortInfoText;
