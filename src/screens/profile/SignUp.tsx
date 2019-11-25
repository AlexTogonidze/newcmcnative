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
  Dimensions
} from "react-native";
import { Colors } from "../../utils/Colors";
import RNPickerSelect from "react-native-picker-select";
import { useApolloClient } from "react-apollo-hooks";
import {
  LOGOUT_MUTATION,
  SIGN_UP,
  SignUpVariables,
  EmptyResponse
} from "../../data/queries";
import { useField } from "../../utils/FormValidation";
import DropdownAlert from "react-native-dropdownalert";

function SignUp(props) {
  const { navigation } = props;
  const client = useApolloClient();
  const fullName = useField("");
  const email = useField("");
  const passWord = useField("");
  const [userRole, setUserRole] = useState<number>(1);
  const alertRef = useRef();

  const register = async () => {
    const publishResponse = await client.mutate<EmptyResponse, SignUpVariables>(
      {
        mutation: SIGN_UP,
        variables: {
          mail: email.value,
          password: passWord.value,
          userName: fullName.value,
          userRole: userRole
        }
      }
    );

    if (publishResponse && publishResponse.payload.success) {
      alertRef.current.alertWithType(
        "success",
        "Success",
        "User was successfully registered"
      );
      setTimeout(() => {
        navigation.goBack();
      }, 1000);
    } else {
      alertRef.current.alertWithType("error", "Error", "Something went wrong");
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <DropdownAlert ref={alertRef}
      elevation={4} />
      <View style={st.regHeader}>
        <Text style={st.regText}>Register</Text>
      </View>
      <View style={{ paddingHorizontal: 10, marginTop: 50 }}>
        <TextInput
          value={fullName.value}
          onChangeText={fullName.onChange}
          placeholder="Full Name"
          placeholderTextColor="#8B8B8C"
          fontSize={20}
          style={st.textInput}
        />
        <TextInput
          value={email.value}
          onChangeText={email.onChange}
          placeholder="Email"
          placeholderTextColor="#8B8B8C"
          fontSize={20}
          style={st.textInput}
        />

        <TextInput
          value={passWord.value}
          onChangeText={passWord.onChange}
          placeholder="Password"
          placeholderTextColor="#8B8B8C"
          secureTextEntry={true}
          fontSize={20}
          style={st.textInput}
        />

        <RNPickerSelect
          style={{ fontSize: 20 }}
          onValueChange={value => setUserRole(value)}
          items={[
            { label: "Manager", value: 1 },
            { label: "Management", value: 2 },
            { label: "Client", value: 3 }
          ]}
        />
      </View>

      <TouchableOpacity style={st.logoutBtn} onPress={register}>
        <Text style={st.logoutText}>Submit</Text>
      </TouchableOpacity>
    </View>
  );
}

var st = StyleSheet.create({
  regHeader: {
    backgroundColor: "#1374a6",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 30,
    alignSelf: "stretch"
  },
  textInput: {
    borderBottomColor: "#444344",
    borderBottomWidth: 0.5,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginBottom: 30
  },
  logoutBtn: {
    marginHorizontal: 50,
    backgroundColor: "#1374a6",
    borderRadius: 15,
    paddingVertical: 20,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
    width: Dimensions.get("window").width - 100
  },
  logoutText: {
    fontSize: 32,
    color: "#fff"
  },
  regText: {
    color: "#fff",
    fontSize: 32
  }
});

export default SignUp;
