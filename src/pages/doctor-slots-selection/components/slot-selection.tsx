import React, {useState} from 'react';
import {FlatList, Text, TouchableOpacity, View} from 'react-native';
import WeeklyCalendar from './weekly-calender';
import {RenderSlot} from './functions';

interface DoctorSession {
  SessionDate: string;
  SessionDefinitionUID1: string;
}

interface Slot {
  SlotID: string;
  SessionStartDttm: string;
}

interface SlotSelectionSectionProps {
  sessions: DoctorSession[];
  slots: Slot[];
  selectedTime: string;
  selectedSlot: string;
  onDateClick: (date: string, sessionId: string) => void;
  onSelectSlot: (slotId: string, time: string) => void;
  styles: any;
}

const SlotSelection: React.FC<SlotSelectionSectionProps> = ({
  sessions,
  slots,
  selectedTime,
  selectedSlot,
  onDateClick,
  onSelectSlot,
  styles,
}) => {
  const [viewAll, setViewAll] = useState(false);

  if (!sessions.length) return null;

  return (
    <View style={styles.calenderContainer}>
      <WeeklyCalendar sessions={sessions} onDateClick={onDateClick} />

      {slots.length > 0 ? (
        <>
          <Text style={[styles.centeredTxt, {marginVertical: 5}]}>
            Available Time
          </Text>
          <FlatList
            data={
              slots.length > 10 ? (viewAll ? slots : slots.slice(0, 10)) : slots
            }
            contentContainerStyle={styles.timeList}
            numColumns={5}
            keyExtractor={(item, index) => `${item.SlotID}-${index}`}
            renderItem={({item}) => (
              <RenderSlot
                item={item}
                selectedTime={selectedTime}
                onSelect={onSelectSlot}
                styles={styles}
              />
            )}
          />
          {slots.length > 10 && (
            <TouchableOpacity onPress={() => setViewAll(prev => !prev)}>
              <Text style={styles.viewToggle}>
                {viewAll ? 'View Less' : 'View More'}
              </Text>
            </TouchableOpacity>
          )}
        </>
      ) : (
        <Text style={styles.noSlots}>No Slots Available</Text>
      )}
    </View>
  );
};

export default SlotSelection;
