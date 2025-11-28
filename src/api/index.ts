import request from './http/request'
import type {
  SearchHotDetailResponse,
  SearchSuggestResponse,
  QrKeyResponse,
  QrCreateResponse,
  QrCheckResponse,
  UserInfoResponse,
  UserDetailResponse,
  UserPlaylistResponse,
  PlaylistDetailResponse,
  PlaylistTrackResponse,
  CheckMusicResponse,
  SongUrlResponse,
  LyricResponse,
  BannerResponse,
  PersonalizedResponse,
  CloudSearchType,
  CloudSearchResponseMap,
  AlbumDetailResponse,
  SongDetailResponse,
  PlaylistSubscribersResponse,
  UserLikeListResponse,
  CommentResponse,
} from './types/response'
import type { CommentType } from './types/type'

export const getSearchHotDetailsApi = () =>
  request.get<SearchHotDetailResponse>('/search/hot/detail')

export const getSearchSuggestApi = (keywords: string) =>
  request.get<SearchSuggestResponse>('/search/suggest', { keywords })

export const getQrKeyApi = () => request.get<QrKeyResponse>('/login/qr/key')

export const getQrCreateApi = (key: string, qrimg?: boolean) =>
  request.get<QrCreateResponse>('/login/qr/create', { key, qrimg })

export const getQrCheckApi = (key: string, noCookie?: boolean) =>
  request.get<QrCheckResponse>('/login/qr/check', { key, noCookie })

export const getUserInfoApi = (params?: { cookie: string }) =>
  request.get<UserInfoResponse>('/user/account', { ...params })

export const getUserDetailByIdApi = (uid: number | string) =>
  request.get<UserDetailResponse>('/user/detail', { uid })

export const getUserPlaylistApi = (uid: number | string) =>
  request.get<UserPlaylistResponse>('/user/playlist', { uid })

export const getPlaylistDetailApi = (id: number | string) =>
  request.get<PlaylistDetailResponse>('/playlist/detail', { id })

export const getPlaylistSubscribersApi = (params: {
  id: number | string
  limit: number
  offset: number
}) =>
  request.get<PlaylistSubscribersResponse>('/playlist/subscribers', {
    ...params,
  })

export const getAlbumDetailApi = (id: number | string) =>
  request.get<AlbumDetailResponse>('/album', { id })

export const getSongDetailApi = (ids: string) =>
  request.get<SongDetailResponse>('/song/detail', { ids })

export const getPlaylistTrackAllApi = (params: {
  id: number | string
  limit: number
  offset: number
}) => request.get<PlaylistTrackResponse>('/playlist/track/all', { ...params })

export const checkMusicApi = (id: number | string) =>
  request.get<CheckMusicResponse>('/check/music', { id })

export const getSongUrlApi = (id: number | string) =>
  request.get<SongUrlResponse>('/song/url', { id })

export const getLyricApi = (id: number | string) =>
  request.get<LyricResponse>('/lyric', { id })

/**
 * @param type 0: pc 1: android 2: iphone 3: ipad
 */
export const getBannersApi = (type: '0' | '1' | '2' | '3' = '0') =>
  request.get<BannerResponse>('/banner', { type })

export const getPersonalizedApi = (limit: number = 30) =>
  request.get<PersonalizedResponse>('/personalized', { limit })

export const cloudSearchApi = <T extends CloudSearchType>(params: {
  keywords: string
  type: T
  limit: number
  offset: number
}) => request.get<CloudSearchResponseMap<T>>('/cloudsearch', { ...params })

export const getUserLikeListApi = (uid: number | string) =>
  request.get<UserLikeListResponse>('/likelist', { uid })

export const likeMusicApi = (params: { id: number | string; like: boolean }) =>
  request.get<BannerResponse>('/like', { ...params })

export const logoutApi = () => request.get('/logout')

export const getPlaylistCommentApi = (params: {
  id: number | string
  limit: number
  offset: number
}) => request.get<CommentResponse>('/comment/playlist', { ...params })

export const getAlbumCommentApi = (params: {
  id: number | string
  limit: number
  offset: number
}) => request.get<CommentResponse>('/comment/album', { ...params })

export const getMusicCommentApi = (params: {
  id: number | string
  limit: number
  offset: number
}) => request.get<CommentResponse>('/comment/music', { ...params })

export const commentLikeApi = (params: {
  id: number | string
  cid: number | string
  t: 1 | 0
  type: CommentType
}) => request.get('/comment/like', { ...params })

export const sendCommentApi = (params: {
  t: 1 | 2
  type: CommentType
  id: number | string
  content: string
  commentId?: number | string
}) => request.get('/comment', { ...params })
