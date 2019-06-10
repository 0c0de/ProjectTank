/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, StatusBar, TouchableOpacity, Image } from 'react-native';

export default class App extends Component{

  constructor(props){
    super(props);

    this.state = {
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
        <View style={styles.joystickView}>
          <View style={styles.LeftJoysticksView}> 
            <TouchableOpacity style={styles.dirButton} onPressIn={() => this.setTankPos("forward")} onPressOut={() => this.setTankPos("none")}>
              <Image source={require('./img/Up.png')} style={{width: 100, height: 100}}/>
            </TouchableOpacity>
            <View style={styles.LeftRightView}>
              <TouchableOpacity style={styles.dirButton} onPressIn={() => this.setTankPos("left")} onPressOut={() => this.setTankPos("none")}>
                <Image source={require('./img/Left.png')} style={{width: 100, height: 100, marginRight: 20}}/>
              </TouchableOpacity>
              <TouchableOpacity style={styles.dirButton} onPressIn={() => this.setTankPos("right")} onPressOut={() => this.setTankPos("none")}>
              < Image source={require('./img/Right.png')} style={{width: 100, height: 100, marginLeft: 20}}/>
              </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.dirButton} onPressIn={() => this.setTankPos("back")} onPressOut={() => this.setTankPos("none")}>
            <Image source={require('./img/Down.png')} style={{width: 100, height: 100}}/>
            </TouchableOpacity>
          </View>
          <View style={styles.RightJoysticksView}>
            <View style={styles.LeftRightView}>
              <TouchableOpacity style={styles.dirButton} onPressIn={() => this.setTankPos("left")} onPressOut={() => this.setTankPos("none")}>
                <Image source={require('./img/Left.png')} style={{width: 100, height: 100}}/>
              </TouchableOpacity>
              <TouchableOpacity style={styles.dirButton} onPressIn={() => this.setTankPos("right")} onPressOut={() => this.setTankPos("none")}>
              < Image source={require('./img/Right.png')} style={{width: 100, height: 100}}/>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <TouchableOpacity style={styles.button} activeOpacity={0.5} onPress={() => this.shootItem()}>
          <HandleShootState state={this.state.armState} />
        </TouchableOpacity>
      </View>
    );
  }

  async setTankPos(dir){
    const objToSend = {
      direction: dir
    };

    const endpointTank = "http://192.168.4.1/tank";
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

  async setTurretPos(dir){
    const objToSend = {
      direction: dir,
    };

    const endpointTurret = "http://192.168.4.1/turret";
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

    fetch('http://192.168.4.1/gun', {
      method: 'POST',
      headers: {
        'Content-Type':'text/plain'
      },
      body: JSON.stringify({state: this.state.armState})
    }).then((result) => {
      alert(result);
    }).catch((err) => {
      console.warn(err);
    });    
  }
  
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#007CD3',
  },
  dirButton:{
    //backgroundColor: '#0057d2',
    justifyContent: 'center',
    alignItems: 'center',
    //marginTop: 30,
    marginBottom: -20,
  },
  joystickView: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  LeftRightView: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button:{
    backgroundColor: '#0057d2',
    width: '30%',
    marginTop: 30,
    padding: 15,
    borderRadius: 10,
  },  
  buttonText:{
    color: '#fefefe',
    textAlign: 'center'
  },
  LeftJoysticksView:{
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: '50%',
    flexWrap: 'wrap',
  },
  RightJoysticksView:{
    flexDirection: 'column',
    justifyContent: 'flex-end',
    alignItems: 'center',
    width: '50%',
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
