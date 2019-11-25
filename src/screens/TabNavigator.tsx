import Icon from "react-native-vector-icons/FontAwesome5";
import { View, Image, Text } from "react-native";
import { createAppContainer } from "react-navigation";
import {
  createBottomTabNavigator,
  createMaterialTopTabNavigator
} from "react-navigation-tabs";
import HomeScreen from "./SearchScreen";
import ProfileScreen from "./profile/ProfileScreen";
import React from "react";
import SingleProject from "./Projects/SingleProject";
import IssuesScreen from "./issues/IssueScreen";
import ProjectList from "./Projects/ProjectList";
import SearchScreen from "./SearchScreen";

export default createMaterialTopTabNavigator(
  {
    Projects: {
      screen: ProjectList,
      navigationOptions: {
        tabBarIcon: ({ focused }) => (
          <View
            style={{
              backgroundColor: focused ? "rgba(255, 255, 255, 0.2)" : "#000",
              borderRadius: 10,
              padding: 10,
              marginLeft: -32,
              marginTop: -10,
              minWidth: 95,
              flexDirection: "row"
            }}
          >
            <Image
              source={require("../../assets/img/homeTab.png")}
              style={{
                tintColor: focused ? "#fff" : "#919191",
                width: 17,
                height: 16.15
              }}
            />
            <Text style={{ color: "#fff", marginLeft: 5 }}>Projects</Text>
          </View>
        )
      }
    },
    Home: {
      screen: SearchScreen,
      navigationOptions: {
        tabBarIcon: ({ focused }) => (
          <View
            style={{
              backgroundColor: focused ? "rgba(255, 255, 255, 0.2)" : "#000",
              borderRadius: 10,
              padding: 10,
              marginTop: -10,
              minWidth: 36,
              flexDirection: "row"
            }}
          >
            <Image
              source={require("../../assets/img/search.png")}
              style={{
                tintColor: focused ? "#fff" : "#919191",
                width: 20,
                height: 20,
                marginLeft: -2
              }}
            />
          </View>
        )
      }
    },
    Issues: {
      screen: IssuesScreen,
      navigationOptions: {
        tabBarIcon: ({ focused }) => (
          <View
            style={{
              backgroundColor: focused ? "rgba(255, 255, 255, 0.2)" : "#000",
              borderRadius: 10,
              padding: 7,
              marginTop: -10,
              minWidth: 36,
              flexDirection: "row"
            }}
          >
              <Image
              source={require("../../assets/img/exclamation.png")}
              style={{
                tintColor: focused ? "#fff" : "#919191",
                width: 22,
                height: 22,
                marginTop:2
              }}
            />

            <Text
              style={{
                position: "absolute",
                top: 0,
                right: 2,
                color: "#fff",
                fontSize: 10,
                backgroundColor: "red",
                borderRadius: 100,
                width: 16,
                justifyContent: "center",
                height: 16,
                textAlign: "center"
              }}
            >
              10
            </Text>
          </View>
        )
      }
    },
    Profile: {
      screen: ProfileScreen,
      navigationOptions: {
        tabBarIcon: ({ focused }) => (
          <View
            style={{
              backgroundColor: focused ? "rgba(255, 255, 255, 0.2)" : "#000",
              borderRadius: 10,
              padding: 10,
              marginTop: -10,
              minWidth: 36,
              flexDirection: "row"
            }}
          >
            <Image
              source={require("../../assets/img/user.png")}
              style={{
                tintColor: focused ? "#fff" : "#919191",
                width: 20,
                height: 20,
                marginLeft: -2
              }}
            />
          </View>
        )
      }
    }
  },
  {
    navigationOptions: {
      header: null
    },
    lazy: true,
    tabBarOptions: {
      showIcon: true,
      showLabel: false,
      activeTintColor: "#fff",
      inactiveTintColor: "#919191",
      labelStyle: {
        fontSize: 14,
        textTransform: "capitalize"
      },
      tabStyle: {
        backgroundColor: "#000",
        height: 70,
        paddingTop: 20
      }
    }
  }
);
