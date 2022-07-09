import React, { useState, useEffect, View } from 'react';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import { SignInScreen } from './src/screens/SignInScreen';
import { SignUpScreen } from './src/screens/SignUpScreen';
import { ConfirmEmailScreen } from './src/screens/ConfirmEmailScreen';
import { ForgotPasswordScreen } from './src/screens/ForgotPasswordScreen';
import { NewPasswordScreen } from './src/screens/NewPasswordScreen';
import CameraScreen from './src/screens/CameraScreen';
import { Translate } from './src/screens/Translate';
import { PreviousTranslations } from './src/screens/PreviousTranslations';

import Amplify, { Auth, Hub } from 'aws-amplify';
import awsconfig from './src/aws-exports';

Amplify.configure(awsconfig);

const Stack = createStackNavigator();

const App = () => {
  const [photo, setPhoto] = useState();
  const [user, setUser] = useState(undefined);
  const [userId, setUserId] = useState(undefined);

  const checkUser = async () => {
    try {
      const authUser = await Auth.currentAuthenticatedUser({
        bypassCache: true,
      });
      setUser(authUser);
    } catch {
      setUser(null);
    }
  };

  useEffect(() => {
    checkUser();
  }, []);

  useEffect(() => {
    const listener = (data) => {
      if (data.payload.event === 'signIn' || data.payload.event === 'signOut') {
        checkUser();
      }
    };
    Hub.listen('auth', listener);
    return () => Hub.remove('auth', listener);
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
          <>
            <Stack.Screen name="CameraScreen">
              {() => (
                <CameraScreen
                  user={user}
                  setUser={setUser}
                  setPhoto={setPhoto}
                />
              )}
            </Stack.Screen>
            <Stack.Screen
              screenOptions={{ headerShown: true }}
              name="Translation"
            >
              {() => (
                <Translate
                  photo={photo}
                  userId={userId}
                  setUser={setUser}
                  user={user}
                />
              )}
            </Stack.Screen>
            <Stack.Screen name="PreviousTranslations">
              {() => <PreviousTranslations />}
            </Stack.Screen>
          </>
        ) : (
          <>
            <Stack.Screen name="SignIn">
              {() => <SignInScreen setUserId={setUserId} setUser={setUser} />}
            </Stack.Screen>
            <Stack.Screen name="SignUp">{() => <SignUpScreen />}</Stack.Screen>
            <Stack.Screen name="ConfirmEmail">
              {() => <ConfirmEmailScreen />}
            </Stack.Screen>
            <Stack.Screen name="ForgotPassword">
              {() => <ForgotPasswordScreen />}
            </Stack.Screen>
            <Stack.Screen name="NewPassword">
              {() => <NewPasswordScreen />}
            </Stack.Screen>
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;