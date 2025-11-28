export interface BaseResponse {
  code: number
}
// 热搜
export interface HotItem {
  score?: number
  iconType?: number
  searchWord?: string
  source?: number
  iconUrl?: string
  content?: string
  url?: string
}

// 基础艺术家信息
export interface Artist {
  id: number
  name: string
  accountId: number // 艺术家账户id
  picUrl: string | null // 艺术家图片 URL（可能为空）
  alias: string[] // 艺术家别名列表
  albumSize: number // 艺术家专辑数量
  picId: number // 图片 ID
  fansGroup: null // 粉丝群体（示例中为 null，可根据实际情况扩展）
  img1v1Url: string // 一寸照片 URL
  img1v1: number // 一寸照片 ID
  trans?: string | null // 艺术家译名（可选字段，示例中为 null）
}

// 专辑信息
export interface Album {
  id: number
  name: string
  artist: Artist // 专辑所属艺术家（复用 Artist 类型）
  publishTime: number // 发布时间戳（毫秒）
  size: number // 专辑内歌曲数量
  copyrightId: number // 版权 ID
  status: number // 状态标识
  picId: number // 专辑图片 ID
  picUrl: string // 专辑图片 URL
  mark: number // 标记信息
  description: string // 专辑描述
}

// 歌曲核心信息
export interface Song {
  id: number
  name: string
  artists: Artist[] // 演唱该歌曲的艺术家列表（复用 Artist 类型）
  album: Album // 所属专辑（复用 Album 类型）
  duration: number // 歌曲时长（毫秒）
  copyrightId: number // 版权 ID（与专辑版权可能不同）
  status: number // 歌曲状态标识
  alias: string[] // 歌曲别名列表
  rtype: number // 类型标识（具体含义需结合业务）
  ftype: number // 文件类型标识
  transNames: string[] // 翻译名称（如示例中的「小花束 (动画电影...)」）
  mvid: number // MV ID（0 表示无 MV）
  fee: number // 访问权限标识（如 8 可能表示付费）
  rUrl: string | null // 资源 URL（示例中无资源）
  mark: number // 标记信息（示例中为大数值）
}

/**
 * 账户信息（登录态、权限、令牌等）
 */
export interface Account {
  id: number // 账户唯一ID
  userName: string // 登录用户名（可能脱敏）
  type: number // 账户类型（示例中为1，具体含义需结合业务）
  status: number // 账户状态（示例中为0，正常）
  whitelistAuthority: number // 白名单权限等级
  createTime: number // 账户创建时间戳（毫秒）
  tokenVersion: number // 令牌版本号
  ban: number // 封禁状态（0 表示未封禁）
  baoyueVersion: number // 包月服务版本号
  donateVersion: number // 捐赠版本号
  vipType: number // VIP类型（0 表示非VIP）
  anonimousUser: boolean // 是否为匿名用户
  paidFee: boolean // 是否已支付费用（如会员）
}

/**
 * 用户个人资料（昵称、头像、签名等展示信息）
 */
export interface Profile {
  userId: number // 用户唯一ID（与account.id可能一致）
  userType: number // 用户类型（0 表示普通用户）
  nickname: string // 昵称
  avatarImgId: number // 头像图片ID
  avatarUrl: string // 头像URL
  backgroundImgId: number // 背景图图片ID
  backgroundUrl: string // 背景图URL
  signature: string // 个人签名
  createTime: number // 用户创建时间戳（毫秒）
  userName: string // 用户名（可能脱敏）
  accountType: number // 账户类型（1 表示普通账户）
  shortUserName: string // 短用户名（脱敏后）
  birthday: number // 生日（时间戳或编码值）
  authority: number // 用户权限等级
  gender: number // 性别（1 表示男？需结合业务确认）
  accountStatus: number // 账户状态（0 表示正常）
  province: number // 所在省份（行政区划代码）
  city: number // 所在城市（行政区划代码）
  authStatus: number // 认证状态（0 表示未认证）
  description: string | null // 简短描述（示例中为null）
  detailDescription: string | null // 详细描述（示例中为null）
  defaultAvatar: boolean // 是否使用默认头像（false 表示自定义头像）
  expertTags: null // 专家标签（示例中为null，若有数据可改为数组）
  experts: null // 专家身份（示例中为null）
  djStatus: number // DJ身份状态（0 表示非DJ）
  locationStatus: number // 定位状态（10 表示已定位）
  vipType: number // VIP类型（0 表示非VIP）
  followed: boolean // 是否已关注该用户
  followeds: number // 关注者数量
  follows: number // 关注的用户数量
  mutual: boolean // 是否互相关注
  authenticated: boolean // 是否完成实名认证
  lastLoginTime: number // 最后登录时间戳（毫秒）
  lastLoginIP: string // 最后登录IP
  remarkName: null // 备注名（示例中为null）
  viptypeVersion: number // VIP版本号
  authenticationTypes: number // 认证类型（0 表示无认证）
  avatarDetail: null // 头像详情（示例中为null）
  anchor: boolean // 是否为主播
}

