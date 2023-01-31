<script setup lang="ts">

import { rgb2hsl , hsl2rgb, color2string, string2color } from '../utils.js'
import IconRightArrow from './icons/IconRightArrow.vue'
import Circle from './Circle.vue'
import Lines from './Lines.vue'
import Rose from './Rose.vue'
import SlidersPicker from './SlidersPicker.vue'
import { ref } from 'vue'
import VideoUploader from './VideoUploader.vue'

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

const video = ref<HTMLVideoElement>()
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

    function computeFrame() {
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
        let maxColor = [colorKeys[0], colorDistribution[colorKeys[0]]]
        for (let i = 0; i < colorKeys.length; i++) {
            if (colorDistribution[colorKeys[i]] > maxColor[1]) maxColor = [colorKeys[i], colorDistribution[colorKeys[i]]]
        }

        numberFrameProcessed++

        let result = string2color(maxColor[0])
        colorResultsArray.value.push(result)

        if (numberFrameProcessed < MAX_COUNT && currentVideoSource === videoSource) setTimeout(computeFrame, 0)
    }

    video?.addEventListener('play', computeFrame )
}

const rgbColor = ref([255, 255, 255])
const radius = ref([CANVAS_HEIGHT / 2, CANVAS_HEIGHT / 4])
const angleRose = ref([20])
const angleLines = ref([0])
const isSorted = ref(false)
      
const colorPickerParams: PickerParams = [
                    {
                        id: 0,
                        label: 'R',
                        min: 0,
                        max: 255,
                        value: 255,
                    },
                    {
                        id: 1,
                        label: 'G',
                        min: 0,
                        max: 255,
                        value: 255,
                    },
                    {
                        id: 2,
                        label: 'B',
                        min: 0,
                        max: 255,
                        value: 255,
                    },
                ]

const radiusPickerParams: PickerParams = [
                    {
                        id: 0,
                        label: 'Out',
                        min: 0,
                        max: CANVAS_HEIGHT / 2,
                        value: CANVAS_HEIGHT / 2,
                    },
                    {
                        id: 1,
                        label: 'In',
                        min: 1,
                        max: CANVAS_HEIGHT / 2,
                        value: CANVAS_HEIGHT / 4,
                    }
                ]

const anglePickerParams: PickerParams = [
                    {
                        id: 0,
                        label: 'Angle',
                        min: 0,
                        max: 360,
                        value: 0,
                    }
                ]

</script>

<template>
    <div
        class="container"
    >
        <div class="settings">
            <SlidersPicker 
                v-model="rgbColor"
                name="Background color"
                :params="colorPickerParams"
            />
            <div class="separationBorder"></div>
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
                :params="anglePickerParams"
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
    border: 3px solid rgba(83, 83, 83, 0.186);
    border-radius: 0.5em;
    margin-bottom: 2em;
    margin-top: 1em;
    padding: 1em;
}

.colorPicker {
    margin: 0.1em;
}

.separationBorder {
    margin: 1em;
    border: 1px solid rgb(155, 136, 136);
}

.videoProcess {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
}


</style>