import React, { useState } from "react";
import {
  Text,
  View,
  Image,
  TouchableOpacity,
  ImageSourcePropType,
  StyleSheet,
  ActivityIndicator
} from "react-native";
import LottieView from 'lottie-react-native';



function LoadingComponent() {
  return (
    <View style={st.container}>
           <LottieView 
           autoPlay
           loop={true}
           source={require('../../assets/img/2614-kewl.json')}  
           />
    </View>
  );
}

const st = StyleSheet.create({
  container: {
    flex:1,
    justifyContent:'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)'
  },
});

export default LoadingComponent;