/**
 * 歌单创作者/用户信息结构
 * （复用部分通用用户属性，同时保留歌单场景下的特定字段）
 */
export interface PlaylistCreator {
  /** 基础标识 */
  userId: number // 用户唯一ID（歌单创建者）
  userType: number // 用户类型（0=普通用户，其他值对应特殊身份）
  nickname: string // 昵称
  avatarUrl: string // 头像URL
  backgroundUrl: string // 背景图URL

  /** 状态与权限 */
  defaultAvatar: boolean // 是否使用平台默认头像
  followed: boolean // 当前用户是否已关注该创作者
  mutual: boolean // 是否与当前用户互相关注
  anchor: boolean // 是否为主播
  vipType: number // VIP类型（0=非VIP，其他值对应会员等级）
  djStatus: number // DJ身份状态（0=非DJ）

  /** 认证与审核 */
  authStatus: number // 平台认证状态（0=未认证，1=个人认证，2=机构认证等）
  accountStatus: number // 账户状态（0=正常，1=冻结等）
  authority: number // 用户权限等级（如内容发布、编辑权限）
  authenticationTypes: number // 认证类型（0=无认证，其他值对应认证渠道）

  /** 地域与基本信息 */
  province: number // 所在省份（行政区划代码，如420000=湖北省）
  city: number // 所在城市（行政区划代码，如420100=武汉市）
  gender: number // 性别（1=男，2=女，0=未知）
  birthday: number // 生日（时间戳或编码值，示例中为0表示未填写）

  /** 内容与描述 */
  signature: string // 个人签名（支持换行符）
  description: string // 简短描述（示例为空）
  detailDescription: string // 详细描述（示例为空）

  /** 图片资源ID（数字格式） */
  avatarImgId: number // 头像图片ID（用于内部资源管理）
  backgroundImgId: number // 背景图图片ID（用于内部资源管理）
  avatarImgIdStr: string // 头像图片ID（字符串格式，冗余字段）
  backgroundImgIdStr: string // 背景图图片ID（字符串格式，冗余字段）
  avatarImgId_str: string // 头像图片ID（兼容旧版本的字符串格式）

  /** 冗余/扩展字段 */
  accountType: number // 账户类型（1=普通账户，其他值对应特殊账户）
  expertTags: null // 专家标签（示例为null，若有数据可扩展为数组）
  experts: null // 专家身份（示例为null）
  remarkName: null // 平台备注名（示例为null，仅内部可见）
  avatarDetail: null // 头像详情（示例为null，含尺寸、格式等信息）
}

/**
 * 歌单详情数据结构
 */
export interface PlaylistItem {
  /** 基础标识 */
  id: number // 歌单ID
  name: string // 歌单名称
  commentThreadId: string // 评论线程ID（用于接口调用）
  coverImgId: number // 封面图数字ID
  coverImgId_str: string // 封面图字符串ID（冗余字段，用于兼容）
  coverImgUrl: string // 封面图URL
  creatorUserId: number // 创建者用户ID（映射自`userId`，语义更明确）
  creator: PlaylistCreator // 歌单创建者信息（复用用户信息结构）

  /** 状态与权限 */
  privacy: number // 隐私状态（0=公开，1=私有等）
  opRecommend: boolean // 是否官方推荐
  highQuality: boolean // 是否高品质歌单
  ordered: boolean // 是否有序歌单（如按专辑顺序）
  copied: boolean // 是否被复制（非原创歌单）
  containsTracks: boolean // 是否包含歌曲（空歌单时为false）

  /** 统计信息 */
  subscribedCount: number // 订阅数
  playCount: number // 播放次数
  trackCount: number // 歌曲总数
  cloudTrackCount: number // 云盘歌曲数
  totalDuration: number // 歌单总时长（毫秒）

  /** 时间戳 */
  createTime: number // 歌单创建时间（毫秒时间戳）
  updateTime: number // 歌单最后更新时间（毫秒时间戳）
  trackUpdateTime: number // 歌曲列表最后更新时间（毫秒时间戳）
  trackNumberUpdateTime: number // 歌曲编号最后更新时间（毫秒时间戳）

  /** 内容相关 */
  description: string | null // 歌单描述（示例为null）
  tags: string[] // 歌单标签（如“流行”“治愈”）
  englishTitle: string | null // 英文标题（示例为null）
  specialType: number // 特殊类型（如5=“喜欢的音乐”，需结合业务）

  /** 关联资源 */
  artists: Artist[] | null // 相关艺术家（示例为null，复用Artist类型）
  tracks: Song[] | null // 歌单内歌曲列表（示例为null，复用Song类型）
  backgroundCoverUrl: string | null // 背景图URL（示例为null）
  titleImageUrl: string | null // 标题图URL（示例为null）

  /** 交互状态 */
  subscribed: boolean | null // 当前用户是否订阅（示例为null）
  anonimous: boolean // 是否匿名歌单（示例为false）
  adType: number // 广告类型（示例为0=无广告）
  shareStatus: any | null // 分享状态（示例为null，结构未知）
  sharedUsers: any[] | null // 共享用户列表（示例为null，结构未知）

