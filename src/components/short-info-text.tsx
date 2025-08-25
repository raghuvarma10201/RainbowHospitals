import React, {useState, useMemo, useCallback} from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  StyleProp,
  TextStyle,
  ViewStyle,
} from 'react-native';
import {pallette} from '../constants/constants';
import {adjust} from '../utils/common-functions';

// ---------- TYPES ----------
interface ShortInfoTextProps {
  text: string; // raw text that may contain HTML tags
  maxChars?: number; // max characters before showing "Read more"
  containerStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

// ---------- COMPONENT ----------
const ShortInfoText: React.FC<ShortInfoTextProps> = ({
  text,
  maxChars = 80,
  containerStyle,
  textStyle,
}) => {
  const [expanded, setExpanded] = useState(false);

  // ✅ Clean text (remove HTML + collapse spaces) only when `text` changes
  const cleanText = useMemo<string>(() => {
    return text
      .replace(/<[^>]*>/g, '') // remove HTML tags
      .replace(/\s+/g, ' ') // collapse multiple spaces
      .trim(); // trim leading/trailing spaces
  }, [text]);

  // ✅ Memoized toggle to prevent re-creation on re-render
  const toggleExpanded = useCallback(() => {
    setExpanded(prev => !prev);
  }, []);

  // ✅ Only show "Read more" if text exceeds threshold
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
