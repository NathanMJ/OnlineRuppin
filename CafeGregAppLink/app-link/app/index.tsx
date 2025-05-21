import { Dimensions, ImageBackground, StyleSheet, Text, View } from "react-native";

export default function Index() {
  return (
    <ImageBackground source={{
      uri: "https://i.ytimg.com/vi/DyJTVkRP1vY/maxresdefault.jpg"
    }}
      style={styles.backgroundImage}
      blurRadius={3}>
      <View
        style={{
          flex: 1,
          alignItems: "center"
        }}
      >
        <View style={styles.header}>
          <Text style={styles.textHeader}>Cafe Greg</Text>
          <Text style={styles.textHeader}>Link App</Text>
        </View>


      </View>
    </ImageBackground >
  );
}

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
  textHeader: {
    color: 'white',
    fontSize: 60,
    textAlign: 'center',
    fontWeight: '700'
  },
  header: {
    flexDirection: 'column',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    paddingVertical: 20,
    marginTop: windowHeight / 10,
    width: windowWidth
  },
  backgroundImage: {
    flex: 1,
    width: windowWidth,
    height: windowHeight,
    justifyContent: 'center'
  }
});





