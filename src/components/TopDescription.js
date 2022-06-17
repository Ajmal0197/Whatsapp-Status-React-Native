import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {wpx} from '../helpers/Scale';

const TopDescription = ({currentViewIndex}) => {
  return (
    <View style={styles.rowCenter}>
      <View style={styles.rowCenter}>
        <View style={{width: wpx(220), marginStart: wpx(24)}}>
          <Text numberOfLines={1} style={{color: 'white'}}>
            3 bedroom in Dar Al Mashaer Towers
          </Text>
          <Text style={{color: 'white'}}>SAR 1,450,000</Text>
        </View>
      </View>
      <Text style={{color: 'white'}}>{currentViewIndex}</Text>
    </View>
  );
};

export default TopDescription;

const styles = StyleSheet.create({
  rowCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
