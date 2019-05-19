/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, StatusBar, TouchableOpacity} from 'react-native';
import AxisPad from 'react-native-axis-pad';
 

export default class App extends Component{

  constructor(props){
    super(props);

    this.state = {
      tankX: 0,
      tankY: 0,
      turretX: 0,
      turretY: 0,
      armState: 'armed',
    }
  }

  componentDidMount(){
    StatusBar.setBarStyle('light-content');
    StatusBar.setTranslucent(true);
    StatusBar.setBackgroundColor('transparent');
  }

  componentWillMount(){
    StatusBar.setBarStyle('light-content');
    StatusBar.setTranslucent(true);
    StatusBar.setBackgroundColor('transparent');
  }

  render() {

    let HandleShootState = ({state}) => {
      switch (state) {
        case 'arming':
          return <Text style={styles.buttonText}>Preparing to shoot</Text>;
        case 'armed':
          return <Text style={styles.buttonText}>Now, shoot</Text>;
        default:
          return <Text style={styles.buttonText}>Arm the Beast</Text>;
      }
    }

    return (
      <View style={styles.container}>
        <StatusBar translucent barStyle="light-content" backgroundColor="transparent" />
        <Text style={styles.title}>React Native Tank TFG 2019</Text>
        <View style={styles.joysticksView}>
          <AxisPad style={styles.joysticks} size={200} handlerSize={100} resetOnRelease={true} autoCenter={true} onValue={(pos) => this.setTankPos(pos)} />
          <AxisPad style={styles.joysticks} size={200} handlerSize={100} resetOnRelease={true} autoCenter={true} onValue={(pos) => this.setTurretPos(pos)} />
        </View>
        <TouchableOpacity style={styles.button} activeOpacity={0.5} onPress={() => this.shootItem()}>
          <HandleShootState state={this.state.armState} />
        </TouchableOpacity>
      </View>
    );
  }

  async setTankPos(position){
    this.setState({tankX: position.x.toFixed(1), tankY: position.y.toFixed(1)});
    const objToSend = {
      x: this.state.tankX,
      y: this.state.tankY
    };

    const endpointTank = "http://192.168.4.1:8080/tank";
    await fetch(endpointTank, {
      method: 'POST',
      headers: {
        'Content-Type':'plain/text',
      },
      body:JSON.stringify(objToSend)
    })
    .then((jsonResp) => {
      console.log("Everything went ok");
    }
    );
  }

  async setTurretPos(position){
    this.setState({turretX: position.x.toFixed(1), turretY: position.y.toFixed(1)});
    const objToSend = {
      x: this.state.turretX,
      y: this.state.turretY
    };

    const endpointTurret = "http://192.168.4.1:8080/turret";
    await fetch(endpointTurret, {
      method: 'POST',
      headers: {
        'Content-Type':'plain/text',
      },
      body:JSON.stringify(objToSend)
    })
    .then((jsonResp) => {
      console.log("Everything went ok");
    }
    );
  }

  shootItem(){
    this.setState({armState: 'arming'});
    console.log(this.state.armState);
    if(this.state.armState === 'arming'){
    console.log("Initiating armed process");
    setTimeout(() => {
      console.log("Armed, now you can shoot");
      this.setState({armState: 'armed'});
    }, 2000);}
    if(this.state.armState === 'armed'){
      this.setState({armState: ''});
    }    
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#007CD3',
  },
  button:{
    backgroundColor: '#656',
    width: '30%',
    marginTop: 30,
    padding: 15,
    borderRadius: 10,
  },  
  buttonText:{
    color: '#fefefe',
    textAlign: 'center'
  },
  joysticksView:{
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '100%',
    flexWrap: 'wrap',
  },
  title: {
    fontSize: 20,
    textAlign: 'center',
    color: '#fefefe',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#fefefe',
    marginBottom: 5,
  },
});
