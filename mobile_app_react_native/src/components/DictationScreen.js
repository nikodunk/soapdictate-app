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
  TouchableOpacity,
  Alert,
  Picker,
  DatePickerIOS,
  Share,
  Button,
  SafeAreaView
} from 'react-native';


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


import Voice from 'react-native-voice';




import InputComponent from './InputComponent';


import { defaultPrintPDF } from './helpers';




import * as RNIap from 'react-native-iap';
const itemSkus = Platform.select({
  ios: [
    'com.bigset.monthly'
  ],
  // android: [
  //   'com.example.coins100'
  // ]
});


const fields = {
              chiefcomplaint: { name: 'Chief Complaint', noteName: 'chiefcomplaint', results: 'chiefcomplaintresults', visible: 'chiefcomplaintvisible' },
              subjective: { name: 'Subjective', noteName: 'subjective', results: 'subjectiveresults' },
              objective: { name: 'Objective', noteName: 'objective', results: 'objectiveresults' },
              assessment: { name: 'Assessment', noteName: 'assessment', results: 'assessmentresults' },
              plan: { name: 'Plan', noteName: 'plan', results: 'planresults' },
              notes: { name: 'Notes', noteName: 'notes', results: 'notesresults' }
              }



export default class DictationScreen extends React.Component {
  constructor(props) {
      super(props);
      this.state = {
        recognized: '',
        started: '',
        results: [],

        recording: false,
        editing: false,
        // previousNote: null,
        noInput: false,
        stopping: false,

        unlocked: false,
        loading: true,
        subscribed: false,
        printing: false,

        fontSize: 15,
        language: 'en-US',

        currentRecordingNote: null,
        selectedPrinter: null,

        chiefcomplaintvisible: false,
        abbreviated: false
        
      };
      
      
      Voice.onSpeechStart = this.onSpeechStart.bind(this);
      Voice.onSpeechRecognized = this.onSpeechRecognized.bind(this);
      Voice.onSpeechResults = this.onSpeechResults.bind(this);
      Voice.onSpeechEnd = this.onSpeechEnd.bind(this);

  }

  componentDidMount() {


      // get email, except if developer mode
      AsyncStorage.getItem('email').then((res) => {
        this.setState({email: res})
        {this.state.email ? Mixpanel.identify(this.state.email) : null }
        if(this.state.email !== 'niko'){Mixpanel.track("DictationScreen Loaded") }
        if(this.state.email === 'niko'){ AsyncStorage.removeItem('remainingtrials') }
      })

      // ----------------------

      // check if subscribed and save for settings screen
      this._getProducts()

      // get notes     
      this._getStoredString('chiefcomplaint') 
      this._getStoredString('subjective')
      this._getStoredString('objective')
      this._getStoredString('assessment')
      this._getStoredString('plan') 
      this._getStoredString('notes') 
      this._getStoredString('patientname') 
      this._getStoredString('billingcode') 
      this._getStoredString('practice') 

      // get settings
      this._getStoredSwitch('abbreviated')
      this._getStoredSwitch('chiefcomplaintvisible') 
      this._getStoredSwitch('billingcodevisible') 


      // get special other items
      AsyncStorage.getItem('chosenDate').then((notes) => {
                if(notes === null){
                    x = Date.now()
                    this.setState({chosenDate: new Date(x) })
                  }
                else{
                    this.setState({chosenDate: new Date(notes) })
                  }
            })

      AsyncStorage.getItem('patientsex').then((notes) => {
                if(notes === ''){
                    this.setState({ 'patientsex': 'female' })
                  }
                else{
                    this.setState({ 'patientsex': JSON.parse(notes) }) 
                  }
            })
  

      AsyncStorage.getItem('language').then((res) => {
        this.setState({language: JSON.parse(res)})
      })

      // ---------------

      
      
      
  }


  _getStoredSwitch(input){
    AsyncStorage.getItem(input).then((res) => {
                    var newState = {}
                    if(res === null){
                        newState[input] = false; 
                        this.setState(newState); 
                        AsyncStorage.setItem(input, JSON.stringify(false))
                      }
                    else{
                        newState[input] = JSON.parse(res)
                        this.setState(newState)
                      }
                })
  }

  _getStoredString(input){
    AsyncStorage.getItem(input).then((res) => {
                    if(res === ''){
                        var newState = {}
                        newState[input] = ''
                        this.setState(newState)
                      }
                    else{
                        var newState = {}
                        newState[input] = JSON.parse(res)
                        this.setState(newState) 
                      }
                })
  }


