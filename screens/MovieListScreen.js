import React, {
	useState,
	useEffect,
} from 'react';
import {
	View,
	Text,
	FlatList,
	ActivityIndicator,
	TextInput,
	StyleSheet,
	TouchableOpacity,
	Image,
	Button,
} from 'react-native';
import axios from 'axios';

const API_KEY =
	'043c6f3cb3d6dddeb563f509df3f5a4f';
const BASE_URL =
	'https://api.themoviedb.org/3/movie/now_playing';
const SEARCH_URL =
	'https://api.themoviedb.org/3/search/movie';

const MovieListScreen = ({ navigation }) => {
	const [movies, setMovies] = useState([]);
	const [page, setPage] = useState(1);
	const [searchTerm, setSearchTerm] =
		useState('');
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const [hasMore, setHasMore] = useState(true);

	const fetchMovies = async (
		page,
		searchTerm = ''
	) => {
		setLoading(true);
		setError(null);
		try {
			const url = searchTerm
				? SEARCH_URL
				: BASE_URL;
			const response = await axios.get(url, {
				params: {
					api_key: API_KEY,
					page,
					query: searchTerm,
				},
			});
			const newMovies = response.data.results;

			setHasMore(newMovies.length > 0);

			setMovies((prevMovies) => {
				const existingIds = new Set(
					prevMovies.map((movie) => movie.id)
				);
				const filteredNewMovies =
					newMovies.filter(
						(movie) => !existingIds.has(movie.id)
					);
				return [
					...prevMovies,
					...filteredNewMovies,
				];
			});
		} catch (err) {
			setError('Failed to load movies');
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchMovies(page, searchTerm);
	}, [page, searchTerm]);

	const handleSearch = () => {
		setMovies([]);
		setPage(1);
		fetchMovies(1, searchTerm);
	};

	const loadMore = () => {
		if (!loading && hasMore) {
			setPage((prevPage) => prevPage + 1);
		}
	};

	return (
		<View style={styles.container}>
			<TextInput
				style={styles.searchInput}
				placeholder='Search for movies...'
				value={searchTerm}
				onChangeText={(text) =>
					setSearchTerm(text)
				}
			/>
			<Button
				title='Search'
				onPress={handleSearch}
				color='#007BFF'
			/>
			{error && (
				<Text style={styles.errorText}>
					{error}
				</Text>
			)}
			<FlatList
				data={movies}
				keyExtractor={(item) =>
					item.id.toString()
				}
				renderItem={({ item }) => (
					<TouchableOpacity
						onPress={() =>
							navigation.navigate(
								'MovieDetailScreen',
								{
									movieId: item.id,
								}
							)
						}
					>
						<View style={styles.movieItem}>
							<Image
								source={{
									uri: `https://image.tmdb.org/t/p/w500${item.poster_path}`,
								}}
								style={styles.poster}
							/>
							<Text style={styles.movieTitle}>
								{item.title}
							</Text>
						</View>
					</TouchableOpacity>
				)}
				ListFooterComponent={
					hasMore ? (
						<View
							style={styles.loadMoreContainer}
						>
							{loading ? (
								<ActivityIndicator size='large' />
							) : (
								<Button
									title='Load More'
									onPress={loadMore}
									color='#007BFF'
								/>
							)}
						</View>
					) : (
						<Text style={styles.noMoreText}>
							No more movies to load
						</Text>
					)
				}
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 16,
	},
	searchInput: {
		height: 40,
		borderColor: '#ccc',
		borderWidth: 1,
		borderRadius: 5,
		paddingHorizontal: 8,
		marginBottom: 16,
	},
	movieItem: {
		flexDirection: 'row',
		alignItems: 'center',
		padding: 16,
		borderBottomWidth: 1,
		borderBottomColor: '#ccc',
	},
	poster: {
		width: 100,
		height: 150,
		borderRadius: 5,
		marginRight: 16,
	},
	movieTitle: {
		fontSize: 18,
		flex: 1,
	},
	errorText: {
		color: 'red',
		textAlign: 'center',
		marginBottom: 16,
	},
	loadMoreContainer: {
		padding: 16,
		alignItems: 'center',
	},
	noMoreText: {
		textAlign: 'center',
		padding: 16,
	},
});

export default MovieListScreen;
