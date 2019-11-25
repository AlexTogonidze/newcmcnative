import React from "react";
import {
  Text,
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useNavigation } from "react-navigation-hooks";
import { Colors } from "../utils/Colors";

export interface ErrorComponentProps {
  text?: string;
}

function ErrorComponent(props: ErrorComponentProps) {
  const { goBack } = useNavigation();

  return (
    <View style={st.container}>
      <Image
        style={st.image}
        source={require("../../assets/img/exclamation-mark.png")}
      />
      <Text style={st.text}>
        {props.text ? props.text : "Opps... Something Went Wrong"}
      </Text>
      <TouchableOpacity style={st.backBtn} onPress={() => goBack()}>
          <Text style={st.backBtnText}>Back</Text>
      </TouchableOpacity>
    </View>
  );
}

const st = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  text: {
    fontSize: 18
  },
  image: {
    width: 45,
    height: 45,
    marginBottom: 7
  },
  backBtn:{
      padding: 15
  },
  backBtnText: {
      color: Colors.blue,
      fontSize: 18
  }
});

export default ErrorComponent;
