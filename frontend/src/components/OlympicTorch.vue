<template lang="pug">
  div
    svg(xmlns='http://www.w3.org/2000/svg' style="display:none" )
      symbol#sbx-icon-search-11(xmlns='http://www.w3.org/2000/svg' viewBox="0 0 1600.000000 2050.000000" )
        path(d='M1297 2164 c-13 -36 -160 -202 -217 -245 -30 -23 -95 -62 -144 -86\
        -196 -98 -291 -179 -316 -268 -17 -61 -8 -165 21 -240 l24 -60 7 42 c9 54 22\
        79 67 126 45 49 80 67 126 67 134 0 169 -169 61 -297 -15 -18 -22 -34 -17 -38\
        18 -11 128 13 179 39 133 68 202 208 232 471 17 149 -2 550 -23 489z')
        path(d='M247 1388 c26 -140 89 -301 142 -360 17 -20 31 -43 31 -51 0 -31 -54\
        -164 -116 -288 -58 -117 -266 -501 -284 -524 -23 -32 -16 -129 12 -146 21 -14\
        75 -10 110 7 24 12 56 52 118 147 194 299 401 542 504 591 46 22 56 24 104 15\
        37 -7 76 -7 125 1 73 11 193 46 201 58 3 6 -722 450 -901 552 l-53 30 7 -32z')
    svg.custom(role='img' aria-label='Search' :style="'width:' + iconWidth + 'px' +';'+ 'height:' + iconHeight + 'px'")
      use(xlink:href='#sbx-icon-search-11')
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';


@Component
export default class OlympicTorch extends Vue {
  @Prop() iconWidth!: number;
  @Prop() iconHeight!: number;
}
</script>

<style lang="scss">
svg.custom {
  // width: 28px;
  // height: 40px;
  fill: #756c88;
  vertical-align: middle;
  transform: scale(1, -1);
}
</style>