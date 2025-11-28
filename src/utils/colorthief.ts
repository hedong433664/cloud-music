import Colorthief from 'colorthief'

export type RGB = {
  r: number
  g: number
  b: number
}

/**
 * 获取图片主色调
 * @param { string | HTMLImageElement } source 图片地址或图片元素
 * @returns { Promise<RGB>} RGB
 */
export const getColor = async (
  source: string | HTMLImageElement,
): Promise<RGB> => {
  const _Colorthief = new Colorthief()

  return new Promise((resolve, reject) => {
    let img: HTMLImageElement
    if (typeof source === 'string') {
      img = new Image()
      img.src = source
      img.crossOrigin = 'Anonymous'
      img.onload = () => {
        const color = _Colorthief.getColor(img, 1)
        resolve({ r: color[0], g: color[1], b: color[2] })
      }

      img.onerror = reject
    } else {
      const color = _Colorthief.getColor(source, 1)
      resolve({ r: color[0], g: color[1], b: color[2] })
    }
  })
}

/**
 * 获取图片调色板
 * @param { string | HTMLImageElement } source 图片地址或图片元素
 * @param { number } colorCount 调色板数量，默认3
 * @returns { Promise<RGB[]>} RGB[]
 */
export const getPalette = async (
  source: string | HTMLImageElement,
  colorCount = 3,
): Promise<RGB[]> => {
  const _Colorthief = new Colorthief()

  return new Promise((resolve, reject) => {
    let img: HTMLImageElement
    if (typeof source === 'string') {
      img = new Image()
      img.src = source
      img.crossOrigin = 'Anonymous'
      img.onload = () => {
        const palette = _Colorthief.getPalette(img, colorCount)
        const colors = palette.map((color) => ({
          r: color[0],
          g: color[1],
          b: color[2],
        }))
        resolve(colors)
      }

      img.onerror = reject
    } else {
      const palette = _Colorthief.getPalette(source, colorCount)
      const colors = palette.map((color) => ({
        r: color[0],
        g: color[1],
        b: color[2],
      }))
      resolve(colors)
    }
  })
}

/**
 * 设置背景色变量
 * @param colors RGB[] 不传则默认为颜色
 */
export const setBackgroundColor = (colors?: RGB) => {
  if (!colors) {
    document.body.style.setProperty('--bg-color', '#13131a')
    return
  }

  document.body.style.setProperty(
    '--bg-color',
    `rgba(${colors.r}, ${colors.g}, ${colors.b}, 0.7)`,
  )
}
