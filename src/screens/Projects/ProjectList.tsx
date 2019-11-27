import React, {useState, useRef} from 'react';
import {
  View,
  Text,
  TextInput,
  Image,
  Alert,
  RefreshControl,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
  Switch,
} from 'react-native';
import ScreenHeader from '../../components/ScreenHeader';
import {PROJECT_PH} from '../../utils/Assets';
import {Colors} from '../../utils/Colors';
import {useNavigation, useNavigationParam} from 'react-navigation-hooks';
import {useQuery, useApolloClient} from 'react-apollo-hooks';
import {LIST_PROJECTS} from '../../data/queries';
import LoadingComponent from '../../components/LoadingComponent';
import {CustomPicker} from 'react-native-custom-picker';
import ErrorComponent from '../../components/ErrorComponent';

const {width: deviceWidth, height: deviceHeight} = Dimensions.get('window');

function ProjectList(props) {
  const {navigation} = props;
  const client = useApolloClient();
  const [count, setCount] = useState(10);
  const [offset, setOffset] = useState(0);
  const [sortedProjects, setSortedProjects] = useState();
  const [refreshing, setRefreshing] = useState(false);
  const [sortLoader, setSortLoader] = useState(false);
  const [desc, setDesc] = useState();
  const [onlyActive, setOnlyActive] = useState();
  const [activeStatus, setActiveStatus] = useState();

  const queryResponse = useQuery(LIST_PROJECTS, {
    variables: {
      count,
      offset,
      onlyActive: false,
    },
  });

  const {data: resp, loading, error, refetch: RefetchList} = queryResponse;

  if (loading) {
    return <LoadingComponent />;
  } else if (error || !(resp && resp.payload && resp.payload.data)) {
    return <ErrorComponent />;
  }

  let projectList = resp.payload.data.projectViews;

  const sortBy = async (value: string) => {
    console.log(onlyActive);
    setSortLoader(true);
    const resp = await client.mutate({
      mutation: LIST_PROJECTS,
      variables: {
        count,
        offset,
        sortBy: value,
        onlyActive,
      },
    });

    if (resp && resp.data && resp.data.payload) {
      setSortLoader(false);
      setSortedProjects(resp.data.payload.data.projectViews);
    }
  };

  const sortByActive = async (value: string) => {
    setOnlyActive(!onlyActive);
    setSortLoader(true);
    const resp = await client.mutate({
      mutation: LIST_PROJECTS,
      variables: {
        count,
        offset,
        sortBy: value,
        onlyActive,
      },
    });

    if (resp && resp.data && resp.data.payload) {
      setSortLoader(false);
      setSortedProjects(resp.data.payload.data.projectViews);
    }
  };

  const sortByDesc = async (value: boolean) => {
    setDesc(!onlyActive);
    setSortLoader(true);
    const resp = await client.mutate({
      mutation: LIST_PROJECTS,
      variables: {
        count,
        offset,
        sortBy: value,
        onlyActive,
        desc,
      },
    });

    if (resp && resp.data && resp.data.payload) {
      setSortLoader(false);
      setSortedProjects(resp.data.payload.data.projectViews);
    }
  };

  const loadMore = async () => {
    if (queryResponse.data!.payload.data.length < count) return;
    await queryResponse.fetchMore({
      variables: {
        offset: resp.payload.data.length,
      },
      updateQuery: (prev, {fetchMoreResult}) => {
        if (!fetchMoreResult) return prev;
        var merged = {
          ...prev,
          payload: {
            ...prev.payload,
            data: prev.payload.data.projectViews.concat(fetchMoreResult.payload.data.projectViews),
          },
        };
        return merged;
      },
    });
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
                {getLabel(selectedItem)
                  .replace(/([A-Z])/g, ' $1')
                  .replace(/^./, function(str) {
                    return str.toUpperCase();
                  })}
              </Text>
              <TouchableOpacity style={st.clearButton} onPress={clear}>
                <Text style={{fontSize: 16}}>x</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    );
  };

  const optionTemplate = settings => {
    const {item, getLabel} = settings;
    return (
      <View style={st.labelContainer}>
        <Text style={st.optionLabel}>
          {getLabel(item)
            .replace(/([A-Z])/g, ' $1')
            .replace(/^./, function(str) {
              return str.toUpperCase();
            })}
        </Text>
      </View>
    );
  };

  const ProjectListBlock = data => {
    return (
      <FlatList
        ListHeaderComponent={
          <View>
            <View style={st.topContainer}>
              <Text style={st.projectText}>
                Projects: {resp.payload.dataSize}
              </Text>
              <View style={st.row}>
                <Text>Active</Text>
                <Switch onValueChange={sortByActive} value={onlyActive} />
                <Text>Finished</Text>
              </View>
            </View>
            <View style={st.topContainer}>
              <CustomPicker
                style={{
                  width: deviceWidth / 2,
                }}
                options={resp.payload.data.listSotrs}
                optionTemplate={optionTemplate}
                placeholder={resp.payload.data.listSotrs[0]}
                modalStyle={{borderRadius: 15, overflow: 'hidden'}}
                fieldTemplate={renderField}
                onValueChange={value => sortBy(value)}
              />

              <View style={st.row}>
                <Text>Asc</Text>
                <Switch onValueChange={sortByDesc} value={desc} />
                <Text>Desc</Text>
              </View>
            </View>
          </View>
        }
        contentContainerStyle={{paddingVertical: 20, paddingHorizontal: 20}}
        data={data}
        showsVerticalScrollIndicator={false}
        keyExtractor={item => item.id.toString()}
        numColumns={2}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={RefetchList} />
        }
        horizontal={false}
        //onEndReached={loadMore}
        renderItem={({item, index}) => (
          <TouchableOpacity
            key={item.id}
            style={{
              borderColor: '#DAE1EC',
              paddingHorizontal: 10,
              width: deviceWidth / 2 - 27,
              borderWidth: 1,
              borderRadius: 15,
              marginBottom: 12,
              marginLeft: index % 2 == 1 ? 15 : 0,
            }}
            activeOpacity={0.8}
            onPress={() =>
              navigation.navigate('SingleProject', {
                projectId: item.id,
              })
            }>
            <View style={st.picContainer}>
              <Image source={{uri: item.pictureUrl}} style={st.mainPicture} />
              <Text style={st.score}>
                <Image
                  source={require('../../../assets/img/star.png')}
                  style={{width: 13, height: 13}}
                />{' '}
                {item.overall}
              </Text>
            </View>
            <View style={{flexDirection: 'row', marginTop: 12}}>
              <Image
                source={require('../../../assets/img/marker.png')}
                style={{height: 10, width: 8, marginTop: 3}}
              />
              <Text style={st.address}>{item.address}</Text>
            </View>
            <View style={{height: 50}}>
              <Text style={st.projectName}>{item.projectName}</Text>
            </View>
            <View style={{flexDirection: 'row', justifyContent: 'flex-start'}}>
              <Text style={st.startDate}>
                {item.startDate.toString().replace(/,/g, '.')}
              </Text>
              <Text style={st.endDate}>
                - {item.endDate.toString().replace(/,/g, '.')}
              </Text>
            </View>
          </TouchableOpacity>
        )}
      />
    );
  };

  return (
    <View style={{flex: 1}}>
      {!sortedProjects
        ? ProjectListBlock(projectList)
        : ProjectListBlock(sortedProjects)}
      {/* {sortedProjects && ProjectListBlock(sortedProjects)} */}
      {sortLoader && (
        <View style={st.sortOverlay}>
          <ActivityIndicator size="large" color={Colors.blue} />
        </View>
      )}
    </View>
  );
}

