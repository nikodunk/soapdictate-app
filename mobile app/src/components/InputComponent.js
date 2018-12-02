import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  AppRegistry,
  AsyncStorage,
  Linking,
  Platform,
  TextInput,
  KeyboardAvoidingView,
  Vibration,
  ScrollView,
  ActivityIndicator,
  Clipboard,
  TouchableOpacity
} from 'react-native';
import Button from 'react-native-button';

import * as Animatable from 'react-native-animatable';
import FontAwesome, { Icons } from 'react-native-fontawesome';





import Sound from 'react-native-sound';
Sound.setCategory('MultiRoute');
var blip = new Sound('blip.m4a', Sound.MAIN_BUNDLE, (error) => {
  if (error) {
    console.log('failed to load the sound', error);
    return;
  }
});


var Mixpanel = require('react-native-mixpanel');
Mixpanel = Mixpanel.default
Mixpanel.sharedInstanceWithToken('c72aabf24fb03673362eae05a8e5150a');





export default class InputComponent extends React.Component {
  constructor(props) {
      super(props);
      this.state = {
        recognized: '',
        started: '',
        results: [],
        recording: false,
        fontSize: 10
      };
  }

  componentDidMount() {

      AsyncStorage.getItem('fontSize').then((res) => {
        var int = JSON.parse(res)
        int = parseInt(int)
        this.setState({fontSize: int})
      })

  }


  


  

  // VIEW
  // -----------------------------------------------------------------------------------------------------------------------


  render () {
      return (



            <View style={styles.container}>

                  <Text style={{marginLeft: 7, fontWeight: '800'}}>{this.props.abbreviated ? this.props.title.slice(0, 1) : this.props.title }</Text>
                  { this.props.editing ? 
                    
                      <TextInput
                               style={styles.textInput}
                               multiline = {true}
                               autoFocus = {true}
                               onChangeText={(text) => this.props.onChangeText(text, this.props.noteName)}
                               value={this.props.note} />
                    
                    :
                    <View>
                      <Text style={{textAlign: 'left', padding: 8, fontSize: this.state.fontSize}}>
                        {this.props.note}
                        {'\u00A0'}
                        {this.props.currentRecordingNote === this.props.noteName ? this.props.temporaryresults : null }
                        
                        {/*{this.props.currentRecordingNote === this.props.noteName && !this.props.temporaryresults && !this.state.continuing ? <Text style={{color: 'red'}}>{'\n'}{'\n'}Go ahead! I'm listening</Text> : null}*/}
                      </Text>

                             {this.props.loading ? <ActivityIndicator style={{marginBottom: 30}} color="black" /> : 
                             <Animatable.View animation="bounceIn" easing="ease-in-out" style={{shadowColor: this.props.currentRecordingNote !== this.props.noteName || this.props.currentStoppingNote === this.props.noteName ? '#2191fb' : 'red', shadowOffset: { width: 0, height: 0 }, shadowOpacity: .4, shadowRadius: 7}}>
                              <TouchableOpacity 
                                style={[{borderColor: 'white', backgroundColor: this.props.currentRecordingNote === this.props.noteName ? 'red' : '#2191fb' },
                                        this.props.currentStoppingNote ===  this.props.noteName || !this.props.unlocked || (this.props.currentRecordingNote !== this.props.noteName && this.props.currentRecordingNote !== null) ? styles.bottomButtonDisabled  : styles.bottomButton,
                                        {justifyContent: 'center', flexDirection: 'row', height: 50},]}
                                onPress={(e) => this.props._toggleRecognizing(e, this.props.noteName)}
                                onLongPress={(e) => this.props._toggleRecognizing(e, this.props.noteName)}
                                disabled={this.props.currentStoppingNote ===  this.props.noteName || !this.props.unlocked || (this.props.currentRecordingNote !== this.props.noteName && this.props.currentRecordingNote !== null)}
                                >
                                  
                                    {this.props.currentRecordingNote !== this.props.noteName ? null : <ActivityIndicator color={'white'} />}
                                    <Text style={[{color: 'white', fontSize: 18, fontWeight: '600' }]}>
                                        {this.props.currentRecordingNote !== this.props.noteName ? <FontAwesome>{Icons.microphone} </FontAwesome> : null}
                                        {this.props.currentRecordingNote !== this.props.noteName ? "Dictate " + this.props.title : " Recording... Touch to Stop."}
                                    </Text>
                                  

                                </TouchableOpacity>
                              </Animatable.View>
                              }

                      {/*<View style={styles.separator} />*/}
                      <Text></Text>
                      <Text></Text>
                    </View> 
                  }

                  
                  


            </View>
            
            
      );
    }
}

const styles = StyleSheet.create({
    container: {
      width: Platform.isPad ? 480 : null
    },
    topBar:{
      flexDirection: 'row', 
      justifyContent: 'space-between'
    },
    transcript: {
      flex: 1,
    },
    button:{
      padding: 8, 
      fontSize: 18, 
      fontWeight: '400',
      textAlign: 'center'
    },
    textInput:{
      borderColor: 'lightgray', 
      borderWidth: 1, 
      borderRadius: 10, 
      padding: 5, 
      margin: 5,
      fontSize: 20,
      backgroundColor: 'white'
      },
    optionBar:{
      flexDirection: 'row', 
      justifyContent: 'space-around',
      marginBottom: 3,
      marginTop: 3,
      marginLeft: '3%',
      marginRight: '3%'
    },
    bottomButton:{
      padding: 15,
      margin: '4%',
      marginTop: 0,
      width: '92%',
      borderWidth: 0,
      borderRadius: 10,
      overflow:'hidden',

    },
    bottomButtonDisabled:{
      padding: 15,
      margin: '4%',
      backgroundColor: 'lightgrey', 
      width: '92%',
      borderWidth: 0,
      borderRadius: 10,
      overflow:'hidden',
    },
    border:{
      borderRadius: 8, 
      borderWidth: 1, 
      overflow: 'hidden', 
      margin: 5,
    },
    borderDisabled:{
      borderRadius: 8, 
      borderWidth: 1, 
      overflow: 'hidden', 
      margin: 5,
      borderColor: 'lightgrey'
    },
    separator:{
        height: 1,
        backgroundColor: "lightgrey",
        marginBottom: 12,
        marginLeft: '5%',
        marginRight: '5%',
      },
});