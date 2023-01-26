<script setup>

// Background colors
// Text in circle
// Snail shape

import { rgb2hsl , hsl2rgb, color2string, string2color } from '../utils'
import IconRightArrow from './icons/IconRightArrow.vue'
import Circle from './Circle.vue'
import Lines from './Lines.vue'
import Rose from './Rose.vue'
import SlidersPicker from './SlidersPicker.vue'
import { ref, onMounted } from 'vue'

const MAX_COUNT = 1000
const CANVAS_HEIGHT = 280

const videoSource = ref(undefined)//'video2.MP4')
const fileInput = ref(document.getElementById("inputVideo"))
const video = ref(null)//ref(document.getElementById("video")) 
const colorResultsArray = ref([])

console.log(video)

const onPickVideo = () => {
    fileInput.value.click()
}

const onVideoPicked = () => {
    //const fileInput = document.getElementById("inputVideo");
    console.log('Trying to upload the video file: %O', fileInput.value)
    if ('files' in fileInput.value) {
        if (fileInput.value.files.length === 0) {
            alert("Select a file to upload")
        } else {
            //let video = document.getElementById('video')
            videoSource.value = URL.createObjectURL(fileInput.value.files[0])
            //videoProcessing()
            video.value.addEventListener('loadeddata', videoProcessing)
        }
    } else {
        console.log('No found "files" property');
    }
}  

const videoProcessing = () => {
    let c1, ctx1, c2, ctx2, c_tmp, ctx_tmp, circleCanvas, ctxCircleCanvas
    let numberFrameProcessed = 0
    //const resultsArray = []
    const resultsDistribution = {}
    colorResultsArray.value.splice(0, colorResultsArray.value.length)
    const currentVideoSource = videoSource.value
    const numberFrame = video.value.duration * 10 // 20 FPS
    const step = CANVAS_HEIGHT / numberFrame
    const circleStep = Math.PI * CANVAS_HEIGHT / numberFrame

    const vHeight = video.value.videoHeight || 1
    const vWidth = video.value.videoWidth || 1

    c1 = document.getElementById('output-canvas')
    if (vWidth && vHeight) {
        c1.style.height = vHeight
        c1.style.width = vWidth
        //console.log(vWidth, vHeight)
    }
    console.log(video.value.videoHeight, video.value.videoWidth)
    ctx1 = c1.getContext('2d')

    //c2 = document.getElementById('output-color-canvas')
    //ctx2 = c2.getContext('2d')
    //let frameResult = ctx2.createImageData(200, 1000)

    //circleCanvas = document.getElementById('output-circle-canvas')
    //ctxCircleCanvas = circleCanvas.getContext('2d')

    c_tmp = document.createElement('canvas')

    //console.log('att', c_tmp)

    if (vWidth && vHeight) {
        c_tmp.width = vWidth
        c_tmp.height = vHeight
    }
    ctx_tmp = c_tmp.getContext('2d')
    //console.log(ctx_tmp, vWidth)
    console.log(' --- Process video ---')

    function computeFrame() {
        if (video.value.paused || video.value.ended) {
            //alert('ddd' + count2)
            return
        }
        let Htot = 0
        let Ltot = 0
        let Stot = 0
        let colorDistribution = {}

        //const vHeight = video.value.videoHeight
        //const vWidth = video.value.videoWidth

        ctx_tmp.drawImage(video.value, 0, 0, vWidth, vHeight)
        let frame = ctx_tmp.getImageData(0, 0, vWidth, vHeight)
        ctx1.putImageData(frame, 0, 0)
        //console.log("frame", frame)
        for (let i = 0; i < frame.data.length / 4; i++) {
            let r = frame.data[i * 4]
            let g = frame.data[i * 4 + 1]
            let b = frame.data[i * 4 + 2]
            if (r > 0 && b > 0 && g > 0) {
                let HSL = rgb2hsl(r, g, b)
                Htot += HSL[0]
                Stot += HSL[1]
                Ltot += HSL[2]
                if (colorDistribution[color2string([r, g, b])]) colorDistribution[color2string([r, g, b])] += 1
                else colorDistribution[color2string([r, g, b])] = 1
            }
        }

        let colorKeys = Object.keys(colorDistribution)
        let maxColor = [colorKeys[0], colorDistribution[colorKeys[0]]]
        for (let i = 0; i < colorKeys.length; i++) {
            if (colorDistribution[colorKeys[i]] > maxColor[1]) maxColor = [colorKeys[i], colorDistribution[colorKeys[i]]]
        }
        //console.log(maxColor)

        //console.log(frame, ctx1, 'frameu')
        //incrementCount()
        numberFrameProcessed++

        //let frameResult = ctx2.createImageData(200, 1000)
        //console.log(frameResult)
        let result = string2color(maxColor[0])
        colorResultsArray.value.push(result)
        //console.log('resul', result, numberFrameProcessed, colorResultsArray)

        let iStart, iEnd//, jStart, jEnd

        iStart = 100 * 4 * (numberFrameProcessed - 1)//(count - 1) * 10 * 4 % 100 * 4
        iEnd = 100 * 4 * (numberFrameProcessed + 1)//count * 10 * 4 % 100 * 4
        //jStart = 10 * numberFrameProcessed// Math.floor((count - 1) * 10)
        //jEnd = 10 * (numberFrameProcessed + 5) //Math.floor(count * 10)

        const numberLines = 1

        const colorString = result.toString()
        if (resultsDistribution[colorString]) resultsDistribution[colorString]++
        else resultsDistribution[colorString] = 1

        //console.log('aie', resultsDistribution)

        //ctx2.putImageData(frameResult, 0, 0)
        if (numberFrameProcessed < MAX_COUNT && currentVideoSource === videoSource.value) setTimeout(computeFrame, 0)
        //console.log('compute', numberFrameProcessed, colorResultsArray)
    }

    video.value.addEventListener('play', computeFrame )
}