var st = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
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
    marginBottom: 15,
  },
  address: {
    color: '#868A91',
    marginLeft: 5,
    fontSize: 12,
    textTransform: 'uppercase',
  },
  projectText: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 12,
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
  clearButton: {
    borderRadius: 5,
    marginRight: 10,
    paddingHorizontal: 5,
  },
  innerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  projectName: {
    color: '#1A1B1D',
    fontSize: 13,
    textTransform: 'capitalize',
    fontWeight: 'bold',
    marginTop: 5,
  },
  endDate: {
    fontSize: 12,
    marginTop: 15,
    color: '#BFC0C8',
    marginBottom: 14,
  },
  startDate: {
    fontSize: 12,
    marginTop: 15,
    color: '#BFC0C8',
    marginBottom: 14,
    marginRight: 5,
  },
  mainPicture: {
    marginLeft: -3,
    width: deviceWidth / 2 - 29,
    height: 110,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  picContainer: {
    borderColor: '#222954',
    position: 'relative',
    width: 160,
    height: 110,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 20,
  },
  score: {
    color: '#fff',
    position: 'absolute',
    bottom: 10,
    right: 0,
  },
  labelContainer: {
    borderBottomWidth: 1,
    borderBottomColor: '#DAE1EC',
    padding: 14,
  },
  optionLabel: {
    fontSize: 18,
  },
});

export default ProjectList;
