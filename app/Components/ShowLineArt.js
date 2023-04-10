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
import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
import { Dimensions } from 'react-native';
import Apploader from './Apploader';
import client from '../api/client';
import { useSelector, useDispatch } from 'react-redux';
import { setHistory } from '../redux/actions';
import AsyncStorage from '@react-native-async-storage/async-storage';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default function ShowLineArt({ navigation, route }) {
	const ImagePath = route.params.imagepath;
	const ImageName = route.params.imagename;
	// console.log(ImageName);
	// const _URL = 'http://df27-110-76-129-227.ngrok.io/';
	// const imgurl = _URL + 'images/' + ImagePath;
	// console.log(imgurl);
	const [load, setload] = useState(false); //Whether the image is being uploaded and processed

	const history = useSelector((state) => state.userReducer);
	const dispatch = useDispatch();

	let _storeData = async (aa) => {
		try {
			await AsyncStorage.setItem('@History', JSON.stringify(aa));
		} catch (error) {
			// Error saving data
			alert(error.message);
		}
	};

	// console.log(history);

	async function startDrawing() {
		setload(true);

		client.get('draw').then((response) => {
			console.log(response.data);

			setload(false); //Image returned so no need for animation

			let aa = history.history;
			let dt = new Date().toLocaleString();

			let obj = {
				type: 'Drawing',
				image: ImagePath,
				time: dt,
			};
			// console.log('aaaa0', aa);

			aa.push(obj);

			// console.log('aaaa', aa);
			_storeData(aa);
			aa = obj;
			// console.log('aaaa2', aa);
			dispatch(setHistory(aa));
			// console.log('aaaa3', history.history);
		});
		navigation.navigate('Drawing', {
			imagepath: ImageName,
		});
	}

	async function dotupload() {
		// console.log(formData);

		//
		//
		//axios
		setload(true); //Start showing the loading animation
		console.log(ImageName);

		//Send the data to the server
		client
			.get('todot/', {
				params: {
					name: ImageName,
				},
			})
			.then((response) => {
				// alert('Success!');
				console.log(response.data);
				// let ret = fetchImage(_URL + '/images/' + response.data);
				// console.log(ret);
				// let link = response.data + '.png';
				setload(false); //Image returned so no need for animation

				let aa = history.history;
				let dt = new Date().toLocaleString();

				let obj = {
					type: 'Dots',
					image: ImagePath,
					time: dt,
				};
				// console.log('aaaa0', aa);

				aa.push(obj);

				// console.log('aaaa', aa);
				_storeData(aa);
				aa = obj;
				// console.log('aaaa2', aa);
				dispatch(setHistory(aa));
				// console.log('aaaa3', history.history);

				navigation.navigate('Dot', {
					imagepath: response.data,
				});
			})
			.catch((error) => {
				alert(error);
				console.log('ERROR ' + error.message);
				setload(false);
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
			<View>
				<Image
					style={{
						width: windowWidth,
						height: windowHeight / (windowHeight / windowWidth),
					}}
					fadeDuration={1000}
					source={{
						uri: ImagePath,
					}}
				/>
			</View>

			<View style={{ marginTop: '40%' }}>
				<TouchableOpacity
					style={styles.buttons}
					onPress={() => {
						startDrawing();
					}}
				>
					<Text style={styles.buttontext}>Start Drawing</Text>
				</TouchableOpacity>
				<TouchableOpacity style={styles.buttons} onPress={dotupload}>
					<Text style={styles.buttontext}>Create and Show Dotted Image</Text>
				</TouchableOpacity>
				{/* <TouchableOpacity
					style={styles.buttons}
					onPress={() => {
						// MediaLibrary.saveToLibraryAsync(ImagePath);
					}}
				>
					<Text style={styles.buttontext}>Save to Device</Text>
				</TouchableOpacity> */}
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
		marginTop: '10%',
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
