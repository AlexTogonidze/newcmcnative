import React, {useState, useRef} from 'react';
import {
  View,
  Text,
  TextInput,
  Image,
  Alert,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import {PROJECT_PH} from '../utils/Assets';
import {Colors} from '../utils/Colors';
import {useQuery, useApolloClient} from 'react-apollo-hooks';
import {LIST_PROJECTS, SEARCH_PROJECTS} from '../data/queries';
import LoadingComponent from '../components/LoadingComponent';
import {CustomPicker} from 'react-native-custom-picker';
import ErrorComponent from '../components/ErrorComponent';
import {useField} from '../utils/FormValidation';

const {width: deviceWidth, height: deviceHeight} = Dimensions.get('window');

function SearchScreen(props) {
  const {navigation} = props;
  const client = useApolloClient();
  const searchVal = useField('');
  const [searchLoader, setSearchLoader] = useState(false);
  const [searchData, setSearchData] = useState([]);
  const [error, setError] = useState(false);

  const queryResponse = useQuery(SEARCH_PROJECTS, {
    variables: {
      value: searchVal,
    },
  });

  const setSearch = async () => {
    if (searchVal.value.length < 2) {
      setError(true);
      return;
    } else {
      setError(false);
    }

    setSearchLoader(true);
    var resp = await client.mutate({
      mutation: SEARCH_PROJECTS,
      variables: {
        value: searchVal.value,
      },
    });

    if (resp && resp.data && resp.data.payload) {
      setSearchLoader(false);
      setSearchData(resp.data.payload.data);
    }
  };

  const SearchScreenBlock = data => {
    return (
      <FlatList
        ListHeaderComponent={
          <View>
            <View style={st.topContainer}>
              <TouchableOpacity activeOpacity={0.9} onPress={() => {}}>
                <Image
                  source={require('../../assets/img/filter.png')}
                  style={st.filter}
                />
              </TouchableOpacity>
              <View style={st.row}>
                <TextInput
                  placeholder="Type something..."
                  style={st.searchInput}
                  value={searchVal.value}
                  onChangeText={searchVal.onChange}
                  returnKeyType="search"
                  onSubmitEditing={() => setSearch()}
                />
                <TouchableOpacity
                  activeOpacity={0.9}
                  onPress={() => setSearch()}
                  style={st.searchBtn}>
                  <Image
                    source={require('../../assets/img/search.png')}
                    style={st.searchImg}
                  />
                </TouchableOpacity>
              </View>
            </View>
            {error && (
              <Text style={st.errorText}>Must be at least 2 characters</Text>
            )}
          </View>
        }
        keyboardShouldPersistTaps={'handled'}
        contentContainerStyle={{paddingVertical: 20, paddingHorizontal: 20}}
        data={data}
        showsVerticalScrollIndicator={false}
        keyExtractor={item => item.id.toString()}
        numColumns={2}
        horizontal={false}
        renderItem={({item, index}) => (
          <TouchableOpacity
            key={item.id}
            style={[
              st.item,
              {
                marginLeft: index % 2 == 1 ? 15 : 0,
              },
            ]}
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
                  source={require('../../assets/img/star.png')}
                  style={{width: 13, height: 13}}
                />{' '}
                {item.overall}
              </Text>
            </View>
            <View style={{flexDirection: 'row', marginTop: 12}}>
              <Image
                source={require('../../assets/img/marker.png')}
                style={st.marker}
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
      {SearchScreenBlock(searchData)}
      {searchLoader && (
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
  errorText: {
    color: Colors.red,
    marginLeft: 40,
  },
  marker: {
    height: 10, 
    width: 8, 
    marginTop: 3
  },
  item: {
    borderColor: '#DAE1EC',
    paddingHorizontal: 10,
    width: deviceWidth / 2 - 27,
    borderWidth: 1,
    borderRadius: 15,
    marginTop: 15,
  },
  filter: {
    height: 24, 
    width: 24, 
    marginTop: 3
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#888',
    borderBottomLeftRadius: 10,
    borderTopLeftRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 7,
    width: deviceWidth - 120,
  },
  searchBtn: {
    backgroundColor: '#000',
    padding: 11,
    borderTopRightRadius: 15,
    borderBottomRightRadius: 15,
  },
  searchImg: {
    height: 20,
    width: 20,
    marginTop: 3,
    tintColor: '#fff',
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
    marginBottom: 10,
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
  },
  sortOverlay: {
    height: deviceHeight - 70,
    zIndex: 9999,
    backgroundColor: 'rgba(255,255,255, 0.8)',
    position: 'absolute',
    top: 70,
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

export default SearchScreen;