  componentWillUnmount() {
      Voice.destroy().then(Voice.removeAllListeners);
    }


  onSpeechStart(e) {
      this.setState({
        started: '√',
      });
    };

  onSpeechRecognized(e) {
      this.setState({
        recognized: '√',
      });
    };

  onSpeechResults(e) {
      this.setState({
        results: e.value,
      });

      newState = {}
      newState[this.state.currentRecordingNote + 'results'] = e.value
      this.setState(newState)

    }


  // CHECK IF WE HAVE ANY AVAILABLE PURCHASES
  async _getProducts() {
    try {
      const products = await RNIap.getProducts(itemSkus);
      this.setState({ products });
      // console.log( products )
      
      // CHECK if already subscribed on AuthScreen and saved to var "receipt" in Asyncstorage
      AsyncStorage.getItem('receipt').then((receipt) => {
          // console.log(receipt)
          const receiptBody = {
            'receipt-data': receipt,
            'password': '427e85d574e34185a6263a63eb2f6c20'
          };

          // CHECK whether there's a subscription, and unlock if there is
          RNIap.validateReceiptIos(receiptBody, false).then((result) => {
              // console.log(result);
              if(result.status == 0 || result.status == 21007){ 
                  this.setState({unlocked: true})
                  this.setState({loading: false})
                  this.setState({subscribed: true})
                  AsyncStorage.setItem('subscribed', 'true')
                }
              else{ 
                  this._checkTrial()
                  this.setState({loading: false})
                }
              
          })
      })

    } catch(err) {
      console.warn(err); // standardized err.code and err.message available
    }
  }



  // CHECK IF STILL IN TRIAL
  _checkTrial(){
      AsyncStorage.getItem('remainingtrials').then((remainingtrials) => {
          // console.log(remainingtrials)
          if(remainingtrials === null ){
            // console.log('first trial dictation!')
            AsyncStorage.setItem('remainingtrials', '8')
            this.setState({ unlocked: true, remaining: remainingtrials })
            // console.log(this.state.unlocked)
          }
          else if( 0 < remainingtrials ){
            // console.log('trials remaining')
            this.setState({ unlocked: true, remaining: remainingtrials })
            // console.log(this.state.unlocked)
          }
          else{
            // console.log('NO trials remaining')
            this.setState({ unlocked: false, remaining: remainingtrials })
            //console.log(this.state.unlocked)
          }
      })
  }

  

  // RECOGNITION METHODS
  // -----------------------------------------------------------------------------------------------------------------------


  // MASTER TOGGLE RECOGNITION
  _toggleRecognizing(e, currentRecordingNote) {
      this.setState({currentRecordingNote: currentRecordingNote})
      this.setState({noInput: false})


      if (this.state.recording === false) { 
        
        if(this.state.email !== 'niko'){ Mixpanel.track("Recognition Started for "+currentRecordingNote) } 

        blip.play();
        // Vibration.vibrate()

        this._startRecognition(e);
        this.setState({continuing: true})
        

        setInterval(() => {
            if (this.state.recording === true){
                this._stopRecognition(e)
              }
         }, 55000);
       }


      else{
        this._stopRecognition(e)
        this.setState({continuing: false})
        blip.play();
        Vibration.vibrate()
        
       }
    }



  // START RECOGNITION
  async _startRecognition(e) {
      console.log('starting')
      

      this.setState({
        recognized: '',
        started: '',
        results: [],
        recording: true
      });



      try {
        await Voice.start(this.state.language);
      } catch (e) {
        console.error(e);
      }
    }







  // STOP RECOGNITION
  async _stopRecognition(e) {
      try {
        await Voice.stop();
        if(this.state.continuing && this.state.results[0] === undefined){
          // CASE UNDEFINED BUT CONTINUING
          
          if(this.state.email !== 'niko'){Mixpanel.track("Recognition Continuing as undefined"); } 
          console.log('onspeechcontinue as undefined')
          setTimeout(() => { Voice.start(this.state.language) }, 500);

          // if this.state.continuing and DEFINED: see onSpeechEnd does the rest
          }
      } catch (e) {
        console.error(e);
      }

      

      // ONLY IF NOT CONTINUING AKA REALLY STOPPING
      if(!this.state.continuing){
            console.log("stopping. not continuing.")
            this.setState({stopping: true})
            this.setState({currentStoppingNote: this.state.currentRecordingNote})


            // CASE UNDEFINED
            if (this.state.results[0] === undefined){
                this.setState({noInput: true, recording: false, stopping: false})
                this.setState({currentRecordingNote: null, currentStoppingNote: null})
                setTimeout(() => { 
                    this.setState({noInput: false})
                  }, 10000);
              }
            
            // REMOVE REMAINING TRIALS
            if(!this.state.subscribed){
              AsyncStorage.getItem('remainingtrials').then((res) => {
                var newRemainingTrials = res - 1
                AsyncStorage.setItem('remainingtrials', JSON.stringify(newRemainingTrials) )
                this._checkTrial()
              })
            }
      }
      
    }





