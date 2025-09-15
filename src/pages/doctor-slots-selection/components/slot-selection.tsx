import React, {useState} from 'react';
import {FlatList, Text, View} from 'react-native';
import WeeklyCalendar from './weekly-calender';
import {RenderSlot} from './functions';

interface DoctorSession {
  SessionDate: string;
  SessionDefinitionUID1: string;
}

interface Slot {
  SlotID: string;
  SessionStartDttm: string; // Example: "2025-09-15T09:30:00"
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
  if (!sessions.length) return null;

  // Helper: Split slots into morning/evening
  const morningSlots = slots.filter(slot => {
    const hour = new Date(slot.SessionStartDttm).getHours();
    return hour < 12;
  });

  const eveningSlots = slots.filter(slot => {
    const hour = new Date(slot.SessionStartDttm).getHours();
    return hour >= 12;
  });

  return (
    <View style={styles.calenderContainer}>
      <WeeklyCalendar sessions={sessions} onDateClick={onDateClick} />

      {slots.length > 0 ? (
        <>
          {morningSlots.length > 0 && (
            <>
              <Text
                style={[
                  styles.centeredTxt,
                  {marginVertical: 5, textAlign: 'left'},
                ]}>
                Morning Slots
              </Text>
              <FlatList
                data={morningSlots}
                contentContainerStyle={styles.timeList}
                numColumns={5}
                keyExtractor={(item, index) =>
                  `${item.SlotID}-morning-${index}`
                }
                renderItem={({item}) => (
                  <RenderSlot
                    item={item}
                    selectedTime={selectedTime}
                    onSelect={onSelectSlot}
                    styles={styles}
                  />
                )}
              />
            </>
          )}

          {eveningSlots.length > 0 && (
            <>
              <Text
                style={[
                  styles.centeredTxt,
                  {marginVertical: 5, textAlign: 'left'},
                ]}>
                Evening Slots
              </Text>
              <FlatList
                data={eveningSlots}
                contentContainerStyle={styles.timeList}
                numColumns={5}
                keyExtractor={(item, index) =>
                  `${item.SlotID}-evening-${index}`
                }
                renderItem={({item}) => (
                  <RenderSlot
                    item={item}
                    selectedTime={selectedTime}
                    onSelect={onSelectSlot}
                    styles={styles}
                  />
                )}
              />
            </>
          )}
        </>
      ) : (
        <Text style={styles.noSlots}>No Slots Available</Text>
      )}
    </View>
  );
};

export default SlotSelection;
