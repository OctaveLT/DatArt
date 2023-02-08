<script setup lang="ts">
import Modal from './Modal.vue';
import IconX from '../icons/IconX.vue';
import IconLinkedIn from '../icons/IconLinkedIn.vue';
import IconGitHub from '../icons/IconGitHub.vue';
import { INFORMATION } from '../../assets/texts'
import { ref } from 'vue';
import IconInfoCircle from '../icons/IconInfoCircle.vue';

const showInformation = ref<boolean>(false)

const toggleShowInformation = () => {
    showInformation.value = !showInformation.value
}

</script>

<template>
    <div class="informationModal">
        <Modal
            v-model:isShown="showInformation"
        >
            <template #content>
                <h1>{{ INFORMATION.title }}<img src="/datArtLogo.svg"/></h1>
                <p class="intro"><img src="/circle.png"/>{{ INFORMATION.intro }}</p>
                <br/>
                <p>
                    <b>{{ INFORMATION.about }}</b>
                    {{ INFORMATION.myself }}
                </p>
                <div class="links">
                    <a href="https://www.linkedin.com/in/octave-le-tullier" target="_blank"><IconLinkedIn/></a>
                    <a href="https://github.com/OctaveLT" target="_blank"><IconGitHub/></a>
                </div>
            </template>
        </Modal>
        <IconInfoCircle
            class="informationClickableIcon" 
            @click="toggleShowInformation"
        />
        <div class="beta">
            Beta
        </div>
    </div>

</template>

<style>

.modal > .information > h1 {
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 0.5em;
}

.modal > .information > h1 > img {
    margin-left: 0.2em;
    height: 1em;
    width: 1em;
}

.modal > .information > .intro {
    display: flex;
    align-items: center;
    justify-content: center;
}

.modal > .information > .intro > img {
    height: 10em;
    width: 10em;
    margin-right: 1em;
}

.modal > .information b {
    font-weight: bold;
}

.modal > .information > .links {
    padding-top: 1.1em;
    display: flex;
    justify-content: center;
}

.modal > .information > .links > a {
    margin-right: 1em;
}

.modal > .information > .links > a:hover {
    transform: scale(1.1);
}

.informationClickableIcon {
    position: fixed;
    top: 1em;
    right: 1em;
    transition: 0.2s;
    cursor: pointer;
}

.informationClickableIcon:hover {
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