  /** 冗余/其他 */
  updateFrequency: string | null // 更新频率（示例为null，如“每周更新”）
  titleImage: number // 标题图数字ID（示例为0）
  status: number // 歌单状态（示例为0=正常）
}

/**
 * 歌手信息（通用结构，适用于歌曲/歌单等场景）
 */
export interface Artist {
  id: number // 歌手唯一ID
  name: string // 歌手姓名
  tns: string[] // 歌手别名列表（第三方平台映射，示例为空）
  alias: string[] // 歌手艺名/别名（平台内，示例为空）
}

/**
 * 专辑信息（通用结构）
 */
export interface Album {
  id: number // 专辑唯一ID
  name: string // 专辑名称
  picUrl: string // 专辑封面URL
  tns: string[] // 专辑别名列表（第三方映射，示例为空）
  pic: number // 专辑封面图片ID（内部资源标识）
}

/**
 * 歌曲详情数据结构（包含基础信息、关联资源、版权状态等）
 */
export interface SongDetail {
  /** 歌曲基础信息 */
  name: string // 歌曲名称（主标题）
  mainTitle: string | null // 主标题（示例为空，预留扩展）
  additionalTitle: string | null // 副标题（示例为空，预留扩展）
  id: number // 歌曲唯一ID（核心标识）
  pst: number // 平台推荐状态（0=未推荐，1=推荐等，需结合业务）
  t: number // 歌曲类型（如原创/翻唱，示例为0）
  alia: string[] // 歌曲别名（如影视OST名称，示例：["动画电影《精灵王座》主题曲"]）
  pop: number // 流行度评分（0-100，越高越热门）
  st: number // 歌曲状态（0=正常，1=下架等）
  fee: number // 付费类型（1=付费，0=免费，需结合业务枚举）
  v: number // 歌曲版本号（迭代更新标识）
  crbt: unknown | null // 彩铃信息（示例为空，结构未知）
  cf: string // 版权方信息（示例为空字符串）

  /** 关联资源 */
  ar: Artist[] // 歌曲演唱歌手列表（复用Artist类型）
  al: Album // 歌曲所属专辑（复用Album类型）

  /** 时长与格式 */
  dt: number // 歌曲时长（单位：毫秒，示例：279145ms ≈ 4分39秒）
  hr: unknown | null // 高解析音频信息（示例为空）
  a: unknown | null // 音频编码信息（示例为空）
  ftype: number // 音频文件类型（如MP3/AAC，示例为0）

  /** 版权与标记 */
  copyright: number // 版权状态（2=原创，1=转载等，需结合业务）
  mark: number // 平台内部标记（如运营活动标识，示例：17179877376）
  originCoverType: number // 原封面类型（1=专辑封面，2=单曲封面等）
  originSongSimpleData: unknown | null // 原歌曲简化数据（示例为空）
  tagPicList: unknown | null // 标签关联图片列表（示例为空）
  resourceState: boolean // 资源可用状态（true=可播放，false=不可用）

  /** 版本与扩展 */
  version: number // 歌曲版本迭代号（如歌词/音频更新）
  songJumpInfo: unknown | null // 歌曲跳转信息（如跳转至MV/歌手页）
  entertainmentTags: unknown | null // 娱乐标签（如“电影原声”）
  awardTags: unknown | null // 奖项标签（如“年度金曲”）
  displayTags: unknown | null // 展示给用户的标签（如“治愈”“催泪”）
  markTags: unknown[] // 平台内部标记标签（示例为空）

  /** 单曲与分发 */
  single: number // 单曲标识（0=非单曲，1=单曲）
  noCopyrightRcmd: unknown | null // 无版权推荐状态（示例为空）
  mv: number // 关联MV ID（示例：5342354，0表示无MV）

  /** 其他元数据 */
  rtype: number // 歌曲类型（如普通歌曲/现场版，示例为0）
  rurl: unknown | null // 免费播放链接（示例为空）
  mst: number // 平台内部状态码（示例：9）
  cp: number // 版权方ID（示例：14026）
  publishTime: number // 歌曲发布时间（单位：毫秒时间戳，示例：1466611202051 → 2016-06-22）
}

export interface Banner {
  imageUrl: string
  bigImageUrl: string
  targetId: number
  typeTitle: string
}

export interface PersonalizedItem {
  id: number
  type: number
  name: string
  picUrl: string
  playCount: number
  trackCount: number
}

export interface CommentItem {
  parentCommentId: number
  commentId: number
  content: string
  time: number
  timeStr: string
  likedCount: number
  liked: boolean
  user: Profile
  children: CommentItem[]
  beReplied: CommentItem[]
}

/**
 * 评论类型（用于区分不同类型的评论）
 * 0: 歌曲
 * 1: mv
 * 2: 歌单
 * 3: 专辑
 * 4: 电台
 * 5: 视频
 * 6: 动态
 */
export type CommentType = '0' | '1' | '2' | '3' | '4' | '5' | '6'
