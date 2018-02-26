import React from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  ListView
} from 'react-native';

import TimeFormatter from 'minutes-seconds-milliseconds';

let laps = [
  { name: 'Lap 1', value: '00.00.01' },
  { name: 'Lap 2', value: '00.00.02' },
  { name: 'Lap 3', value: '00.00.03' },
  { name: 'Lap 4', value: '00.00.04' },
  { name: 'Lap 5', value: '00.00.05' }
];

let ds = new ListView.DataSource({
  rowHasChanged: (row1, row2) => row1 !== row2,
});

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      dataSource: ds.cloneWithRows(laps),
      isRunning: false,
      mainTimer: null,
      lapTimer: null,
      mainTimerStart: null,
      lapTimerStart: null
    }
  }

  handleStartStop() {
    let { isRunning, firstTime, mainTimer, lapTimer } = this.state;

    if (isRunning) {
      clearInterval(this.interval);
      this.setState({
        isRunning: false
      });
      return ;
    }

    this.setState({
      mainTimerStart: new Date(),
      lapTimerStart: new Date(),
      isRunning: true
    });

    this.interval = setInterval(() => {
      this.setState({
        mainTimer: new Date() - this.state.mainTimerStart + mainTimer,
        lapTimer: new Date() - this.state.lapTimerStart + lapTimer,
      });
    }, 100);
  }

  handleLapReset() {
    let { isRunning, mainTimerStart } = this.state;

    if(mainTimerStart && !isRunning) {
      laps: [],
      this.setState({
        mainTimerStart: null,
        lapTimerStart: null,
        mainTimer: 0,
        lapTimer: 0
      });
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.top}>
          <View style={styles.header}>
            <Text style={styles.title}>Stopwatch</Text>
          </View>
          <View style={styles.timerWrapper}>
            <View style={styles.timerWrapperInner}>
              <Text style={styles.lapTimer}>{ TimeFormatter(this.state.lapTimer) }</Text>
              <Text style={styles.mainTimer}>{TimeFormatter(this.state.mainTimer)}</Text>
            </View>
          </View>
        </View>
        <View style={styles.bottom}>
          <View style={styles.buttonWrapper}>
            <TouchableHighlight underlayColor='#777' onPress={this.handleLapReset.bind(this)} style={styles.button} >
              <Text>{ (this.state.mainTimerStart && !this.state.isRunning) ? 'Reset' : 'Lap' }</Text>
            </TouchableHighlight>
            <TouchableHighlight underlayColor='#DDD' onPress={this.handleStartStop.bind(this)} style={styles.button} >
              <Text style={[styles.startBtn, this.state.isRunning && styles.stopBtn]}>{this.state.isRunning? 'Stop' : 'Start'}</Text>
            </TouchableHighlight>
          </View>
          <View style={styles.lapWrapper}>
            <ListView
              enableEmptySections={true}
              dataSource={this.state.dataSource}
              renderRow={(rowData) => (
                <View style={styles.lapRow}>
                  <Text style={styles.lapNumber}>{rowData.name}</Text>
                  <Text style={styles.lapTime}>{rowData.value}</Text>
                </View>
              )}
            />
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  header: {
    borderBottomWidth: 0.5,
    paddingTop: 20,
    paddingBottom: 10,
    backgroundColor: '#F9F9F9'
  },
  title: {
    alignSelf: 'center',
    fontWeight: '600'
  },
  top: {
    flex: 1
  },
  bottom: {
    flex: 2,
    backgroundColor: '#F0EFF5'
  },
  timerWrapper: {
    backgroundColor: '#FFF',
    justifyContent: 'center',
    flex: 1
  },
  timerWrapperInner: {
    alignSelf: 'center'
  },
  mainTimer: {
    fontSize: 60,
    fontWeight: '100',
    alignSelf: 'flex-end'
  },
  lapTimer: {
    fontSize: 18,
    alignSelf: 'flex-end'
  },
  buttonWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 15,
    paddingBottom: 30
  },
  button: {
    height: 80,
    width: 80,
    borderRadius: 40,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center'
  },
  lapRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    height: 40,
    paddingTop: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: '#DDD'
  },
  lapNumber: {
    fontSize: 16,
    color: '#777'
  },
  lapTime: {
    color: '#000',
    fontSize: 20,
    fontWeight: '300'
  },
  startBtn: {
    color: '#00CC00'
  },
  stopBtn: {
    color: 'red'
  }
});
