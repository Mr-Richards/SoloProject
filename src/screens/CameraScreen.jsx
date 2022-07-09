import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Camera, CameraType } from 'expo-camera';
import FlipButton from '../components/FlipButton';
import CaptureButton from '../components/CaptureButton';
import { Auth } from 'aws-amplify';

export default function cameraScreen({ setPhoto, setUser, user }) {
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [type, setType] = useState(CameraType.back);
  const [cameraRef, setCameraRef] = useState(useRef());

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasCameraPermission(status === 'granted');
    })();
  }, []);

  if (hasCameraPermission === null) {
    return <View />;
  }
  if (hasCameraPermission === false) {
    return <Text>Please allow access to camera in settings</Text>;
  }
  const signOut = () => {
    Auth.signOut();
    setUser(false);
  };

  const signIn = () => {
    Auth.signOut();
    setUser(false);
  };

  return (
    <Camera style={styles.camera} type={type} autoFocus="on" ref={cameraRef}>
      {user === 'guest' ? (
        <Text
          onPress={signIn}
          style={{
            color: 'red',
            marginVertical: 60,
            marginHorizontal: 20,
            fontSize: 20,
          }}
        >
          Sign In
        </Text>
      ) : (
        <Text
          onPress={signOut}
          style={{
            color: 'red',
            marginVertical: 60,
            marginHorizontal: 20,
            fontSize: 20,
          }}
        >
          Sign Out
        </Text>
      )}
      <View style={styles.buttonContainer}>
        <FlipButton setType={setType}></FlipButton>
        <CaptureButton
          setPhoto={setPhoto}
          cameraRef={cameraRef}
        ></CaptureButton>
      </View>
    </Camera>
  );
}

const styles = StyleSheet.create({
  camera: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  buttonContainer: {
    flex: 0.1,
    width: '59%',
    flexDirection: 'row',
    backgroundColor: 'transparent',
    margin: '5%',
    marginRight: '36%',
  },
});