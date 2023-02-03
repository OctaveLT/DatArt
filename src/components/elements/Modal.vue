<script setup lang="ts">
import IconX from '../icons/IconX.vue';
import IconLinkedIn from '../icons/IconLinkedIn.vue';
import IconGitHub from '../icons/IconGitHub.vue';
import { INFORMATION } from '../../assets/texts'

const props = defineProps<{
    isShown: boolean,
}>()

const emit = defineEmits(['update:isShown'])

const toggleModal = () => {
    emit('update:isShown', !props.isShown)
}

</script>

<template>
    <transition name="fade" mode="out-in">
        <div class="modal" v-show="isShown">
            <div class="greyBackground" @click="toggleModal">
            </div>
            <div class="information" @click="(e: Event) => e.preventDefault()">
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
                <IconX class="closeIcon" @click="toggleModal"/>
            </div>
        </div>
    </transition>
</template>

<style>
.modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 100;
}

.modal > .greyBackground {
    background-color: rgba(197, 197, 197, 0.5);
    position: absolute;
    width: 100%;
    height: 100%;
}

.modal > .information {
    max-width: 70%;
    padding: 1.8em;
    background-color: #CC998D;
    border-radius: 1em;
}

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

.modal > .information > .closeIcon {
    position: absolute;
    top: 0.5em;
    right: 0.5em;
}

.modal > .information > .closeIcon:hover {
    transform: scale(1.3);
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s;
}

.fade-enter, .fade-leave-to {
  opacity: 0;
}
</style>