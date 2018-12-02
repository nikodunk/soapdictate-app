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
  Button
} from 'react-native';

import RNHTMLtoPDF from 'react-native-html-to-pdf';


export async function defaultPrintPDF(state){

  const output = `
      <div style="font-family: sans-serif; margin: 30px;">
        ${state.practice ? '<h2>'+state.practice+'</h2>' : ''}
        <div style="border: 1px solid black; padding: 10px;  margin-bottom: 0; padding-left: 20px; ">
          <h3>Patient Information</h3>
          <div style="display: flex;">
            <div style="flex: 1">
              <p>Name: ${state.patientname}<br>
                 Sex: ${state.patientsex}</p>
            </div>
            <div style="text-align: right; flex: 1">
              <p>Encounter Date: ${state.chosenDate.toLocaleDateString("en-US")}<br>
              ${state.billingcode ? 'Billing Code:'+state.billingcode+'</p>' : '</p>'}
            </div>
          </div>
        </div>
        <div style="padding-top: 10px;">
          ${state.chiefcomplaint ? '<p><b>Chief Complaint</b><br>'+state.chiefcomplaint+'</p><br><br>' : ''}
          ${state.subjective ? 
              '<p><b>' + (state.abbreviated === 'true' ? 'S' : 'Subjective')  + '</b><br>'
              +state.subjective+'</p><br><br>' : ''
            }
          ${state.objective ?
               '<p><b>' + (state.abbreviated === 'true' ? 'O' : 'Objective')  + '</b><br>'
               +state.objective+'</p><br><br>' 
              : 
                ''
            }
          ${state.assessment ?
               '<p><b>' + (state.abbreviated === 'true' ? 'A' : 'Assessment')  + '</b><br>'
               +state.assessment+'</p><br><br>' 
              : 
                ''
            }
          ${state.plan ?
               '<p><b>' + (state.abbreviated === 'true' ? 'P' : 'Plan')  + '</b><br>'
               +state.plan+'</p><br><br>' 
              : 
                ''
            }
          ${state.notes ? '<p><b>Other Notes</b><br>'+state.notes+'</p><br><br>' : ''}
        </div>
      </div>
      `

      const results = await RNHTMLtoPDF.convert({
        html: output,
        fileName: 'test',
        base64: true,
      })


      Share.share({
            // url: 'http://bam.tech', 
            title: 'gaggi',
            url: `data:application/pdf;base64,${results.base64}`
          })

      return

}



// undo(){
//   Mixpanel.track("Undo Pressed");
//   if (this.state.previousNote !== null ){ 
//       AsyncStorage.setItem('notes', JSON.stringify(this.state.previousNote)); 
//       destroyedNote = this.state.notes
//       this.setState({notes: this.state.previousNote})
//       this.setState({previousNote: destroyedNote})
//      }
//   else return
// }

// copy(){
//   var copyString = 'Patient Name:' + this.state.patientname + '\n \n' + 'Chief Complaint:' + this.state.chiefcomplaint + '\n \n' + this.state.subjective + '\n \n' + this.state.objective + '\n \n' + this.state.assessment + '\n \n' + this.state.plan + '\n \n' + this.state.notes
//   Clipboard.setString(copyString);
// }

// email(){
//   if(this.state.email !== 'niko'){ Mixpanel.track("Email Pressed"); }
//   var copyString = 'Patient Name:' + this.state.patientname + '\n \n' + 'Chief Complaint: ' + this.state.chiefcomplaint + '\n \n' + 'Subjective: '+ this.state.subjective + '\n \n' + 'Objective: ' + this.state.objective + '\n \n' + 'Assessment: '+ this.state.assessment + '\n \n' + 'Plan: ' +this.state.plan + '\n \n' + 'Notes: '+ this.state.notes
//   AsyncStorage.getItem('email').then((email) => {
//     // tracker.trackEvent("buttonexport", "exported email");
//     Platform.OS === 'ios'
//       ? Linking.openURL('mailto:'+email+' ?cc=&subject=Export from Soapdictate &body='+ copyString) 
//       : Linking.openURL('mailto:'+email+' ?cc=&subject=yourSubject&body=yourMessage')
//   })
// }