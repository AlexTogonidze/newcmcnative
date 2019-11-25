import React, {useState, useEffect} from 'react';
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
  ActivityIndicator,
  Switch,
} from 'react-native';
import {useApolloClient, useQuery} from 'react-apollo-hooks';
import ScreenHeader from '../../components/ScreenHeader';
import {Colors} from '../../utils/Colors';
import {LIST_ALL_ISSUES} from '../../data/queries';
import LoadingComponent from '../../components/LoadingComponent';
import ErrorComponent from '../../components/ErrorComponent';
import {CustomPicker} from 'react-native-custom-picker';
import RadioForm, {
  RadioButton,
  RadioButtonInput,
  RadioButtonLabel,
} from 'react-native-simple-radio-button';
import TextWithShowMore from '../../utils/TextUtils';

const {width: deviceWidth, height: deviceHeight} = Dimensions.get('screen');

function IssuesScreen(props) {
  const {navigation} = props;
  const client = useApolloClient();
  const [count, setCount] = useState(10);
  const [offset, setOffset] = useState(0);
  const [selected, setSelected] = useState(0);
  const [sortStatus, setSortStatus] = useState();
  const [sortedIssues, setSortedIssues] = useState();
  const [sortLoader, setSortLoader] = useState(false);

  const radio_props = [
    {label: 'All', value: 0},
    {label: 'Only Active', value: 1},
  ];

  const queryResponse = useQuery(LIST_ALL_ISSUES, {
    variables: {
      count,
      offset,
    },
  });

  const {data: resp, loading, error, refetch: RefetchList} = queryResponse;

  if (loading) {
    return <LoadingComponent />;
  } else if (error || !(resp && resp.payload && resp.payload.data)) {
    return <ErrorComponent />;
  }

  let issueList = resp.payload.data.projectViews;

  const sortBy = async (value: string) => {
    setSortLoader(true);
    var resp = await client.mutate({
      mutation: LIST_ALL_ISSUES,
      variables: {
        count,
        offset,
        sortBy: value,
        onlyActive: sortStatus,
      },
    });

    if (resp && resp.data && resp.data.payload) {
      setSortLoader(false);
      setSortedIssues(resp.data.payload.data.projectViews);
      //alert(JSON.stringify(resp.data.payload.data.projectViews, null, 4));
    }
  };

  const sortByStatus = async (value: boolean) => {
    setSortLoader(true);
    setSortStatus(value);
    var resp = await client.mutate({
      mutation: LIST_ALL_ISSUES,
      variables: {
        count,
        offset,
        onlyActive: value,
      },
    });

    if (resp && resp.data && resp.data.payload) {
      setSortLoader(false);
      setSortedIssues(resp.data.payload.data.projectViews);
    }
  };

  const renderField = settings => {
    const {selectedItem, defaultText, getLabel, clear} = settings;
    return (
      <View style={st.container}>
        <View>
          {!selectedItem && (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <Text style={{fontSize: 15, textTransform: 'capitalize'}}>
                {defaultText}
              </Text>
            </View>
          )}
          {selectedItem && (
            <View style={st.innerContainer}>
              <Text style={{textTransform: 'capitalize'}}>
                {getLabel(selectedItem)}
              </Text>
            </View>
          )}
        </View>
      </View>
    );
  };

  const issuelistBlock = data => {
    return (
      <FlatList
        contentContainerStyle={{paddingBottom: 20, paddingHorizontal: 16}}
        data={data}
        showsVerticalScrollIndicator={false}
        keyExtractor={item => item.id.toString()}
        //onEndReached={loadMore}
        renderItem={({item, index}) => (
          <View key={item.id} style={st.itemContainer}>
            <TouchableOpacity
              activeOpacity={1}
              onPress={() =>
                navigation.navigate('SingleProject', {
                  projectId: item.projectId,
                })
              }>
              <Image source={{uri: item.pictureUrl}} style={st.imageSize} />
            </TouchableOpacity>

            <View style={{width: deviceWidth - 180, marginLeft: 10}}>
              <Text style={st.projectName}>{item.projectName}</Text>
              <Text style={st.issueTitle}>{item.name}</Text>

              <TextWithShowMore text={item.value} />
            </View>

            <View style={st.statusContainer}>
              <Image
                source={
                  item.resolved
                    ? require('../../../assets/img/check-green.png')
                    : require('../../../assets/img/exclamation-mark.png')
                }
                style={{width: 25, height: 25}}
              />
            </View>
          </View>
        )}
      />
    );
  };

  // const toggleSwitch = () => {
  //   setSortStatus(!sortStatus);
  // };

  const optionTemplate = settings => {
    const {item, getLabel} = settings;
    return (
      <View style={st.labelContainer}>
        <Text style={st.optionLabel}>{getLabel(item)}</Text>
      </View>
    );
  };

  return (
    <View style={{flex: 1}}>
      <View style={{paddingTop: 15, paddingHorizontal: 20}}>
        <View>
          <Text style={st.projectText}>
            All Issues: {resp.payload.dataSize}
          </Text>
        </View>

        <View style={st.topContainer}>
          <View>
            <CustomPicker
              style={{
                width: deviceWidth / 3,
                borderColor: '#DAE1EC',
              }}
              modalStyle={{borderRadius: 15, overflow: 'hidden'}}
              options={resp.payload.data.listSotrs}
              optionTemplate={optionTemplate}
              placeholder="Sort By"
              fieldTemplate={renderField}
              onValueChange={value => sortBy(value)}
            />
          </View>

          {/* <View style={st.row}>
            <Text>All</Text>
            <Switch onValueChange={sortByStatus} value={sortStatus}/>
            <Text>Active</Text>
          </View>

          <View style={st.row}>
            <Text>Asc</Text>
            <Switch onValueChange={sortByStatus} value={sortStatus}/>
            <Text>Desc</Text>
          </View> */}
          <View>
              <RadioForm formHorizontal={true} animation={true}>
                {radio_props.map((obj, i) => (
                  <RadioButton labelHorizontal={true} key={i}>
                    <RadioButtonInput
                      obj={obj}
                      index={i}
                      isSelected={selected === i ? true : false}
                      onPress={() => {
                        setSelected(obj.value)
                        if(obj.label == 'All'){
                          sortByStatus(false);
                        } else if (obj.label == 'Only Active'){
                          sortByStatus(true);
                        }
                      }
                    }
                      borderWidth={1}
                      buttonInnerColor={selected === i ? "#3E87DC" : "#888"}
                      buttonOuterColor={
                        selected === i ? "#3E87DC" : "#888"
                      }
                      buttonSize={15}
                      buttonOuterSize={25}
                      buttonWrapStyle={{ marginLeft: 10, marginTop: 8 }}
                    />
                    <RadioButtonLabel
                      obj={obj}
                      index={i}
                      labelHorizontal={true}
                      onPress={() => {
                        setSelected(obj.value)
                        if(obj.label == 'All'){
                          sortByStatus(false);
                        } else if (obj.label == 'Only Active'){
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
      </View>

      {!sortedIssues ? issuelistBlock(issueList) : issuelistBlock(sortedIssues)}
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
    borderColor: 'grey',
    borderWidth: 1,
    padding: 8,
    borderRadius: 10,
  },
  topContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 15,
  },
  projectName: {
    textTransform: 'capitalize',
    color: '#888',
  },
  sortOverlay: {
    height: deviceHeight - 100,
    zIndex: 9999,
    backgroundColor: 'rgba(255,255,255, 0.8)',
    position: 'absolute',
    top: 100,
    left: 0,
    width: deviceWidth,
    justifyContent: 'center',
  },
  projectText: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  row: {
    flexDirection: 'row',
  },
  statusContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 20,
  },
  itemContainer: {
    borderColor: '#DAE1EC',
    padding: 10,
    alignSelf: 'stretch',
    borderWidth: 1,
    borderRadius: 15,
    marginBottom: 12,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  address: {
    color: '#868A91',
    marginLeft: 5,
    fontSize: 12,
    textTransform: 'uppercase',
  },
  projTopContainer: {
    flexDirection: 'row',
    marginHorizontal: 10,
    paddingVertical: 20,
    paddingHorizontal: 10,
    backgroundColor: '#05ABBF',
    borderRadius: 10,
    marginBottom: 12,
    alignItems: 'center',
  },
  imageSize: {
    width: 60,
    height: 60,
    borderRadius: 4,
  },
  issueTitle: {
    textTransform: 'uppercase',
    fontWeight: 'bold',
  },
  projName: {
    color: '#fff',
    fontSize: 30,
  },
  date: {
    color: '#fff',
    marginLeft: 50,
    fontSize: 17,
    marginTop: 15,
  },
  labelContainer: {
    borderBottomWidth: 1,
    borderBottomColor: '#DAE1EC',
    padding: 14,
  },
  optionLabel: {
    fontSize: 18,
    textTransform: 'capitalize',
  },
});

export default IssuesScreen;
