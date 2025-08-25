import React, {useState, useMemo, useCallback} from 'react';
import {Text, View, TouchableOpacity, StyleSheet} from 'react-native';
import {pallette} from '../constants/constants';
import {adjust} from '../utils/common-functions';
import {ShortInfoTextProps} from './types';

// ---------- COMPONENT ----------
const ShortInfoText: React.FC<ShortInfoTextProps> = ({
  text,
  maxChars = 80,
  containerStyle,
  textStyle,
}) => {
  const [expanded, setExpanded] = useState(false);

  const cleanText = useMemo<string>(() => {
    return text
      .replace(/<[^>]*>/g, '') // remove HTML tags
      .replace(/\s+/g, ' ') // collapse multiple spaces
      .trim(); // trim leading/trailing spaces
  }, [text]);

  const toggleExpanded = useCallback(() => {
    setExpanded(prev => !prev);
  }, []);

  const shouldShowToggle = cleanText.length > maxChars;

  return (
    <View style={containerStyle}>
      <Text
        style={[styles.docName, textStyle]}
        numberOfLines={expanded ? undefined : 2}>
        {cleanText}
      </Text>

      {shouldShowToggle && (
        <TouchableOpacity onPress={toggleExpanded} activeOpacity={0.7}>
          <Text style={styles.readMore}>
            {expanded ? 'Read less' : 'Read more'}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

// ---------- STYLES ----------
const styles = StyleSheet.create({
  docName: {
    fontSize: adjust(10),
    color: pallette.white,
    fontFamily: 'ProximaNovaA-Regular',
    textAlign: 'justify',
  },
  readMore: {
    color: pallette.white,
    fontSize: adjust(10),
    fontWeight: 'bold',
    textAlign: 'right',
  },
});

export default ShortInfoText;
