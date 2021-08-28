<template>
  <v-app background="#f00">
    <v-main>
      <v-container>
        <Nuxt />
      </v-container>
    </v-main>
  </v-app>
</template>



<style>
.theme--dark.v-application {
  background-color: var(--v-background-base, #121212) !important;
}

.theme--light.v-application {
  background-color: var(--v-background-base, white) !important;
}
</style>