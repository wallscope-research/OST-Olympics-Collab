<template lang="pug">
div
	h2.chart-title Top Male Athlets
	.athletsList
		Tag(tag-text='Michael Fred Phelps II')
		Tag(tag-text='Alexij Moscal')
		Tag(tag-text='Joe Hobbs')
		Tag(tag-text='Robert Klein')
		Tag(tag-text='Max Rogger')


</template>


<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import Tag from '@/components/Tag.vue'

@Component({components: { Tag }})
export default class TopMaleAthlets extends Vue {}
</script>


<style lang="scss">

</style>