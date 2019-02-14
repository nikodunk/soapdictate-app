import React from 'react';
import {  StyleSheet, 
          Text, 
          View, 
          TouchableOpacity, 
          StatusBar, 
          AsyncStorage, 
          ActivityIndicator, 
          FlatList, 
          Linking, 
          Image, 
          ImageBackground,
          TextInput,
          Platform,
          Keyboard,
          Button,
          ScrollView,
          Picker,
          KeyboardAvoidingView,
          Switch} from 'react-native';
import styles from './_styles'
import * as Animatable from 'react-native-animatable';
import { SafeAreaView } from 'react-navigation'

var Mixpanel = require('react-native-mixpanel');
Mixpanel = Mixpanel.default
Mixpanel.sharedInstanceWithToken('c72aabf24fb03673362eae05a8e5150a');



class SettingsScreen extends React.Component {
      

      constructor(props) {
        super(props);
        this.state = {
          usergroup: '',
          email: '',
          subscribed: false,
          language: null,
          fontSize: null,
          practice: '',
          abbreviated: false,
          chiefcomplaintvisible: true,
          billingcodevisible: false,
          patientnumbervisible: false
        };
        this._getStoredSwitch = this._getStoredSwitch.bind(this);
        this._getStoredString = this._getStoredString.bind(this);
      }
      
      componentDidMount() {

          AsyncStorage.getItem('email').then((res) => {
            this.setState({email: res})
            if(this.state.email !== 'niko'){ Mixpanel.track("Settings Loaded"); }
          })

          this._getStoredString('subscribed')
          this._getStoredString('fontSize')
          this._getStoredString('language')
          this._getStoredString('practice')

          this._getStoredSwitch('abbreviated')
          this._getStoredSwitch('chiefcomplaintvisible')
          this._getStoredSwitch('billingcodevisible')
          this._getStoredSwitch('patientnumbervisible')
          
      }

      _getStoredSwitch(input){
        AsyncStorage.getItem(input).then((res) => {
          var newState = {};
          newState[input] = JSON.parse(res); 
          this.setState(newState);
        })
      }

      _getStoredString(input){
        AsyncStorage.getItem(input).then((res) => {
                    var newState = {}
                    newState[input] = JSON.parse(res)
                    this.setState(newState)
                  })
      }


      _onChangeEmail(text){
          this.setState({email: text})
          AsyncStorage.setItem('email', JSON.stringify(text))
      }

      _onChangePractice(text){
          this.setState({practice: text})
          AsyncStorage.setItem('practice', JSON.stringify(text))
      }

      _onChangeFontSize(newFontSize){
        AsyncStorage.setItem('fontSize', JSON.stringify(newFontSize))
        this.setState({fontSize: newFontSize})
      }


      _onChangeLanguage(newLanguage){
        AsyncStorage.setItem('language', JSON.stringify(newLanguage))
        this.setState({language: newLanguage})
        if(this.state.email !== 'niko'){ Mixpanel.track("Language changed to "+newLanguage); }
      }

      _onSwitchAbbreviated(value){
        this.setState({abbreviated: value})
        AsyncStorage.setItem('abbreviated', JSON.stringify(value))
        if(this.state.email !== 'niko'){ Mixpanel.track("Switched Abbreviation to "+this.state.abbreviated); }
      }

      _onSwitchChiefComplaintVisible(value){
        this.setState({chiefcomplaintvisible: value})
        AsyncStorage.setItem('chiefcomplaintvisible', JSON.stringify(value))
        console.log(JSON.stringify(value))
        if(this.state.email !== 'niko'){ Mixpanel.track("Switched chiefcomplaintvisible to "+this.state.chiefcomplaintvisible); }
      }

      _onSwitchBillingCodeVisible(value){
        this.setState({billingcodevisible: value})
        AsyncStorage.setItem('billingcodevisible', JSON.stringify(value))
        if(this.state.email !== 'niko'){ Mixpanel.track("Switched billingcodevisible to "+this.state.billingcodevisible); }
      }

      _onSwitchPatientNumberVisible(value){
        this.setState({patientnumbervisible: value})
        AsyncStorage.setItem('patientnumbervisible', JSON.stringify(value))
        if(this.state.email !== 'niko'){ Mixpanel.track("Switched patientnumbervisible to "+this.state.patientnumbervisible); }
      }



