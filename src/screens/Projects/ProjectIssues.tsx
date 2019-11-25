import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Dimensions,
  Alert,
  ActivityIndicator
} from "react-native";
import { useApolloClient, useQuery } from "react-apollo-hooks";
import ScreenHeader from "../../components/ScreenHeader";
import { Colors } from "../../utils/Colors";
import { LIST_ALL_ISSUES, GET_ISSUE_DETAILS } from "../../data/queries";
import LoadingComponent from "../../components/LoadingComponent";
import ErrorComponent from "../../components/ErrorComponent";
import { CustomPicker } from "react-native-custom-picker";
import RadioForm, {
  RadioButton,
  RadioButtonInput,
  RadioButtonLabel
} from "react-native-simple-radio-button";
import TextWithShowMore from "../../utils/TextUtils";
import { useNavigationParam } from "react-navigation-hooks";

const { width: deviceWidth, height: deviceHeight } = Dimensions.get("screen");

function IssuesScreen(props) {
  const { navigation } = props;
  const client = useApolloClient();
  const [count, setCount] = useState(10);
  const [offset, setOffset] = useState(0);
  const [selected, setSelected] = useState(0);
  const [sortStatus, setSortStatus] = useState();
  const [sortedIssues, setSortedIssues] = useState();
  const [sortLoader, setSortLoader] = useState(false);

  var projectId = useNavigationParam("id");
  var score = useNavigationParam("score");

  const radio_props = [
    { label: "All", value: 0 },
    { label: "Only Active", value: 1 }
  ];

  const queryResponse = useQuery(GET_ISSUE_DETAILS, {
    variables: {
      count,
      offset,
      projectId
    }
  });

  const { data: resp, loading, error, refetch: RefetchList } = queryResponse;

  if (loading) {
    return <LoadingComponent />;
  } else if (error || !(resp && resp.payload && resp.payload.data)) {
    return <ErrorComponent />;
  }

  let issueData = resp.payload.data;
  let projectView = issueData.projectView;

  const sortByStatus = async (value: boolean) => {
    setSortLoader(true);
    setSortStatus(value);
    var resp = await client.mutate({
      mutation: GET_ISSUE_DETAILS,
      variables: {
        projectId,
        count,
        offset,
        onlyActive: value
      }
    });

    if (
      resp &&
      resp.data &&
      resp.data.payload &&
      resp.data.payload.data.issues
    ) {
      setSortLoader(false);
      setSortedIssues(resp.data.payload.data.issues);
    }
  };

  const unsortedIssuelistBlock = ()=> {
    return issueData.issues.map(item => (
      <View key={item.id} style={st.itemContainer}>
        <View style={{ width: deviceWidth - 140, marginLeft: 10 }}>
          <Text style={st.issueTitle}>{item.name}</Text>
          <TextWithShowMore text={item.value} />
        </View>

        <View style={st.statusContainer}>
          <Image
            source={
              item.resolved
                ? require("../../../assets/img/check-green.png")
                : require("../../../assets/img/exclamation-mark.png")
            }
            style={{ width: 25, height: 25 }}
          />
        </View>
      </View>
    ));
  };

  const issuelistBlock = data => {
    return(
    <FlatList
      contentContainerStyle={{ paddingBottom: 20 }}
      data={data}
      showsVerticalScrollIndicator={false}
      keyExtractor={item => item.id.toString()}
      //onEndReached={loadMore}
      renderItem={({ item, index }) => (
        <View key={item.id} style={st.itemContainer}>
          <View style={{ width: deviceWidth - 140, marginLeft: 10 }}>
            <Text style={st.issueTitle}>{item.name}</Text>
            <TextWithShowMore text={item.value} />
          </View>

          <View style={st.statusContainer}>
            <Image
              source={
                item.resolved
                  ? require("../../../assets/img/check-green.png")
                  : require("../../../assets/img/exclamation-mark.png")
              }
              style={{ width: 25, height: 25 }}
            />
          </View>
        </View>
      )}
    />
    )
  };

  return (
    <View style={{ flex: 1 }}>
      <ScreenHeader 
      leftText="Critical Issues"
      score={score} 
       />
      <View style={{ paddingTop: 15 }}>
        <View style={st.itemContainer}>
          <View>
            <Image
              source={{ uri: projectView.pictureUrl }}
              style={st.imageSize}
            />
          </View>

          <View style={{ width: deviceWidth - 180, marginLeft: 15 }}>
            <Text style={st.issueTitle}>{projectView.projectName}</Text>
            <Text style={st.projectName}>{projectView.address}</Text>
            <Text style={st.date}>
              {projectView.startDate} - {projectView.endDate}
            </Text>
          </View>
        </View>

        <View style={{ marginHorizontal: 16, marginVertical: 5 }}>
          <RadioForm
            formHorizontal={true}
            animation={true}
            style={{ alignItems: "center" }}
          >
            {radio_props.map((obj, i) => (
              <RadioButton labelHorizontal={true} key={i}>
                <RadioButtonInput
                  obj={obj}
                  index={i}
                  isSelected={selected === i ? true : false}
                  onPress={() => {
                    setSelected(obj.value);
                    if (obj.label == "All") {
                      sortByStatus(false);
                    } else if (obj.label == "Only Active") {
                      sortByStatus(true);
                    }
                  }}
                  borderWidth={1}
                  buttonInnerColor={selected === i ? "#3E87DC" : "#888"}
                  buttonOuterColor={selected === i ? "#3E87DC" : "#888"}
                  buttonSize={15}
                  buttonOuterSize={25}
                  buttonWrapStyle={{ marginLeft: 10, marginTop: 8 }}
                />
                <RadioButtonLabel
                  obj={obj}
                  index={i}
                  labelHorizontal={true}
                  onPress={() => {
                    setSelected(obj.value);
                    if (obj.label == "All") {
                      sortByStatus(false);
                    } else if (obj.label == "Only Active") {
                      sortByStatus(true);
                    }
                  }}
                  labelStyle={{ fontSize: 18, color: "#888", padding: 10 }}
                  labelWrapStyle={{}}
                />
              </RadioButton>
            ))}
          </RadioForm>
        </View>
      </View>

      {!sortedIssues ? unsortedIssuelistBlock() : issuelistBlock(sortedIssues)}
      {sortLoader && (
        <View style={st.sortOverlay}>
          <ActivityIndicator size="large" color={Colors.blue} />
        </View>
      )}
    </View>
  );
}

