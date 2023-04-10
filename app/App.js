import HomePage from './Components/HomePage';
import ShowImage from './Components/ShowImage';
import ShowLineArt from './Components/ShowLineArt';
import ShowDot from './Components/ShowDot';
import ShowDrawing from './Components/ShowDrawing';
import ShowDrawingAccuracy from './Components/ShowDrawingAccuracy';
import FinalAccuracy from './Components/FinalAccuracy';
import LoginPage from './Components/LoginPage';

import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Provider } from 'react-redux';
import { Store } from './redux/store';
import History from './Components/History';

const Stack = createNativeStackNavigator();

export default function App() {
	return (
		<Provider store={Store}>
			<NavigationContainer>
				<Stack.Navigator
					initialRouteName="Home"
					screenOptions={{
						headerShown: false,
					}}
				>
					<Stack.Screen name="Login" component={LoginPage} />
					<Stack.Screen name="Home" component={HomePage} />
					<Stack.Screen name="Image" component={ShowImage} />
					<Stack.Screen name="LineArt" component={ShowLineArt} />
					<Stack.Screen name="Dot" component={ShowDot} />
					<Stack.Screen name="Drawing" component={ShowDrawing} />
					<Stack.Screen
						name="DrawingAccuracy"
						component={ShowDrawingAccuracy}
					/>
					<Stack.Screen name="FinalAccuracy" component={FinalAccuracy} />
					<Stack.Screen name="History" component={History} />
				</Stack.Navigator>
			</NavigationContainer>
		</Provider>
	);
}
