import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  KeyboardAvoidingView,
  Image,
  TouchableOpacity,
  StyleSheet
} from "react-native";
import GeneralTextInput from "../utils/GeneralTextinput";
import { MAIN_LOGO } from "../utils/Assets";
import { Colors } from "../utils/Colors";
import { RECOVER_PASSWORD } from "../data/queries";
import { useApolloClient } from "react-apollo-hooks";
import { useField } from "../utils/FormValidation";

function PassRecovery(props) {
  const { navigation } = props;
  const [asyncProgress, setAsyncProgress] = useState(false);
  const client = useApolloClient();
  var email = useField("");

  const recover = async () => {
    setAsyncProgress(true);
    var resp = await client.mutate({
      mutation: RECOVER_PASSWORD,
      variables: {
        value: email.value
      }
    });

    if (resp.data) {
      setAsyncProgress(false);
      if (resp.data.payload.success) {
        props.navigation.replace("StatusScreen");
      }
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
      behavior="height"
    >
      <Image source={MAIN_LOGO} style={st.logo} />
      <GeneralTextInput
        autoFocus={true}
        value={email.value}
        onChangeText={email.onChange}
        placeholder="Type your email"
        changeBorderOnFocus={true}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <TouchableOpacity
        style={st.loginBtn}
        activeOpacity={0.8}
        onPress={recover}
      >
        <Text style={{ color: "#fff", fontSize: 18 }}>Send</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={{ padding: 5, marginTop: 10 }}
        onPress={() => navigation.navigate("Login")}
      >
        <Text>Remember Password? Sign in</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}

var st = StyleSheet.create({
  loginBtn: {
    backgroundColor: Colors.blue,
    borderRadius: 10,
    alignSelf: "stretch",
    marginHorizontal: 40,
    alignItems: "center",
    paddingVertical: 13,
    marginTop: 20
  },
  logo: {
    width: 100,
    height: 71,
    marginBottom: 50
  }
});

export default PassRecovery;
