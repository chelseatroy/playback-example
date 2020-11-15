import * as WebBrowser from 'expo-web-browser';
import React from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';

import Colors from '../constants/Colors';
import {Text, View} from './Themed';
import {Audio} from 'expo-av';


export default class EditScreenInfo extends React.Component {
    state = {
        isPlaying: false,
        playbackInstance: null,
        currentIndex: 0,
        volume: 1.0,
        isBuffering: false
    }

    async componentDidMount() {
        try {
            await Audio.setAudioModeAsync({
                allowsRecordingIOS: false,
                interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
                playsInSilentModeIOS: true,
                interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DUCK_OTHERS,
                shouldDuckAndroid: true,
                staysActiveInBackground: true,
                playThroughEarpieceAndroid: true
            })

            this.loadAudio()
        } catch (e) {
            console.log(e)
        }
    }

    async loadAudio() {
        const {currentIndex, isPlaying, volume} = this.state

        try {
            const playbackInstance = new Audio.Sound()
            const source = {
                uri: 'https://ia600204.us.archive.org/11/items/hamlet_0911_librivox/hamlet_act5_shakespeare.mp3'
            }

            const status = {
                shouldPlay: isPlaying,
                volume
            }

            playbackInstance.setOnPlaybackStatusUpdate(this.onPlaybackStatusUpdate)
            await playbackInstance.loadAsync(source, status, false)
            this.setState({playbackInstance})
        } catch (e) {
            console.log(e)
        }
    }

    onPlaybackStatusUpdate = status => {
        this.setState({
            isBuffering: status.isBuffering
        })
    }

    render() {
        return (
            <View>
                <View style={styles.getStartedContainer}>
                    <TouchableOpacity onPress={this.beginZeMetronome.bind(this)} style={styles.button}>
                        <Text
                            style={styles.buttonText}
                            lightColor="rgba(0,0,0,0.8)"
                            darkColor="rgba(255,255,255,0.8)">
                            {this.state.isPlaying ?
                                "Pauze ze metronome!"
                                : (
                                    "Begin ze metronome!"
                                )}
                        </Text>
                    </TouchableOpacity>

                </View>

            </View>
        );

    }

    async beginZeMetronome() {
        const {isPlaying, playbackInstance} = this.state

        isPlaying ? await playbackInstance.pauseAsync() : await playbackInstance.playAsync()

        this.setState({isPlaying: !isPlaying})
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    developmentModeText: {
        marginBottom: 20,
        fontSize: 14,
        lineHeight: 19,
        textAlign: 'center',
    },
    contentContainer: {
        paddingTop: 30,
    },
    welcomeContainer: {
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 20,
    },
    welcomeImage: {
        width: 100,
        height: 80,
        resizeMode: 'contain',
        marginTop: 3,
        marginLeft: -10,
    },
    getStartedContainer: {
        alignItems: 'center',
        marginHorizontal: 50,
    },
    homeScreenFilename: {
        marginVertical: 7,
    },
    codeHighlightText: {
        color: 'rgba(96,100,109, 0.8)',
    },
    codeHighlightContainer: {
        borderRadius: 3,
        paddingHorizontal: 4,
    },
    getStartedText: {
        fontSize: 17,
        lineHeight: 24,
        textAlign: 'center',
    },
    button: {
        backgroundColor: 'green',
        alignItems: 'center',
        padding: 10,
        borderRadius: 10,
        marginTop: 20,
    },
    buttonText: {
        color: 'white',
        fontSize: 20,
        fontWeight: "bold",

    },
    helpContainer: {
        marginTop: 15,
        marginHorizontal: 20,
        alignItems: 'center',
    },
    helpLink: {
        paddingVertical: 15,
    },
    helpLinkText: {
        textAlign: 'center',
    },
});
