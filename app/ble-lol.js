import React, { Component } from 'react';
import {
    NativeAppEventEmitter,
    View,
    Text,
    Button } from 'react-native';
import BleManager from 'react-native-ble-manager';

// I changed this to export default App
export class BluetoothScanner extends Component {
    constructor(props){
        super(props);
        this.devices = [];
        this.state = {
            dataSource: []
        };
    }

    componentDidMount() {
        this.test = BleManager.start.toString();

        NativeAppEventEmitter.addListener('BleManagerDiscoverPeripheral',(data) =>
        {
            let device = 'device found: ' + data.name + '(' + data.id + ')';

            if(this.devices.indexOf(device) == -1) {
                this.devices.push(device);
            }

            let newState = this.state;
            newState.dataSource = [...newState.dataSource, this.devices];
            this.setState(newState);
        });

        BleManager.start({showAlert: false})
            .then(() => {
                // Success code
                this.test = 'Module initialized';
            }).catch((error)=>{
            console.log("Api call error");
            alert(error.message);
        });
    }

    startScanning = () => {
        console.log('start scanning');
        this.test = BleManager.scan;
        BleManager.scan([], 120)
            .then((ww) => {
                this.test = ww;
            })
            .catch((error) => alert(error.message))
    };

    render() {
        return (
            <View style={{padding: 50 }}>
                <Text>{this.test}</Text>
                <Text>Bluetooth scanner</Text>
                <Button onPress={this.startScanning} title="Start scanning"/>

                {this.state.dataSource.map((el)=> (<Text>{el}</Text>))}
            </View>
        );
    }
}