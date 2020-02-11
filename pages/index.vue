<template>
  <div class="content">
    <notifications group="error">
      <template slot="body" slot-scope="props">
        <div class="vue-notification error">
          <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 512 512" style="enable-background:new 0 0 512 512;" xml:space="preserve" width="25px" height="25px" class=""><g><g>
            <g>
              <path d="M505.403,406.394L295.389,58.102c-8.274-13.721-23.367-22.245-39.39-22.245c-16.023,0-31.116,8.524-39.391,22.246    L6.595,406.394c-8.551,14.182-8.804,31.95-0.661,46.37c8.145,14.42,23.491,23.378,40.051,23.378h420.028    c16.56,0,31.907-8.958,40.052-23.379C514.208,438.342,513.955,420.574,505.403,406.394z M477.039,436.372    c-2.242,3.969-6.467,6.436-11.026,6.436H45.985c-4.559,0-8.784-2.466-11.025-6.435c-2.242-3.97-2.172-8.862,0.181-12.765    L245.156,75.316c2.278-3.777,6.433-6.124,10.844-6.124c4.41,0,8.565,2.347,10.843,6.124l210.013,348.292    C479.211,427.512,479.281,432.403,477.039,436.372z" data-original="#000000" class="active-path" data-old_color="#000000" fill="#FFFFFF"/>
            </g>
          </g><g>
            <g>
              <path d="M256.154,173.005c-12.68,0-22.576,6.804-22.576,18.866c0,36.802,4.329,89.686,4.329,126.489    c0.001,9.587,8.352,13.607,18.248,13.607c7.422,0,17.937-4.02,17.937-13.607c0-36.802,4.329-89.686,4.329-126.489    C278.421,179.81,268.216,173.005,256.154,173.005z" data-original="#000000" class="active-path" data-old_color="#000000" fill="#FFFFFF"/>
            </g>
          </g><g>
            <g>
              <path d="M256.465,353.306c-13.607,0-23.814,10.824-23.814,23.814c0,12.68,10.206,23.814,23.814,23.814    c12.68,0,23.505-11.134,23.505-23.814C279.97,364.13,269.144,353.306,256.465,353.306z" data-original="#000000" class="active-path" data-old_color="#000000" fill="#FFFFFF"/>
            </g>
          </g></g> </svg>
          {{props.item.text}}
        </div>
      </template>
    </notifications>
    <NavBar :userPicture="user.image" />
    <div class="container">
      <h1 class="title">
        Spotify Music Mixer
      </h1>
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
    NavBar
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
        this.user.image = result.images[0].url;
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
  @apply font-semibold text-6xl mb-16
}

.vue-notification {
  padding: 0.7rem;
  top: 0.6rem;
  color: #fff;
  position: absolute;
  left: 50%;
  -webkit-transform: translateX(-50%);
  transform: translateX(-50%);
  margin-top: 15px;
  border-radius: 4px;
  font-size: 16px;
  display: flex;
  align-items: center;
}

.vue-notification > svg {
  height: 25px;
  margin-right: 10px;
}

.vue-notification.error {
  background: #BF1A2F;
}
</style>
