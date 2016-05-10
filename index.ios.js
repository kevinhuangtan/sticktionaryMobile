'use strict';
import React, {
  AppRegistry,
  Component,
  Image,
  ListView,
  StyleSheet,
  TouchableHighlight,
  TextInput,
  Text,
  TouchableOpacity,
  NavigatorIOS,
  Button,
  View,
} from 'react-native';

var PARSE_APP_ID = "GmRKUobj8tlt3frniHIjdhJu2Ps9wXrR4hjyHoU2"
var PARSE_JAVASCRIPT_KEY = "fowVweRBZt9qKDusxYFwHOTXnDtDqe8YRIpHoxbm"
var Parse = require('parse/react-native').Parse;
Parse.initialize(PARSE_APP_ID, PARSE_JAVASCRIPT_KEY);
var AudioPlayer = require('react-native-audioplayer');

//play sound
AudioPlayer.play('beep.mp3');

var words = require('./words.json')


function getRandomInt(min, max, indices) {
  var random =  Math.floor(Math.random() * (max - min + 1)) + min;
  while(indices.indexOf(random)!= -1){
    random = Math.floor(Math.random() * (max - min + 1)) + min;
  }
  console.log(random)
  return random
}

class Scene3Categories extends Component{
  constructor(props) {
    super(props);
    this.handlePress = this.handlePress.bind(this);
    this.renderRow = this.renderRow.bind(this);
    this.state = {
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      }),
      categories : [
        {
          'name' : 'Art',
          'url':require('./images/art.png')

        },
        {
          'name' : 'Bathroom',
          'url':require('./images/bathroom.png')
        },
        {
          'name' : 'Bedroom',
          'url':require('./images/bedroom.png')

        },
        {
          'name' : 'Bedroom 2',
          'url':require('./images/bedroom-2.png')

        },
        {
          'name' : 'Closet',
          'url':require('./images/closet.png')

        },
        {
          'name' : 'Dressing Room',
          'url':require('./images/dressing-room.png')

        },
        {
          'name' : 'Entertainment',
          'url':require('./images/entertainment.png')

        },
        {
          'name' : 'Fitness Room',
          'url':require('./images/fitness-room.png')

        },
        {
          'name' : 'Garage',
          'url':require('./images/garage.png')

        },
        {
          'name' : 'House',
          'url':require('./images/house.png')

        },
        {
          'name' : 'Kitchen',
          'url':require('./images/kitchen.png')

        },
        {
          'name' : 'Kitchen 2',
          'url':require('./images/kitchen-2.png')
        },
        {
          'name' : 'Laundry Room',
          'url':require('./images/laundry-room.png')
        },
        {
          'name' : 'Living Room',
          'url':require('./images/living-room.png')
        },
        {
          'name' : 'Music',
          'url':require('./images/music.png')
        },
        {
          'name' : 'Office',
          'url':require('./images/office.png')
        },
        {
          'name' : 'Office 2',
          'url':require('./images/office-2.png')
        },
        {
          'name' : 'Sports',
          'url':require('./images/sports.png')
        },
        {
          'name' : 'Sports 2',
          'url':require('./images/sports-2.png')
        },
        {
          'name' : 'Workshop',
          'url':require('./images/workshop.png')
        },
        {
          'name' : 'Yard',
          'url':require('./images/yard.png')
        }
      ]
    };
  }
  componentDidMount(){
    this.setState({
      dataSource: this.state.dataSource.cloneWithRows(this.state.categories),
    })

  }
  handlePress(c){
    // console.log(c);
    var filteredWords =[];
    this.props.parseWords.map(function(w, i){
      if(w.get("Category") == c.name){
        filteredWords.push(w);
      }
    })
    console.log(filteredWords);
    this.props.navigator.push({
      title: 'Pick A Category',
      component: Scene3,
      backButtonTitle: 'Custom Back',
      navigationBarHidden:false,
      passProps: {
        parseWords:filteredWords,
      },
    });
  }
  renderRow(c){
    return(
      <TouchableOpacity activeOpacity={.7} onPress={() => this.handlePress(c)}>
        <View style={styles.category}>
          <Image source={c.url} style={[scene1.logo, {width:100, height: 100, resizeMode:'cover', marginTop:0,marginBottom:0} ]}/>
          <Text  style={[styles.text, {alignSelf:'center', marginLeft:20, fontSize:22}]}>{c.name}</Text>
        </View>
      </TouchableOpacity>
    )
  }
  render(){
    return(
      <View style={[styles.scene]}>
        <Text style={[styles.text, {marginTop:20, marginBottom:20, marginLeft:10, fontSize:20}]}>Pick a Category</Text>
        <ListView
          dataSource={this.state.dataSource}
          renderRow={this.renderRow}
          automaticallyAdjustContentInsets={false}
          enableEmptySections
        />
      </View>

    )
  }
}

