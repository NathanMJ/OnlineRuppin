import { ImageBackground } from "expo-image";
import { router } from "expo-router";
import { useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function HelpToConnect() {

    const [pageIndex, setPageIndex] = useState(0)

    //TODO: get the pages from the db

    const arrow = 'https://static-00.iconduck.com/assets.00/arrow-circle-right-icon-512x512-b8acao5m.png'

    const pagesExplain = [
        {
            text: 'Scan the QR Logo on your given tablet',
            img: ''
        },
        {
            text: 'A QR code will appear',
            img: ''
        },
        {
            text: 'Click on the button in link app',
            img: ''
        },
        {
            text: 'Scan the QR code and now you can order from your phone !',
            img: ''
        }
    ]

    const clickOnArrow = (direction) => {

        let tempPageIndex = pageIndex;
        switch (direction) {
            case 'right':
                tempPageIndex = pageIndex + 1;
                setPageIndex(tempPageIndex);
                break;
            case 'left':
                tempPageIndex = pageIndex - 1;
                setPageIndex(tempPageIndex);
                break;
        }
    }

    return (
        <ImageBackground source={{
            uri: "https://i.ytimg.com/vi/DyJTVkRP1vY/maxresdefault.jpg"
        }} style={styles.backgroundImage}>
            <View style={styles.header}>
                <Text style={{ color: 'white', fontWeight: 800, padding: 30, fontSize: 50 }}>Steps to follow</Text>
            </View>
            <View style={styles.explainView}>
                <Text style={{ fontSize: 40, textAlign: "center", fontWeight: 600 }}>{pagesExplain[pageIndex].text}</Text>
                <View style={{ flex: 1 }}>

                </View>
                <View style={{ flexDirection: "row", justifyContent: 'space-between' }}>
                    <TouchableOpacity style={{ display: pageIndex == 0 ? 'none' : 'block' }} onPress={() => clickOnArrow('left')}>
                        <Image
                            source={{ uri: arrow }}
                            style={{ transform: [{ scaleX: -1 }], width: 60, height: 60, alignSelf: 'center' }}
                        />
                    </TouchableOpacity>
                    <View style={{ flex: 1 }}></View>
                    <TouchableOpacity style={{ display: pageIndex == pagesExplain.length - 1 ? 'none' : 'block' }} onPress={() => clickOnArrow('right')}>
                        <Image
                            source={{ uri: arrow }}
                            style={{ width: 60, height: 60, alignSelf: 'center' }}
                        />
                    </TouchableOpacity>
                </View>
            </View>
            <TouchableOpacity style={styles.footer} onPress={() => router.push({ pathname: "/" })}>
                <Text style={{
                    color: 'white', fontWeight: 800, padding: 10, fontSize: 60, textAlign: 'center'
                }}>Return</Text>
            </TouchableOpacity>
        </ImageBackground>
    )
}



const styles = StyleSheet.create({
    header: {

    },
    explainView: {
        flex: 1,
        backgroundColor: 'white',
        width: '100%',
        padding: 10
    },
    footer: {
        backgroundColor: 'red',
        margin: 20,
        width: '80%',
        borderRadius: 30
    },
    backgroundImage: {
        flex: 1,
        width: '100%',
        height: '100%',
        alignItems: 'center'
    }
});

