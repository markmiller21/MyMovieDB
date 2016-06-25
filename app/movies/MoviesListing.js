import React, { Component } from 'react';
import {
  StyleSheet,
  ListView,
  TouchableHighlight,
  Navigator,
  Image,
  Text,
  View,
  TextInput,
} from 'react-native'
import MovieDetail from './movieDetail';


const API_KEY = '3fd73edeff6cbd709b8a3f2f0ae16aff';
const POSTER_PATH = 'https://image.tmdb.org/t/p/w154';
const SINGLE_REQUEST_URL = `http://api.themoviedb.org/3/movie/550?api_key=${API_KEY}`
const FULL_REQUEST_URL = `http://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}`

class MoviesListing extends Component {
  constructor(props) {
    super(props);
    this.state = {
      movies: null,
      dataSource: new ListView.DataSource({
        rowHasChanged: (r1, r2) => r1 !== r2
      }),
    }
  }

  componentDidMount() {
    this.fetchData();
  }

  fetchData() {
    fetch(FULL_REQUEST_URL)
      .then((response) => response.json())
      .then((responseData) => {
        this.setState({
          dataSource: this.state.dataSource.cloneWithRows(responseData.results),
          movies: responseData.results,
        });
      });
  }

  // https://www.npmjs.com/package/react-native-simple-router
  nextPage(movie) {
  	this.props.toRoute({
  		name: movie.title,
  		component: MovieDetail,
      data: movie,
      sceneConfig: Navigator.SceneConfigs.HorizontalSwipeJump, //Point this swipe feature out https://www.npmjs.com/package/react-native-simple-router
	  	})
  }

  render() {
    if (!this.state.movies) {
      return (
        <View>
          <Text>Loading...</Text>
            
        </View>
      )
    }
    return (
    	<ListView dataSource={this.state.dataSource}
      	renderRow={this.renderSingleMovie.bind(this)}/>
    );
  }

  renderSingleMovie(movie) {
    return (
      <TouchableHighlight onPress={this.nextPage.bind(this, movie)}>
        <View style={styles.container}>
          <Image style={styles.thumbnail} 
            source={{uri: POSTER_PATH + movie.poster_path}} />
          <View style={styles.listData}>
            <Text>{movie.title}</Text>
            <Text>{movie.release_date}</Text>
          </View>
          <TextInput
              style={{
                height: 43, 
                width: 69,
                borderWidth: 1,
                borderColor: "rgba(0,0,0,0.5)",
              }}
              placeholder={'Type here'}
              placeholderTextColor={"rgba(198,198,204,1)"}
              onChangeText={(text) => {this.setState({text})}}
              onSubmitEditing={() => {this.setState({text: ''})}}
              value={(this.state && this.state.text) || ''}
            />
        </View>
      </TouchableHighlight>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  thumbnail: {
    height: 80,
    width: 40,
  },
  listData: {
    marginLeft: 20,
    flex: 1,
  }
});

module.exports = MoviesListing;