class Scene3 extends Component{
  constructor(props) {
    super(props);
    this.handlePress = this.handlePress.bind(this);
    this.repeatAudio = this.repeatAudio.bind(this);
    this.state = {
      parseQuizWords : [],
      select : 0,
      indices : []
    };
  }
  componentDidMount(){
    var parseWords = this.props.parseWords;
    if(!parseWords){
      return null
    }
    var parseQuizWords = [];
    var indices = [];
    for(var i = 0; i < 9 ;i++){
      var index = getRandomInt(0, parseWords.length - 1, indices);
      var word = {};
      if(parseWords[index]){
        word.english = parseWords[index].get("english");
        word.chinese = parseWords[index].get("chinese");
        word.pinyin = parseWords[index].get("pinyin");
        word.image = parseWords[index].get("image") ? parseWords[index].get("image")._url : "";
        parseQuizWords.push(word);
        indices.push(index);
      }
    }
    this.setState({
      indices : indices,
      parseQuizWords : parseQuizWords,
      select : getRandomInt(0, 8, this.state.indices)
    }, function(){
      var select = this.state.select;
      var word = this.state.parseQuizWords[select].english;
      var url = ('/mp3/'+word+'.mp3');
      AudioPlayer.play(url);
    })
  }
  repeatAudio(){
    var select = this.state.select;
    var word = this.state.parseQuizWords[select].english;
    var url = ('/mp3/'+word+'.mp3');
    AudioPlayer.play(url);
  }
  handlePress(i){
    if(i==this.state.select){
      console.log('correct');
      var parseWords = this.props.parseWords;
      var parseQuizWords = [];
      var indices = [];
      for(var i = 0; i < 9 ;i++){

        var index = getRandomInt(0, parseWords.length - 1, indices);
        var word = {};
        if(parseWords[index]){
          word.english = parseWords[index].get("english");
          word.chinese = parseWords[index].get("chinese");
          word.pinyin = parseWords[index].get("pinyin");
          word.image = parseWords[index].get("image") ? parseWords[index].get("image")._url : "";
          parseQuizWords.push(word);
          indices.push(index)
        }
      }
      var indices = this.state.indices;
      indices.push(index);
      this.setState({
        indices : indices,
        parseQuizWords : parseQuizWords,
        select : getRandomInt(0, 8, this.state.indices)
      }, function(){
        var select = this.state.select;
        var word = this.state.parseQuizWords[select].english;
        var url = ('/mp3/'+word+'.mp3');
        AudioPlayer.play(url);
      })
    }
    else{
      console.log('false');
    }
  }
  render() {
    var tiles = [];
    this.state.parseQuizWords.map(function(tile, i){
      tiles.push(tile)
    })
    if(tiles.length == 0){
      return null
    }
    var select = tiles[this.state.select].pinyin;
    return (
      <View style={[styles.scene, scene3.scene3]}    >
        <Text style={[styles.text, scene3.select]}>Select <Text style={styles.bold}>{select}</Text></Text>
        <View style={scene3.quizContainer}>
          <View style={scene3.quizRowContainer}>
            {tiles.splice(0,3).map(function(quizWord, i){
              var url = quizWord.image;
              return(
                <View
                  style={scene3.quizImageContainer} key={i}>
                  <TouchableOpacity onPress={()=>this.handlePress(i)} activeOpacity={.3}>
                  <Image  source={{uri: url}} style={[scene2.image, scene3.imageQuiz]}/>
                </TouchableOpacity>
                </View>
                )
            }, this)}
          </View>
          <View style={scene3.quizRowContainer}>
            {tiles.splice(0,3).map(function(quizWord, i){
              var url = quizWord.image;
              var id= 3+i;
              return (
                <View
                  style={scene3.quizImageContainer}
                  key={i}>
                  <TouchableOpacity onPress={()=>this.handlePress(id)} activeOpacity={.3}>
                    <Image source={{uri: url}} style={[scene2.image, scene3.imageQuiz]}/>
                  </TouchableOpacity>
                </View>
              )
            }, this)}
          </View>
          <View
            onPress={this.handlePress}
            style={scene3.quizRowContainer}>
            {tiles.splice(0,3).map(function(quizWord, i){
              var url = quizWord.image;
              var id= 6+i;
              return(
                <View
                  style={scene3.quizImageContainer}
                  key={i}>
                  <TouchableOpacity onPress={()=>this.handlePress(id)} activeOpacity={.3}>

                    <Image  source={{uri: url}} style={[scene1.image, scene3.imageQuiz]}/>
                  </TouchableOpacity>
                </View>
              )
            }, this)}
          </View>
        </View>
        <Text style={[styles.text, styles.button]} onPress={this.repeatAudio}>REPEAT AUDIO</Text>

      </View>
    )
  }
}