//const test = ref([])
const rgbColor = ref([255, 255, 255])
//const outsideCircleRadius = ref(CANVAS_HEIGHT / 2)
//const insideCircleRadius = ref(CANVAS_HEIGHT / 8)
const radius = ref([CANVAS_HEIGHT / 2, CANVAS_HEIGHT / 4])
const angleRose = ref([20])
const angleLines = ref([0])
const isSorted = ref(false)

const colorPickerParams = [
                    {
                        id: 0,
                        label: 'R',
                        min: 0,
                        max: 255,
                        value: 255
                    },
                    {
                        id: 1,
                        label: 'G',
                        min: 0,
                        max: 255,
                        value: 255
                    },
                    {
                        id: 2,
                        label: 'B',
                        min: 0,
                        max: 255,
                        value: 255
                    },
                ]

const radiusPickerParams = [
                    {
                        id: 0,
                        label: 'Out',
                        min: 0,
                        max: CANVAS_HEIGHT / 2,
                        value: CANVAS_HEIGHT / 2
                    },
                    {
                        id: 1,
                        label: 'In',
                        min: 1,
                        max: CANVAS_HEIGHT / 2,
                        value: CANVAS_HEIGHT / 4
                    }
                ]

const anglePickerParams = [
                    {
                        id: 0,
                        label: 'Angle',
                        min: 0,
                        max: 360,
                        value: 0
                    }
                ]
        
</script>

<template>
    <div
        class="container"
    >
        <div
            class="settings"
        >
<!--             <button 
                @click="onPickVideo"
            >
                Upload video
            </button> -->
            <!-- <ColorPicker v-model="rgbColor" name="Background color"/> -->
