import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  FlatList,
  Alert
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
      projectId: id
    }
  });

  const { data: resp, loading, error, refetch: RefetchList } = queryResponse;

  if (loading) {
    return <LoadingComponent />;
  } else if (error || !(resp && resp.payload && resp.payload.data)) {
    return <ErrorComponent />;
  }

  var budgetData = resp.payload.data;

  // alert(JSON.stringify(budgetData.initialBudgets, null , 4));

   let  initialnumbers = [];
   let  updatednumbers = [];
   let finalnumbers = [];

   let initials = budgetData.initialBudgets.map(x => initialnumbers.push(x.value));
   let updated = budgetData.budgetVariations.map(x => updatednumbers.push(x.value));
   let finalBudget = budgetData.finalBudgets.map(x => finalnumbers.push(x.value));

   let initialTotal = initialnumbers.reduce((a, b) => a + b, 0);
   let updatedTotal = updatednumbers.reduce((a, b) => a + b, 0);
   let finalTotal = finalnumbers.reduce((a, b) => a + b, 0);

  const INITIAL = 1,
   VARIANCE = 2,
    LATEST = 3;

  const tabs = [
    {
      id: INITIAL,
      title: "INITIAL"
    },
    {
      id: VARIANCE,
      title: "VARIANCE"
    },
    {
      id: LATEST,
      title: "LATEST REV."
    }
  ];

  const onTabLabelPress = (index: number) => {
    setActiveTabIndex(index);
    if (index == INITIAL) {
      setType(1);
    } else if (index == VARIANCE) {
      setType(2);
    } else if (index == LATEST) {
      setType(3);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={st.shadow}>
        <ScreenHeader 
        leftText="Budget"
        score={score} 
        />
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
          <DataComponent data={budgetData.initialBudgets} total={initialTotal} isBudget={true}/>
        </View>
      )}
      {type == 2 && (
        <View>
          <DataComponent data={budgetData.budgetVariations} total={updatedTotal} isBudget={true}/>
        </View>
      )}
      {type == 3 && (
        <View>
          <DataComponent data={budgetData.finalBudgets} total={finalTotal} isBudget={true}/>
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
