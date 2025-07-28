import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';

type WeekDay = {
  day: string;
  date: number;
  fullDate: string;
  month: string;
  monthShort: string;
  year: number;
};

function getCurrentWeek(baseDate = new Date()) {
  const today = new Date(baseDate);
  const currentDay = today.getDay(); // 0 (Sun) - 6 (Sat)
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - currentDay);

  const week = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date(startOfWeek);
    date.setDate(startOfWeek.getDate() + i);
    week.push({
      day: date.toLocaleDateString('en-US', { weekday: 'short' }),
      date: date.getDate(),
      fullDate: date.toISOString().split('T')[0],
      month: date.toLocaleDateString('en-US', { month: 'long' }),
      monthShort: date.toLocaleDateString('en-US', { month: 'short' }),
      year: date.getFullYear(),
    });
  }
  return week;
}

function getMonthDisplay(
  week: Array<{ day: string; date: number; fullDate: string; month: string; monthShort: string; year: number }>
) {
  const months = [...new Set(week.map(d => d.monthShort))];
  const years = [...new Set(week.map(d => d.year))];

  if (months.length === 1 && years.length === 1) {
    return `${months[0]} ${years[0]}`;
  } else if (years.length === 1) {
    return `${months[0]} - ${months[1]} ${years[0]}`;
  } else {
    return `${months[0]} ${years[0]} - ${months[1]} ${years[1]}`;
  }
}

interface DynamicWeekWithMonthProps {
  sessions: Array<{
    SessionDate: string;
    SessionDefinitionUID1: string;
    [key: string]: any;
  }>;
  onDateClick?: (sessionDate: string, sessionDefinitionUID1: string) => void;
}

export const DynamicWeekWithMonth: React.FC<DynamicWeekWithMonthProps> = ({ sessions, onDateClick }) => {
  const [week, setWeek] = useState(getCurrentWeek());
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  const handlePrevWeek = () => {
    const newBase = new Date(week[0].fullDate);
    newBase.setDate(newBase.getDate() - 7);
    const prevWeek = getCurrentWeek(newBase);
    setWeek(prevWeek);
    setSelectedDate(prevWeek[0].fullDate);
  };

  const handleNextWeek = () => {
    const newBase = new Date(week[6].fullDate);
    newBase.setDate(newBase.getDate() + 1);
    const nextWeek = getCurrentWeek(newBase);
    setWeek(nextWeek);
    setSelectedDate(nextWeek[0].fullDate);
  };

  const isDateAvailable = (date: string) => {
    return Array.isArray(sessions) && sessions.some(
      (s) => new Date(s.SessionDate).toISOString().split('T')[0] === date
    );
  };

  const renderItem = ({ item }: { item: WeekDay }) => {
    const isSelected = item.fullDate === selectedDate;
    const available = isDateAvailable(item.fullDate);

    return (
      <TouchableOpacity
        disabled={!available}
        onPress={() => {
          if (!available) return;
          const session = sessions.find(
            (s) => new Date(s.SessionDate).toISOString().split('T')[0] === item.fullDate
          );
          if (session && onDateClick) {
            setSelectedDate(item.fullDate);
            onDateClick(session.SessionDate, session.SessionDefinitionUID1);
          }
        }}
        style={[
          styles.dayContainer,
          !available && styles.disabledContainer,
        ]}
      >
        <Text
          style={[
            styles.dayText,
            isSelected && styles.selectedDayText,
            !available && styles.disabledText,
          ]}
        >
          {item.day}
        </Text>
        <Text
          style={[
            styles.dateText,
            isSelected && styles.selectedDateText,
            !available && styles.disabledText,
          ]}
        >
          {item.date}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* Month Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handlePrevWeek}>
          <Text style={styles.arrow}>{'<'}</Text>
        </TouchableOpacity>
        <Text style={styles.month}>{getMonthDisplay(week)}</Text>
        <TouchableOpacity onPress={handleNextWeek}>
          <Text style={styles.arrow}>{'>'}</Text>
        </TouchableOpacity>
      </View>

      {/* Week Scroll */}
      <FlatList
        horizontal
        data={week}
        renderItem={renderItem}
        keyExtractor={item => item.fullDate}
        contentContainerStyle={styles.list}
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 5,
    borderRadius: 10,
    margin: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  arrow: {
    fontSize: 20,
    marginHorizontal: 20,
    color: '#4B3E75',
  },
  month: {
    fontSize: 16,
    color: '#4B3E75',
    fontFamily: 'ProximaNovaA-Bold',
  },
  list: {
    justifyContent: 'space-around',
    paddingHorizontal: 10,
  },
  dayContainer: {
    alignItems: 'center',
    marginHorizontal: 10,
  },
  dayText: {
    color: '#4B3E75',
    fontSize: 13,
    fontFamily: 'ProximaNovaA-Bold',
  },
  dateText: {
    color: '#4B3E75',
    fontSize: 15,
    fontFamily: 'ProximaNovaA-Bold',
  },
  selectedDayText: {
    color: '#00BCD4',
  },
  selectedDateText: {
    color: '#00BCD4',
  },
  disabledText: {
    color: '#BDBDBD',
  },
  disabledContainer: {
    opacity: 0.5,
  },
});
