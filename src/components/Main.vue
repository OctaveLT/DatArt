<script setup lang="ts">

import { rgb2hsl , hsl2rgb, color2string, string2color } from '../utils.js'
import IconRightArrow from './icons/IconRightArrow.vue'
import Circle from './canvas/Circle.vue'
import Lines from './canvas/Lines.vue'
import Rose from './canvas/Rose.vue'
import SlidersPicker from './elements/SlidersPicker.vue'
import { ref } from 'vue'
import VideoUploader from './elements/VideoUploader.vue'

type ColorDistribution = {
        [keys: string]: number
    }

type PickerParams = {
                id : number,
                label: string,
                min: number,
                max: number,
                value: number
            }[]

const MAX_COUNT = 1000
const CANVAS_HEIGHT = 280
const DEFAULT_RGB_COLOR = [255, 255, 255]
const DEFAULT_OUT_RADIUS = CANVAS_HEIGHT * 0.45
const DEFAULT_IN_RADIUS = CANVAS_HEIGHT * 0.25
const DEFAULT_ANGLE_ROSE = 120
const DEFAULT_ANGLE = 0
const DEFAULT_COLOR_THRESHOLD = 25
const DEFAULT_IS_SORTED = false

const colorResultsArray = ref<string[][]>([])

const videoProcessing = (video: HTMLVideoElement, videoSource: string) => {
    let numberFrameProcessed: number = 0
    colorResultsArray.value.splice(0, colorResultsArray.value.length)
    const currentVideoSource = videoSource

    const vHeight: number = video?.videoHeight || 1
    const vWidth: number = video?.videoWidth || 1

    const outputCanvas = document.getElementById('outputCanvas') as HTMLCanvasElement
    const contextOutputCanvas: CanvasRenderingContext2D = outputCanvas.getContext('2d')!
    const tmpCanvas = document.createElement('canvas') as HTMLCanvasElement
    const contextTmpCanvas: CanvasRenderingContext2D = tmpCanvas.getContext('2d')!

    if (vWidth && vHeight) {
        outputCanvas.style.height = vHeight.toString()
        outputCanvas.style.width = vWidth.toString()
    }

    if (vWidth && vHeight) {
        tmpCanvas.width = vWidth
        tmpCanvas.height = vHeight
    }

    console.log(' --- Process video ---')

    const computeFrame = () => {
        if (video?.paused || video?.ended) {
            return
        }
        let hTot: number = 0
        let lTot: number = 0
        let sTot: number = 0
        let colorDistribution: ColorDistribution = {}

        video && contextTmpCanvas.drawImage(video, 0, 0, vWidth, vHeight)
        let frame = contextTmpCanvas.getImageData(0, 0, vWidth, vHeight)
        contextOutputCanvas.putImageData(frame, 0, 0)
        for (let i = 0; i < frame.data.length / 4; i++) {
            let r = frame.data[i * 4]
            let g = frame.data[i * 4 + 1]
            let b = frame.data[i * 4 + 2]
            if (r > 0 && b > 0 && g > 0) {
                let HSL = rgb2hsl(r, g, b)
                hTot += HSL[0]
                lTot += HSL[1]
                sTot += HSL[2]
                if (colorDistribution[color2string([r, g, b])]) colorDistribution[color2string([r, g, b])] += 1
                else colorDistribution[color2string([r, g, b])] = 1
            }
        }

        let colorKeys = Object.keys(colorDistribution)
        let sortedColors: string[] = colorKeys.sort((color1, color2) => colorDistribution[color1] < colorDistribution[color2] ? 1 : -1)

        numberFrameProcessed++

        let relativeIndex: number = Math.floor(colorThreshold.value[0] * 0.01 * (sortedColors.length - 1))
        let result: string[] = string2color(sortedColors[relativeIndex])
        colorResultsArray.value.push(result)

        if (numberFrameProcessed < MAX_COUNT && currentVideoSource === videoSource) setTimeout(computeFrame, 0)
    }

    video?.addEventListener('play', computeFrame )
}

const rgbColor = ref(DEFAULT_RGB_COLOR)
const radius = ref([DEFAULT_OUT_RADIUS, DEFAULT_IN_RADIUS])
const angleRose = ref([DEFAULT_ANGLE_ROSE, DEFAULT_OUT_RADIUS])
const angleLines = ref([DEFAULT_ANGLE])
const isSorted = ref(DEFAULT_IS_SORTED)
const colorThreshold = ref([DEFAULT_COLOR_THRESHOLD])
      
