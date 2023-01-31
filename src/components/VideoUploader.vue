<script setup lang="ts">

import { ref } from 'vue'

const props = defineProps<{
    height: number,
    videoProcessing: (video: HTMLVideoElement, videoSource: string) => void
}>()

const videoSource = ref<string>('')
const fileInput = ref<HTMLInputElement>()
const video = ref<HTMLVideoElement>()

const onPickVideo = () => {
    fileInput.value?.click()
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
        console.log('No found "files" property');
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
        <video 
            id="video" 
            ref="video"
            :width="height" 
            :height="height"
            v-show="videoSource" 
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
            Upload a video to extract its color! (Preferably low quality)
        </button>
</template>

<style>

video {
    border: 1px solid grey;
    border-radius: 1em;
    background-color: rgb(220, 217, 217);
    margin: 1em;
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

</style>