  // ON FINAL RESULTS ARE IN – EVENT CALLED ONLY IF THERE ARE RESULTS AND WHEN FINAL RESULTS ARE IN BACK FROM SERVER – CAN BE DELAYED AFTER STOP, DEPENDING ON CONNECTION SPEED
  onSpeechEnd(e) {
      
          if(this.state.email !== 'niko'){ Mixpanel.track("Recognition Successfully Ended"); }
          var newNote
          // CONCATENATE TO OLD NOTE IF THERE WAS AN EXISTING NOTE, OTHERWISE NEW NOTE
          this.state[this.state.currentRecordingNote] ? newNote = this.state[this.state.currentRecordingNote] + ' ' + this.state.results[0] : newNote = this.state.results[0] 

          // SAVE TO STATE AND TO DISK
          console.log('saving to disk as : ' + newNote + 'to: ' + this.state.currentRecordingNote)
          AsyncStorage.setItem(this.state.currentRecordingNote, JSON.stringify(newNote))
          newState = {}
          newState[this.state.currentRecordingNote] = newNote
          this.setState(newState)
          

          this.setState({
            results: [],
            recording: false,
            stopping: false
          });
          
          

          newState = {}; newState[this.state.currentRecordingNote + 'results'] = ''
          this.setState(newState)
          


      if(!this.state.continuing){ 
                  this.setState({currentRecordingNote: null})
                  this.setState({currentStoppingNote: null})
                  console.log('onspeechend')
                }

      
      if(this.state.continuing){ 
                  this._startRecognition(e); 
                  console.log('onspeechcontinue') 
                }

    }




  
  // OTHER METHODS
  // -----------------------------------------------------------------------------------------------------------------------

  

