<template>
  <div class="search-multi-match__container">
    <h2 class="title">{{ route.query.keywords }}</h2>

    <el-tabs v-model="activeName" @tab-change="handleTabChange">
      <el-tab-pane label="单曲" name="songs" lazy>
        <song-table
          v-model:limit="songLimit"
          v-model:offset="songOffset"
          :data="songs"
          :total="songsCount"
          @pagination="getSongs()"
        />
      </el-tab-pane>

      <el-tab-pane label="歌单" name="playlists" lazy>
        <PlaylistPane
          v-model:limit="playlistLimit"
          v-model:offset="playlistOffset"
          :data="playlists"
          :total="playlistsCount"
          @pagination="getPlaylists()"
        />
      </el-tab-pane>

      <el-tab-pane label="专辑" name="albums" lazy>
        <AlbumPane
          v-model:limit="albumLimit"
          v-model:offset="albumOffset"
          :data="albums"
          :total="albumsCount"
          @pagination="getAlbums()"
        />
      </el-tab-pane>

      <el-tab-pane label="歌手" name="artists" lazy>
        <ArtistPane
          v-model:limit="artistLimit"
          v-model:offset="artistOffset"
          :data="artists"
          :total="artistsCount"
          @pagination="getArtists()"
        />
      </el-tab-pane>

      <el-tab-pane label="用户" name="users" lazy>
        <Subscribers
          v-model:limit="userLimit"
          v-model:offset="userOffset"
          :data="userProfiles"
          :total="userCount"
          @pagination="getUserProfiles()"
        />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup lang="ts">
import { cloudSearchApi } from '@/api'
import { computed, onActivated, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { setBackgroundColor } from '@/utils'
import PlaylistPane from './PlaylistPane.vue'
import AlbumPane from './AlbumPane.vue'
import ArtistPane from './ArtistPane.vue'
import Subscribers from '../PlaylistDetail/Subscribers.vue'

import type {
  Album,
  Artist,
  PlaylistItem,
  Profile,
  SongDetail,
} from '@/api/types/type'
import type { TabPaneName } from 'element-plus'

defineOptions({
  name: 'SearchMultiMatch',
})

const activeName = ref<string>('songs')
const route = useRoute()
const keywords = computed(() => route.query.keywords as string)

const songs = ref<SongDetail[]>([])
const songsCount = ref<number>(0)
const songLimit = ref<number>(15)
const songOffset = ref<number>(0)

const playlists = ref<PlaylistItem[]>([])
const playlistsCount = ref<number>(0)
const playlistLimit = ref<number>(24)
const playlistOffset = ref<number>(0)

const albums = ref<Album[]>([])
const albumsCount = ref<number>(0)
const albumLimit = ref<number>(24)
const albumOffset = ref<number>(0)

const artists = ref<Artist[]>([])
const artistsCount = ref<number>(0)
const artistLimit = ref<number>(24)
const artistOffset = ref<number>(0)

const userProfiles = ref<Profile[]>([])
const userCount = ref<number>(0)
const userLimit = ref<number>(24)
const userOffset = ref<number>(0)

const getSongs = async () => {
  const { result } = await cloudSearchApi<'1'>({
    keywords: keywords.value,
    type: '1',
    limit: songLimit.value,
    offset: songOffset.value,
  })
  songs.value = result.songs
  songsCount.value = result.songCount
}

const getPlaylists = async () => {
  const { result } = await cloudSearchApi<'1000'>({
    keywords: keywords.value,
    type: '1000',
    limit: playlistLimit.value,
    offset: playlistOffset.value,
  })

  playlists.value = result.playlists
  playlistsCount.value = result.playlistCount
}

const getAlbums = async () => {
  const { result } = await cloudSearchApi<'10'>({
    keywords: keywords.value,
    type: '10',
    limit: albumLimit.value,
    offset: albumOffset.value,
  })
  albums.value = result.albums
  albumsCount.value = result.albumCount
}

const getArtists = async () => {
  const { result } = await cloudSearchApi<'100'>({
    keywords: keywords.value,
    type: '100',
    limit: artistLimit.value,
    offset: artistOffset.value,
  })
  artists.value = result.artists
  artistsCount.value = result.artistsCount
}

const getUserProfiles = async () => {
  const { result } = await cloudSearchApi<'1002'>({
    keywords: keywords.value,
    type: '1002',
    limit: userLimit.value,
    offset: userOffset.value,
  })
  userProfiles.value = result.userprofiles
  userCount.value = result.userprofileCount
}

const handleTabChange = (name: TabPaneName) => {
  if (name === 'songs') {
    getSongs()
  } else if (name === 'playlists') {
    getPlaylists()
  } else if (name === 'albums') {
    getAlbums()
  } else if (name === 'artists') {
    getArtists()
  } else if (name === 'users') {
    getUserProfiles()
  }
}

watch(
  () => route.query.keywords,
  (newKeywords) => {
    if (newKeywords) {
      handleTabChange(activeName.value)
    }
  },
)

onActivated(() => {
  setBackgroundColor()
  getSongs()
})
</script>

<style lang="scss" scoped>
.search-multi-match__container {
  display: flex;
  flex-direction: column;
  gap: 10px;
  box-sizing: border-box;
}
</style>
