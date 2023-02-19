<script setup lang="ts">
import SlidersPicker from './SlidersPicker.vue'
import ColorPicker from './ColorPicker.vue'
import IconCircle from '../icons/IconCircle.vue'
import IconLines from '../icons/IconLines.vue'
import IconRose from '../icons/IconRose.vue'
import { SETTINGS } from '@/assets/texts'
import type { pickerParams, settingsAttributes } from '@/assets/types'
import { DEFAULT_ANGLE , DEFAULT_ANGLE_ROSE, DEFAULT_COLOR_THRESHOLD, DEFAULT_RGB_COLOR } from '@/assets/constants'

const props = defineProps<{
    canvasSize: number,
    attributes: settingsAttributes
/*     colorThreshold: number[],
    rgbColor: string[],
    radius: number[],
    angleLines: number[],
    angleRose: number[] */
}>()

const DEFAULT_OUT_RADIUS: number = props.canvasSize * 0.45
const DEFAULT_IN_RADIUS: number = props.canvasSize * 0.25

const radiusPickerParams: pickerParams = [
                    {
                        id: 0,
                        label: SETTINGS.label.outsideRadius,
                        min: 0,
                        max: props.canvasSize / 2,
                        value: DEFAULT_OUT_RADIUS,
                    },
                    {
                        id: 1,
                        label: SETTINGS.label.insideRadius,
                        min: 1,
                        max: props.canvasSize / 2,
                        value: DEFAULT_IN_RADIUS,
                    }
                ]

const anglePickerParams: pickerParams = [
                    {
                        id: 0,
                        label: SETTINGS.label.linesAngle,
                        min: 0,
                        max: 360,
                        value: DEFAULT_ANGLE,
                    }
                ]

const angleRadiusPickerParams: pickerParams = [
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
                        max: props.canvasSize / 2,
                        value: DEFAULT_OUT_RADIUS,
                    }
                ]

const colorThresholdPickerParams: pickerParams = [
                    {
                        id: 0,
                        label: SETTINGS.label.colorThreshold,
                        min: 0,
                        max: 100,
                        value: DEFAULT_COLOR_THRESHOLD,
                    }
                ]


</script>

<template>
        <div class="settings">
            <div>
                <SlidersPicker 
                    v-model="attributes.general.colorThreshold"
                    :name="SETTINGS.label.colorThreshold"
                    :params="colorThresholdPickerParams"
                    >
                <template #icon>
                   {{ SETTINGS.generalTitle }}
                </template>
            </SlidersPicker>
                <ColorPicker
                    v-model="attributes.general.rgbColor"
                    :name="SETTINGS.label.backgroundColor"
                    :label="SETTINGS.label.backgroundColor"
                    :value="DEFAULT_RGB_COLOR"
                />                
            </div>
            <div class="separationBorder main"></div>
            <SlidersPicker 
                v-model="attributes.circle.radius"
                name="Circle"
                :params="radiusPickerParams"
            >
                <template #icon>
                    <IconCircle/>
                </template>
            </SlidersPicker>
            <div class="separationBorder"></div>
            <SlidersPicker 
                v-model="attributes.lines.angle"
                name="Lines"
                :params="anglePickerParams"
            >
                <template #icon>
                    <IconLines/>
                </template>
            </SlidersPicker>
            <div class="separationBorder"></div>
            <SlidersPicker 
                v-model="attributes.rose.angle"
                name="Rose"
                :params="angleRadiusPickerParams"
            >
                <template #icon>
                    <IconRose/>
                </template>
            </SlidersPicker>
        </div>
</template>

<style>
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
</style>