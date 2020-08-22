/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useEffect, useState} from 'react';
import {Agenda} from 'react-native-calendars';
import {StatusBar} from 'react-native';
import {SafeAreaProvider, SafeAreaView} from 'react-native-safe-area-context';
import {
  getCurrentYearEvents,
  eventModifier,
  timeToString,
  rowHasChanged,
  renderItem,
  renderEmptyDate,
} from './utils';

const App = () => {
  const [items, setItems] = useState({});
  const [markedItems, setMarkedItems] = useState({});
  const [fetchedEvents, setFetchedEvents] = useState([]);
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  useEffect(() => {
    const currentDateYear = new Date().getFullYear();
    getCurrentYearEvents(setFetchedEvents, currentDateYear);
  }, []);
  useEffect(() => {
    if (fetchedEvents.length !== 0) {
      eventModifier(setItems, setMarkedItems, fetchedEvents);
    }
  }, [fetchedEvents]);
  useEffect(() => {
    getCurrentYearEvents(setFetchedEvents, currentYear);
  }, [currentYear]);

  const loadItems = ({year}) => {
    if (currentYear != year) {
      setCurrentYear(year);
    }
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}} mode={'padding'}>
        <StatusBar
          barStyle="dark-content"
          translucent={true}
          backgroundColor={'transparent'}
        />
        <Agenda
          items={items}
          markedDates={markedItems}
          loadItemsForMonth={loadItems}
          selected={timeToString()}
          renderItem={renderItem}
          renderEmptyDate={renderEmptyDate}
          rowHasChanged={rowHasChanged}
        />
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default App;
