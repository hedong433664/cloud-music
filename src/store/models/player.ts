import { checkMusicApi, getLyricApi, getSongUrlApi } from '@/api'
import { formatLyric } from '@/utils'
import { ElMessage } from 'element-plus'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { SongDetail } from '@/api/types/type'

export const usePlayerStore = defineStore('player', () => {
  const currentSong = ref<SongDetail>()
  const currentSongUrl = ref<string>()
  const currentSongLyric = ref<any[]>()
  const currentPlaylist = ref<SongDetail[]>([])
  const currentTime = ref<number>(0)
  const durationTime = ref<number>(0)
  const playerStatus = ref<boolean>(false)
  const singleLoop = ref<boolean>(false)
  const volume = ref<number>(0.3)
  const muteBeforeVolume = ref<number>(0.3)
  const muted = ref<boolean>(false)
  // 创建播放器实例
  const audio = new Audio()
  audio.volume = volume.value
  audio.loop = singleLoop.value
  audio.muted = muted.value

  // 创建音频分析

  let isInit = false
  let analyser: AnalyserNode
  let buffer: Uint8Array<ArrayBuffer>
  let audioStream: MediaStream
  let animateId: number

  // 监听播放器播放状态
  audio.onplay = async () => {
    playerStatus.value = true
    // 初始化音频分析
    if (isInit) {
      return
    }

    isInit = true

    // 获取系统音频流
    try {
      audioStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          // 使用标准约束语法替代mandatory
          deviceId: 'default',
          autoGainControl: false,
          echoCancellation: false,
          noiseSuppression: false,
        },
      })

      const audioCtx = new AudioContext()
      const source = audioCtx.createMediaStreamSource(audioStream)
      analyser = audioCtx.createAnalyser()
      analyser.fftSize = 1024
      buffer = new Uint8Array(analyser.frequencyBinCount)
      analyser.getByteFrequencyData(buffer)
      source.connect(analyser)
      analyser.connect(audioCtx.destination)
    } catch (error) {
      console.error(error)
      ElMessage.error('获取音频流失败')
    }
  }

  const updateDraw = (draw: (data: number[]) => any) => {
    const animate = () => {
      if (!isInit) {
        return
      }
      analyser.getByteFrequencyData(buffer)
      const data = Array.from(buffer)
      // // 两倍的频率数据，一反一正
      // const rearrangedData: number[] = []
      // // 反
      // for (let i = data.length - 1; i >= 0; i--) {
      //   rearrangedData.push(data[i])
      // }
      // // 正
      // for (let i = 0; i < data.length; i++) {
      //   rearrangedData.push(data[i])
      // }

      draw(data)
      animateId = requestAnimationFrame(animate)
    }
    animate()

    return () => {
      cancelAnimationFrame(animateId)
    }
  }

  // 监听播放器暂停状态
  audio.onpause = () => {
    playerStatus.value = false
  }

  // 监听播放器播放进度
  audio.ontimeupdate = () => {
    currentTime.value = audio.currentTime
  }

  // 监听播放器播放结束
  audio.onended = () => {
    if (singleLoop.value) {
      audio.play()
    } else {
      nextSong()
    }
  }

  // 监听播放器播放错误
  audio.onerror = () => {
    ElMessage.error('音乐播放出错')
  }

  // 设置当前时间
  const setCurrentTime = (time: number) => {
    currentTime.value = time
    audio.currentTime = time
  }

  // 设置总时长
  const setDurationTime = (time: number) => {
    durationTime.value = time
  }

  // 设置音量
  const setVolume = (value: number) => {
    volume.value = value
    audio.volume = value
    muted.value = value === 0
    audio.muted = muted.value
  }

  // 播放/暂停
  const togglePlayerStatus = () => {
    playerStatus.value = !playerStatus.value

    if (playerStatus.value) {
      audio.play()
    } else {
      audio.pause()
    }
  }
  // 静音/取消静音
  const toggleMute = () => {
    muted.value = !muted.value
    audio.muted = muted.value
    if (muted.value) {
      muteBeforeVolume.value = volume.value
      setVolume(0)
    } else {
      setVolume(muteBeforeVolume.value)
    }
  }

  // 单曲循环
  const toggleSingleLoop = () => {
    singleLoop.value = !singleLoop.value
    audio.loop = singleLoop.value
  }

  // 上一首
  const prevSong = () => {
    if (currentPlaylist.value.length === 1) {
      audio.loop = true
      return
    }

    const index = currentPlaylist.value.findIndex(
      (item) => item.id === currentSong.value?.id,
    )

    if (index === 0) {
      play(currentPlaylist.value[currentPlaylist.value.length - 1])
    } else {
      play(currentPlaylist.value[index - 1])
    }
  }

  // 下一首
  const nextSong = () => {
    if (currentPlaylist.value.length === 1) {
      audio.loop = true
      return
    }

    const index = currentPlaylist.value.findIndex(
      (item) => item.id === currentSong.value?.id,
    )

    if (index === currentPlaylist.value.length - 1) {
      play(currentPlaylist.value[0])
    } else {
      play(currentPlaylist.value[index + 1])
    }
  }

  // 添加到播放列表
  const addToPlaylist = (song: SongDetail) => {
    if (isExist(song)) return

    currentPlaylist.value.push(song)
  }

  // 检查是否已存在播放列表中
  const isExist = (song: SongDetail) => {
    return currentPlaylist.value.some((item) => item.id === song.id)
  }

  const play = async (song: SongDetail) => {
    if (!song) return

    if (song.id === currentSong.value?.id) {
      togglePlayerStatus()
      return
    }

    // 设置当前播放歌曲
    currentSong.value = song

    // 添加到播放列表
    if (!isExist(song)) {
      currentPlaylist.value.push(song)
    }
    // 设置总时长
    setDurationTime(song.dt)
    // 先检查音乐是否可用
    const { success, message } = await checkMusicApi(song.id)

    if (!success) {
      return ElMessage.error(message)
    }

    // 获取音乐url
    const { data } = await getSongUrlApi(song.id)
    currentSongUrl.value = data[0].url

    // 获取歌词
    const { lrc } = await getLyricApi(song.id)
    currentSongLyric.value = formatLyric(lrc.lyric)

    // 播放
    audio.src = currentSongUrl.value
    audio.play()
  }

  const playAll = (songs: SongDetail[]) => {
    currentPlaylist.value = [...songs]
    play(songs[0])
  }

  return {
    currentPlaylist,
    currentSong,
    currentSongUrl,
    currentSongLyric,
    currentTime,
    durationTime,
    playerStatus,
    singleLoop,
    volume,
    muted,
    setCurrentTime,
    setDurationTime,
    setVolume,
    togglePlayerStatus,
    toggleSingleLoop,
    toggleMute,
    prevSong,
    nextSong,
    play,
    playAll,
    addToPlaylist,
    updateDraw,
  }
})
