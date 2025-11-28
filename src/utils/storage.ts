/**
 * 设置 Cookie 的可选配置
 */
interface SetCookieOptions {
  maxAge?: number // Cookie 有效期（秒）
  expires?: Date // Cookie 过期时间（Date 对象）
  secure?: boolean // 是否仅 HTTPS 传输（默认 false）
  sameSite?: 'Strict' | 'Lax' | 'None' // 同站策略（默认 Lax）
  path?: string // Cookie 生效路径（默认根路径 '/'）
}

/**
 * 将完整的 Cookie 字符串解析并设置到浏览器
 * @param cookieString 完整的 Cookie 字符串（格式：`key1=value1; key2=value2`）
 * @param options 可选配置（如过期时间、安全策略等）
 */
export function setCookiesFromString(
  cookieString: string,
  options: SetCookieOptions = {},
): void {
  // cookieString 为空则直接清除所有 Cookie
  if (!cookieString) {
    document.cookie = ''
    return
  }
  // 处理 sameSite=None 必须搭配 secure=true 的情况
  if (options.sameSite === 'None' && !options.secure) {
    console.warn('⚠️ sameSite=None 要求 secure=true，已自动启用 secure')
    options.secure = true
  }

  // 1. 清理空字符串并分割成单个 Cookie 项
  const trimmedString = cookieString.trim()
  if (!trimmedString) return

  const cookieEntries = trimmedString.split('; ').filter(Boolean)

  // 2. 遍历每个 Cookie 项，解析键值对
  for (const entry of cookieEntries) {
    const trimmedEntry = entry.trim()
    if (!trimmedEntry) continue

    // 按第一个 `=` 分割（避免值中包含等号的情况，如 MUSIC_U）
    const [rawKey, ...rawValueParts] = trimmedEntry.split('=')
    const key = rawKey.trim()
    const value = rawValueParts.join('=').trim() // 合并值中的等号

    if (!key) continue // 跳过无键的无效项

    try {
      // 3. 构造 Cookie 字符串（编码值避免特殊字符问题）
      let cookieText = `${encodeURIComponent(key)}=${encodeURIComponent(value)}`

      // 添加基础属性
      cookieText += `; path=${options.path || '/'}`
      cookieText += `; secure=${options.secure ?? false}`
      cookieText += `; sameSite=${options.sameSite ?? 'Lax'}`

      // 添加可选属性（maxAge / expires）
      if (options.maxAge !== undefined) {
        cookieText += `; max-age=${options.maxAge}`
      }
      if (options.expires) {
        cookieText += `; expires=${options.expires.toUTCString()}`
      }

      // 4. 设置到浏览器
      document.cookie = cookieText
    } catch (error) {
      console.error(`❌ 设置 Cookie 失败（键：${key}）:`, error)
    }
  }
}
