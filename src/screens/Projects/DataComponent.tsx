import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  Dimensions,
  ActivityIndicator,
  FlatList
} from "react-native";

const { width: deviceWidth } = Dimensions.get("window");

function DataComponent(props) {
  function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",").replace(/-/g, "+");
  }

  return (
    <View>
      {!!props.total && 
        <View style={[st.valContainer, {paddingTop: 25}]}>
          <Text style={st.totalKey}>Total</Text>
          <Text style={[st.value, {color:'#3E87DC'}]}>$ {numberWithCommas(props.total)}</Text>
        </View>
      }
      <FlatList
        data={props.data}
        renderItem={({ item, index }) => (
          <View>
            <View
              style={[
                st.valContainer,
                { backgroundColor: index % 2 == 0 ? "#EBECED" : "#fff" }
              ]}
            >
              <Text style={st.key}>{item.key}</Text>
              {!!props.isBudget ?
                <Text style={st.value}>$ {numberWithCommas(item.value)}</Text> : 
                <Text style={[st.key, {color: '#1A1B1D'}]}> {item.value}</Text>
              }
              
            </View>
          </View>
        )}
      />
    </View>
  );
}

const st = StyleSheet.create({
  valContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 18
  },
  value: {
    color: "#1A1B1D",
    fontSize: 13,
    lineHeight: 14,
    fontWeight: 'bold'
  },
  key: {
    color: "#868A90",
    fontSize: 13,
    lineHeight: 14
  },
  totalKey: {
    color: "#3E87DC",
    fontSize: 13,
    lineHeight: 14
  }
});

export default DataComponent;
