import { StyleSheet, Text, View, FlatList, Image } from 'react-native';

import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setHistory, resetHistory } from '../redux/actions';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function History() {
	const history = useSelector((state) => state.userReducer);
	const dispatch = useDispatch();
	const [dataa, setdataa] = useState([]);

	let _retrieveData = async () => {
		try {
			const value = await AsyncStorage.getItem('@History');
			let hehehe = value != null ? JSON.parse(value) : null;
			// console.log('hehehehee', hehehe);
			if (hehehe) {
				dispatch(resetHistory());
				hehehe.forEach((element, i) => {
					console.log(hehehe, 'heh');
					if (hehehe.includes(element)) {
						hehehe.splice(i, 1);
					} else {
						if (element) dispatch(setHistory(element));
					}
				});
				setdataa(hehehe);
			}
			// console.log(history.history);
			// const ret = await AsyncStorage.removeItem('@History');
		} catch (error) {
			// Error retrieving data
			console.log(error);
		}
	};

	useEffect(() => {
		_retrieveData();
	}, []);

	return (
		<View
			style={{
				zIndex: 100000,
				backgroundColor: 'white',
				width: '100%',
				height: '100%',
			}}
		>
			<FlatList
				style={{
					marginTop: '15%',
				}}
				data={dataa}
				renderItem={({ item }) => (
					<View>
						<Image
							source={{
								uri: item.image,
							}}
						></Image>
						<Text style={styles.item}>
							{item.type}: {item.time}
						</Text>
					</View>
				)}
				keyExtractor={(item, index) => index.toString()}
			></FlatList>
		</View>
	);
}

const styles = StyleSheet.create({
	item: {
		padding: 10,
		fontSize: 18,
		height: 44,
	},
});
