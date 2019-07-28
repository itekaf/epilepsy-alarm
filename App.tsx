import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';

// tslint:disable-next-line: no-default-export
export default function app(): React.ReactNode {
  return (
    <View style={styles.container}>
      <Text>Open up App.tsx to start working on your app!</Text>
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
