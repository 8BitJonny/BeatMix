<template>
  <div class="content">
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
    <NavBar :userPicture="user.image" />
    <div class="container">
      <div class="mb-12">
        <h1 class="title">
          <span class="desktop">
            Fusify - Artist Mixer
          </span>
          <span class="mobile">
            Fusify
          </span>
        </h1>
        <p class="subtitle">
          Your favourite artists in one playlist within seconds.
        </p>
      </div>
      <Search
        @click="checkAuth"
        :userId="user.id"
      />
    </div>
  </div>
</template>

<script>
import Search from '~/components/Search.vue'
import NavBar from '~/components/NavBar.vue'
import ErrorMessage from '~/components/errorNotification.vue'
import SuccessMessage from '~/components/successNotification.vue'

export default {
  data: () => {
    return {
      user: {
        image: null,
        id: null
      }
    }
  },
  components: {
    Search,
    NavBar,
    ErrorMessage,
    SuccessMessage
  },
  methods: {
    checkAuth: function() {
      if (!this.cookies['spotify_auth_token']) {
        location.assign(`/login?redirect_uri=${this.getBaseUrl()}/auth/callback`)
      }
    },
    getBaseUrl() {
      return `${window.location.protocol}//${window.location.host}`
    }
  },
  computed: {
    cookies: function() {
      const pairs = document.cookie.split(";");
      let cookies = {};
      for (let i=0; i<pairs.length; i++){
        let pair = pairs[i].split("=");
        cookies[(pair[0]+'').trim()] = unescape(pair.slice(1).join('='));
      }
      return cookies;
    }
  },
  mounted: function() {
    if (this.cookies['spotify_auth_token']) {
      this.$axios.$get('https://api.spotify.com/v1/me',
        { headers: {
          'Authorization': 'Bearer ' + this.cookies['spotify_auth_token']
        }}
      ).then(result => {
        this.user.image = result.images.length > 0 ? result.images[0].url : 'default';
        this.user.id = result.id;
      }).catch(err => {
        if (err.response.data.error.message === 'The access token expired') {
          location.assign("/refreshToken")
        }
      })
    }
  }
}
</script>

<style>
@import url('https://fonts.googleapis.com/css?family=Montserrat&display=swap');

html, body {
  width: 100vw;
}

body {
  background-color: #191414;
  font-family: 'Montserrat', sans-serif;
  @apply text-white
}

.container {
  @apply flex-auto flex flex-col items-center text-center mx-auto my-16
}
.content {
  @apply min-h-screen flex flex-col
}

.title {
  display: block;
  letter-spacing: 1px;
  @apply font-semibold text-6xl
}
.subtitle {
  @apply text-xl
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
</style>
