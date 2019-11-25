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
  FlatList,
  Alert
} from "react-native";
import ScreenHeader from "../../components/ScreenHeader";
import { useNavigation, useNavigationParam } from "react-navigation-hooks";
import DraggableFlatList from "react-native-draggable-flatlist";

const { width: deviceWidth } = Dimensions.get("window");

function BlockEditor(props) {
  const { navigation } = props;
  const { goBack, navigate } = useNavigation();
  const blockData = useNavigationParam('blockData');
  const [visibleItems, setVisibleItems] = useState([
    { id: 16,
      name: 'Client Satisfcation',
      score: "4.2",
      sequenceNumber: 0
    },
    {
      id: 17,
      name: "Critical Issues",
      score: "4.6",
      sequenceNumber: 1
    },
    {
      id: 18,
      name: "CMC Value",
      score: "3.6",
      sequenceNumber: 2
    },
    {
      id: 19,
      name: "Schedule",
      score: "2.2",
      sequenceNumber: 3
    }
  ]);

  const [invisibleItems, setinVisibleItems] = useState([
    {
      id: 21,
      name: "Budget",
      score: "2.1"
    }
  ]);


  const removeVisible = item => {
    if (visibleItems.length > 1) {
      setVisibleItems(visibleItems.filter(x => x.id !== item.id));
      setinVisibleItems([...invisibleItems, item]);
    } else {
      Alert.alert("You must leave minimum 1 block to the visible blocks");
    }
  };

  const addVisible = item => {
    setinVisibleItems(invisibleItems.filter(x => x.id !== item.id));
    setVisibleItems([...visibleItems, item]);
  };


  return (
    <View style={{ flex: 1 }}>
      <ScreenHeader
        leftText="Customize Block"
        rightBtnText="Save"
        onRightBtnPress={() => goBack()}
      />
      <View style={st.messageContainer}>
        <Image
          source={require("../../../assets/img/warn.png")}
          style={st.warn}
        />
        <Text style={st.message}>Add or remove blocks from categories</Text>
      </View>

      <View style={{ marginTop: 40, paddingHorizontal: 16, flex: 1 }}>
        <Text
          style={st.visible}
        >
          Visible Blocks
        </Text>

        <DraggableFlatList
          data={visibleItems}
          scrollPercent={0}
          keyExtractor={(item, index) => `draggable-item-${item.id}`}
          renderItem={({ item, index, move, moveEnd, isActive }) => (
            <TouchableOpacity
              onLongPress={move}
              onPressOut={moveEnd}
              style={[st.scoreCard, { elevation: isActive ? 10 : 4 }]}
              key={item.id}
              activeOpacity={0.9}
            >
              <View style={{ justifyContent: "center" }}>
                <Text>{item.name}</Text>
              </View>
              <View style={[st.row, { alignItems: "center" }]}>
                <Image
                  source={require("../../../assets/img/star.png")}
                  style={{
                    width: 12,
                    height: 12,
                    tintColor: item.score < 2.5 ?  "#E26C64" : (item.score > 2.5 && item.score < 4 ? '#E9A967' : '#3DBD7D'),
                    marginRight: 5
                  }}
                />
                <Text style={{ color: item.score < 2.5 ?  "#E26C64" : (item.score > 2.5 && item.score < 4 ? '#E9A967' : '#3DBD7D'), fontSize: 13 }}>
                  {item.score}
                </Text>
                <TouchableOpacity
                  onPress={() => removeVisible(item)}
                  style={st.operationTouchable}
                >
                  <Text style={st.minusText}>-</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          )
        }
        />
      </View>

      <View style={st.invisibleContainer}>
        <Text
          style={{
            fontSize: 16,
            lineHeight: 18,
            marginBottom: 20,
            fontWeight: "bold"
          }}
        >
          Invisible Blocks
        </Text>

        {invisibleItems.map(item => (
          <View style={st.scoreCard} key={item.id}>
            <View style={{ justifyContent: "center" }}>
              <Text>{item.name}</Text>
            </View>
            <View style={[st.row, { alignItems: "center" }]}>
              <Image
                source={require("../../../assets/img/star.png")}
                style={{
                  width: 12,
                  height: 12,
                  tintColor: item.score < 2.5 ?  "#E26C64" : (item.score > 2.5 && item.score < 4 ? '#E9A967' : '#3DBD7D'),
                  marginRight: 5
                }}
              />
              <Text style={{ color:  item.score < 2.5 ?  "#E26C64" : (item.score > 2.5 && item.score < 4 ? '#E9A967' : '#3DBD7D'), fontSize: 13 }}>
                {item.score}
              </Text>
              <TouchableOpacity
                style={st.operationTouchable}
                onPress={() => addVisible(item)}
              >
                <Text style={st.plusText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

const st = StyleSheet.create({
  row: {
    flexDirection: "row"
  },
  messageContainer: {
    backgroundColor: "#3E87DC",
    paddingHorizontal: 20,
    paddingVertical: 15,
    flexDirection: "row",
    alignItems: "center"
  },
  message: {
    fontSize: 13,
    color: "#fff"
  },
  warn: {
    width: 18,
    height: 18,
    marginRight: 10
  },
  scoreCard: {
    borderWidth: 1,
    borderColor: "#DAE1EC",
    alignSelf: "stretch",
    borderRadius: 14,
    paddingLeft: 25,
    paddingRight: 15,
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    flexDirection: "row",
    backgroundColor: "#fff",
    elevation: 4,
    marginHorizontal: 4,
    minHeight: 58,
    marginBottom: 15
  },
  invisibleContainer: {
    paddingHorizontal: 20,
    paddingVertical: 30,
    backgroundColor: "#EBECED",
    position: "absolute",
    bottom: 0,
    width: "100%"
  },
  minusText: {
    backgroundColor: "#E26C64",
    color: "#fff",
    borderRadius: 100,
    width: 20,
    height: 20,
    textAlign: "center",
    fontWeight: "bold",
    lineHeight: 18
  },
  plusText: {
    backgroundColor: "#3DBD7D",
    color: "#fff",
    borderRadius: 100,
    width: 20,
    height: 20,
    textAlign: "center",
    fontWeight: "bold",
    lineHeight: 18
  },
  operationTouchable: {
    borderRadius: 100,
    width: 40,
    height: 40,
    marginLeft: 10,
    justifyContent: "center",
    alignItems: "center"
  },
  visible: {
    fontSize: 16,
    lineHeight: 18,
    marginBottom: 20,
    fontWeight: "bold"
  }
});

export default BlockEditor;
