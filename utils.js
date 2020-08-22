import React, {Fragment} from 'react';
import {Alert, TouchableOpacity, View, Text, StyleSheet} from 'react-native';
import RNCalendarEvents from 'react-native-calendar-events';
import moment from 'moment';

const fetchEventsYearly = (startTime, endTime, setterFunc) => {
  RNCalendarEvents.fetchAllEvents(startTime, endTime)
    .then((findAllEve) => {
      if (Array.isArray(findAllEve)) {
        setterFunc(findAllEve);
      }
    })
    .catch((e) => {
      console.log('error', e);
    });
};

const getCurrentYearEvents = (setterFunc, year) => {
  RNCalendarEvents.checkPermissions().then((checkPerm) => {
    let startTime = new Date(`${year}-01-01`);
    let endTime = new Date(`${year}-12-31`);
    startTime.setHours(0, 0, 0);
    endTime.setHours(24, 0, 0);
    startTime = moment(startTime).format('YYYY-MM-DD') + 'T00:00:00.000Z';
    endTime = moment(endTime).format('YYYY-MM-DD') + 'T00:00:00.000Z';
    checkPerm !== 'authorized'
      ? RNCalendarEvents.requestPermissions(true).then((reqPerm) => {
          reqPerm === 'authorized'
            ? fetchEventsYearly(startTime, endTime, setterFunc)
            : Alert.alert('We need permission to access you calender');
        })
      : fetchEventsYearly(startTime, endTime, setterFunc);
  });
};

const eventModifier = (setterFunc, setMarkedItems, eventArray) => {
  const tempDatesObject = {};
  const tempMarkedItems = {};
  eventArray.forEach(
    (
      {startDate, title, id, description, endDate, location, url, notes},
      index,
    ) => {
      !tempDatesObject[startDate.split('T')[0]]
        ? ((tempDatesObject[startDate.split('T')[0]] = [
            {
              title,
              description,
              endDate,
              location,
              marked: true,
              id,
              url,
              notes,
            },
          ]),
          (tempMarkedItems[startDate.split('T')[0]] = {marked: true}))
        : tempDatesObject[startDate.split('T')[0]].push({
            title,
            description,
            endDate,
            location,
            marked: true,
            id,
            url,
            notes,
          });
    },
  );
  setMarkedItems(tempMarkedItems);
  setterFunc(tempDatesObject);
};

const timeToString = (time) => {
  const date = time ? new Date(time) : new Date();
  return date.toISOString().split('T')[0];
};

const rowHasChanged = (r1, r2) => {
  return r1.id !== r2.id;
};

const styles = StyleSheet.create({
  item: {
    backgroundColor: 'white',
    flex: 1,
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
    marginTop: 17,
  },
  emptyDate: {
    height: 15,
    flex: 1,
    paddingTop: 30,
  },
});

const renderItem = ({
  title,
  description,
  url,
  notes,
  endDate,
  location,
  id,
  height,
}) => {
  return (
    <TouchableOpacity
      style={[styles.item, {height}]}
      onPress={() => Alert.alert(title, description)}>
      <Text>{title ? title : 'Title'}</Text>
      {Platform.OS === 'ios' ? (
        <Fragment>
          <Text>{notes}</Text>
          <Text>{url}</Text>
        </Fragment>
      ) : (
        <Text>{description}</Text>
      )}
      <Text>{location}</Text>
    </TouchableOpacity>
  );
};

const renderEmptyDate = () => {
  return (
    <View style={styles.emptyDate}>
      <Text>This is empty date!</Text>
    </View>
  );
};
export {
  getCurrentYearEvents,
  eventModifier,
  timeToString,
  rowHasChanged,
  renderItem,
  renderEmptyDate,
};
