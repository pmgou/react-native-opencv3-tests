/**
 * Sample React Native App
 * https://github.com/adamgf/react-native-opencv3-tests/CvImageManipulations
 * @author Adam G. Freeman, adamgf@gmail.com 01/19/2019
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Dimensions, DeviceEventEmitter, TouchableOpacity, ScrollView, Image, Platform, StyleSheet, Text, View} from 'react-native';
import {RNCv, CvCamera, CvInvoke, CvInvokeGroup, ColorConv, CvType, Mat, MatOfInt, MatOfFloat, CvScalar, CvPoint} from 'react-native-opencv3';

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
  android:
    'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

export default class App extends Component<Props> {

  constructor(props) {
    super(props)
    this.RNFS = require('react-native-fs')
    let {height, width} = Dimensions.get('window')
    this.scrollView = React.createRef()
    this.cvCamera = React.createRef()
    this.histSizeNum = 25.0
    this.state = { scrollleft : width - 64, windowwidth : width, windowheight : height }
  }

  componentDidMount = async() => {
    // I like to use camelCase similar to camelToe
    let interMat = await new Mat().init()
    let channelOne = await new MatOfInt(1).init()
    let maskMat = await new Mat().init()
    let histogramMat = await new Mat().init()
    let ranges = await new MatOfFloat(0.0, 256.0).init()
    let histSize = await new MatOfInt(this.histSizeNum).init()

    const scalarVal = new CvScalar(0.0, 0.0, 0.0, 0.0)
    const RGBScalar1 = new CvScalar(0.0, 200.0, 0.0, 255.0)

    //await this.RNFS.unlink(outputFilename)

    //let fillImage = await RNCv.matToImage(fillMat, outputFilename)
    ///const { uri } = fillImage
    //alert('uri is: file://' + uri)

    this.setState({ ...this.state, interMat : interMat, channelOne : channelOne,
      maskMat : maskMat, histogramMat : histogramMat, histSize : histSize, ranges : ranges, clearColor : scalarVal, RGBScalar1 : RGBScalar1 })

    DeviceEventEmitter.addListener('onHistograms', this.onHistograms);
    DeviceEventEmitter.addListener('onFrameSize', this.onFrameSize);

    setTimeout(() => {
      if (this.scrollView && this.scrollView.current) {
        this.scrollView.current.scrollTo({ x : 0, y : this.state.windowheight, animated : false })
      }
    }, 500);
  }

  onFrameSize = async(e) => {
    if (!this.state.fillMat) {
      const { frameWidth, frameHeight } = JSON.parse(e.payload).frameSize
      let fillMat = await new Mat(frameWidth,frameHeight,CvType.CV_8UC4).init()
      const scalarVal = new CvScalar(0.0, 0.0, 0.0, 0.0)
      fillMat.setTo(scalarVal)
      this.setState({ ...this.state, frameWidth: frameWidth, frameHeight: frameHeight, fillMat: fillMat, halfHeight : frameHeight / 2.0 })
    }
  }

  onHistograms = async(e) => {
    let hist = e.payload
    const { frameWidth, frameHeight, fillMat, clearColor, RGBScalar1 } = this.state

    if (fillMat) {
      let thickness = (frameWidth / (this.histSizeNum + 10) / 5)
      if (thickness > 5) {
        thickness = 5
      }

      const c = 1
      const offset = ((frameWidth - (5*this.histSizeNum + 4*10)*thickness)/2)
      for (let h=0;h < this.histSizeNum;h++) {
          const x1 = offset + ((this.histSizeNum + 10) + h) * thickness
          const x2 = x1
          const y1 = frameHeight - 1.0
          const y2 = y1 - 2.0 - hist[h]
          let mP1 = new CvPoint(x1, y1)
          let mP2 = new CvPoint(x2, y2)
          //RNCv.drawLine(histMat,mP1,mP2,RGBScalar,5);
          RNCv.invokeMethod("line", {"p1":fillMat,"p2":mP1,"p3":mP2,"p4":RGBScalar1,"p5":thickness})
      }

      if (this.cvCamera && this.cvCamera.current) {
        // have to do this for performance ...
        this.cvCamera.current.setOverlay(fillMat)
      }
    }
  }

  press1 = (e) => {
    alert('pressed 1')
  }

  press2 = (e) => {
    alert('pressed 2')
  }

  press3 = (e) => {
    alert('pressed 3')
  }

  press4 = (e) => {
    alert('pressed 4')
  }

  press5 = (e) => {
    alert('pressed 5')
  }

  press6 = (e) => {
    alert('pressed 6')
  }

  press7 = (e) => {
    alert('pressed 7')
  }

  press8 = (e) => {
    alert('pressed 8')
  }

  render() {
    const { interMat, channelOne, maskMat, histogramMat, histSize, ranges, halfHeight, fillMat } = this.state

    return (
      <View style={styles.container}>
          <CvInvokeGroup groupid='invokeGroup0'>
            <CvInvoke func='normalize' params={{"p1":histogramMat,"p2":histogramMat,"p3":halfHeight,"p4":0,"p5":1}} callback='onHistograms'/>
            <CvInvoke func='calcHist' params={{"p1":"rgba","p2":channelOne,"p3":maskMat,"p4":histogramMat,"p5":histSize,"p6":ranges}}/>
            <CvCamera ref={this.cvCamera} style={{ width: '100%', height: '100%', position: 'absolute' }} />
          </CvInvokeGroup>
        <ScrollView ref={this.scrollView} style={{ 'left' : this.state.scrollleft, ...styles.scrollview }}>
          <TouchableOpacity  onPress={this.press1} style={styles.to}>
            <Image source={require('./images/react-native-icon.png')} style={styles.scrollimg}/>
          </TouchableOpacity>
          <TouchableOpacity  onPress={this.press2} style={styles.to}>
            <Image source={require('./images/react-native-icon.png')} style={styles.scrollimg}/>
          </TouchableOpacity>
          <TouchableOpacity  onPress={this.press3} style={styles.to}>
            <Image source={require('./images/react-native-icon.png')} style={styles.scrollimg}/>
          </TouchableOpacity>
          <TouchableOpacity  onPress={this.press4} style={styles.to}>
            <Image source={require('./images/react-native-icon.png')} style={styles.scrollimg}/>
          </TouchableOpacity>
          <TouchableOpacity  onPress={this.press5} style={styles.to}>
            <Image source={require('./images/react-native-icon.png')} style={styles.scrollimg}/>
          </TouchableOpacity>
          <TouchableOpacity  onPress={this.press6} style={styles.to}>
            <Image source={require('./images/react-native-icon.png')} style={styles.scrollimg}/>
          </TouchableOpacity>
          <TouchableOpacity  onPress={this.press7} style={styles.to}>
            <Image source={require('./images/react-native-icon.png')} style={styles.scrollimg}/>
          </TouchableOpacity>
          <TouchableOpacity  onPress={this.press8} style={styles.to}>
            <Image source={require('./images/react-native-icon.png')} style={styles.scrollimg}/>
          </TouchableOpacity>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    backgroundColor: 'transparent',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  to: {
    width: 64,
    height: 64,
    backgroundColor: 'transparent',
  },
  scrollimg: {
    width: 56,
    height: 56,
    margin: 4,
  },
  scrollview: {
    top: 0,
    bottom: 0,
    right: 0,
    height: 512,
    width: 64,
    backgroundColor: '#FFF',
    opacity: 0.5,
  },
});
