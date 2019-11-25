import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  KeyboardAvoidingView,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator
} from "react-native";
import GeneralTextInput from "../utils/GeneralTextinput";
import { MAIN_LOGO } from "../utils/Assets";
import { Colors } from "../utils/Colors";
import { useApolloClient } from "react-apollo-hooks";
import {
  LOGIN_MUTATION,
  GET_SESSION_INFO,
  LoginVariables,
  LoginResponse
} from "../data/queries";
import { useField } from "../utils/FormValidation";
import DropdownAlert from "react-native-dropdownalert";

function LoginScreen(props) {
  const { navigation } = props;
  const client = useApolloClient();
  const email = useField("tartornike@gmail.com");
  const password = useField("1");
  const alertRef = useRef();
  const [asyncProgress, setAsyncProgress] = useState(false);

  const login = async () => {
    setAsyncProgress(true);
    var resp = await client.mutate<LoginResponse, LoginVariables>({
      mutation: LOGIN_MUTATION,
      variables: {
        email: email.value,
        password: password.value
      },
      update: (cache, resp) => {
        if (resp.data && resp.data.payload.success) {
          //const cachedItem2 = cache.readQuery<GetLoginResponse>({ query: GET_SESSION_INFO });
          cache.writeQuery({
            query: GET_SESSION_INFO,
            data: {
              sessionInfo: {
                ...resp.data.payload.data,
                isLoggedIn: true
              }
            }
          });
        }
      }
    });

    if (resp.data) {
      setAsyncProgress(false);
      if (resp.data.payload.success) {
        navigation.replace("TabNavigator");
      } else {
        alertRef.current.alertWithType(
          "error",
          "Error",
          "Username or password is incorrect"
        );
      }
    }
  };

  return (
    <KeyboardAvoidingView style={st.container} behavior="height">
      <Image source={MAIN_LOGO} style={st.logo} />

      <DropdownAlert ref={alertRef} />

      <GeneralTextInput
        placeholder="User Name"
        changeBorderOnFocus={true}
        value={email.value}
        onChangeText={email.onChange}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <GeneralTextInput
        placeholder="Password"
        value={password.value}
        onChangeText={password.onChange}
        changeBorderOnFocus={true}
        isPasswordType={true}
        autoCapitalize="none"
      />
      <TouchableOpacity
        style={st.loginBtn}
        activeOpacity={0.8}
        onPress={login}
        disabled={asyncProgress ? true : false}
      >
        {asyncProgress ? (
          <ActivityIndicator size="small" color="white" />
        ) : (
          <Text
            style={{ color: "#fff", fontSize: 16, textTransform: "uppercase" }}
          >
            Login
          </Text>
        )}
      </TouchableOpacity>
      <TouchableOpacity
        style={st.passRecovery}
        onPress={() => navigation.navigate("PassRecovery")}
      >
        <Text>Forgot Password?</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}

var st = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  logo: {
    width: 100,
    height: 71,
    marginBottom: 50
  },
  loginBtn: {
    backgroundColor: Colors.blue,
    alignSelf: "stretch",
    marginHorizontal: 40,
    alignItems: "center",
    paddingVertical: 14,
    marginTop: 20,
    borderRadius: 10
  },
  passRecovery: {
    padding: 5,
    marginTop: 10
  }
});

export default LoginScreen;
