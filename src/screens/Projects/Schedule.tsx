import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  FlatList
} from "react-native";
import { useTranslation } from "react-i18next";
import { useQuery, useApolloClient } from "react-apollo-hooks";
import { useNavigation, useNavigationParam } from "react-navigation-hooks";
import ScreenHeader from "../../components/ScreenHeader";
import DataComponent from "./DataComponent";
import LoadingComponent from "../../components/LoadingComponent";
import { GET_BUDGET_DETAILS } from "../../data/queries";
import ErrorComponent from "../../components/ErrorComponent";

function Budget(props) {
  const { t } = useTranslation();
  const { navigate, goBack } = useNavigation();
  var id = useNavigationParam("id");
  var score = useNavigationParam("score");
  const [activeTabIndex, setActiveTabIndex] = useState<number>(1);
  var [type, setType] = useState(1);

  const queryResponse = useQuery(GET_BUDGET_DETAILS, {
    variables: {
      projectId: 18
    }
  });

  const { data: resp, loading, error, refetch: RefetchList } = queryResponse;

  if (loading) {
    return <LoadingComponent />;
  } else if (error || !(resp && resp.payload && resp.payload.data)) {
    return <ErrorComponent />
  }

  var scheduleData = [
    { key: "Sheet Pilling", value: "jun 24, 2019 - oct 3, 2019" },
    { key: "RC & other structural work", value: "aug 4, 2019 - oct 27, 2019" },
    { key: "MEP Works", value: "jun 24, 2019 - jan 25, 2020" },
    { key: "Electrical", value: "feb 24, 2019 - oct 26, 2019" },
    { key: "Facade Curtain Wall", value: "may 6, 2019 - sep 15, 2019" },
    { key: "Internal Works", value: "jul 13, 2019 - nov 3, 2019" },
  ];

  var updatedcheduleData = [
    { key: "Sheet Pilling", value: "+14 days" },
    { key: "RC & other structural work", value: "-1 days" },
    { key: "MEP Works", value: "No change" },
    { key: "Electrical", value: "+65 days" },
    { key: "Facade Curtain Wall", value: "+9 days" },
    { key: "Internal Works", value: "-4 days" },
  ];

  var finalScheduleData = [
    { key: "Sheet Pilling", value: "jul 13, 2019 - oct 8, 2019" },
    { key: "RC & other structural work", value: "aug 7, 2019 - oct 26, 2019" },
    { key: "MEP Works", value: "jun 24, 2019 - jan 25, 2020" },
    { key: "Electrical", value: "feb 24, 2019 - jan 16, 2020" },
    { key: "Facade Curtain Wall", value: "may 6, 2019 - sep 26, 2019" },
    { key: "Internal Works", value: "jul 13, 2019 - nov 7, 2020" },
  ];

  const INITIAL = 1,
    UPDATED = 2,
    FINAL = 3;

  const tabs = [
    {
      id: INITIAL,
      title: "INITIAL"
    },
    {
      id: UPDATED,
      title: "VARIANCE"
    },
    {
      id: FINAL,
      title: "LATEST REV."
    }
  ];

  const onTabLabelPress = (index: number) => {
    setActiveTabIndex(index);
    if (index == INITIAL) {
      setType(1);
    } else if (index == UPDATED) {
      setType(2);
    } else if (index == FINAL) {
      setType(3);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={st.shadow}>
        <ScreenHeader 
        leftText="Schedule"
        score={score}  />
        <View style={st.tabBar}>
          {tabs.map(x => {
            return (
              <TouchableOpacity
                activeOpacity={0.8}
                key={x.id}
                onPress={() => onTabLabelPress(x.id)}
                style={[st.titleContainer]}
              >
                <Text
                  style={[
                    st.title,
                    x.id === activeTabIndex ? st.activeTabLabel : null,
                    x.id === activeTabIndex && {
                      borderBottomColor: "#1A1B1D",
                      borderBottomWidth: 1
                    }
                  ]}
                >
                  {x.title}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
      {type == 1 && (
        <View>
          <DataComponent data={scheduleData}  />
        </View>
      )}
      {type == 2 && (
        <View>
          <DataComponent data={updatedcheduleData} />
        </View>
      )}
      {type == 3 && (
        <View>
          <DataComponent data={finalScheduleData}  />
        </View>
      )}
    </View>
  );
}

const st = StyleSheet.create({
  tabBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 0,
    paddingHorizontal: 50,
    backgroundColor: "#fff"
  },
  titleContainer: {
    justifyContent: "center",
    alignItems: "center"
  },
  shadow: {
    backgroundColor: "#fff",
    elevation: 2
  },
  title: {
    fontSize: 13,
    lineHeight: 20,
    letterSpacing: 0.2,
    color: "#BFC0C8",
    paddingVertical: 23
  },
  activeTabLabel: {
    color: "#1A1B1D",
    fontSize: 13
  },
  centerLoader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  centered: {
    justifyContent: "center"
  }
});

export default Budget;
