import React, {
	useState,
	useEffect,
} from 'react';
import {
	View,
	Text,
	Image,
	StyleSheet,
	ActivityIndicator,
	SafeAreaView,
	ScrollView,
	Dimensions,
} from 'react-native';
import axios from 'axios';
import Icon from 'react-native-vector-icons/FontAwesome';

const { width } = Dimensions.get('window');

const API_KEY =
	'043c6f3cb3d6dddeb563f509df3f5a4f';
const BASE_URL = 'https://api.themoviedb.org/3';

const MovieDetailScreen = ({ route }) => {
	const { movieId } = route.params;
	const [movie, setMovie] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const fetchMovieDetails = async () => {
			setLoading(true);
			setError(null);
			try {
				const movieResponse = await axios.get(
					`${BASE_URL}/movie/${movieId}`,
					{
						params: {
							api_key: API_KEY,
							language: 'en-US',
						},
					}
				);
				setMovie(movieResponse.data);
			} catch (err) {
				setError('Failed to load movie details');
			} finally {
				setLoading(false);
			}
		};

		fetchMovieDetails();
	}, [movieId]);

	const renderStars = (rating) => {
		const starCount = Math.round(rating / 2);
		return Array(5)
			.fill()
			.map((_, index) => (
				<Icon
					key={index}
					name={
						index < starCount ? 'star' : 'star-o'
					}
					size={16}
					color='#FFD700'
					style={{ marginRight: 2 }}
				/>
			));
	};

	if (loading) {
		return (
			<View style={styles.loader}>
				<ActivityIndicator
					size='large'
					color='#0000ff'
				/>
			</View>
		);
	}

	if (error) {
		return (
			<Text style={styles.errorText}>
				{error}
			</Text>
		);
	}

	return (
		<SafeAreaView style={styles.container}>
			<ScrollView>
				{movie && (
					<>
						<Image
							source={{
								uri: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
							}}
							style={styles.poster}
						/>
						<View style={styles.contentContainer}>
							<Text style={styles.title}>
								{movie.title}
							</Text>
							<View
								style={styles.ratingContainer}
							>
								<Text style={styles.ratingText}>
									{Math.round(
										movie.vote_average * 10
									) / 10}
								</Text>
								<View
									style={styles.starsContainer}
								>
									{renderStars(
										movie.vote_average
									)}
								</View>
							</View>
							<Text style={styles.description}>
								{movie.overview}
							</Text>
							<Text style={styles.releaseDate}>
								Release Date: {movie.release_date}
							</Text>
						</View>
					</>
				)}
			</ScrollView>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#f0f2f5',
	},
	poster: {
		width: width,
		height: width * 1.5,
		resizeMode: 'cover',
	},
	contentContainer: {
		padding: 20,
		backgroundColor: 'white',
		borderTopLeftRadius: 20,
		borderTopRightRadius: 20,
		marginTop: -20,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: -2 },
		shadowOpacity: 0.1,
		shadowRadius: 10,
		elevation: 5,
	},
	title: {
		fontSize: 28,
		fontWeight: 'bold',
		color: '#3498db',
		marginBottom: 10,
		textShadowColor: 'rgba(0, 0, 0, 0.1)',
		textShadowOffset: { width: 1, height: 1 },
		textShadowRadius: 2,
	},
	ratingContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		marginBottom: 15,
		backgroundColor: '#f9f9f9',
		padding: 10,
		borderRadius: 10,
	},
	ratingText: {
		fontSize: 24,
		fontWeight: 'bold',
		color: '#2ecc71',
		marginRight: 10,
	},
	starsContainer: {
		flexDirection: 'row',
	},
	description: {
		fontSize: 16,
		color: '#4a4a4a',
		lineHeight: 24,
		marginBottom: 20,
	},
	releaseDate: {
		fontSize: 14,
		color: '#7f8c8d',
		fontStyle: 'italic',
	},
	loader: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#f0f2f5',
	},
	errorText: {
		color: '#e63946',
		textAlign: 'center',
		marginVertical: 16,
		fontSize: 16,
		fontWeight: '500',
	},
});

export default MovieDetailScreen;
