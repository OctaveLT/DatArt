<script setup lang="ts">

import { rgb2hsl , hex2rgb, hsl2rgb, color2string, string2color, useBreakpoints } from '../utils.js'
import IconRightArrow from './icons/IconRightArrow.vue'
import Circle from './canvas/Circle.vue'
import Lines from './canvas/Lines.vue'
import Rose from './canvas/Rose.vue'
import SlidersPicker from './elements/SlidersPicker.vue'
import ColorPicker from './elements/ColorPicker.vue'
import { onMounted, onUnmounted, ref, reactive } from 'vue'
import VideoUploader from './elements/VideoUploader.vue'
import IconCircle from './icons/IconCircle.vue'
import IconLines from './icons/IconLines.vue'
import IconRose from './icons/IconRose.vue'
import IconInfoCircle from './icons/IconInfoCircle.vue'
import Modal from './elements/Modal.vue'
import { SETTINGS } from '../assets/texts'

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
const DEFAULT_ANGLE_ROSE = 120
const DEFAULT_ANGLE = 0
const DEFAULT_COLOR_THRESHOLD = 25
const DEFAULT_IS_SORTED = false
const DEFAULT_RGB_COLOR = '#ffffff'
const CANVAS_WIDTH_RATIO = 0.21
const canvasResponsiveSize = useBreakpoints(CANVAS_WIDTH_RATIO)
const DEFAULT_OUT_RADIUS = canvasResponsiveSize.value * 0.45
const DEFAULT_IN_RADIUS = canvasResponsiveSize.value * 0.25

const colorResultsArray = ref<string[][]>([])

const rgbColor = ref([DEFAULT_RGB_COLOR])
const radius = ref([DEFAULT_OUT_RADIUS, DEFAULT_IN_RADIUS])
const angleRose = ref([DEFAULT_ANGLE_ROSE, DEFAULT_OUT_RADIUS])
const angleLines = ref([DEFAULT_ANGLE])
const isSorted = ref(DEFAULT_IS_SORTED)
const colorThreshold = ref([DEFAULT_COLOR_THRESHOLD])
const showInformation = ref<boolean>(false)

const radiusPickerParams: PickerParams = [
                    {
                        id: 0,
                        label: SETTINGS.label.outsideRadius,
                        min: 0,
                        max: canvasResponsiveSize.value / 2,
                        value: DEFAULT_OUT_RADIUS,
                    },
                    {
                        id: 1,
                        label: SETTINGS.label.insideRadius,
                        min: 1,
                        max: canvasResponsiveSize.value / 2,
                        value: DEFAULT_IN_RADIUS,
                    }
                ]

const anglePickerParams: PickerParams = [
                    {
                        id: 0,
                        label: SETTINGS.label.linesAngle,
                        min: 0,
                        max: 360,
                        value: DEFAULT_ANGLE,
                    }
                ]

const angleRadiusPickerParams: PickerParams = [
                    {
                        id: 0,
                        label: SETTINGS.label.roseAngle,
                        min: 0,
                        max: 360,
                        value: DEFAULT_ANGLE_ROSE,
                    }
                    ,
                    {
                        id: 1,
                        label: SETTINGS.label.roseRadius,
                        min: 1,
                        max: canvasResponsiveSize.value / 2,
                        value: DEFAULT_OUT_RADIUS,
                    }
                ]

const colorThresholdPickerParams: PickerParams = [
                    {
                        id: 0,
                        label: SETTINGS.label.colorThreshold,
                        min: 0,
                        max: 100,
                        value: DEFAULT_COLOR_THRESHOLD,
                    }
                ]

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

const toggleShowInformation = () => {
    showInformation.value = !showInformation.value
}

</script>

<template>
    <div
        class="container"
    >
        <div class="settings">
            <div>
                <SlidersPicker 
                    v-model="colorThreshold"
                    :name="SETTINGS.label.colorThreshold"
                    :params="colorThresholdPickerParams"
                    >
                <template #icon>
                   {{ SETTINGS.generalTitle }}
                </template>
            </SlidersPicker>
                <ColorPicker
                    v-model="rgbColor"
                    :name="SETTINGS.label.backgroundColor"
                    :label="SETTINGS.label.backgroundColor"
                    :value="DEFAULT_RGB_COLOR"
                />                
            </div>
            <div class="separationBorder main"></div>
            <SlidersPicker 
                v-model="radius"
                name="Circle"
                :params="radiusPickerParams"
            >
                <template #icon>
                    <IconCircle/>
                </template>
            </SlidersPicker>
            <div class="separationBorder"></div>
            <SlidersPicker 
                v-model="angleLines"
                name="Lines"
                :params="anglePickerParams"
            >
                <template #icon>
                    <IconLines/>
                </template>
            </SlidersPicker>
            <div class="separationBorder"></div>
            <SlidersPicker 
                v-model="angleRose"
                name="Rose"
                :params="angleRadiusPickerParams"
            >
                <template #icon>
                    <IconRose/>
                </template>
            </SlidersPicker>
        </div>
        <div class="videoProcess">
            <VideoUploader
                :height="canvasResponsiveSize"
                :video-processing="videoProcessing"
            />     
            <canvas id="outputCanvas" ></canvas>    
            <IconRightArrow id="iconRightArrow"/>
            <Circle 
                :colors="colorResultsArray"
                :backgroundColor="hex2rgb(rgbColor[0])"
                :height="canvasResponsiveSize"
                :width="canvasResponsiveSize"
                :outsideRadius="radius[0]"
                :insideRadius="radius[1]"
            />
            <Lines 
                :colors="colorResultsArray"
                :backgroundColor="hex2rgb(rgbColor[0])"
                :height="canvasResponsiveSize"
                :width="canvasResponsiveSize"
                :scale="2"
                :isColorsSorted="isSorted"
                :angle="angleLines[0]"
            />
            <Rose 
                :colors="colorResultsArray"
                :backgroundColor="hex2rgb(rgbColor[0])"
                :height="canvasResponsiveSize"
                :width="canvasResponsiveSize"
                :angle="angleRose[0]"
                :outsideRadius="angleRose[1]"
            />  
        </div>
    </div>
    <IconInfoCircle 
        class="iconInfoCircle" 
        @click="toggleShowInformation"
    />
    <div class="beta">
        Beta
    </div>
    <Modal
        v-model:isShown="showInformation"
    />
</template>

<style>

.container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    height: 100vh;
    padding-bottom: 1em;
}

#outputCanvas {
    display: none;
}

#iconRightArrow {
    color: #CC998D;
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
    flex-basis: 25%;
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

.iconInfoCircle {
    position: fixed;
    top: 1em;
    right: 1em;
    transition: 0.2s;
    cursor: pointer;
}

.iconInfoCircle:hover {
    transform: scale(1.1);
}

@keyframes scale {
    0% {
            transform: scale(1)
        }
    75% {
            transform: scale(1)
        }
    80% {
        transform: scale(1.3)
        }
    90% {
        transform: scale(1);
    }
}

.beta {
    position: fixed;
    top: 2.3em;
    right: 1em;
    color: #CC998D;
    animation: scale 10s linear 0s infinite alternate;
}



</style>