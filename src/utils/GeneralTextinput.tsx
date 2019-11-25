import React, {useState} from 'react';
import {View, Text, TextInput, StyleSheet} from 'react-native';
import { Colors } from './Colors';

export interface GeneralTextInputParams {
    placeholder: string,
    maxLength?: number,
    changeBorderOnFocus?: boolean,
    style?: any,
    isPasswordType?: boolean,
    hidePlaceholderOnFocus: boolean,
    value: string
    onChangeText: any,
    autoCapitalize: string,
    keyboardType: string
}

function GeneralTextInput(props: GeneralTextInputParams) {
   let [borderColor, setBorderColor] = useState(false);

   return(
       <View>
           <TextInput
           placeholder={props.placeholder}
           maxLength={props.maxLength || 500}
           changeBorderOnFocus={props.changeBorderOnFocus}
           onFocus={() => setBorderColor(true)}
           value={props.value}
           onChangeText={props.onChangeText}
           hidePlaceholderOnFocus={props.hidePlaceholderOnFocus}
           onBlur={() => setBorderColor(false)}
           style={[props.style, st.input,  props.changeBorderOnFocus && borderColor && {borderColor: Colors.blue}]}
           placeholderTextColor={Colors.gray} 
           autoCapitalize={props.autoCapitalize == "none" ? "none" : "sentences"}
           secureTextEntry={props.isPasswordType ? true : false}
           autoCorrect={false}
           keyboardType={props.keyboardType}
           >
           </TextInput>
       </View>
   )
}

const st = StyleSheet.create({
    input: {
       fontSize: 17,
       paddingVertical: 9,
       paddingHorizontal: 10,
       marginBottom: 10,
       borderWidth: 1,
       borderColor: Colors.gray,
       borderRadius:10,
       marginVertical:5,
       marginHorizontal: 30,
       width: 330
    }
})

export default GeneralTextInput;
