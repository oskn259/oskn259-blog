<template>
  <v-app class="root">

    <v-main>
      <v-container>
        <Nuxt />
      </v-container>
    </v-main>

    <v-footer class="pa-2">
      <v-col class="text-center" cols="12" >

        <v-container class="pa-0 mb-3">
          <a href="https://twitter.com/oskn259" style="text-decoration: none;">
            <v-icon class="mdi mdi-twitter mx-2"/>
          </a>
          <a href="https://github.com/oskn259" style="text-decoration: none;">
            <v-icon class="mdi mdi-github mx-2"/>
          </a>
        </v-container>

        <div class="text-caption">© oskn259 2021</div>

      </v-col>
    </v-footer>
  </v-app>
</template>



<style scoped>
.root {
  font-family: 'Noto Sans Japanese', "游ゴシック体", "Yu Gothic", YuGothic, "ヒラギノ角ゴシック Pro", "Hiragino Kaku Gothic Pro", 'メイリオ', Meiryo, Osaka, "ＭＳ Ｐゴシック", "MS PGothic", sans-serif;
}

.theme--dark.v-application {
  background-color: var(--v-background-base, #121212) !important;
}

.theme--light.v-application {
  background-color: var(--v-background-base, white) !important;
}
</style>