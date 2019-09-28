import React from 'react'
import { Text, View, Button, NativeModules, StyleSheet} from 'react-native';

interface IState {
    foundDeviceName: string;
    deviceBondLevel: number;
    heartBeatRate: number;
}

export default class Dashboard extends React.Component {
    public state: IState;

    constructor(props) {
        super(props);
        this.state = {
            foundDeviceName: 'None',
            deviceBondLevel: 0,
            heartBeatRate: 0
        };
    }
    searchBluetoothDevices = () => {
        NativeModules.DeviceConnector.enableBTAndDiscover( (error, deviceBondLevel)=>{
            this.setState({ deviceBondLevel: deviceBondLevel});
        })
        setInterval(this.getDeviceBondLevel, 2000)
    }
    getDeviceBondLevel = () => {
        NativeModules.DeviceConnector.getDeviceBondLevel( (error, deviceBondLevel)=>{
            this.setState({ deviceBondLevel: deviceBondLevel}, () => {
                this.getDeviceBondLevel
            });
        })
    }
    activateHeartRateCalculation = () => {
        NativeModules.HeartBeatMeasurer.startHeartRateCalculation( (error, heartBeatRate)=>{
            this.setState({ heartBeatRate: heartBeatRate});
        })
        setInterval(this.getHeartRate, 2000)
    }
    getHeartRate = () => {
        NativeModules.HeartBeatMeasurer.getHeartRate( (error, heartBeatRate)=>{
            this.setState({ heartBeatRate: heartBeatRate});
        })
    }
    render() {
        return (
            <View style={styles.container}>
                <View style={styles.package}>
                    <Text style={styles.sensorField}>Heart Beat:</Text>
                    <Text style={styles.sensorField}>{this.state.heartBeatRate + ' Bpm'}</Text>
                </View>
                <View style={styles.package}>
                    <Text style={styles.sensorField}>Device BL:</Text>
                    <Text style={styles.sensorField}>{this.state.deviceBondLevel}</Text>
                </View>
                <View style={styles.buttonContainer}>
                    <Button onPress={this.searchBluetoothDevices} title='Link With MiBand' />
                    <View style={styles.spacing}/>
                    <Button onPress={this.activateHeartRateCalculation} title='Get Heart Rate' />
                </View>
            </View>
        );
    }
}

// tslint:disable-next-line: typedef
const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        alignContent: 'center',
        padding: '5%',
        paddingTop: '50%',
    },
    package: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        margin: '10%',
    },
    sensorField: {
        fontSize: 30,
    },
    buttonContainer: {
        flexDirection: 'column',
        justifyContent: 'space-around',
    },
    spacing: {
        padding: '10%'
    }
  });