const colorPickerParams: PickerParams = [
                    {
                        id: 0,
                        label: 'R',
                        min: 0,
                        max: 255,
                        value: DEFAULT_RGB_COLOR[0],
                    },
                    {
                        id: 1,
                        label: 'G',
                        min: 0,
                        max: 255,
                        value: DEFAULT_RGB_COLOR[1],
                    },
                    {
                        id: 2,
                        label: 'B',
                        min: 0,
                        max: 255,
                        value: DEFAULT_RGB_COLOR[2],
                    },
                ]

const radiusPickerParams: PickerParams = [
                    {
                        id: 0,
                        label: 'Out',
                        min: 0,
                        max: CANVAS_HEIGHT / 2,
                        value: DEFAULT_OUT_RADIUS,
                    },
                    {
                        id: 1,
                        label: 'In',
                        min: 1,
                        max: CANVAS_HEIGHT / 2,
                        value: DEFAULT_IN_RADIUS,
                    }
                ]

const anglePickerParams: PickerParams = [
                    {
                        id: 0,
                        label: 'Angle',
                        min: 0,
                        max: 360,
                        value: DEFAULT_ANGLE,
                    }
                ]

const angleRadiusPickerParams: PickerParams = [
                    {
                        id: 0,
                        label: 'Angle',
                        min: 0,
                        max: 360,
                        value: DEFAULT_ANGLE_ROSE,
                    }
                    ,
                    {
                        id: 1,
                        label: 'Radius',
                        min: 1,
                        max: CANVAS_HEIGHT / 2,
                        value: DEFAULT_OUT_RADIUS,
                    }
                ]

const colorThresholdPickerParams: PickerParams = [
                    {
                        id: 0,
                        label: '-/+',
                        min: 0,
                        max: 100,
                        value: DEFAULT_COLOR_THRESHOLD,
                    }
                ]


</script>

<template>
    <div
        class="container"
    >
        <div class="settings">
            <SlidersPicker 
                v-model="colorThreshold"
                name="Color threshold"
                :params="colorThresholdPickerParams"
            />
            <div class="separationBorder"></div>
            <SlidersPicker 
                v-model="rgbColor"
                name="Background color"
                :params="colorPickerParams"
            />
            <div class="separationBorder main"></div>
            <SlidersPicker 
                v-model="radius"
                name="Radius"
                :params="radiusPickerParams"
            />
            <div class="separationBorder"></div>
            <SlidersPicker 
                v-model="angleLines"
                name="Lines angle"
                :params="anglePickerParams"
            />
            <div class="separationBorder"></div>
            <SlidersPicker 
                v-model="angleRose"
                name="Rose angle"
                :params="angleRadiusPickerParams"
            />
        </div>
        <div class="videoProcess">
            <VideoUploader
                :height="CANVAS_HEIGHT"
                :video-processing="videoProcessing"
            />     
            <canvas id="outputCanvas" ></canvas>    
            <IconRightArrow id="iconRightArrow"/>
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
                :angle="angleLines[0]"
            />
            <Rose 
                :colors="colorResultsArray"
                :backgroundColor="rgbColor"
                :height="CANVAS_HEIGHT"
                :width="CANVAS_HEIGHT"
                :angle="angleRose[0]"
                :outsideRadius="angleRose[1]"
            />  
        </div>
    </div>
</template>

<style>

.container {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 1em;
    text-align: center;
}

#outputCanvas {
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
    border: 1px solid rgba(83, 83, 83, 0.186);
    border-radius: 0.5em;
    margin-bottom: 2em;
    margin-top: 1em;
    padding: 1em;
    background-color: rgba(236, 235, 228, 0.6);
}

.separationBorder {
    margin: 1em;
    border: 1px dashed rgb(155, 136, 136);
}

.separationBorder.main {
    margin-top: 0.5em;
    margin-bottom: 0.5em;
    margin-left: 1.5em;
    margin-right: 1.5em;
    border: 1px solid rgb(155, 136, 136);
}

.videoProcess {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    position: relative;
}


</style>