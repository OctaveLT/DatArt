<script setup lang="ts">

import { ref } from 'vue'

const props = defineProps<{
    height: number,
    videoProcessing: (video: HTMLVideoElement, videoSource: string) => void,
}>()

const videoSource = ref<string>('')
const fileInput = ref<HTMLInputElement>()
const video = ref<HTMLVideoElement>()
const height = ref<number>(props.height)

const onPickVideo = () => {
    fileInput.value?.click()
}

const chooseNewVideo = () => {
    video.value?.pause()
    onPickVideo()
}

const restartVideo = () => {
    video.value?.load()
}

const onVideoPicked = () => {
    console.log('Trying to upload the video file: %O', fileInput.value)
    if (fileInput.value && 'files' in fileInput.value) {
        if (fileInput.value.files && fileInput.value.files.length > 0) {
            videoSource.value = URL.createObjectURL(fileInput.value.files[0])
            video.value?.addEventListener('loadeddata', () => props.videoProcessing(video.value as HTMLVideoElement, videoSource.value))
        } else {
            alert("Select a file to upload")
        }
    } else {
        console.log('No found "files" property')
    }
}  

</script>

<template>
    <input
        id="inputVideo"
        type="file"
        ref="fileInput"
        accept="video/*"
        @change="onVideoPicked"
    />
    <div v-show="videoSource" class="videoContainer">
        <video 
            id="video" 
            ref="video"
            :width="height" 
            :height="height"
            :src="videoSource" 
            autoplay
            controls
            muted
        >
        </video>
        <div class="pickNewVideo" >
            <button @click="chooseNewVideo">
                New video
            </button>
            <button @click="restartVideo">
                Restart
            </button>
        </div>
    </div>
    <button
        class="noVideo"
        v-show="!videoSource"
        @click="onPickVideo"
    >
        Upload a video to extract its color! (Preferably low quality)
    </button>
</template>

<style>

video {
    border: 1px solid grey;
    border-radius: 1em;
    background-color: rgb(220, 217, 217);
    margin: 1em;
    cursor: pointer;
}

.videoContainer:hover > .pickNewVideo {
    visibility: visible;
    cursor: pointer;
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

#inputVideo {
    display: none;
}

.pickNewVideo {
    visibility: hidden;
    position: absolute;
    bottom: -1.3em;
    transition: transform .2s;
    align-self: center;
    display: inline;
}

.pickNewVideo:hover {
    transform: scale(1.1);
}

</style>