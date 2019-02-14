import React from 'react';
import { StyleSheet, Text, View, AsyncStorage, TextInput, TouchableOpacity, Alert, ImageBackground, ActivityIndicator, Image, Platform, ScrollView, KeyboardAvoidingView, Linking } from 'react-native';
import { SafeAreaView } from 'react-navigation'

import * as Animatable from 'react-native-animatable';
import Button from 'react-native-button';

var Mixpanel = require('react-native-mixpanel');
Mixpanel = Mixpanel.default
Mixpanel.sharedInstanceWithToken('c72aabf24fb03673362eae05a8e5150a');






class AuthScreen extends React.Component {

  constructor(props) {
    super(props);
    this.state = { 
        loading: false,
        email: ''
       };
  }


  componentDidMount() {
      Mixpanel.track("EmailScreen Loaded");
      AsyncStorage.getItem('email').then((res) => {
        email = res
        this.setState({email: email})
      })
  }



  _onPress = async (email) => {
    Mixpanel.track("Email Button Pressed");
    this.setState({loading: true})
    console.log(email)
    if(email === '' || email === ' ' || email === null){
      Alert.alert('Please enter your email');
      this.setState({loading: false})
      return
    }
    else{
      fetch('https://healthnotes.herokuapp.com/email/', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: email
          }),
      }).then(() => AsyncStorage.setItem('email', email ))
        .then(() => this.props.navigation.navigate('App'))
    }
  };


  


  render() {
    return (
    <SafeAreaView style={{flex: 1}}>
      <View style={styles.container}>
        
        <View style={{ textAlign: 'center', alignItems: 'center', flex: 1, margin: 40}}>
      
          <Animatable.View animation="fadeIn" duration={1000}>
            <Text style={{fontSize: 24, color: '#2191fb', textAlign: 'center'}}>
                Welcome! Please set your email to continue.
            </Text>
            <Text></Text>
          </Animatable.View>
          
          { this.state.loading ? 
            
            <ActivityIndicator style={{marginTop: 10}} color="black" />
            
            : 
            <KeyboardAvoidingView behavior="padding" enabled>

              <View style={styles.border}>
                <TextInput 
                    underlineColorAndroid="transparent"
                    style={styles.input}
                    placeholder={'Enter email'}
                    autoFocus={true}
                    autoCapitalize = 'none'
                    keyboardType={'email-address'}
                    onChangeText={ (text) => {  this.setState({email: text}) }}
                />
                <Button 
                  style={[{backgroundColor: '#2191fb' }, styles.bottomButton]}
                  onPress={() => this._onPress(this.state.email)} >
                  Continue
                </Button>
              </View>

              <Text style={{color: 'grey'}}>
                By using this software you agree to receiving the occasional feedback or marketing email to help us improve the product for you.{'\n'}
              </Text>

            </KeyboardAvoidingView>
          }
      
        </View>
      </View>
    </SafeAreaView>
      );
  }
}

styles = StyleSheet.create({
  container: {
      flex: 1,
      flexDirection: 'column',
      backgroundColor: 'white',
    },
  input:{
        height: 40, 
        backgroundColor:'white',
        paddingLeft: 10,
        padding: 4,
        textAlign: 'center'
      },
  bottomButton:{
        color: 'white',
        padding: 15,
        
        borderWidth: 0,
        overflow:'hidden',
        fontSize: 18,
        fontWeight: '600',
        height: 50, 
  },
  button:{
    padding: 8, 
    fontSize: 18, 
    fontWeight: '400',
  },
  border:{
    borderRadius: 10, 
    borderWidth: 1, 
    borderColor: '#2191fb', 
    overflow: 'hidden', 
    margin: 5, 
    marginTop: 0
  }
})


export default AuthScreen;