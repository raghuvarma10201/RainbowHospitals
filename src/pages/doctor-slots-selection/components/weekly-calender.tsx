import React, {useState, useMemo, useEffect} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {adjust} from '../../../utils/common-functions';
import {h, pallette, w} from '../../../constants/constants';

type Session = {
  SessionDate: string;
  SessionDefinitionUID1: string;
  [key: string]: any;
};

type SessionDay = {
  fullDate: string;
  day: string;
  date: number;
  dateObj: Date;
  session: Session;
};

interface Props {
  sessions: Session[];
  onDateClick?: (sessionDate: string, sessionDefinitionUID1: string) => void;
}

function getMonthDisplayForChunk(chunk: SessionDay[]): string {
  if (chunk.length === 0) return '';

  const start = chunk[0].dateObj;
  const end = chunk[chunk.length - 1].dateObj;

  const startMonth = start.toLocaleDateString('en-US', {month: 'long'});
  const endMonth = end.toLocaleDateString('en-US', {month: 'long'});

  const startYear = start.getFullYear();
  const endYear = end.getFullYear();

  if (startMonth === endMonth && startYear === endYear) {
    return `${startMonth}`;
  } else if (startYear === endYear) {
    return `${startMonth} - ${endMonth}`;
  } else {
    return `${startMonth} - ${endMonth}`;
  }
}

const WeeklyCalendar: React.FC<Props> = ({sessions, onDateClick}) => {
  const sortedSessions = useMemo(() => {
    return [...sessions]
      .filter(s => s.SessionDate && !isNaN(new Date(s.SessionDate).getTime()))
      .sort(
        (a, b) =>
          new Date(a.SessionDate).getTime() - new Date(b.SessionDate).getTime(),
      )
      .map(s => {
        const date = new Date(s.SessionDate);
        return {
          fullDate: date.toISOString().split('T')[0],
          day: date.toLocaleDateString('en-US', {weekday: 'short'}),
          date: date.getDate(),
          dateObj: date,
          session: s,
        };
      });
  }, [sessions]);

  const [selectedDate, setSelectedDate] = useState<string>('');
  const [pageIndex, setPageIndex] = useState(0);

  useEffect(() => {
    if (sortedSessions.length > 0) {
      setSelectedDate(sortedSessions[0].fullDate);
    }
  }, [sortedSessions]);

  const chunkedSessions: SessionDay[][] = useMemo(() => {
    const chunks: SessionDay[][] = [];
    for (let i = 0; i < sortedSessions.length; i += 7) {
      chunks.push(sortedSessions.slice(i, i + 7));
    }
    return chunks;
  }, [sortedSessions]);

  const currentChunk = chunkedSessions[pageIndex] || [];

  const handlePrev = () => {
    if (pageIndex > 0) setPageIndex(p => p - 1);
  };

  const handleNext = () => {
    if (pageIndex < chunkedSessions.length - 1) setPageIndex(p => p + 1);
  };

  const renderDay = (item: SessionDay) => (
    <TouchableOpacity
      style={[
        styles.dayBox,
        {
          backgroundColor:
            item.fullDate === selectedDate
              ? pallette.medium_turquoise
              : pallette.white,
        },
      ]}
      onPress={() => {
        setSelectedDate(item.fullDate);
        onDateClick?.(
          item.session.SessionDate,
          item.session.SessionDefinitionUID1,
        );
      }}>
      <Text
        style={[
          styles.dayText,
          {
            color:
              item.fullDate === selectedDate ? pallette.white : pallette.black,
          },
        ]}>
        {item.day}
      </Text>
      <Text
        style={[
          styles.dateText,
          {
            color:
              item.fullDate === selectedDate ? pallette.white : pallette.black,
          },
        ]}>
        {item.date}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      {currentChunk.length > 0 && (
        <View style={styles.header}>
          <TouchableOpacity onPress={handlePrev} disabled={pageIndex === 0}>
            <Text
              style={[styles.arrow, pageIndex === 0 && styles.disabledArrow]}>
              {'<'}
            </Text>
          </TouchableOpacity>
          <Text style={styles.title}>
            {getMonthDisplayForChunk(currentChunk)}
          </Text>
          <TouchableOpacity
            onPress={handleNext}
            disabled={pageIndex >= chunkedSessions.length - 1}>
            <Text
              style={[
                styles.arrow,
                pageIndex >= chunkedSessions.length - 1 && styles.disabledArrow,
              ]}>
              {'>'}
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Sessions Grid */}
      {currentChunk.length > 0 ? (
        <View style={styles.weekRow}>{currentChunk.map(renderDay)}</View>
      ) : (
        <Text style={styles.noSessionsText}>No sessions available</Text>
      )}
    </View>
  );
};

export default WeeklyCalendar;

const styles = StyleSheet.create({
  container: {
    marginBottom: h * 0.01,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  arrow: {
    fontSize: adjust(20),
    marginHorizontal: 20,
    color: '#4B3E75',
  },
  disabledArrow: {
    color: '#CCC',
  },
  title: {
    fontSize: adjust(14),
    fontFamily: 'ProximaNovaA-Bold',
    color: '#4B3E75',
  },
  weekRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 2,
  },
  dayBox: {
    alignItems: 'center',
    padding: 10,
    borderRadius: 8,
    width: w * 0.12,
  },
  dayText: {
    fontSize: adjust(10),
    fontFamily: 'ProximaNovaA-Bold',
  },
  dateText: {
    fontSize: adjust(12),
    fontFamily: 'ProximaNovaA-Bold',
  },
  noSessionsText: {
    textAlign: 'center',
    fontSize: adjust(12),
    color: '#999',
    marginTop: 10,
  },
});
