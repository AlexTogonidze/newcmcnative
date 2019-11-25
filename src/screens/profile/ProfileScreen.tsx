import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  KeyboardAvoidingView,
  Image,
  TouchableOpacity,
  StyleSheet,
  TouchableHighlight,
  Dimensions
} from "react-native";
import { Colors } from "../../utils/Colors";
import { PLACEHOLDER_IMG } from "../../utils/Assets";
import { useApolloClient } from "react-apollo-hooks";
import { LOGOUT_MUTATION } from "../../data/queries";
import ScreenHeader from "../../components/ScreenHeader";

function ProfileScreen(props) {
  const { navigation } = props;
  const client = useApolloClient();


  const logout = async () => {
    var resp = await client.mutate({
      mutation: LOGOUT_MUTATION,
    })
    navigation.replace('Login')
    
  }

  return (
    <View style={{flex: 1}}>
      
      <View style={st.topContainer}>
        <Image source={PLACEHOLDER_IMG} style={{ width: 100, height: 100,marginRight: 20 }} />
        <View style={st.nameContainer}>
            <Text style={st.name}>
                Sandro Togonidze
            </Text>
            <Text style={st.role}>
                Manager Role
            </Text>
        </View>
      </View>

    <View style={{paddingHorizontal: 10}}>
            <Text style={st.settingTitle}>Settings</Text>
        <View>
            <TouchableOpacity style={st.touchableBig} >
                <Text style={st.profileTexts}>Edit  User  Profile</Text>
            </TouchableOpacity >
            <TouchableOpacity  style={st.touchableBig} onPress={()=> navigation.navigate('ChangePassword')}>
                <Text style={st.profileTexts}>Change Password</Text>
            </TouchableOpacity>
            <TouchableOpacity  style={[st.touchableBig, st.bottomBorder]} onPress={()=> navigation.navigate('SignUp')}>
                <Text style={st.profileTexts}>Add  New  User</Text>
            </TouchableOpacity>
        </View>
    </View>

    <TouchableOpacity style={st.logoutBtn} onPress={logout}>
        <Text style={st.logoutText}>Log Out</Text>
    </TouchableOpacity>
    </View>
  );
}

var st = StyleSheet.create({
  topContainer: {
      alignItems:'center',
    marginTop:15,
    flexDirection: "row",
    paddingHorizontal: 10,
    borderRadius: 10,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 15
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation:5
  },
  nameContainer: {
      justifyContent: 'center'
  },
  name: {
      fontSize: 28,
      color: '#393939'
  },
  role:{
      fontSize: 21,
      color: '#717374'
  },
  settingTitle:{
      fontSize:22,
      marginLeft:25,
      color: '#717374',
      marginTop: 40,
      marginBottom: 20
  },
  touchableBig:{
      paddingVertical: 32,
      alignItems: 'center',
      justifyContent:'center',
      alignSelf: 'stretch',
      borderTopWidth:0.3,
      borderTopColor: '#6C6B6C'
  },
  profileTexts: {
      fontSize: 20,
      lineHeight: 24,
      color: '#3D3E3E'
  },
  logoutBtn:{
      marginHorizontal: 50,
      backgroundColor: '#E2E0E1',
      borderRadius: 15,
      paddingVertical: 20,
      alignItems: 'center',
      justifyContent: 'center',
      position: "absolute",
      bottom: 30,
      width: Dimensions.get('window').width - 100
  },
  logoutText: {
      fontSize: 32
  },
  bottomBorder: {
    borderBottomWidth:0.3,
    borderBottomColor: '#6C6B6C'
  }
});

export default ProfileScreen;