class Textrow extends Component {
  constructor(props) {
    super(props);
    this.handlePress = this.handlePress.bind(this);
  }
  handlePress(){
    this.props._setWord(this.props.rowData)
  }

  render() {
    return (
       <TouchableOpacity onPress={this.handlePress}>
        <View  style={styles.rowContainer} ref="text">
          <Text onPress={this.handlePress} style={[styles.text, styles.row]}>{this.props.rowData}</Text>
        </View>
      </TouchableOpacity>
    );
  }
}

class Character extends Component{
  constructor(props) {
    super(props);
  }
  render(){
    if(this.props.measure){
      return(
        <View className="Character" style={[scene2.character, scene2.measure]}>
          <Text className="top" style={[scene2.top]}>{this.props.chinese}</Text>
          <Text className="bottom" style={[scene2.bottom]}>{this.props.pinyin}</Text>
        </View>
      )

    }
    return(
      <View className="Character" style={scene2.character}>
        <Text className="top" style={[scene2.top]}>{this.props.chinese}</Text>
        <Text className="bottom" style={[scene2.bottom]}>{this.props.pinyin}</Text>
      </View>
    )
  }
}

class Scene2 extends Component{
  constructor(props) {
    super(props);
    this.handlePress = this.handlePress.bind(this);

    this.state = {
      chinese: "",
      pinyin:"",
      measure_chi: "",
      measure_eng:"",
      url :"",
      parseWord:""
    };
  }
  componentDidMount(){
    var queryWord = new Parse.Query("Words");
    var self = this;
    queryWord.equalTo("english", this.props.word);
    queryWord.first({
      success: function(parseWord){
          self.setState({
            parseWord: parseWord,
            chinese: parseWord.get("chinese"),
            pinyin: parseWord.get("pinyin"),
            measure_chi: parseWord.get("measure_chi"),
            measure_eng: parseWord.get("measure_eng"),
            url: parseWord.get("image") ? parseWord.get("image")._url:""
         })
      },
      error: function(error){
        console.log(error.message);
      }
    })
  }
  handlePress(){
    var word = this.props.word;
    var url = ('/mp3/'+word+'.mp3');
    AudioPlayer.play(url);
  }
  render() {
    var parseWord = this.state.parseWord;
    if(!parseWord){
      return null
    }

    var url = parseWord.get("image") ? parseWord.get("image")._url : "";
    var Measure;
    if(parseWord.get("measure_eng")){
      Measure = <Character pinyin={parseWord.get("measure_eng")} chinese={parseWord.get("measure_chi")} measure={true}/>
    }
    var pinyin = parseWord.get("pinyin");
    var chinese = parseWord.get("chinese");

    var pinyinChars = pinyin.split(" ");
    var chineseChars = chinese.split("");

    return (
      <View style={[styles.scene, scene2.scene2]}>
        <View style={scene2.wordsContainer}>
          {Measure}
          {pinyinChars.map(function(char, i){
            return (
              <Character key={i} pinyin={char} chinese={chineseChars[i]}/>
            )
          })}
        </View>
        <Image source={{uri: url}} style={scene2.image}/>
        <Text style={[styles.text, styles.button]} onPress={this.handlePress}>PRONOUNCE</Text>
      </View>
    )
  }
}

