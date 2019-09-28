import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import DashBoard from './components/TestComponent/TestComponent.components'

// tslint:disable-next-line: no-default-export
export default function app(): React.ReactNode {
  return (
    <View style={styles.container}>
      <DashBoard />
    </View>
  );
}

// tslint:disable-next-line: typedef
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
