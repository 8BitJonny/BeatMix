<template>
  <div>
    <notifications width="434px" position="top center" group="error">
      <template slot="body" slot-scope="props">
        <ErrorMessage :text="props.item.text" />
      </template>
    </notifications>
    <notifications width="350px" position="top center" group="success">
      <template slot="body" slot-scope="props">
        <SuccessMessage />
      </template>
    </notifications>
    <TheNavBar />
    <nuxt />
    <TheFooter />
  </div>
</template>

<script>
import TheNavBar from '~/components/TheNavBar.vue'
import TheFooter from '~/components/TheFooter'
import ErrorMessage from '~/components/errorNotification.vue'
import SuccessMessage from '~/components/successNotification.vue'

export default {
  components: {
    TheNavBar,
    TheFooter,
    ErrorMessage,
    SuccessMessage
  }
}
</script>

<style>
@import url('https://fonts.googleapis.com/css?family=Montserrat&display=swap');

html {
  font-family: 'Source Sans Pro', -apple-system, BlinkMacSystemFont, 'Segoe UI',
    Roboto, 'Helvetica Neue', Arial, sans-serif;
  font-size: 16px;
  word-spacing: 1px;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
}

*,
*:before,
*:after {
  box-sizing: border-box;
  margin: 0;
}

html, body {
  width: 100vw;
  overflow-x: hidden;
}

body {
  background-color: #191414;
  font-family: 'Montserrat', sans-serif;
  @apply text-white
}


.mobile {
  display: none;
}

@media (max-width: 400px) {
  .mobile {
    display: block;
  }
  .desktop {
    display: none;
  }
}

.container {
  @apply flex-auto flex flex-col items-center text-center mx-auto my-8
}
.content {
  @apply flex flex-col
}

.vue-notification {
  padding: 0.7rem;
  color: #fff;
  margin-top: 21px;
  border-radius: 4px;
  font-size: 16px;
  display: flex;
  align-items: center;
}

.vue-notification > svg {
  height: 25px;
  margin-right: 10px;
}

.button--green {
  display: inline-block;
  border-radius: 4px;
  border: 1px solid #3b8070;
  color: #3b8070;
  text-decoration: none;
  padding: 10px 30px;
}

.button--green:hover {
  color: #fff;
  background-color: #3b8070;
}

.button--grey {
  display: inline-block;
  border-radius: 4px;
  border: 1px solid #35495e;
  color: #35495e;
  text-decoration: none;
  padding: 10px 30px;
  margin-left: 15px;
}

.button--grey:hover {
  color: #fff;
  background-color: #35495e;
}

.title {
  display: block;
  letter-spacing: 1px;
  @apply font-semibold text-6xl
}
.subtitle {
  @apply text-xl
}
</style>
