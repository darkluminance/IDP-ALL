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
	ActivityIndicator,
	TextInput,
} from 'react-native';
import Pressable from 'react-native/Libraries/Components/Pressable/Pressable';
import { Dimensions } from 'react-native';
import * as Permissions from 'expo-permissions';
import * as MediaLibrary from 'expo-media-library';
import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
import client from '../api/client';
import axios from 'axios';
import FormData from 'form-data';
import Apploader from './Apploader';
import DropDownPicker from 'react-native-dropdown-picker';
import Checkbox from 'expo-checkbox';
import SelectDropdown from 'react-native-select-dropdown';
import { useSelector, useDispatch } from 'react-redux';
import { setHistory } from '../redux/actions';
import AsyncStorage from '@react-native-async-storage/async-storage';

//Getting device dimensions
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default function ShowImage({ navigation, route }) {
	const ImagePath = route.params.imagepath; //Path of the image to the device
	const Img = route.params.image; //The obtained image
	// const _URL = 'http://192.168.0.15:6969/';
	const [load, setload] = useState(false); //Whether the image is being uploaded and processed into the server
	const [showOptions, setOptions] = useState(false); //Show the lineart options or not
	const [isChecked, setChecked] = useState(false); //Is filtering on or off in options

	const [selectedItem, setSelectedItem] = useState(0); // Which option is selected
	const [threshold, setThreshold] = useState(-1);

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

	//Uploading into the server function
	//Create a formdata and insert the image into it
	//Then send the formdata to the server
	async function upload() {
		let formData = new FormData();

		let pic = {
			uri: Img.uri,
			type: 'image/jpg',
			name: Img.fileName || ImagePath.substr(ImagePath.lastIndexOf('/') + 1),
		};

		formData.append('image', pic);

		// console.log(formData);

		//
		//
		//axios
		setOptions(false);
		setload(true); //Start showing the loading animation

		//Send the data to the server
		client
			.post('tolineart/' + selectedItem + '/' + threshold, formData, {
				headers: {
					Accept: 'application/json',
					'Content-Type': 'multipart/form-data', //Must for sending a formdata
				},
			})
			.then((response) => {
				// alert('Success!');
				// console.log(response.data);
				// let ret = fetchImage(_URL + '/images/' + response.data);
				// console.log(ret);
				// let link = response.data + '.png';
				setload(false); //Image returned so no need for animation

				let aa = history.history;
				let dt = new Date().toLocaleString();

				let obj = {
					type: 'Lineart',
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
				// console.log(response.data);

				navigation.navigate('LineArt', {
					imagepath: response.data[0],
					imagename: response.data[1],
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
					source={{ uri: ImagePath }}
				/>
			</View>

			<View style={{ marginTop: '40%' }}>
				<TouchableOpacity
					style={styles.buttons}
					onPress={() => {
						setOptions(true);
					}}
				>
					<Text style={styles.buttontext}>Create and Show Lineart</Text>
				</TouchableOpacity>
				<TouchableOpacity
					style={styles.backbutton}
					onPress={() => {
						navigation.navigate('Home');
					}}
				>
					<Text style={styles.backbuttontext}>Go Home</Text>
				</TouchableOpacity>
			</View>

			{showOptions ? (
				<View
					style={[
						StyleSheet.absoluteFillObject,
						{
							justifyContent: 'center',
							alignItems: 'center',
							backgroundColor: 'rgba(0,0,0,0.5)',
							zIndex: 100,
						},
					]}
				>
					<View
						style={{
							width: '80%',
							height: '38%',
							backgroundColor: 'white',
							borderRadius: 20,
							padding: 20,
						}}
					>
						<View
							style={{
								flexDirection: 'row',
								justifyContent: 'space-between',
							}}
						>
							<Text
								style={[
									styles.backbuttontext,
									{
										fontSize: 20,
										color: 'rgb(69,69,69)',
										fontWeight: 'bold',
									},
								]}
							>
								Set options
							</Text>
							<TouchableOpacity
								style={[
									{
										width: 30,
										height: 30,
										backgroundColor: '#ff7675',
										borderRadius: 100,
										alignItems: 'center',
										justifyContent: 'center',
										marginTop: -8,
									},
								]}
								onPress={() => setOptions(false)}
							>
								{/* <Text style={styles.buttontext}>X</Text> */}
							</TouchableOpacity>
						</View>
						<View
							style={[
								{
									alignItems: 'center',
								},
							]}
						>
							<View
								style={[
									{
										padding: 20,
									},
								]}
							>
								<Text
									style={[
										{
											marginBottom: 15,
											marginLeft: -10,
											fontWeight: 'bold',
										},
									]}
								>
									Lineart method (Select to change)
								</Text>
								{/* <DropDownPicker
									items={[
										{ label: 'Blur Inversion', value: 0 },
										{ label: 'Adaptive Mean Threshold', value: 1 },
										{ label: 'Canny Edge Detection', value: 2 },
									]}
									defaultIndex={0}
									containerStyle={{ height: 40 }}
									onChangeItem={(item) => console.log(item.label, item.value)}
								/> */}
								<SelectDropdown
									data={[
										'Blur Inversion',
										'Adaptive Mean Threshold',
										'Canny Edge Detection',
									]}
									onSelect={(selectedItem, index) => {
										setSelectedItem(index);
									}}
									defaultValueByIndex={0}
									buttonStyle={{
										width: 250,
									}}
								></SelectDropdown>
							</View>
							<View
								style={[
									isChecked
										? {
												flexDirection: 'row',
												marginLeft: -5,
												marginTop: 20,
												marginBottom: 20,
										  }
										: {
												flexDirection: 'row',
												marginLeft: -130,
												marginTop: 20,
												marginBottom: 20,
										  },
								]}
							>
								<View
									style={[
										{
											flexDirection: 'row',
											marginRight: 30,
										},
									]}
								>
									<Text
										style={[
											{
												fontWeight: 'bold',
											},
										]}
									>
										Filtering
									</Text>
									<Checkbox
										style={styles.checkbox}
										value={isChecked}
										onValueChange={(val) => {
											setChecked(val);

											if (val) setThreshold(100);
											else setThreshold(-1);
										}}
										color={isChecked ? '#4630EB' : undefined}
									/>
								</View>
								{isChecked ? (
									<View
										style={[
											{
												flexDirection: 'row',
											},
										]}
									>
										<Text
											style={[
												{
													fontWeight: 'bold',
													marginRight: 15,
												},
											]}
										>
											Threshold
										</Text>
										<SelectDropdown
											data={[10, 50, 80, 100, 150, 180, 200, 220]}
											onSelect={(selectedItem, index) => {
												// console.log(selectedItem);
												setThreshold(selectedItem);
											}}
											defaultValue={100}
											buttonStyle={{
												width: 65,
												height: 35,
												marginTop: -8,
											}}
										></SelectDropdown>
									</View>
								) : null}
							</View>
							<TouchableOpacity
								style={[
									styles.buttons,
									{
										width: 180,
										height: 38,
									},
								]}
								onPress={() => {
									if (!isChecked) {
										setThreshold(-1);
									} else setThreshold(threshold);
									console.log(selectedItem, threshold);
									upload();
								}}
							>
								<Text style={styles.buttontext}>Let's go</Text>
							</TouchableOpacity>
						</View>
					</View>
				</View>
			) : null}

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

	checkbox: {
		// margin: 8,
		marginLeft: 15,
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

	loader: {
		position: 'absolute',
		zIndex: 1000,
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		width: '100%',
		height: '100%',
	},
});
