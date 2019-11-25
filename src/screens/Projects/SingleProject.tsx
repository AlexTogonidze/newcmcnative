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
  ActivityIndicator
} from "react-native";
import { PROJECT_PH } from "../../utils/Assets";
import { Colors } from "../../utils/Colors";
import { useNavigation, useNavigationParam } from "react-navigation-hooks";
import { LIST_SINGLE_PROJECT } from "../../data/queries";
import { useQuery, useApolloClient } from "react-apollo-hooks";
import LoadingComponent from "../../components/LoadingComponent";

import ErrorComponent from "../../components/ErrorComponent";

const { width: deviceWidth } = Dimensions.get("window");

const ScoreRenderer = props => {
  let tintColor;

  if (props.value > 4) {
    tintColor = Colors.green;
  } else if (props.value < 4 && props.value >= 3) {
    tintColor = Colors.yellow;
  } else {
    tintColor = Colors.red;
  }

  return (
    <View style={[st.row, { alignItems: "center" }]}>
      <Image
        source={require("../../../assets/img/star.png")}
        style={[st.star, { tintColor: tintColor }]}
      />
      <Text style={{ color: tintColor, fontSize: 13 }}>{props.value}</Text>
    </View>
  );
};

function SingleProject(props) {
  const { navigation } = props;
  const { goBack, navigate } = useNavigation();
  const projectId = useNavigationParam("projectId");

  const queryResponse = useQuery(LIST_SINGLE_PROJECT, {
    variables: {
      projectId
    }
  });

  const { data: resp, loading, error, refetch: RefetchList } = queryResponse;

  if (loading) {
    return <LoadingComponent />;
  } else if (error || !(resp && resp.payload && resp.payload.data)) {
    return <ErrorComponent />;
  }

  let projectData = resp.payload.data;
  // alert(JSON.stringify(projectData, null , 4))

  let scoreContainerBg;

  if (
    projectData.scoreModel.overall < 4 &&
    projectData.scoreModel.overall > 3
  ) {
    scoreContainerBg = "#E9A967";
  } else if (projectData.scoreModel.overall > 4) {
    scoreContainerBg = "#3DBD7D";
  } else {
    scoreContainerBg = "#E26C64";
  }

  return (
    <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
      <ImageBackground
        source={{ uri: projectData.projectView.pictureUrl }}
        style={st.backgroundImage}
      >
        <View
          style={[
            st.row,
            {
              justifyContent: "space-between",
              paddingRight: 10,
              paddingLeft: 8
            }
          ]}
        >
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => goBack()}
            activeOpacity={0.8}
            style={{ padding: 12 }}
          >
            <View style={st.backContainer}>
              <Image
                source={require("../../../assets/img/back.png")}
                style={{ width: 14, height: 10 }}
              />
            </View>
          </TouchableOpacity>

          <View style={st.row}>
            <TouchableOpacity
              activeOpacity={1}
              onPress={() =>
                navigate("BlockEditor", {
                  blockData: projectData.customizeModel
                })
              }
              style={{ padding: 12 }}
            >
              <View style={st.editorContainer}>
                <Image
                  source={require("../../../assets/img/pen.png")}
                  style={{ width: 12, height: 12 }}
                />
              </View>
            </TouchableOpacity>

            <View
              style={[st.scoreContainer, { backgroundColor: scoreContainerBg }]}
            >
              <Image
                source={require("../../../assets/img/star.png")}
                style={{ width: 12, height: 12 }}
              />
              <Text style={{ color: "#fff", fontSize: 13 }}>
                {" "}
                {projectData.scoreModel.overall}
              </Text>
            </View>
          </View>
        </View>

        <View
          style={{
            backgroundColor: "rgba(0,0,0,0.4)",
            paddingTop: 10,
            paddingBottom: 15,
            paddingHorizontal: 20
          }}
        >
          <Text style={st.title}>{projectData.projectView.projectName}</Text>
          <Text style={st.location}>
            <Image
              source={require("../../../assets/img/marker.png")}
              style={{ width: 11, height: 14, tintColor: "#fff" }}
            />{" "}
            {projectData.projectView.address}
          </Text>

          <Text style={st.location}>
            <Image
              source={require("../../../assets/img/clock.png")}
              style={{ width: 14, height: 14 }}
            />{" "}
            {projectData.projectView.startDate} -{" "}
            {projectData.projectView.endDate}
          </Text>
        </View>
      </ImageBackground>

      <View style={st.scoreCardContainer}>
        <TouchableOpacity 
        activeOpacity={1}
        style={st.scoreCard}
        onPress={() =>
          navigate("SatisfactionScreen", {
            id: projectId,
            score: projectData.scoreModel.clientSatisfaction
          })
        }>
          <View style={{ justifyContent: "center" }}>
            <Text>Client Satisfaction</Text>
            {projectData.clientSatisfactionNote && (
              <Text style={st.noteText}>
                {projectData.clientSatisfactionNote}
              </Text>
            )}
          </View>
          <ScoreRenderer value={projectData.scoreModel.clientSatisfaction} />
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={1}
          style={st.scoreCard}
          onPress={() =>
            navigate("Budget", {
              id: projectId,
              score: projectData.scoreModel.budget
            })
          }
        >
          <View style={{ justifyContent: "center" }}>
            <Text>Budget</Text>
            {projectData.budgetNote && (
              <Text style={st.noteText}>
                {projectData.budgetNote}
              </Text>
            )}
          </View>
          <ScoreRenderer value={projectData.scoreModel.budget} />
        </TouchableOpacity>

        <TouchableOpacity
          style={st.scoreCard}
          activeOpacity={1}
          onPress={() => navigate("Schedule", {
            score: projectData.scoreModel.schedule
          })}
        >
          <View style={{ justifyContent: "center" }}>
            <Text>Schedule</Text>
            {projectData.scheduleNote && (
              <Text style={st.noteText}>
                {projectData.scheduleNote}
              </Text>
            )}
          </View>
          <ScoreRenderer value={projectData.scoreModel.schedule} />
        </TouchableOpacity>

        <TouchableOpacity 
        activeOpacity={1}
        style={st.scoreCard}
        onPress={() =>
          navigate("CMCValueScreen", {
            id: projectId,
            score: projectData.scoreModel.budget
          })
        }>
          <View style={{ justifyContent: "center" }}>
            <Text>CMC Value</Text>
            {projectData.cmcValueNote && (
              <Text style={st.noteText}>
                {projectData.cmcValueNote}
              </Text>
            )}
          </View>
          <ScoreRenderer value={projectData.scoreModel.cmcValue} />
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={1}
          style={st.scoreCard}
          onPress={() =>
            navigate("ProjectIssues", {
              id: projectId,
              score: projectData.scoreModel.issues
            })
          }
        >
          <View style={{ justifyContent: "center" }}>
            <Text>Critical Issues</Text>
            {projectData.issuesNote && (
              <Text style={st.noteText}>
                {projectData.issuesNote}
              </Text>
            )}
          </View>
          <ScoreRenderer value={projectData.scoreModel.issues} />
        </TouchableOpacity>
      </View>

      <View style={{ paddingBottom: 20 }}>
        <View style={[st.optionContainer, { backgroundColor: "#EBECED" }]}>
          <Text style={st.optionTitle}>Client</Text>
          <Text>{projectData.clientName}</Text>
        </View>

        <View style={st.optionContainer}>
          <Text style={st.optionTitle}>Location</Text>
          <Text>{projectData.projectView.address}</Text>
        </View>

        <View style={[st.optionContainer, { backgroundColor: "#EBECED" }]}>
          <Text style={st.optionTitle}>Report Date</Text>
          <Text>{projectData.reportDate.replace(/-/g, "/")}</Text>
        </View>

        <View style={st.optionContainer}>
          <Text style={st.optionTitle}>Project Status</Text>
          <Text>Pre-Construction</Text>
        </View>

        <View style={[st.optionContainer, { backgroundColor: "#EBECED" }]}>
          <Text style={st.optionTitle}>Build up area</Text>
          <Text>{projectData.buildArea}</Text>
        </View>

        <View style={st.optionContainer}>
          <Text style={st.optionTitle}>Project Manager</Text>
          <Text>{projectData.projectManager}</Text>
        </View>
      </View>
    </ScrollView>
  );
}

