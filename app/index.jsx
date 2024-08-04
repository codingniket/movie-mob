import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import MovieListScreen from './../screens/MovieListScreen';
import MovieDetailScreen from './../screens/MovieDetailScreen';

const Stack = createStackNavigator();

function index() {
	return (
		<NavigationContainer independent={true}>
			<Stack.Navigator initialRouteName='Movies'>
				<Stack.Screen
					name='MovieList'
					component={MovieListScreen}
				/>
				<Stack.Screen
					name='MovieDetailScreen'
					component={MovieDetailScreen}
				/>
			</Stack.Navigator>
		</NavigationContainer>
	);
}

export default index;
