import * as React from 'react';
import { registerRootComponent } from 'expo';
import { StyleSheet, Text, View } from 'react-native';
import DashBoard from './components/TestComponent/TestComponent.components'

interface IState {

}

// tslint:disable-next-line: no-default-export
class App extends React.Component<null, IState> {
  public state: IState;

  constructor(props: null) {
    super(props);
  }

  render(): React.ReactNode {
    return (
      <View style={styles.container}>
        <DashBoard />
      </View>
    )
  }
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

export default registerRootComponent(App);
