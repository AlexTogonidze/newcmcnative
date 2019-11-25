import React from 'react';
import {StatusBar} from 'react-native';
import { ApolloProvider } from 'react-apollo-hooks';
import { createAppContainer,  } from "react-navigation";
import { createStackNavigator} from 'react-navigation-stack';
import { useTranslation, withTranslation, WithTranslation, Trans } from 'react-i18next';
import client from './Network'
import i18n from './i18n/i18n';

import LoginScreen from './screens/Login';
import StatusScreen from './screens/StatusScreen';
import SearchScreen from './screens/SearchScreen';
import InitialScreen from './screens/InitialScreen';
import PassRecovery from './screens/RecoverPassword';
import ProfileScreen from './screens/profile/ProfileScreen';
import ChangePassword from './screens/profile/ChangePassword';
import SignUp from './screens/profile/SignUp';
import SingleProject from './screens/Projects/SingleProject';
import ProjectIssues from './screens/Projects/ProjectIssues';
import Schedule from './screens/Projects/Schedule';
import TabNavigator from './screens/TabNavigator';
import Budget from './screens/Projects/Budget';
import ProjectList from './screens/Projects/ProjectList';
import BlockEditor from './screens/Projects/BlockEditor';
import SatisfactionScreen from './screens/Projects/ClientSatisfaction';
import CMCValueScreen from './screens/Projects/CMCValue';


const AppNavigator = createStackNavigator(
  {
    Initial: InitialScreen,
    Home: SearchScreen,
    Login: LoginScreen,
    PassRecovery: PassRecovery,
    Profile: ProfileScreen,
    ChangePassword: ChangePassword,
    SignUp: SignUp,
    SingleProject: SingleProject,
    ProjectList: ProjectList,
    Schedule: Schedule,
    Budget: Budget,
    ProjectIssues: ProjectIssues,
    StatusScreen: StatusScreen,
    TabNavigator: TabNavigator,
    BlockEditor: BlockEditor,
    SatisfactionScreen: SatisfactionScreen,
    CMCValueScreen: CMCValueScreen
  },
  {
    initialRouteName: "Login",
    cardStyle: {
      backgroundColor: '#fff'
    },
    headerMode: 'none'
  },
);

interface NavWithTranslations extends WithTranslation {
  navigation: {}
}

const navigationPersistenceKey = __DEV__ ? "NavigationStateDEV" : null;

class CustomNavigator extends React.Component<NavWithTranslations> {
  static router = AppNavigator.router;
  render() {
    const { navigation, t, i18n } = this.props;
    return <AppNavigator persistenceKey={navigationPersistenceKey} navigation={navigation} screenProps={{ t, i18n }} />;
  }
}

var App = createAppContainer(CustomNavigator);
const TranslatedApp = withTranslation()(App);

const AppRoot = () => (
  <ApolloProvider client={client}>
    <StatusBar backgroundColor="black" barStyle="light-content" />
    <TranslatedApp i18n={i18n} />
  </ApolloProvider>
);

export default AppRoot