      render() {
          return (
              <SafeAreaView style={{flex: 1}}>
                <Animatable.View animation="slideInLeft" duration={400} easing="ease-out" style={{flex: 0.95, alignItems: 'center',}}>
                  <StatusBar
                     barStyle="dark-content"
                   />
                  
                  <View style={{flexDirection: 'row', justifyContent: 'space-between', width: '100%'}}>
                    <Button
                      onPress={() => this.props.navigation.navigate('Dictation')}
                      title={"Back"}
                      ></Button>
                    <Text style={{padding: 8, fontSize: 20}}>Settings   </Text>
                    <Button
                      onPress={() => {}}
                      title={"    "}
                      ></Button>
                  </View>   
                        
                  <KeyboardAvoidingView behavior="padding" enabled>
                    <ScrollView keyboardShouldPersistTaps={'handled'}>
                      

                        {/* ------------------------------------------- */}

                        
                        {/* EMAIL FEEDBACK */}
                        <View style={{flex: 1, alignItems: 'center', padding: 10}}>
                           <Text style={{fontWeight: 'bold', padding: 3}}>Feature missing? Have feedback?</Text>
                          <TouchableOpacity onPress={() => Linking.openURL('mailto:n.dunkel@gmail.com')} >
                            <Text style={[styles.shadowBox, styles.outlineButton]}>
                              Email Feedack
                            </Text>
                          </TouchableOpacity> 
                          <Text></Text>
                          <Text>Email the developers with feature requests, ideas, bugs to fix or feedback!</Text>
                        </View>


                        <View>
                          <Text></Text>
                          <View style={styles.separator} />
                          
                        </View>


                        {/* ------------------------------------------- */}





                        

                        <Text style={{paddingLeft: 3}}>Subjective</Text>

                        {/* CHIEF COMPLAINT SEPERATE ON / OFF */}
                        {<View style={{ padding: 10}}>
                          <View style={{flexDirection:'row' }}> 

                            <Text style={{fontWeight: 'bold', padding: 3}}>Chief Complaint Separate</Text>
                            <Switch value={this.state.chiefcomplaintvisible} onValueChange={(value) => this._onSwitchChiefComplaintVisible(value)} />

                          </View>
                        </View>}

                        {/* HPI SEPERATE ON / OFF */}
                        {/*<View style={{padding: 10}}>
                          <View style={{flexDirection:'row'}}> 

                            <Text style={{fontWeight: 'bold', padding: 3}}>History Present Illness (HPI) Separate</Text>
                            <Switch value={this.state.hpivisible} onValueChange={(value) => this._onSwitchHpiVisible(value)} />

                          </View>
                        </View>*/}

                        {/* SOCIAL HISTORY SEPARATE ON / OFF */}
                        {/*<View style={{padding: 10}}>
                          <View style={{flexDirection:'row'}}> 

                            <Text style={{fontWeight: 'bold', padding: 3}}>Social History Separate</Text>
                            <Switch value={this.state.socialhistoryvisible} onValueChange={(value) => this._onSwitchSocialHistoryVisible(value)} />

                          </View>
                        </View>*/}

                        {/*-----*/}

                        {/*<Text style={{paddingLeft: 3}}>Objective</Text>*/}

                        {/* REVIEW OF SYSTEMS FIELD ON / OFF */}
                        {/*<View style={{ padding: 10}}>
                          <View style={{flexDirection:'row'}}> 

                            <Text style={{fontWeight: 'bold', padding: 3}}>Review Of Systems Separate</Text>
                            <Switch value={this.state.reviewsystemsvisible} onValueChange={(value) => this._onSwitchReviewSystemsVisible(value)} />

                          </View>
                        </View>*/}

                        {/* FINDINGS ON / OFF */}
                        {/*<View style={{ padding: 10}}>
                          <View style={{flexDirection:'row'}}> 

                            <Text style={{fontWeight: 'bold', padding: 3}}>Findings Field Separate</Text>
                            <Switch value={this.state.findingsvisible} onValueChange={(value) => this._onSwitchFindingsVisible(value)} />

                          </View>
                        </View>*/}


                        {/* LAB RESULTS ON / OFF */}
                        {/*<View style={{ padding: 10}}>
                          <View style={{flexDirection:'row' }}> 

                            <Text style={{fontWeight: 'bold', padding: 3}}>Lab Results Separate</Text>
                            <Switch value={this.state.labresultsvisible} onValueChange={(value) => this._onSwitchLabResultsVisible(value)} />

                          </View>
                        </View>*/}



                        {/*-----*/}

                        {/*<Text style={{paddingLeft: 3}}>Other</Text>*/}


                        {/* ACUPUNCTURE MODE ON / OFF */}
                        {/*<View style={{flex: 1, padding: 10}}>
                          <View style={{flexDirection:'row'}}> 

                            <Text style={{fontWeight: 'bold', padding: 3}}>Acupuncture Mode</Text>
                            <Switch value={this.state.acupuncturemode} onValueChange={(value) => this._onSwitchAcupunctureMode(value)} />

                          </View>
                        </View>*/}


                        {/* LONG VS. SHORT NOTE SOAP */}
                        <View style={{padding: 10}}>
                          <View style={{flexDirection:'row' }}> 

                            <Text style={{fontWeight: 'bold', padding: 3}}>Abbreviate S.O.A.P. </Text>
                            <Switch value={this.state.abbreviated} onValueChange={(value) => this._onSwitchAbbreviated(value)} />

                          </View>
                        </View>


                        <View>
                          <Text></Text>
                          <View style={styles.separator} />
                        </View>

                        {/*-----*/}





                        {/* BILLING CODE ON / OFF */}
                        {<View style={{ padding: 10}}>
                          <View style={{flexDirection:'row'}}> 

                            <Text style={{fontWeight: 'bold', padding: 3}}>Billing Code Field</Text>
                            <Switch value={this.state.billingcodevisible} onValueChange={(value) => this._onSwitchBillingCodeVisible(value)} />

                          </View>
                        </View>}


                        {/* PATIENT NUMBER ON / OFF */}
                        {/*<View style={{ padding: 10}}>
                          <View style={{flexDirection:'row'}}> 

                            <Text style={{fontWeight: 'bold', padding: 3}}>Patient Number Field</Text>
                            <Switch value={this.state.patientnumbervisible} onValueChange={(value) => this._onSwitchPatientNumberVisible(value)} />

                          </View>
                        </View>*/}






                        <View>
                          <Text></Text>
                          <View style={styles.separator} />
                        </View>

                        

                        {/* ------------------------------------------- */}



                        {/* PRACTICE NAME */}
                        <View style={{flex: 1, alignItems: 'center', padding: 10}}>
                          <View style={{flexDirection:'row', alignItems: 'center'}}> 
                            <Text style={{fontWeight: 'bold', padding: 3}}>Set{'\n'}Practice{'\n'}Name </Text>
                            <View style={{flexDirection:'row', alignItems: 'center'}}> 
                              <TextInput 
                                underlineColorAndroid="transparent"
                                style={styles.input}
                                placeholder={this.state.practice}
                                autoCorrect={false}
                                onChangeText={(text) => this._onChangePractice(text)} 
                              />
                          </View>

                          </View>
                          <Text></Text>
                          <Text>Practice Name that will print on top of PDF</Text>
                        </View>


                        <View >
                          <Text></Text>
                          <View style={styles.separator} />
                        </View>




                        {/* ------------------------------------------- */}


                        
                        {/* SET EMAIL */}
                        <View style={{flex: 1, alignItems: 'center', padding: 10}}>
                          <View style={{flexDirection:'row', alignItems: 'center'}}> 
                            <Text style={{fontWeight: 'bold', padding: 3}}>Your{'\n'}Email </Text>
                            <View style={{flexDirection:'row', alignItems: 'center'}}> 
                              <TextInput 
                                underlineColorAndroid="transparent"
                                style={styles.input}
                                placeholder={this.state.email}
                                autoCorrect={false}
                                keyboardType={'email-address'}
                                autoCapitalize={'none'}
                                onChangeText={(text) => this._onChangeEmail(text)} 
                              />
                          </View>

                          </View>
                          <Text></Text>
                          <Text>Address that will auto-fill when emailing note</Text>
                        </View>
                          
                          
                        <View>
                          <Text></Text>
                          <View style={styles.separator} />
                        </View>
                        
                        {/* ------------------------------------------- */}


                        {/* FONT SIZE */}
                        <View style={{flex: 1, alignItems: 'center', padding: 10}}>
                          <View style={{flexDirection:'row', alignItems: 'center'}}> 

                            <Text style={{fontWeight: 'bold', padding: 3}}>Font Size</Text>
                            <Picker
                              selectedValue={this.state.fontSize}
                              itemStyle={{height: 100}}
                              style={{ height: 100, width: 100, borderColor: 'lightgrey', borderWidth: 1, borderRadius: 10, margin: 10 }}
                              onValueChange={(itemValue, itemIndex) => this._onChangeFontSize(itemValue)}>
                              <Picker.Item label="10" value="10" />
                              <Picker.Item label="12" value="12" />
                              <Picker.Item label="14" value="14" />
                              <Picker.Item label="16" value="16" />
                              <Picker.Item label="18" value="18" />
                              <Picker.Item label="20" value="20" />
                              <Picker.Item label="22" value="22" />
                              <Picker.Item label="24" value="24" />
                              <Picker.Item label="26" value="26" />
                              <Picker.Item label="28" value="28" />
                              <Picker.Item label="30" value="30" />
                            </Picker>

                          </View>
                        </View>


                        <View>
                          <Text></Text>
                          <View style={styles.separator} />
                        </View>





                        {/* ------------------------------------------- */}



                        {/* LANGUAGE */}
                        <View style={{flex: 1, alignItems: 'center', padding: 10}}>
                          <View style={{flexDirection:'row', alignItems: 'center'}}> 

                            <Text style={{fontWeight: 'bold', padding: 3}}>Recognition {'\n'}Language</Text>
                            <Picker
                              selectedValue={this.state.language}
                              itemStyle={{height: 100, padding: 20}}
                              style={{ height: 100, width: 200, borderColor: 'lightgrey', borderWidth: 1, borderRadius: 10}}
                              onValueChange={(itemValue, itemIndex) => this._onChangeLanguage(itemValue)}>
                              <Picker.Item label="U.S. English" value="en" />
                              <Picker.Item label="UK English" value="en-GB" />
                              <Picker.Item label="English (Indian)" value="en-IN" />
                              <Picker.Item label="Chinese (Simplified)" value="zh-Hans" />
                              <Picker.Item label="Chinese (Traditional)" value="zh-Hant" />
                              <Picker.Item label="Chinese (Hong Kong)" value="zh-HK" />
                              <Picker.Item label="German" value="de-DE" />
                              <Picker.Item label="Spanish" value="es" />
                              <Picker.Item label="Spanish (Mexico)" value="es-MX" />
                              <Picker.Item label="French (France)" value="fr-FR" />
                              <Picker.Item label="Arabic" value="ar_SA" />
                            </Picker>

                          </View>
                        </View>

                        <View>
                          <Text></Text>
                          <View style={styles.separator} />
                        </View>


                        


                        {/* ------------------------------------------- */}

                        {/* HOW TO UNSUBSCRIBE */}
                        {this.state.subscribed ?
                          <View>
                            <View style={{flex: 1, alignItems: 'center', padding: 10}}>
                              <Text style={{fontSize: 15, textAlign: 'center', color: 'grey'}}>
                                You are currently enrolled in the $3.99/mo plan. Cancel your subscription any time in the iOS "Settings" App under "iTunes & App Store" > "Apple ID" > "View Apple ID" > "Subscriptions".
                              </Text>
                            </View>
                            <View>
                              <Text></Text>
                              <View style={styles.separator} />
                            </View>
                          </View>
                          :
                          null
                        }


                        {/* ------------------------------------------- */}


                        {/* INVITE COLLEAGUES */}
                        <View style={{flex: 1, alignItems: 'center', padding: 10}}>
                          <TouchableOpacity 
                              style={[styles.shadowBox, styles.materialButtonLong]} 
                              onPress={() => Platform.OS === 'ios' ? Linking.openURL('sms: &body=https://itunes.apple.com/app/id1384252497') : Linking.openURL('sms:?body=https://play.google.com/store/apps/details?id=com.pokedoc.iamoff')} >
                            <Text style={[styles.materialButtonTextLong]}>
                              Share app with colleagues
                            </Text>
                          </TouchableOpacity> 
                        </View>

                        <View>
                          <Text></Text>
                          <View style={styles.separator} />
                        </View>

                        {/* ------------------------------------------- */}
                        

                       
                    </ScrollView>
                  </KeyboardAvoidingView>
                </Animatable.View> 
              </SafeAreaView>
              
              
            

        
          );
        }
        

    }



export default SettingsScreen;