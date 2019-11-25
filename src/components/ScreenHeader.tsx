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
import { useNavigation } from "react-navigation-hooks";
import { useTranslation } from "react-i18next";
import { MENU_IMG } from "../utils/Assets";
import { Colors } from "../utils/Colors";

export interface ScreenHeaderProps {
  leftText?: string;
  titleIcon?: ImageSourcePropType;
  titleText?: string;
  titleDate?: string;
  titleLeftDate?: string;
  onLeftBtnPress?: () => void;
  onRightBtnPress?: () => Promise<any>;
  rightBtnText?: string;
  requestBtnText?: string;
  rightBtnColor?: string;
  rightBtnIcon?: ImageSourcePropType;
  disabled?: boolean;
  noBarShadow?: boolean;
  requesBtn?: boolean;
  moreBtn?: boolean;
  titleIconStyle?: object;
  image?: ImageSourcePropType;
  score?: number
}

function ScreenHeader(props: ScreenHeaderProps) {
  const { t } = useTranslation();
  const { goBack } = useNavigation();
  const [isAsyncActionInProgress, setIsAsyncActionInProgress] = useState(false);

  // const onBackBtnPress = () => {
  //   if (typeof props.onLeftBtnPress === "function") {
  //     props.onLeftBtnPress();
  //   } else {
  //     goBack();
  //   }
  // };
  const onRightBtnPress = async () => {
    if (props.onRightBtnPress && typeof onRightBtnPress === "function") {
      setIsAsyncActionInProgress(true);
      try {
        await props.onRightBtnPress();
      } finally {
        setIsAsyncActionInProgress(false);
      }
    }
  };

  let tintColor;

  if(props.score > 4){
    tintColor = Colors.green;
  } else if (props.score < 4 && props.score >= 3){
    tintColor = Colors.yellow;
  } else {
    tintColor = Colors.red;
  }

  return (
    <View style={props.noBarShadow ? st.noShadowBar : st.screenHeaderBar}>
      <View style={st.leftContainer}>
        <TouchableOpacity
          onPress={() => goBack()}
          activeOpacity={0.8}
          style={st.backContainer}
        >
          <Image
            source={require('../../assets/img/back.png')}
            style={{ width: 14, height: 10, tintColor: '#868A90' }}
          />
        </TouchableOpacity>
        {!!props.leftText && (
          <Text style={st.screenHeaderTitle}>{props.leftText}</Text>
        )}
      </View>

      {props.score &&
        <View
        >
           <View style={[st.leftContainer]}>
            <Image
              source={require("../../assets/img/star.png")}
              style={{
                width: 13,
                height: 13,
                tintColor: tintColor,
                marginRight: 5
              }}
            />
            <Text style={{ color: tintColor, fontSize: 14,marginRight: 20 }}>{props.score}</Text>
          </View>
      </View>
       }

{props.rightBtnText &&
        <TouchableOpacity
        style={{paddingHorizontal:16, paddingVertical: 14}}
        onPress={onRightBtnPress}
        >
           <Text style={st.rightBtnText}>{props.rightBtnText}</Text>
      </TouchableOpacity>
       }
    
    </View>
  );
}

const st = StyleSheet.create({
  leftContainer: {
    flexDirection: "row",
    alignItems: "center"
  },
  rightBtnText:{
    fontSize: 15,
    fontWeight: 'bold',
    color: '#868A90'
  },
  screenHeaderBar: {
    flexDirection: "row",
    paddingLeft: 2,
    paddingRight: 4,
    paddingVertical: 15,
    height: 60,
    backgroundColor: "#fff",
    shadowColor: "#C7D8E8",
    justifyContent: "space-between",
    alignItems: "center",
    shadowOffset: {
      width: 0,
      height: 1
    },
    shadowOpacity: 1,
    shadowRadius: 1.41,
    elevation: 10
  },
  noShadowBar: {
    position: "relative",
    zIndex: 99,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 0,
    height: 60,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 20
  },
  screenHeaderTitleContainer: {
    flexDirection: "row",
    alignItems: "center"
  },
  screenHeaderTitle: {
    fontSize: 15,
    letterSpacing: 0.2,
    color:  '#1A1B1D',
    fontWeight: 'bold'
  },
  backContainer: {
    width: 50,
    height: 50,
    alignItems: "center",
    justifyContent: "center"
  }
});

export default ScreenHeader;