class Scene1 extends Component{
  constructor(props) {
    super(props);
    this.autocomplete = this.autocomplete.bind(this);
    this._setWord = this._setWord.bind(this);
    this.handlePress = this.handlePress.bind(this);

    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      dataSource: ds.cloneWithRows([]),
      // dataSource: ds.cloneWithRows(words),
      text: null,
      data:[],
      word: "",
      wordsText : [],
      parseWords : []
    };
  }
  componentDidMount(){
    var queryWord = new Parse.Query('Words');
    queryWord.limit(1000);
    var self = this;
    queryWord.find().then(function(parseWords){
      self.setState({parseWords : parseWords})
    })
  }
  autocomplete(text){

    var filteredWords = []
    if(!text){
    }
    else{
      words.map(function(word, i){
        if(word.startsWith(text)){
          filteredWords.push(word)
        }
      })
    }
    this.setState({
     dataSource: this.state.dataSource.cloneWithRows(filteredWords)
   })
  }
  handlePress(){
    this.props.navigator.push({
      title: 'Quiz',
      component: Scene3Categories,
      backButtonTitle: 'Categories',
      navigationBarHidden:false,
      passProps: {
        parseWords:this.state.parseWords

      },
    });
  }
  _setWord(word){
    this.setState({ word : word }, function(){
      this.props.navigator.push({
        title: this.state.word,
        component: Scene2,
        navigationBarHidden:false,

        backButtonTitle: 'Custom Back',
        passProps: {
          word: this.state.word,
        },
      });
    });
  }
  render() {
    return (
      <View style={[styles.scene,{paddingTop: 10,}]}>
        <Image source={require('./Sticktionary-logo.png')} style={scene1.logo}/>
        <TextInput
          style={[styles.text, styles.input]}
          autoCapitalize={"none"}
          onChangeText={this.autocomplete}
          value={this.state.text}
          placeholder="search for word"
        />
        <ListView
          automaticallyAdjustContentInsets={false}
          dataSource={this.state.dataSource}
          style={styles.list}
          renderRow={(rowData) => <Textrow _setWord={this._setWord} rowData={rowData}/>}
        />
      <Text style={[styles.text, styles.button, scene1.quizButton]} onPress={this.handlePress}>QUIZ</Text>

      </View>
    );
  }
}

class Sticktionary extends Component {
  render() {
    return (
      <NavigatorIOS
        ref="nav"
        style={styles.container}
        navigationBarHidden={true}
        initialRoute={{
          title: 'Sticktionary',
          component: Scene1,
        }}
      />
    );
  }
}

const scene3 = StyleSheet.create({

  scene3:{
    flex: 1,
    padding: 50,
    justifyContent: 'center',
    alignItems:'center',
    flexDirection:'column',

  },
  repeat:{
    backgroundColor: "rgba(120, 186, 109,.5)"
  },
  select:{
    fontSize: 20,
    marginBottom: 15,
    letterSpacing: 0,
    alignSelf : 'flex-start'
  },
  quizContainer:{
    height:350
  },
  quizRowContainer:{
    flex: 1,
    flexDirection:'row',
    height: 100
  },
  quizImageContainer:{
    shadowColor: "rgba(0,0,0,.2)",
    shadowOffset: {width:2,height:3},
    shadowOpacity : 1,
    flex: 1,
    margin: 5,
  },
  imageQuiz:{
    height: 107,
    width: 100,
    resizeMode: 'contain',

  }

})