var st = StyleSheet.create({
  row: {
    flexDirection: "row"
  },
  noteText: { 
    color: "#868A90", 
    fontSize: 13 
  },
  title: {
    color: "#fff",
    fontSize: 20,
    lineHeight: 25
  },
  location: {
    fontSize: 12,
    lineHeight: 15,
    color: "#fff",
    textTransform: "uppercase",
    marginVertical: 7
  },
  backgroundImage: {
    width: deviceWidth,
    height: 262,
    paddingTop: 3,
    justifyContent: "space-between"
  },
  editorContainer: {
    borderRadius: 100,
    width: 38,
    height: 38,
    backgroundColor: "#3E87DC",
    justifyContent: "center",
    alignItems: "center"
  },
  scoreContainer: {
    borderRadius: 14,
    width: 83,
    height: 38,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    marginLeft: 8,
    marginTop: 12
  },
  backContainer: {
    borderRadius: 100,
    width: 38,
    height: 38,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "center",
    alignItems: "center"
  },
  scoreCard: {
    borderWidth: 1,
    borderColor: "#DAE1EC",
    alignSelf: "stretch",
    borderRadius: 14,
    paddingHorizontal: 25,
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    flexDirection: "row",
    backgroundColor: "#fff",
    elevation: 4,
    minHeight: 58,
    marginBottom: 15
  },
  scoreCardContainer: {
    paddingHorizontal: 20,
    paddingVertical: 25
  },
  optionContainer: {
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    height: 50,
    alignItems: "center"
  },
  optionTitle: {
    color: "#868A90",
    fontSize: 13,
    lineHeight: 14
  },
  star: {
    width: 12,
    height: 12,
    //tintColor: "#3DBD7D",
    marginRight: 5
  }
});

export default SingleProject;
