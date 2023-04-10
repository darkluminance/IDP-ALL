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
	TextInput,
} from 'react-native';
import Pressable from 'react-native/Libraries/Components/Pressable/Pressable';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setHistory } from '../redux/actions';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LoginPage({ navigation }) {
	//Main app stuff
	const [text, onChangeText] = useState('');
	const [pass, onChangePassText] = useState('');

	const history = useSelector((state) => state.userReducer);
	const dispatch = useDispatch();

	let _retrieveData = async () => {
		try {
			const value = await AsyncStorage.getItem('@History');
			let hehehe = value != null ? JSON.parse(value) : null;
			// console.log('hehehehee', hehehe);
			if (hehehe)
				hehehe.forEach((element) => {
					if (element) dispatch(setHistory(element));
				});
			// console.log(history.history);
			// const ret = await AsyncStorage.removeItem('@History');
		} catch (error) {
			// Error retrieving data
			console.log(error);
		}
	};

	useEffect(() => {
		// console.log('here');
		_retrieveData();
	}, []);

	return (
		<SafeAreaView style={styles.container}>
			<StatusBar style="auto" />
			<Text
				style={[
					{
						fontSize: 25,
						textAlign: 'center',
						fontWeight: 'bold',
						color: '#696969',
						marginTop: '40%',
					},
				]}
			>
				Welcome to
			</Text>
			<Text
				style={{
					fontSize: 35,
					textAlign: 'center',
					fontWeight: 'bold',
					color: '#696969',
					marginTop: '5%',
					marginBottom: '10%',
				}}
			>
				Assistant Drawing Robot
			</Text>

			<View>
				<Image
					style={{ width: 128, height: 128 }}
					fadeDuration={1000}
					source={require('../assets/robot.png')}
				/>
			</View>

			<View
				style={{
					marginTop: '20%',
					alignItems: 'center',
					justifyContent: 'center',
				}}
			>
				<TextInput
					style={styles.input}
					onChangeText={onChangeText}
					value={text}
					placeholder={'User Name'}
				/>
				<TextInput
					style={styles.input}
					onChangeText={onChangePassText}
					value={pass}
					placeholder={'Password'}
					type="password"
					secureTextEntry={true}
				/>
				<TouchableOpacity
					style={styles.buttons}
					onPress={() => {
						//takeImage();
						console.log(text, pass);
						navigation.navigate('Home', { username: text });
					}}
				>
					<Text style={styles.buttontext}>Login</Text>
				</TouchableOpacity>
			</View>
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
	input: {
		height: 40,
		width: 300,
		margin: 12,
		borderWidth: 1,
		padding: 10,
	},
});
