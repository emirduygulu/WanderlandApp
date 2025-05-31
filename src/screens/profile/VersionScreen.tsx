import { View, Text, StyleSheet } from 'react-native'
import React from 'react'

const VersionScreen = () => {
  return (
    <View style={styles.container}>
      <Text>VersionScreen</Text>
      <Text>Version 1.0.0</Text>
      <Text>Copyright 2025</Text>
      <Text>All rights reserved</Text>
    </View>
  )
}

export default VersionScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});