  delete(){
    if(this.state.email !== 'niko'){ Mixpanel.track("Delete Pressed"); }
    Alert.alert(
      'Clear all fields?',
      'This action can not be undone.',
      [
        {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
        {text: 'OK', onPress: () => {
          // this.setState({previousNote: this.state.notes})
          AsyncStorage.removeItem('patientname') ; this.setState({patientname: ''})
          AsyncStorage.removeItem('chiefcomplaint') ; this.setState({chiefcomplaint: ''})
          AsyncStorage.removeItem('subjective') ; this.setState({subjective: ''})
          AsyncStorage.removeItem('objective') ; this.setState({objective: ''})
          AsyncStorage.removeItem('assessment') ; this.setState({assessment: ''})
          AsyncStorage.removeItem('plan') ; this.setState({plan: ''})
          AsyncStorage.removeItem('notes'); this.setState({notes: ''})

        }},
      ],
      { cancelable: true }
    )
  }




  exportText(){
    if(this.state.email !== 'niko'){ Mixpanel.track("Export Text Pressed"); }
    var copyString = 'Patient Name:' + this.state.patientname + '\n \n' + 'Chief Complaint:' + this.state.chiefcomplaint + '\n \n' + this.state.subjective + '\n \n' + this.state.objective + '\n \n' + this.state.assessment + '\n \n' + this.state.plan + '\n \n' + this.state.notes
    // Clipboard.setString(copyString);
    
    Share.share({
          message: copyString,
          title: 'Export from soapdictate'
        })
  }


  async printPDF() {

      this.setState({printing: true})

      if(this.state.email !== 'niko'){ Mixpanel.track("Export PDF Pressed"); }

      defaultPrintPDF(this.state).then(this.setState({printing: false}))

    }

  


  _toggleEditing(){
    if(this.state.email !== 'niko'){ Mixpanel.track("Edit Pressed"); }
    if (this.state.editing === true){

      // // STOP EDITING AND SAVE
      this.setState({editing: false})
      // AsyncStorage.setItem('notes', JSON.stringify(this.state.editedText))
      // this.setState({notes: this.state.editedText})
    }
    if (this.state.editing === false){

      // START EDITING
      this.setState({editing: true})
      // this.setState({editedText: this.state.notes})
    }
    else return
    
  }

  onChangeText(text, notename){
    console.log(text, notename)
    newState = {}
    newState[notename] = text
    this.setState(newState)
    AsyncStorage.setItem(notename, JSON.stringify(text))
  }

  onChangeSex(newSex){
          AsyncStorage.setItem('patientsex', JSON.stringify(newSex))
          this.setState({patientsex: newSex})
        }

  onChangePatientName(text){
    this.setState({patientname: text})
    AsyncStorage.setItem('patientname', JSON.stringify(text))
  }


  onChangeBilling(text){
    this.setState({billingcode: text})
    AsyncStorage.setItem('billingcode', JSON.stringify(text))
  }

  setDate(newDate) {
      AsyncStorage.setItem('chosenDate', newDate)
      this.setState({chosenDate: new Date (newDate) })
    }


  makeFields(){
      var inputs = []

      for(var field in fields){
          if ( this.state[fields[field]["visible"]] !== false ){
              inputs.push(
                  <View key = {fields[field].name}>
                    <InputComponent 
                            title={fields[field].name} 
                            noteName={fields[field].noteName}
                            note={this.state[fields[field].noteName]}
                            temporaryresults={this.state[fields[field].results]}
                            unlocked={this.state.unlocked}
                            editing={this.state.editing}
                            currentRecordingNote={this.state.currentRecordingNote}
                            currentStoppingNote={this.state.currentStoppingNote}
                            onChangeText={this.onChangeText.bind(this)}
                            _toggleRecognizing={this._toggleRecognizing.bind(this)}
                            loading={this.state.loading}
                            abbreviated={this.state.abbreviated} />
                  </View>
              )
          }
      }
            
      return inputs

  }
  


  // VIEW
  // -----------------------------------------------------------------------------------------------------------------------


  render () {

      return (
        <SafeAreaView style={{flex: 1}}>
          <KeyboardAvoidingView style={styles.container} behavior="padding" enabled>
            
            <View style={styles.topBar}>
                  <Button
                    style={ styles.button }
                    disabled={this.state.recording || this.state.editing }
                    onPress={() => this.props.navigation.navigate('Settings')}
                    title="Settings" />


                  {!this.state.editing ? 
                    <Button
                      style={ styles.button }
                      disabled={this.state.recording || (!this.state.patientname && !this.state.chiefcomplaint && !this.state.subjective &&  !this.state.objective && !this.state.assessment && !this.state.plan && !this.state.notes) || this.state.hidden }
                      onPress={this._toggleEditing.bind(this)}
                      title="Edit" />
                    :
                    <Button
                      style={ styles.button }
                      onPress={this._toggleEditing.bind(this)}
                      title="Done" />
                  }
            </View>


            <View style={styles.transcript}>
              <ScrollView style={{marginLeft: 10, marginRight: 10, paddingTop: 20}} contentContainerStyle={{flexDirection: Platform.isPad ? 'row' : 'column', flexWrap: 'wrap'}}>
                  






                  { this.makeFields() }







                  <View style={styles.mySeparator} />
                  <Text></Text>
                  <Text></Text>

                  <View style={{width: Platform.isPad ? 480 : null}}>
                      <Text style={{marginLeft: 7, fontWeight: '800'}}>Patient Name</Text>
                      <TextInput
                            onFocus={() => this.setState({hidden: true})}
                            onBlur={() => this.setState({hidden: false})}
                            style={styles.textInput}
                            autocorrect={'false'}
                            placeholder={'First Last'}
                            value={this.state.patientname}
                            onChangeText={(text) => this.onChangePatientName(text)}
                            />
                  </View>


                  <Text></Text>
                  <Text></Text>

                  <View style={{width: Platform.isPad ? 480 : null}}>
                      <Text style={{marginLeft: 7, fontWeight: '800'}}>Sex</Text>
                      <Picker
                        selectedValue={this.state.patientsex}
                        itemStyle={{height: 100, padding: 20}}
                        style={{ height: 100, borderColor: 'lightgrey', borderWidth: 1, borderRadius: 10}}
                        onValueChange={(itemValue, itemIndex) => this.onChangeSex(itemValue)}>
                        <Picker.Item label="Female" value="f" />
                        <Picker.Item label="Male" value="m" />
                        <Picker.Item label="Other" value="o" />
                      </Picker>
                  </View>

                  <Text></Text>
                  <Text></Text>

                  {this.state.billingcodevisible ?
                    <View style={{width: Platform.isPad ? 480 : null}}>
                        <Text style={{marginLeft: 7, fontWeight: '800'}}>Billing Code</Text>
                        <TextInput 
                              onFocus={() => this.setState({hidden: true})}
                              onBlur={() => this.setState({hidden: false})}
                              style={styles.textInput}
                              autocorrect={'false'}
                              value={this.state.billingcode}
                              onChangeText={(text) => this.onChangeBilling(text)}
                              />
                    </View> : null }

                  <Text></Text>
                  <Text></Text>

                  <View style={{width: Platform.isPad ? 480 : null}}>
                      <Text style={{marginLeft: 7, fontWeight: '800'}}>Visit Date</Text>
                      
                        {this.state.chosenDate ?
                          <DatePickerIOS
                                style={{borderWidth: 1, borderColor: 'lightgrey', borderRadius: 10, color: 'dodgerblue', marginBottom: 30}}
                                mode={'date'}
                                date={this.state.chosenDate}
                                onDateChange={(date) => this.setDate(date)}
                              />
                              :
                              null
                            }
                  
                  </View>
    
                  

              </ScrollView>
            </View>


            {/* 4 OPTIONBAR BUTTONS */}

            {this.state.loading ? <ActivityIndicator style={{marginBottom: 30}} color="black" /> : 
            <View style={[styles.shadowBox]}>
                
                { (this.state.patientname || this.state.chiefcomplaint || this.state.subjective ||  this.state.objective || this.state.assessment || this.state.plan || this.state.notes) && !this.state.editing && !this.state.hidden ?
                      <Animatable.View animation="slideInUp" duration={400} easing="ease-out">
                        <View style={styles.optionBar}>

                            {/* CLEAR */}
                            <TouchableOpacity 
                              style={[{ borderColor: 'dodgerblue'}, 
                                      this.state.editing || this.state.recording ? styles.borderDisabled : styles.border]}
                              onPress={this.delete.bind(this)}
                              disabled={this.state.editing || this.state.recording }>
                              <Text
                                style={[styles.button, {color: this.state.editing || this.state.recording ? 'lightgrey' : 'dodgerblue'}]}>
                                <FontAwesome>{Icons.trash} </FontAwesome>{'\n'}
                                Clear
                              </Text>
                            </TouchableOpacity>

                            
                            {/*<TouchableOpacity 
                              style={[{ borderColor: 'dodgerblue'}, 
                                      this.state.editing || this.state.recording ? styles.borderDisabled : styles.border]}
                              onPress={this.undo.bind(this)}
                              disabled={this.state.editing || this.state.recording }>
                              <Text
                                style={[styles.button, {color: this.state.editing || this.state.recording ? 'lightgrey' : 'dodgerblue'}]}>
                                <FontAwesome>{Icons.undo} </FontAwesome>{'\n'}
                                Undo
                              </Text>
                            </TouchableOpacity>*/}

                            {/* COPY ALL */}
                            {/*<TouchableOpacity 
                              style={[{ borderColor: 'dodgerblue'}, 
                                      this.state.editing || this.state.recording ? styles.borderDisabled : styles.border]}
                              onPress={this.copy.bind(this)}
                              disabled={this.state.editing || this.state.recording }>
                              <Text
                                style={[styles.button, {color: this.state.editing || this.state.recording ? 'lightgrey' : 'dodgerblue'}]}>
                                <FontAwesome>{Icons.clone} </FontAwesome>{'\n'}
                                Copy
                              </Text>
                            </TouchableOpacity>*/}


                            {/* EMAIL */}
                            {/*<TouchableOpacity 
                              style={[{ borderColor: 'dodgerblue'}, 
                                      this.state.editing || this.state.recording ? styles.borderDisabled : styles.border]}
                              onPress={this.email.bind(this)}
                              disabled={this.state.editing || this.state.recording }>
                              <Text
                                style={[styles.button, {color: this.state.editing || this.state.recording ? 'lightgrey' : 'dodgerblue'}]}>
                                <FontAwesome>{Icons.envelope} </FontAwesome>{'\n'}
                                Email
                              </Text>
                            </TouchableOpacity>*/}

                            

                            {/* EXPORT */}
                            <TouchableOpacity 
                              style={[{ borderColor: 'dodgerblue'}, 
                                    this.state.editing || this.state.recording ? styles.borderDisabled : styles.border]}
                              onPress={this.exportText.bind(this)}
                              disabled={this.state.editing || this.state.recording }>
                              <Text
                                style={[styles.button, {color: this.state.editing || this.state.recording ? 'lightgrey' : 'dodgerblue'}]}>
                                <FontAwesome>{Icons.share} </FontAwesome>{'\n'}
                                Export Note
                              </Text>
                            </TouchableOpacity>

                            


                            {/* PRINT PDF */}
                            {this.state.printing ? <ActivityIndicator style={{marginBottom: 30}} color="black" />
                            :
                            <TouchableOpacity 
                              style={[{ borderColor: 'dodgerblue', backgroundColor: this.state.editing || this.state.recording ? 'lightgrey' : 'dodgerblue'}, 
                                      this.state.editing || this.state.recording ? styles.borderDisabled : styles.border]}
                              onPress={this.printPDF.bind(this)}
                              disabled={this.state.editing || this.state.recording }>
                              <Text
                                style={[styles.button, {fontWeight: '600', color: this.state.editing || this.state.recording ? 'white' : 'white'}]}>
                                <FontAwesome>{Icons.print} </FontAwesome>{'\n'}
                                Make PDF Note
                              </Text>
                            </TouchableOpacity>
                            }

                        


                        </View>
                      </Animatable.View>
                      :
                      null 
                }
                


                {/* NO INPUT DETECTED */}
                { this.state.noInput ?
                  <Animatable.Text animation="slideInUp" duration={400} easing="ease-out" style={{color: 'red', textAlign: 'center', padding: 5}}>
                    No Voice input detected! Please speak louder, get better WiFi, or give your connection more time.
                  </Animatable.Text> 
                  :
                  null
                }

                {/* REMAINING FREE DICTATIONS 
                { !this.state.subscribed ? 
                  <Animatable.View animation="slideInUp" duration={400} easing="ease-out" >
                    <Text style={{color: 'dodgerblue', textAlign: 'center', paddingBottom: 5}}>
                      Remaining dictations before signup: {this.state.remaining ? this.state.remaining : 8}
                    </Text> 
                  </Animatable.View>
                  :
                  null
                }
                */}

                {/* START 7-DAY FREE TRIAL */}
                {!this.state.unlocked ? 

                    <Animatable.View animation="slideInUp" duration={400} easing="ease-out" >
                      <TouchableOpacity 
                        style={[{backgroundColor: 'dodgerblue' }, styles.bottomButton]}
                        onPress={() => this.props.navigation.navigate('Signup')}>
                        <Text
                          style={{color: 'white', fontSize: 18, fontWeight: '600', textAlign: 'center'}}>
                          Start 7-day free trial to continue
                        </Text>
                      </TouchableOpacity>
                    </Animatable.View>

                : 
                null
                }
              </View>
            }
            
          
        </KeyboardAvoidingView>
      </SafeAreaView>
      );
    }
}



const styles = StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: 'column'
    },
    topBar:{
      flexDirection: 'row', 
      justifyContent: 'space-between',
      backgroundColor: 'white', 
      shadowColor: 'black', 
      shadowOffset: { width: 0, height: 6 }, 
      shadowOpacity: .05, 
      shadowRadius: 5,
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
      padding: 10, 
      marginTop: 0,
      marginBottom: 20,
      fontSize: 20,
      backgroundColor: 'white'
      },

    optionBar:{
      flexDirection: 'row', 
      justifyContent: 'space-around',
      paddingBottom: 3,
      marginLeft: '3%',
      marginRight: '3%',
      marginTop: 0,
      paddingTop: 5
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
      marginTop: 0
    },
    borderDisabled:{
      borderRadius: 8, 
      borderWidth: 1, 
      overflow: 'hidden', 
      margin: 5,
      borderColor: 'lightgrey',
      marginTop: 0
    },
    mySeparator:{
        height: 1,
        backgroundColor: "lightgrey",
        marginBottom: 12,
        marginLeft: '5%',
        marginRight: '5%',
      },
    shadowBox:{
      backgroundColor: 'white', 
      shadowColor: 'black', 
      shadowOffset: { width: 0, height: -6 }, 
      shadowOpacity: .05, 
      shadowRadius: 5,
    }
});
