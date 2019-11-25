import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  KeyboardAvoidingView,
  Image,
  TouchableOpacity,
  StyleSheet,
  TouchableHighlight,
  Dimensions,
  Alert
} from "react-native";
import { Colors } from "../../utils/Colors";
import { PLACEHOLDER_IMG } from "../../utils/Assets";
import { useApolloClient } from "react-apollo-hooks";
import {
  LOGOUT_MUTATION,
  CHANGE_PASSWORD,
  ChangePasswordVariables,
  EmptyResponse
} from "../../data/queries";
import { useField } from "../../utils/FormValidation";
import ScreenHeader from "../../components/ScreenHeader";
import DropdownAlert from "react-native-dropdownalert";

function ChangePassword(props) {
  const { navigation } = props;
  const client = useApolloClient();
  var currentPass = useField("");
  var newPass = useField("");
  var confirmPass = useField("");
 
  const alertRef = useRef();

  const changePass = async () => {
    Alert.alert(
      "Are you sure you want To change your password?",
      "",
      [
        {
          text: "No",
          style: "cancel"
        },
        {
          text: "Yes",
          onPress: async () => {
            if(newPass.value !== confirmPass.value)
             return;
             
            const publishResponse = await client.mutate<EmptyResponse, ChangePasswordVariables>({
              mutation: CHANGE_PASSWORD,
              variables: {
                newPassword: newPass.value,
                newVerifyPassword: confirmPass.value,
                oldPassword: currentPass.value
              }
            });

            if (publishResponse.data) {
              if (publishResponse.data.payload.success) {
                alertRef.current.alertWithType(
                  "success",
                  "Success",
                  "Password was successfully changed"
                );
                navigation.goBack();
              } else {
                alertRef.current.alertWithType(
                  "error",
                  "Error",
                  "Password was not changed"
                );
              }
            }
          }
        }
      ],
      { cancelable: true }
    );
  };

  return (
    <View style={{ flex: 1 }}>
     <DropdownAlert ref={alertRef}
    elevation={4}/>
      <ScreenHeader 
      leftText="Change Password" />
      
     
      <View style={{ paddingHorizontal: 10, marginTop: 50 }}>
        <TextInput
          value={currentPass.value}
          autoCapitalize="none"
          placeholder="Current  Password"
          onChangeText={currentPass.onChange}
          placeholderTextColor="#8B8B8C"
          secureTextEntry={true}
          fontSize={20}
          style={st.textInput}
        />
        <TextInput
           value={newPass.value}
           onChangeText={newPass.onChange}
           autoCapitalize="none"
          placeholder="New Password"
          placeholderTextColor="#8B8B8C"
          fontSize={20}
          secureTextEntry={true}
          style={st.textInput}
        />

        <TextInput
        value={confirmPass.value}
        onChangeText={confirmPass.onChange}
        autoCapitalize="none"
          placeholder="Confirm New Password"
          placeholderTextColor="#8B8B8C"
          fontSize={20}
          secureTextEntry={true}
          style={st.textInput}
        />
        <TouchableOpacity
          style={{ padding: 5, marginTop: 10, alignItems: "flex-end" }}
          onPress={() => navigation.navigate("PassRecovery")}
        >
          <Text style={{ fontSize: 20, color: "#338CB9" }}>
            Forgot Password?
          </Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={st.logoutBtn} onPress={changePass}>
        <Text style={st.logoutText}>Sumbit</Text>
      </TouchableOpacity>
    </View>
  );
}


var st = StyleSheet.create({
  textInput: {
    borderBottomColor: "#444344",
    borderBottomWidth: 0.5,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginBottom: 30
  },
  logoutBtn: {
    marginHorizontal: 50,
    backgroundColor: "#444D89",
    borderRadius: 15,
    paddingVertical: 20,
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    bottom: 30,
    width: Dimensions.get("window").width - 100
  },
  logoutText: {
    fontSize: 32,
    color: "#fff"
  }
});

export default ChangePassword;
