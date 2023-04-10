import { StyleSheet, Text, View, Image } from 'react-native';
import React from 'react';
import LottieView from 'lottie-react-native';
import { useState, useEffect, useLayoutEffect, useRef } from 'react';

export default function Apploader() {
	//Animation reference to control it during load
	const animation = useRef(null);

	const PlayAnim = () => {
		animation.current.play(); //Play animation
	};

	//Occurs when everytime the component is loaded
	useEffect(() => {
		if (animation.current) PlayAnim();
	}, []);

	return (
		<View style={[StyleSheet.absoluteFillObject, styles.loadercontainer]}>
			<LottieView
				source={require('../assets/bouncingfruits.json')}
				ref={animation}
				// autoPlay={true}
				speed={1}
				loop
				style={{
					width: '50%',
					height: '50%',
					justifyContent: 'center',
					alignItems: 'center',
					marginBottom: '10%',
				}}
			></LottieView>

			<Text style={styles.title}>Uploading and Processing...</Text>
		</View>
	);
}

const styles = StyleSheet.create({
	loadercontainer: {
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: 'rgba(255,255,255,0.9)',
		zIndex: 1,
	},

	title: {
		fontSize: 18,
		textAlign: 'center',
		fontWeight: 'bold',
		color: '#696969',
		marginTop: '-45%',
		marginBottom: '30%',
	},
});
