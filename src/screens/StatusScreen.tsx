import React, { useEffect } from 'react'
import {
    Text,
    View,
    Image,
    TouchableOpacity,
    BackHandler,
    Alert,
    StyleSheet
} from 'react-native';
import {MAIN_LOGO} from '../utils/Assets'
import { Colors } from '../utils/Colors';


export interface StatusScreenProps {
    title: string
    subtitle: string
}

function StatusScreen(props) {


    BackHandler.addEventListener('hardwareBackPress', function () {
        //back button exits app when on this page
        BackHandler.exitApp()
        return true;
    });

    return (
        <View style={st.container}>
            <View style={st.recoveryContainer}>
                <Image source={MAIN_LOGO} style={st.logo} />
                <Text style={st.signUpSubtitle}>Please Check your email</Text>
                <Text style={st.recoverySubtitle}>New Password was Sent to your main</Text>
            </View>
        </View>
    );
}

var st = StyleSheet.create({
    loginBtn: {
    backgroundColor: Colors.blue, 
     borderRadius: 5, 
     alignSelf: 'stretch',
     marginHorizontal: 30, 
     alignItems: 'center', 
     paddingVertical: 8, 
     marginTop: 20
    },
    logo:{
        width: 100, 
        height: 71, 
        marginBottom: 50
    }
});

export default StatusScreen;
