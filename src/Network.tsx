import { InMemoryCache, defaultDataIdFromObject  } from 'apollo-cache-inmemory';
import { ApolloLink } from 'apollo-link';
import { HttpLink } from 'apollo-link-http';
import AsyncStorage from '@react-native-community/async-storage';
import { ApolloClient } from 'apollo-client';
import { onError } from "apollo-link-error";
import { RestLink } from 'apollo-link-rest';
import { setContext } from 'apollo-link-context';
import gql from "graphql-tag";
import { APIBaseUrl } from './globalconfig';
import { Alert } from 'react-native';


// This is the same cache you pass into new ApolloClient
const cache = new InMemoryCache();


const data = {
  sessionInfo: {
    __typename: 'SessionInfo',
    isLoggedIn: false,
    accessToken: ''
  }
}

cache.writeData({ data });

const GET_SESSION_TOKENS = gql`
query SessionInfoQuery {
    sessionInfo @client {
        isLoggedIn
        accessToken
    }
}`;


const authLink = setContext((_, { headers }) => {
  const resp = cache.readQuery<GetLoginResponse>({
    query: GET_SESSION_TOKENS
  });

  if (resp && resp.sessionInfo && resp.sessionInfo.isLoggedIn) {

    return {
      headers: {
        ...headers,
        "Access-Token": resp.sessionInfo.accessToken
      }
    }
  }

  return headers
});

const restLink = new RestLink(
  {
    uri: APIBaseUrl,
    customFetch: async (request: RequestInfo, init: RequestInit) => {
      console.log("RestLink - Request", request, init);
      var resp = await fetch(request, init);

      var contentTypeHeader = resp.headers.get('content-type');
      if (resp.ok &&
        contentTypeHeader &&
        contentTypeHeader.includes('application/json')) {
        var jsonData = await resp.clone().json();
        console.log("RestLink - Response JsonData: ", resp.headers, jsonData);
      } else {
        var textData = await resp.clone().text();
        console.log("RestLink - Response TextData: ", resp.headers, textData);
      }
      return resp;
    },
  });


var client = new ApolloClient({
  cache,
  resolvers: {
    SessionInfo: {
      isLoggedIn: (launch, _args, { cache }) => {
        debugger;
        console.log('Requesting session Info')
        const resp = cache.readQuery({ query: GET_SESSION_TOKENS });
        console.log('Respondind session info', resp);
        return resp!.sessionInfo;
      }
    },
    Mutation: {
      updateNetworkStatus: (obj: any, args: any, context: any, info: any) => {
        context.cache.writeData({
          data: { isCOnnected: args.isConnected }
        });
        return null;
      },
    },
  },
  link: ApolloLink.from([
    // errorLink,
    authLink,
    restLink,
  ]),
});

client.onResetStore(() => {
  return new Promise(resolve => resolve(
    cache.writeData({ data })
  ));
});

export default client;