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
  Alert
} from "react-native";
import { useApolloClient, useQuery } from "react-apollo-hooks";
import ScreenHeader from "../../components/ScreenHeader";
import { Colors } from "../../utils/Colors";
import {
  LIST_ALL_ISSUES,
  GET_ISSUE_DETAILS,
  GET_SATISFACTION_DETAILS
} from "../../data/queries";
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

const { width: deviceWidth } = Dimensions.get("screen");

function SatisfactionScreen(props) {
  const { navigation } = props;
  const client = useApolloClient();
  const [count, setCount] = useState(10);
  const [offset, setOffset] = useState(0);

  var projectId = useNavigationParam("id");
  var score = useNavigationParam("score");

  const queryResponse = useQuery(GET_SATISFACTION_DETAILS, {
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

  let satisfactionData = resp.payload.data;
  //alert(JSON.stringify(satisfactionData, null ,4));
  let projectView = satisfactionData.projectView;

  const satisfactionListBlock = data => {
    return (
      <FlatList
        contentContainerStyle={{ paddingBottom: 20 }}
        data={data}
        showsVerticalScrollIndicator={false}
        keyExtractor={item => item.id.toString()}
        //onEndReached={loadMore}
        renderItem={({ item, index }) => (
          <View key={item.id} style={st.itemContainer}>
            <View style={{ width: deviceWidth - 80, marginLeft: 10 }}>
              <Text style={st.issueTitle}>{item.description}</Text>
              <TextWithShowMore text={item.value} />
            </View>
          </View>
        )}
      />
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <ScreenHeader leftText="Client Satisfaction" score={score} />
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
      </View>

      {satisfactionData.values.length > 0 ? (
        <ScrollView style={{flex: 1}}
        showsVerticalScrollIndicator={false}>
          <Text style={st.clientComments}>Client notes:</Text>
          {satisfactionListBlock(satisfactionData.values)}
        </ScrollView>
      ) : (
        <Text style={st.noNotes}>No client notes</Text>
      )}
    </View>
  );
}

var st = StyleSheet.create({
  noNotes: {
      marginLeft:16,
      marginTop:20,
    fontSize: 20,
    fontWeight: "600"
  },
  clientComments: {
    fontSize: 18,
    marginBottom: 10,
    fontWeight: "bold",
    marginLeft: 16
  },
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
  }
});

export default SatisfactionScreen;