const scene2 = StyleSheet.create({
  scene2:{
    flex: 1,
    height: 400,
    padding: 50,
    justifyContent: 'center',
    alignItems:'center',

  },
  image:{
    height: 250,
    width: 300,
    borderRadius: 20,
    resizeMode: 'contain'
  },
  wordsContainer:{
    flexDirection:'row',
    justifyContent: 'center',
    width:500,
    marginBottom: 50
  },
  character:{
    flexDirection:'column',
    width:80,
    justifyContent:'center',
  },
  top:{
    flex:1,
    fontFamily: 'Menlo',

    alignSelf: 'center',
    fontSize:35

  },
  bottom:{
    flex: 1,
    fontFamily: 'Menlo',

    alignSelf: 'center',
    fontSize:20,

  },
  measure:{
    opacity:.5
  }



})
const scene1 = StyleSheet.create({
  scene1:{
  },

  list:{
    paddingTop:10,
  },
  button:{
    backgroundColor:"rgb(236, 236, 236)",
    borderRadius: 2,
    borderStyle : 'solid',
    padding: 20,
    paddingLeft: 30,
    paddingRight: 30,
    margin: 10,
    marginTop: 50,
    borderWidth: 0,
    fontSize: 20,
    fontFamily: "Helvetica",
    fontWeight: "bold",
    shadowColor: "rgba(0,0,0,.2)",
    shadowOffset: {width:2,height:3},
    shadowOpacity : 1
  },

  logo:{
    resizeMode: 'contain',
    width: 300,
    height: 90,
    alignSelf: 'center',
    marginBottom: 10,
    marginTop: 20

  },
  quizButton:{
    width: 150,
    textAlign: 'center',
    paddingTop: 15,
    paddingBottom: 15,
    alignSelf:'center',
    marginTop:0,
    marginBottom: 30
  },


});

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  category:{
    borderWidth: 1,
    flexDirection:'row',
    justifyContent:'flex-start'
  },
  input:{
    width: 300,
    height: 60,
    alignSelf:'center',
    borderRadius : 10,
    padding:10,
    paddingLeft: 20,
    borderWidth:5,
    shadowOpacity: 0,
    borderColor: "rgb(100,100,100)",
    fontSize: 20,
    backgroundColor:"rgb(253,253,253)"
  },
  scene:{
    flex: 1,
    paddingTop: 60,
    backgroundColor:"rgb(252,250,250)"
  },
  text:{
    fontSize: 30,
    fontFamily: 'Menlo',
    color: 'rgb(50,50,50)'
  },
  centered: {
    alignSelf :'center'
  },
  list:{
    paddingTop:10,
  },
  bold:{
    fontWeight:'bold'
  },
  row:{
    fontSize:22,
    padding: 10,
    paddingLeft: 20,

  },
  rowContainer:{
    marginTop: 2,
    marginBottom: 5,
    borderRightColor: "white",
    borderBottomColor: "rgb(230,230,230)",
    borderLeftColor: "white",
    borderRadius: 0,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    borderStyle : 'solid',
    // borderWidth: 1,
    borderTopWidth: 0,
    borderRightWidth: 0,
    borderBottomWidth: 1,
    borderLeftWidth: 0

  },

  button:{
    backgroundColor:"rgb(236, 236, 236)",
    borderRadius: 2,
    borderStyle : 'solid',
    padding: 20,
    paddingLeft: 30,
    paddingRight: 30,
    margin: 10,
    marginTop: 50,
    borderWidth: 0,
    fontSize: 20,
    fontFamily: "Helvetica",
    fontWeight: "bold",
    shadowColor: "rgba(0,0,0,.2)",
    shadowOffset: {width:2,height:3},
    shadowOpacity : 1
  },
});

AppRegistry.registerComponent('Sticktionary', () => Sticktionary);
