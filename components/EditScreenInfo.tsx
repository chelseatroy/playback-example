import * as WebBrowser from 'expo-web-browser';
import React from 'react';
import {
    StyleSheet,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    Keyboard
} from 'react-native';

import Colors from '../constants/Colors';
import {Text, View} from './Themed';
import {Audio} from 'expo-av';


export default class EditScreenInfo extends React.Component {
    state = {
        isPlaying: false,
        playbackInstance: null,
        currentIndex: 0,
        volume: 1.0,
        rate: 1.0,
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
        const {isPlaying, volume} = this.state

        try {
            const playbackInstance = new Audio.Sound()
            const source = {
                uri: 'http://k007.kiwi6.com/hotlink/z019vpcym9/Coffee_Medium_roast_...mp3'
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
                <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>

                <View style={styles.getStartedContainer}>
                    <Text
                        style={styles.label}
                        lightColor="rgba(0,0,0,0.8)"
                        darkColor="rgba(255,255,255,0.8)">
                        How fast should the metronome play? (1 is normal speed)
                    </Text>
                    <TextInput style = {styles.rateInput}
                        keyboardType = 'numeric'
                        onChangeText = {(text)=> this.onRateChanged(text)}
                        defaultValue = { "1.0" }
                    />
                    <TouchableOpacity onPress={this.playOrPauseMetronome.bind(this)} style={styles.button}>
                        <Text
                            style={styles.buttonText}
                            lightColor="rgba(0,0,0,0.8)"
                            darkColor="rgba(255,255,255,0.8)">
                            {this.state.isPlaying ?
                                "Pauze ze metronome!"
                                :
                                "Begin ze metronome!"
                                }
                        </Text>
                    </TouchableOpacity>

                </View>
                </TouchableWithoutFeedback>
            </View>
        );

    }

    async onRateChanged(newRate) {
        const {playbackInstance, isPlaying} = this.state

        if (isPlaying) {
            await playbackInstance.pauseAsync()
        }
        this.setState({
            isPlaying: false,
            rate: parseFloat(newRate)
        })
    }

    async playOrPauseMetronome() {
        const {isPlaying, playbackInstance, rate} = this.state

        await playbackInstance.setStatusAsync({ rate: rate, shouldCorrectPitch: true })
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
    label: {
        color: 'green',
        fontSize: 16,
        padding: 10,
        textAlign: 'center'
    },
    rateInput: {
        height: 40,
        width: 60,
        borderColor: 'green',
        borderWidth: 2,
        borderRadius: 10,
        textAlign: 'center'
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
