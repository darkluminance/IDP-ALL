import { StatusBar } from 'expo-status-bar';
import {
	StyleSheet,
	Text,
	View,
	Image,
	SafeAreaView,
	Button,
	TouchableHighlight,
	TouchableOpacity,
} from 'react-native';
import Pressable from 'react-native/Libraries/Components/Pressable/Pressable';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';

export default function HomePage({ navigation, route }) {
	// const [image, setImage] = useState(null);
	// const URL = 'http://192.168.0.15:6969/';
	const username = '';
	try {
		username = route.params.username;
	} catch (error) {}

	const pickImage = async () => {
		// No permissions request is necessary for launching the image library
		let result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.All,
			allowsEditing: true,
			aspect: [1, 1],
			quality: 1,
		});

		if (result.uri) {
			navigation.navigate('Image', { imagepath: result.uri, image: result });
		}
	};

	const takeImage = async () => {
		// No permissions request is necessary for launching the image library
		let result = await ImagePicker.launchCameraAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.All,
			allowsEditing: true,
			aspect: [1, 1],
			quality: 1,
		});

		if (result.uri) {
			navigation.navigate('Image', { imagepath: result.uri, image: result });
		}
	};

	//Main app stuff
	return (
		<SafeAreaView style={styles.container}>
			<StatusBar style="auto" />
			<Text style={styles.title}>Welcome {username ? username : ''}</Text>

			<View>
				<Image
					style={{ width: 128, height: 128 }}
					fadeDuration={1000}
					source={require('../assets/robot.png')}
				/>
			</View>

			<View style={{ marginTop: '30%' }}>
				<TouchableOpacity
					style={styles.buttons}
					onPress={() => {
						pickImage();
					}}
				>
					<Text style={styles.buttontext}>Upload Image</Text>
				</TouchableOpacity>
				<TouchableOpacity
					style={styles.buttons}
					onPress={() => {
						takeImage();
					}}
				>
					<Text style={styles.buttontext}>Scan from Phone</Text>
				</TouchableOpacity>
				{/* <TouchableOpacity style={styles.buttons} onPress={() => {}}>
					<Text style={styles.buttontext}>Scan from Robot</Text>
				</TouchableOpacity> */}
			</View>

			<TouchableOpacity
				style={[
					{
						position: 'absolute',
						top: '10%',
						right: '10%',
						width: 50,
						height: 50,
						borderRadius: 100,
						// backgroundColor: 'lightblue',
					},
				]}
				onPress={() => {
					navigation.navigate('History');
				}}
			>
				<Image
					style={{ width: 50, height: 50 }}
					source={require('../assets/history.png')}
				></Image>
			</TouchableOpacity>
		</SafeAreaView>

		// <View style={styles.container}>
		// 	<Camera style={styles.camera} type={type}></Camera>
		// </View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#eee',
		alignItems: 'center',
		paddingLeft: '5%',
		paddingRight: '5%',
	},

	camera: {
		height: '100%',
		width: '100%',
	},

	title: {
		fontSize: 35,
		textAlign: 'center',
		fontWeight: 'bold',
		color: '#696969',
		marginTop: '50%',
		marginBottom: '10%',
	},

	buttons: {
		alignItems: 'center',
		justifyContent: 'center',
		width: 300,
		height: 50,
		borderRadius: 100,
		backgroundColor: '#0984e3',
		marginTop: '8%',
	},

	buttontext: {
		fontSize: 16,
		lineHeight: 21,
		fontWeight: 'bold',
		letterSpacing: 0.25,
		color: 'white',
	},
});
