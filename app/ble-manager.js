import React from 'react';
import {Platform, View, Text} from 'react-native';
import { BleManager } from 'react-native-ble-plx';
import base64 from 'react-native-base64'

const UUID_BASE = (x) => `0000${x}-0000-3512-2118-0009af100700`

const UUID_SERVICE_GENERIC_ACCESS =     0x1800
const UUID_SERVICE_GENERIC_ATTRIBUTE =  0x1801
const UUID_SERVICE_DEVICE_INFORMATION = 0x180a
const UUID_SERVICE_FIRMWARE =           UUID_BASE('1530')
const UUID_SERVICE_ALERT_NOTIFICATION = 0x1811
const UUID_SERVICE_IMMEDIATE_ALERT =    0x1802
const UUID_SERVICE_HEART_RATE =         0x180d
const UUID_SERVICE_MIBAND_1 =           'fee0'
const UUID_SERVICE_MIBAND_2 =           'fee1'

export class BleManagerResolver extends React.Component {

    constructor() {
        super()
        this.manager = new BleManager()
        this.state = {info: "", values: {}, devices: []}
        this.prefixUUID = "f000aa"
        this.suffixUUID = "-0451-4000-b000-000000000000"
        this.sensors = {
            0: "Temperature",
            1: "Accelerometer",
            2: "Humidity",
            3: "Magnetometer",
            4: "Barometer",
            5: "Gyroscope"
        }
    }

    serviceUUID(num) {
        return this.prefixUUID + num + "0" + this.suffixUUID
    }

    notifyUUID(num) {
        return this.prefixUUID + num + "1" + this.suffixUUID
    }

    writeUUID(num) {
        return this.prefixUUID + num + "2" + this.suffixUUID
    }

    info(message) {
        this.setState({info: message})
    }

    error(message) {
        this.setState({info: "ERROR: " + message})
    }

    updateValue(key, value) {
        this.setState({values: {...this.state.values, [key]: value}})
    }

    componentWillMount() {
        if (Platform.OS === 'ios') {
            this.manager.onStateChange((state) => {
                if (state === 'PoweredOn') {
                    // this.test();
                    this.scanAndConnect()
                }
            })
        } else {
            this.scanAndConnect()
        }
    }

    test() {
        this.manager.connectedDevices(null)
            .then((devices) => {
                this.info(devices || 't');
                this.setState({devices: devices});
            })
    }

    scanAndConnect() {
        this.manager.startDeviceScan(null,
            null, (error, device) => {
                this.info("Scanning...");
                this.setState({devices: [...this.state.devices, device.name]});
                this.info(device.name || 'test');

                if (error) {
                    this.error(error.message);
                    return
                }

                if (device.name === 'Mi Band 3' || device.name === 'SensorTag') {
                    this.info("Save to state");
                    this.manager.stopDeviceScan()
                    device.connect()
                        .then((device) => {
                            this.info("Discovering services and characteristics");
                            device.writeCharacteristicWithResponseForService(
                                UUID_BASE('1811'),
                                '00002A46–0000–1000–8000–00805f9b34fb',
                                base64.encode('\x05\x01' + 'TEST')
                            ).then((test) => this.info(test))
                            return device.discoverAllServicesAndCharacteristics()
                        })
                        .then((device) => {
                            this.info("Setting notifications")
                            return this.setupNotifications(device)
                        })
                        .then(() => {
                            this.info("Listening...")
                        }, (error) => {
                            this.error(error.message)
                        })
                }
            });
    }

    async setupNotifications(device) {
        // const service = this.serviceUUID(id);
        // const characteristicW = this.writeUUID(id);
        // const characteristicN = this.notifyUUID(id);

        device.writeCharacteristicWithResponseForService(
            UUID_BASE('1811'),
            UUID_BASE('2A46'),
            base64.encode('\x05\x01' + 'TEST')
    ).then((test) => this.info(test))
        // device.monitorCharacteristicForService(UUID_BASE(UUID_SERVICE_MIBAND_1), UUID_BASE(0x2a2b), (error, characteristic) => {
        //     if (error) {
        //         this.error(error.message);
        //         return
        //     }
        //     // this.updateValue(characteristic.uuid, characteristic.value)
        //     this.setState({steps: characteristic.value});
        // })
    }

    render() {
        return (
            <View style={{padding: 50}}>
                <Text>{this.state.info}</Text>
                <Text>{this.state.devices}</Text>
                <Text style={{fontSize: 20, color: 'red'}}>{this.state.steps}</Text>
                {/*{Object.keys(this.sensors).map((key) => {*/}
                {/*    return <Text key={key}>*/}
                {/*        {this.sensors[key] + ": " + (this.state.values[this.notifyUUID(key)] || "-")}*/}
                {/*    </Text>*/}
                {/*})}*/}
            </View>
        )
    }
}