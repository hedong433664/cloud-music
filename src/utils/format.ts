/**
 * 格式化秒
 * @param { Number } time 时间
 * @param { Boolean } isSecond 是否是秒
 * @returns { String } 00:00 格式
 */
export const formatSecond = (
  time: number,
  isSecond: boolean = false,
): string => {
  if (typeof time !== 'number' || !time) {
    return '00:00'
  }
  if (isSecond) {
    time = time * 1000
  }
  const minutes = Math.floor(time / 60 / 1000)
  const seconds = Math.floor((time / 1000) % 60)
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
}
// export const formatSecond = (ms: number): string => {
//   if (typeof ms !== 'number' || !ms) {
//     return '00:00'
//   }
//   const minutes = Math.floor(ms / 60)
//   const seconds = Math.floor(ms % 60)
//   return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
// }

/**
 * 格式化播放次数
 * @param { Number } count 播放次数
 * @returns { String } 0 或 0.00万 或 0.00亿
 */
export const formatCount = (count: number): string => {
  if (!count) {
    return '0'
  }
  let str = '' // 存储格式化后的字符串
  // 判断 count 是否大于等于 10000，如果是，则需要加上“万”（除以 10000）
  if (count >= 10000) {
    str = (count / 10000).toFixed(2) + '万'
  } else {
    str = count.toString() // 如果小于 10000，则直接使用原始值
  }
  // 判断新的 str 值是否大于等于 10000，如果是，则需要加上“亿”（除以 10000）
  if (parseFloat(str) >= 10000) {
    str = (parseFloat(str) / 10000).toFixed(2) + '亿'
  }
  return str
}

/**
 * 格式化歌词
 * @param { String } lyric 歌词
 * @returns 格式化后的歌词
 */
export const formatLyric = (lyric: string) => {
  const lines = lyric.split('\n')

  return lines.filter(Boolean).map((line) => {
    const [time, text] = line.split(']')
    // 将time处理成毫秒数
    const timeArr = time.slice(1).split(':')
    const timeInMs = Number(timeArr[0]) * 60 * 1000 + Number(timeArr[1]) * 1000
    return { time: timeInMs, text }
  })
}