var st = StyleSheet.create({
  container: {
    borderColor: "grey",
    borderWidth: 1,
    padding: 8,
    borderRadius: 10
  },
  topContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 15
  },
  projectName: {
    textTransform: "capitalize",
    color: "#888"
  },
  projectText: {
    fontWeight: "bold",
    fontSize: 16
  },
  row: {
    flexDirection: "row"
  },
  statusContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 20
  },
  itemContainer: {
    borderColor: "#DAE1EC",
    padding: 10,
    marginHorizontal: 16,
    alignSelf: "stretch",
    borderWidth: 1,
    borderRadius: 15,
    marginBottom: 12,
    flexDirection: "row",
    flexWrap: "wrap"
  },
  address: {
    color: "#868A91",
    marginLeft: 5,
    fontSize: 12,
    textTransform: "uppercase"
  },
  projTopContainer: {
    flexDirection: "row",
    marginHorizontal: 10,
    paddingVertical: 20,
    paddingHorizontal: 10,
    backgroundColor: "#05ABBF",
    borderRadius: 10,
    marginBottom: 12,
    alignItems: "center"
  },
  imageSize: {
    width: 100,
    height: 100,
    borderRadius: 4
  },
  issueTitle: {
    textTransform: "uppercase",
    fontWeight: "bold"
  },
  projName: {
    color: "#fff",
    fontSize: 30
  },
  date: {
    fontSize: 13,
    marginTop: 12,
    color: "#BFC0C8"
  },
  sortOverlay: {
    height: deviceHeight - 250,
    zIndex: 9999,
    backgroundColor: "rgba(255,255,255, 0.8)",
    position: "absolute",
    top: 250,
    left: 0,
    width: deviceWidth,
    justifyContent: "center"
  },
});

export default IssuesScreen;
