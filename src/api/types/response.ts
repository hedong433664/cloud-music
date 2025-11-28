import type {
  Account,
  BaseResponse,
  HotItem,
  Profile,
  Song,
  PlaylistItem,
  SongDetail,
  Banner,
  PersonalizedItem,
  Album,
  Artist,
  CommentItem,
} from './type'

export interface SearchHotDetailResponse extends BaseResponse {
  data: HotItem[]
}

export interface SearchSuggestResponse extends BaseResponse {
  result: {
    songs: Song[]
  }
}

export interface QrKeyResponse extends BaseResponse {
  data: {
    code: number
    unikey: string
  }
}

export interface QrCreateResponse extends BaseResponse {
  data: {
    qrurl: string
    qrimg: string
  }
}

export interface QrCheckResponse extends BaseResponse {
  /**
   * code
   * 800: 等待扫码
   * 801: 二维码过期
   * 802: 待确认
   * 803: 授权登录成功
   */
  message: string
  cookie: string
}

export interface UserInfoResponse extends BaseResponse {
  account: Account // 账户核心信息（登录态相关）
  profile: Profile // 用户个人资料（展示信息相关）
}

export interface UserDetailResponse extends BaseResponse {
  level: number
  profile: Profile
}

export interface UserPlaylistResponse extends BaseResponse {
  more: boolean
  playlist: PlaylistItem[]
}

export interface PlaylistDetailResponse extends BaseResponse {
  playlist: PlaylistItem
}

export interface PlaylistTrackResponse extends BaseResponse {
  songs: SongDetail[]
}

export interface CheckMusicResponse extends BaseResponse {
  success: boolean
  message: string
}

export interface SongUrlResponse extends BaseResponse {
  data: {
    url: string
  }[]
}

export interface LyricResponse extends BaseResponse {
  lrc: {
    lyric: string
  }
}

export interface BannerResponse extends BaseResponse {
  banners: Banner[]
}

export interface PersonalizedResponse extends BaseResponse {
  result: PersonalizedItem[]
}

export interface CloudSearchSongsResponse extends BaseResponse {
  result: {
    songs: SongDetail[]
    songCount: number
  }
}

export interface CloudSearchAlbumsResponse extends BaseResponse {
  result: {
    albums: Album[]
    albumCount: number
  }
}

export interface CloudSearchPlaylistsResponse extends BaseResponse {
  result: {
    playlists: PlaylistItem[]
    playlistCount: number
  }
}

export interface CloudSearchArtistsResponse extends BaseResponse {
  result: {
    artists: Artist[]
    artistsCount: number
  }
}

export interface CloudSearchUsersResponse extends BaseResponse {
  result: {
    userprofiles: Profile[]
    userprofileCount: number
  }
}

export type CloudSearchType = '1' | '10' | '100' | '1000' | '1002'

export type SearchTypeToResponse = {
  '1': CloudSearchSongsResponse // type='1' → 歌曲响应
  '10': CloudSearchAlbumsResponse // type='10' → 专辑响应
  '100': CloudSearchArtistsResponse // type='100' → 歌单响应
  '1000': CloudSearchPlaylistsResponse // type='1000' → 歌手响应
  '1002': CloudSearchUsersResponse // type='1002' → 用户响应
}

export type CloudSearchResponseMap<T extends CloudSearchType> =
  SearchTypeToResponse[T]

export interface AlbumDetailResponse extends BaseResponse {
  songs: SongDetail[]
  album: Album
}

export interface SongDetailResponse extends BaseResponse {
  songs: SongDetail[]
}

export interface PlaylistSubscribersResponse extends BaseResponse {
  total: number
  subscribers: Profile[]
}

export interface UserLikeListResponse extends BaseResponse {
  ids: number[]
}

export interface CommentResponse extends BaseResponse {
  hotComments: CommentItem[]
  comments: CommentItem[]
  total: number
}
