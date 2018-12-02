import { StyleSheet } from 'react-native';

export default styles = StyleSheet.create({
    

    // general 
    container: {
        flex: 1,
        alignItems: 'center',
        elevation: 0,
      },

    //dictation
    hamburgerBar:{
      flexDirection: 'row', 
      marginTop: 15, 
    },
    hamburger: {
        height: 20  ,
        width: 30,
        margin: 10,
        marginTop: 6
      },
    title:{
        fontWeight: '900',
        fontSize: 25,
        textAlign: 'center',
      },
      
    textInput:{
      flex: 1,
      borderColor: 'lightgray', 
      borderWidth: 1, 
      borderRadius: 10, 
      padding: 5, 
      margin: 5,
      fontSize: 20,
      backgroundColor: 'white'
    },
    textInputSelected:{
      flex: 1,
      borderColor: '#2191fb', 
      borderWidth: 1, 
      borderRadius: 5, 
      padding: 5, 
      margin: 5,
      fontSize: 20,
      backgroundColor: 'white',
      shadowColor: '#2191fb',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: .5,
      shadowRadius: 7,
    },
    label:{
      marginRight: 5,
      textAlign: 'right'
    },
    labelSelected:{
      marginRight: 5,
      textAlign: 'right',
      fontWeight: '900',
      color: '#2191fb'
    },
    
    // sidebar
    sidebarText: {
      fontSize: 20,
    },
    sidebarTitle:{
        fontWeight: '900',
        fontSize: 25,
        margin: 10,
        color: 'white',
        shadowColor: 'grey',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.5,
        shadowRadius: 7,
        elevation: 5
      },
    separator:{
        height: 1,
        backgroundColor: "lightgrey",
        marginBottom: 12,
        marginLeft: '5%',
        marginRight: '5%',
      },


      // other
      
     
      materialButtonLong: {
        marginTop: 10,
        borderWidth:0,
        alignItems:'center',
        justifyContent:'center',
        width: 250,
        height: 50,
        borderRadius:10,
        backgroundColor:'#2191fb',
        opacity: 100,
        // shadowColor: 'grey',
        // shadowOffset: { width: 0, height: 5 },
        // shadowOpacity: 0.5,
        // shadowRadius: 7,
        // elevation: 5
      },
      materialButtonText:{
        fontSize: 18,
        fontWeight: '600',
        color: 'white'
      },
      materialButtonTextLong:{
        fontSize: 18,
        fontWeight: '600',
        color: 'white'
      },
      outlineButton: {
        fontSize: 20,
        marginTop: 10,
        borderWidth:1,
        alignItems:'center',
        justifyContent:'center',
        borderRadius:5,
        borderColor:'#2191fb',
        padding: 8,
        color: '#2191fb'
      },
      flatList:{
        paddingTop: 10
      },
      listItem: {
        flexDirection: 'row',
        padding: 10,
        height: 60,
      },
      buttonImage:{
        width: 70,
        height: 70,

      },
      text: {
        fontSize: 18,
      },
      

      buttonImageContainer: {
        shadowColor: 'black',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: .5,
        shadowRadius: 5,
        elevation: 5,
        marginTop: 10
        
      },

      buttonImageContainerRecording: {
        shadowColor: 'black',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: .5,
        shadowRadius: 5,
        elevation: 8,
        marginTop: 10
        
      },




      // login shiat
      loginContainer:{
        marginTop: 0,
        flex: 1
      },
      window:{
        margin: 30,
      },
      input:{
        height: 40, 
        width: 200,
        borderColor: 'lightgray', 
        borderWidth: 1,
        marginTop: 10,
        borderRadius:10,
        backgroundColor:'white',
        paddingLeft: 10,
        padding: 4,
        textAlign: 'center'
      },
      // shadowBox:{
      //   backgroundColor: 'rgba(255, 255, 255, 0.2)',
      //   shadowColor: 'grey',
      //   shadowOffset: { width: 0, height: 5 },
      //   shadowOpacity: 0.5,
      //   shadowRadius: 7,
      //   elevation: 7,
      // },
      shadowBox:{
        backgroundColor: 'white', shadowColor: '#2191fb', shadowOffset: { width: 0, height: 0 }, shadowOpacity: .4, shadowRadius: 7
      },
      loginBox: {
        flex: 0.5,
        justifyContent:'center',
        alignItems: 'center',
        margin: 20
      },
}); 