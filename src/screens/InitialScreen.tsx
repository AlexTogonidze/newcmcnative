import gql from "graphql-tag";
import React, { useEffect } from 'react';
import { useApolloClient } from 'react-apollo-hooks';
import { StyleSheet, Text, View, Button, ActivityIndicator } from 'react-native';
 

export const IS_LoggedIn_Query = gql`
query SessionInfoQuery {
    sessionInfo {
        isLoggedIn @client
    }
}`;

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
    instructions: {
        textAlign: 'center',
        color: '#333333',
        marginBottom: 5,
    },
});

function InitialScreen(props) {
    const client = useApolloClient();
    async function checkLogin() {
        const { data } = await client.query({
            query: IS_LoggedIn_Query
        });

        if (data.sessionInfo && data.sessionInfo.isLoggedIn) {
            props.navigation.replace('Home');
        } else {
            props.navigation.replace('TabNavigator');
        }
    }

    useEffect(() => {
        checkLogin();
    }, []);

    return (
        <View style={styles.container}>
            <ActivityIndicator size='large' color='#000' />
        </View>
    );
}

export default InitialScreen;