<!--             <input type="range" :min="0" :max="CANVAS_HEIGHT / 2" v-model="outsideCircleRadius"/>
            <input type="range" :min="0" :max="CANVAS_HEIGHT / 2" v-model="insideCircleRadius"/> -->
            <!-- <RadiusPicker v-model="radius" name="Radius" :max="CANVAS_HEIGHT / 2"/> -->
            <SlidersPicker 
                v-model="rgbColor"
                name="Background color"
                :params="colorPickerParams"
            />
            <SlidersPicker 
                v-model="radius"
                name="Radius"
                :params="radiusPickerParams"
            />
            <SlidersPicker 
                v-model="angleLines"
                name="Lines angle"
                :params="anglePickerParams"
            />
            <SlidersPicker 
                v-model="angleRose"
                name="Rose angle"
                :params="anglePickerParams"
            />
            <input type="checkbox" v-model="isSorted"/>
            <button>
                Add a shape
            </button>
        </div>
        <input
            id="inputVideo"
            type="file"
            ref="fileInput"
            accept="video/*"
            @change="onVideoPicked"
        />
        <div
            style="
                display: flex;
                flex-direction: row;
                align-items: center;
            "
        >
            <video 
                id="video" 
                ref="video"
                v-show="videoSource" 
                width="320" 
                :height="CANVAS_HEIGHT" 
                :src="videoSource" 
                autoplay
                controls
                muted>
            </video>
            <button
                class="noVideo"
                v-show="!videoSource"
                @click="onPickVideo"
            >
                Upload a video to extract its color!
            </button>
            <!-- <canvas id="video-canvas" width="320" height="640"></canvas> -->
            <canvas id="output-canvas" ></canvas>
            <IconRightArrow id="iconRightArrow"/>
<!--             <canvas id="output-color-canvas" width="160" :height="CANVAS_HEIGHT"></canvas>
            <canvas id="output-circle-canvas" :width="CANVAS_HEIGHT" :height="CANVAS_HEIGHT"></canvas> -->
            <Circle 
                :colors="colorResultsArray"
                :backgroundColor="rgbColor"
                :height="CANVAS_HEIGHT"
                :width="CANVAS_HEIGHT"
                :outsideRadius="radius[0]"
                :insideRadius="radius[1]"
            />
            <Lines 
                :colors="colorResultsArray"
                :backgroundColor="rgbColor"
                :height="CANVAS_HEIGHT"
                :width="CANVAS_HEIGHT"
                :scale="2"
                :isColorsSorted="isSorted"
                :angle="angleLines"
            />
            <Rose 
                :colors="colorResultsArray"
                :backgroundColor="rgbColor"
                :height="CANVAS_HEIGHT"
                :width="CANVAS_HEIGHT"
                :angle="angleRose"
            />
        </div>
    </div>
</template>

<style>

.container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    flex-grow: 1;
    margin: 1em;
    text-align: center;
}

button {
    color: rgb(114, 119, 107);
    margin: 0.1em;
}

#inputVideo {
    background-color: rgb(211, 214, 213);
    display: none;
}

.previewBlock {
        display: block;
        cursor: pointer;
        width: 300px;
        height: 281px;        
        margin: 0 auto 20px;
        background-position: center center;
        background-size: cover;
    }

video {
    border: 1px solid grey;
    border-radius: 1em;
    margin: 1em;
    background-color: rgb(220, 217, 217);
}

.noVideo {
    margin: 1em;
    align-self: stretch;
    background-color: white;
    border: 1px dashed grey;
    border-radius: 1em;
    font-weight: bold;
}

.noVideo:hover {
    background-color: whitesmoke;
}

canvas {
    border: 1px solid whitesmoke;
    margin: 1em;
    box-shadow: 5px 5px 5px rgba(0, 0, 0, 0.135);
}

#output-canvas {
    display: none;
}

#iconRightArrow {
    color: green;
}

.settings {
    display: flex;
    flex-direction: row;
    justify-content: center;
    padding: 0.1em;
    background-color: rgba(83, 83, 83, 0.186);
    border-radius: 0.5em;
}

.colorPicker {
    margin: 0.1em;
}

</style>