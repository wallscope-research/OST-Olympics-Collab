<template lang="pug">
div
	h2.chart-title Top Female Athlets
	.athletsList
		Tag(tag-text='Ewe Roberts')
		Tag(tag-text='Maria Kora')
		Tag(tag-text='Natasha Morrison')
		Tag(tag-text='Barbara Fic')
		Tag(tag-text='Angela Gaya Rose')
</template>


<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Tag from '@/components/Tag.vue'

@Component({components: { Tag }})
export default class TopFemaleAthlets extends Vue {}
</script>


<style lang="scss">

</style>