import React from 'react';
import { StyleSheet, Text, View, AsyncStorage, TextInput, TouchableOpacity, Alert, ImageBackground, ActivityIndicator, Image, Platform, ScrollView, KeyboardAvoidingView, Linking, SafeAreaView } from 'react-native';

import * as Animatable from 'react-native-animatable';
import Button from 'react-native-button';

var Mixpanel = require('react-native-mixpanel');
Mixpanel = Mixpanel.default
Mixpanel.sharedInstanceWithToken('c72aabf24fb03673362eae05a8e5150a');


import * as RNIap from 'react-native-iap';
const itemSkus = Platform.select({
  ios: [
    'com.bigset.monthly'
  ],
  // android: [
  //   'com.example.coins100'
  // ]
});






class AuthScreen extends React.Component {

  constructor(props) {
    super(props);
    this.state = { 
        loading: false
       };
  }

  componentDidMount() {
      
      Mixpanel.track("Authscreen Loaded");
  }

  componentWillUnmount() {
    RNIap.endConnection();
  }



  _onPress = async () => {
    Mixpanel.track("Subscribe Pressed");
    this.setState({loading: true})
    this._buyProduct()
  };


  _buyProduct(){
        
      RNIap.buyProduct('com.bigset.monthly').then(purchase => {
        
        AsyncStorage.setItem('receipt', purchase.transactionReceipt )
        console.log('SUCCESS!! ', purchase)

        this.props.navigation.navigate('Dictation')

      }).catch(err => {
        
        this.setState({loading: false})

        console.warn(err); // standardized err.code and err.message available
        
        alert(err.message);
        
      })
  }


  _getPurchases = async() => {
    this.setState({loading: true})
    try {
      const purchases = await RNIap.getAvailablePurchases();
      console.log(purchases)
      if(purchases){
        purchases.forEach(purchase => {
          if (purchase.productId == 'com.bigset.monthly') {
            AsyncStorage.setItem('receipt', purchase.transactionReceipt )
            // console.log('SUCCESS!! ', purchase)
            this.props.navigation.navigate('Dictation')
          } 
          else {
            return
          }
        })
        Alert.alert('Restore Successful', 'You successfully restored your subscription');
      }
      else{
        Alert.alert('Restore Unsuccessful', 'It appears you have no previous subscriptions');
      }
    } catch(err) {
      console.warn(err); // standardized err.code and err.message available
      Alert.alert(err.message);
    }
  }


  render() {
    return (
    <SafeAreaView style={{flex: 1}}>
      <View style={styles.container}>
        <View style={styles.topBar}>
              <Button
                style={[styles.button]}
                onPress={() => this.props.navigation.navigate('Dictation')}
                >Back</Button>
        </View>
        <View style={{ textAlign: 'center', alignItems: 'center', flex: .7}}>
      
          <Animatable.View animation="fadeIn" duration={1000}>
            <Text style={{fontSize: 24, color: '#2191fb', textAlign: 'center'}}>
                Save hours of typing every day.
            </Text>

          </Animatable.View>
          <Animatable.View animation="fadeIn"  duration={3000}>
            <Text style={{fontSize: 16, textAlign: 'center' }}>
                Agree to terms, enter email, and start 1-week free trial. $3.99/month after that.
            </Text>
          </Animatable.View>
          
          { this.state.loading ? 
            
            <ActivityIndicator style={{marginTop: 10}} color="black" />
            
            : 
            <KeyboardAvoidingView behavior="padding" enabled>
              <ScrollView style={{ margin: 5, borderWidth: 1, borderColor: 'lightgrey', padding: 5}}>
                            <Text style={{fontSize: 12, color: 'grey'}}>
                                • Payment will be charged to iTunes Account at confirmation of purchase {'\n'}
                                • Subscription automatically renews unless auto-renew is turned off at least 24-hours before the end of the current period {'\n'}
                                • Account will be charged for renewal within 24-hours prior to the end of the current period, and identify the cost of the renewal{'\n'}
                                • Subscriptions may be managed by the user and auto-renewal may be turned off by going to the user's Account Settings after purchase{'\n'}
                                • Any unused portion of a free trial period, if offered, will be forfeited when the user purchases a subscription to that publication, where applicable{'\n'}
                                • By using this software you agree to receiving the occasional feedback or marketing email to help us improve the product for you.{'\n'}
                            </Text>
                            <Text style={{fontSize: 12, color: '#2191fb'}}
                                  onPress={() => Linking.openURL('http://soapdictate.com/terms/')}>
                              • Terms of Service{'\n'}
                            </Text>
                            <Text style={{fontSize: 12, color: '#2191fb'}}
                                  onPress={() => Linking.openURL('http://soapdictate.com/privacy/')}>
                              • Privacy Policy{'\n'}
                            </Text>
              </ScrollView>

              <View style={styles.border}>
                <Button 
                  style={[{backgroundColor: '#2191fb' }, styles.bottomButton]}
                  onPress={() => this._onPress()} >
                  Start free trial, then $3.99/month
                </Button>
              </View>

              <View style={{borderRadius: 10, borderWidth: 1, borderColor: '#2191fb', overflow: 'hidden', margin: 5, marginTop: 0}}>
                <Button
                  style={styles.button}
                  onPress={() => this._getPurchases()}>
                  or restore purchase
                </Button>
              </View>

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
      backgroundColor: 'white'
    },
    topBar:{
      flexDirection: 'row', 
      justifyContent: 'space-between'
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