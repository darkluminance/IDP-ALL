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
import { Dimensions } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
import client from '../api/client';
import axios from 'axios';
import FormData from 'form-data';
import Apploader from './Apploader';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default function ShowDrawing({ navigation, route }) {
	const Path = route.params.imagepath;
	console.log(Path);
	let uriPath = null;
	const [load, setload] = useState(false); //Whether the image is being uploaded and processed

	const takeImage = async () => {
		// No permissions request is necessary for launching the image library
		let result = await ImagePicker.launchCameraAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.All,
			allowsEditing: true,
			aspect: [1, 1],
			quality: 1,
		});

		if (result.uri) {
			// navigation.navigate('Image', { imagepath: result.uri, image: result });
			upload(result);
		}
	};

	//Uploading into the server function
	//Create a formdata and insert the image into it
	//Then send the formdata to the server
	async function upload(ur) {
		let formData = new FormData();
		console.log(ur);
		console.log(Path);
		uriPath = ur.uri;

		let pic = {
			uri: ur.uri,
			type: 'image/jpg',
			name: ur.fileName || ur.uri.substr(ur.uri.lastIndexOf('/') + 1),
		};

		formData.append('image', pic);

		console.log(formData);

		//
		//
		//axios

		//Send the data to the server
		client
			.post('accuracy/?nem=' + Path, formData, {
				headers: {
					Accept: 'application/json',
					'Content-Type': 'multipart/form-data', //Must for sending a formdata
				},
			})
			.then((response) => {
				console.log(response.data);
				setload(false);
				navigation.navigate('DrawingAccuracy', {
					// imagepath: response.data[0],
					// imagename: response.data[1],
					accuracy: response.data,
					imagePath: uriPath,
				});
			})
			.catch((error) => {
				// alert(error);
				console.log('ERROR ' + error.message);
			});

		//
		//
		//Fetch api data
		// const config = {
		// 	method: 'POST',
		// 	headers: {
		// 		Accept: 'application/json',
		// 		'Content-Type':
		// 			'multipart/form-data; boundary=6ff46e0b6b5148d984f148b6542e5a5d',
		// 	},
		// 	body: formData,
		// };
		// fetch(URL + 'tolineart', config)
		// 	.then((response) => {
		// 		console.log('succeeded!');
		// 	})
		// 	.catch((error) => {
		// 		alert(error);
		// 		console.log(error.message);
		// 	});
	}
	return (
		<SafeAreaView style={styles.container}>
			<StatusBar style="auto" />
			{/* <View>
				<Image
					style={{
						width: windowWidth,
						height: windowHeight / 1.75,
					}}
					fadeDuration={1000}
					source={require('../assets/sketch.png')}
					// source={{
					// 	uri: ImagePath,
					// }}
				/>
			</View> */}

			<View style={{ marginTop: '95%' }}>
				<TouchableOpacity
					style={styles.buttons}
					onPress={() => {
						// navigation.navigate('DrawingAccuracy');
						takeImage();
						setload(true);
					}}
				>
					<Text style={styles.buttontext}>Scan your Drawing</Text>
				</TouchableOpacity>
				<TouchableOpacity
					style={styles.backbutton}
					onPress={() => {
						navigation.goBack();
					}}
				>
					<Text style={styles.backbuttontext}>Go Back</Text>
				</TouchableOpacity>
			</View>

			{load ? <Apploader></Apploader> : null}
		</SafeAreaView>
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

	buttons: {
		alignItems: 'center',
		justifyContent: 'center',
		width: 300,
		height: 50,
		borderRadius: 100,
		backgroundColor: '#0984e3',
		marginTop: '8%',
	},

	backbutton: {
		alignItems: 'center',
		justifyContent: 'center',
		width: 300,
		height: 50,
		borderRadius: 100,
		backgroundColor: '#eee',
		marginTop: '8%',
		borderColor: '#0984e3',
		borderWidth: 2,
	},

	buttontext: {
		fontSize: 16,
		lineHeight: 21,
		fontWeight: 'bold',
		letterSpacing: 0.25,
		color: 'white',
	},

	backbuttontext: {
		fontSize: 16,
		lineHeight: 21,
		fontWeight: 'bold',
		letterSpacing: 0.25,
		color: '#0984e3',
	},
});
