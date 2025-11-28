<template>
  <div class="comment-container">
    <div class="title-count">
      <h3 class="title">全部评论</h3>

      <span class="count">{{ total }}</span>
    </div>

    <el-affix :offset="80">
      <el-input
        v-model="comment"
        class="comment-input"
        placeholder="说点什么吧"
        type="textarea"
        maxlength="1000"
        show-word-limit
        :autosize="{
          minRows: 4,
          maxRows: 6,
        }"
        @input="handleCommentInput"
      />

      <el-row justify="end">
        <el-button
          v-show="!!comment"
          class="send-comment-btn"
          type="primary"
          size="small"
          @click="sendComment"
        >
          发布
        </el-button>
      </el-row>
    </el-affix>

    <h3>精彩评论</h3>

    <ul class="comment-list">
      <li
        class="comment-item"
        v-for="item in hotComments"
        :key="item.commentId"
      >
        <el-image class="avatar" :src="item.user.avatarUrl" lazy />

        <div class="comment-wrapper">
          <el-link class="nickname" @click="handleUserDetail(item.user.userId)">
            {{ item.user.nickname }}
          </el-link>

          <div class="comment-content">
            <div v-html="item.content?.replace(/\n/g, '<br>')" />

            <div
              class="at-comment"
              v-for="child in item.beReplied"
              :key="child.commentId"
            >
              <el-link
                class="nickname"
                @click="handleUserDetail(child.user.userId)"
              >
                @{{ child.user.nickname }}
              </el-link>
              ：
              <div v-html="child.content?.replace(/\n/g, '<br>')" />
            </div>
          </div>

          <div class="comment-footer">
            <span class="publish-time">
              {{ item.timeStr }}
            </span>

            <div class="btns">
              <span
                class="liked-count"
                :style="{ color: item.liked ? '#ff3a3a' : '' }"
              >
                {{ formatCount(item.likedCount) }}
              </span>

              <el-icon
                class="icon-button"
                :color="item.liked ? '#ff3a3a' : ''"
                size="20"
                @click="likeComment(item)"
              >
                <svg-icon name="icon-like"></svg-icon>
              </el-icon>

              <el-icon class="icon-button" size="20" @click="atComment(item)">
                <svg-icon name="icon-comment"></svg-icon>
              </el-icon>
            </div>
          </div>
        </div>
      </li>
    </ul>

    <h3>最新评论</h3>

    <ul class="comment-list">
      <li class="comment-item" v-for="item in comments" :key="item.commentId">
        <el-image class="avatar" :src="item.user.avatarUrl" lazy />

        <div class="comment-wrapper">
          <el-link class="nickname" @click="handleUserDetail(item.user.userId)">
            {{ item.user.nickname }}
          </el-link>

          <div class="comment-content">
            <div v-html="item.content?.replace(/\n/g, '<br>')" />

            <div
              class="at-comment"
              v-for="child in item.beReplied"
              :key="child.commentId"
            >
              <el-link
                class="nickname"
                @click="handleUserDetail(child.user.userId)"
              >
                @{{ child.user.nickname }}
              </el-link>
              ：
              <div v-html="child.content?.replace(/\n/g, '<br>')" />
            </div>
          </div>

          <div class="comment-footer">
            <span class="publish-time">
              {{ item.timeStr }}
            </span>

            <div class="btns">
              <span class="liked-count">
                {{ formatCount(item.likedCount) }}
              </span>

              <el-icon
                class="icon-button"
                :color="item.liked ? '#ff3a3a' : ''"
                @click="likeComment(item)"
              >
                <svg-icon name="icon-like"></svg-icon>
              </el-icon>

              <el-icon class="icon-button" @click="atComment(item)">
                <svg-icon name="icon-comment"></svg-icon>
              </el-icon>
            </div>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import {
  getAlbumCommentApi,
  getMusicCommentApi,
  getPlaylistCommentApi,
  commentLikeApi,
  sendCommentApi,
} from '@/api'
import { formatCount } from '@/utils'

import type { CommentItem, CommentType } from '@/api/types/type'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

defineOptions({
  name: 'Comment',
})

type Props = {
  id: number | string
  type: CommentType
}
const props = withDefaults(defineProps<Props>(), {
  type: '2',
})

const router = useRouter()
const comment = ref<string>('')
const atCommentId = ref<number | string>()
const atCommentUserName = ref<string>()
const hotComments = ref<CommentItem[]>([])
const comments = ref<CommentItem[]>([])
const total = ref<number>(0)

const getComments = async () => {
  const apiMap: Partial<Record<CommentType, typeof getMusicCommentApi>> = {
    '0': getMusicCommentApi,
    '2': getPlaylistCommentApi,
    '3': getAlbumCommentApi,
  }

  const res = await apiMap[props.type]!({
    id: props.id,
    limit: 20,
    offset: 0,
  })

  hotComments.value = res.hotComments
  comments.value = res.comments
  total.value = res.total
}

const handleUserDetail = (userId: number) => {
  router.push(`/account/${userId}`)
}

const likeComment = async (item: CommentItem) => {
  const params: Parameters<typeof commentLikeApi>[0] = {
    id: props.id,
    cid: item.commentId,
    t: item.liked ? 0 : 1,
    type: props.type,
  }
  await commentLikeApi(params)
  getComments()
}

const atComment = (item: CommentItem) => {
  atCommentId.value = item.commentId
  atCommentUserName.value = item.user.nickname
  comment.value = `回复 ${item.user.nickname}：`
}

const handleCommentInput = (val: string) => {
  // 内容没有atCommentUserName时，清空atCommentId
  if (!atCommentUserName.value) {
    return
  }

  if (val.indexOf(atCommentUserName.value) === -1) {
    atCommentId.value = ''
  }
}

const sendComment = async () => {
  const isEmpty =
    !comment.value.trim() ||
    comment.value.replace('\n', '') === `回复 ${atCommentUserName.value}：`

  if (isEmpty) {
    return ElMessage.warning('评论内容不能为空')
  }

  const params: Parameters<typeof sendCommentApi>[0] = {
    t: 1,
    type: props.type,
    id: props.id,
    content: comment.value,
    commentId: atCommentId.value,
  }

  await sendCommentApi(params)
  getComments()
  atCommentId.value = ''
  atCommentUserName.value = ''
  comment.value = ''
}

watch(
  () => props.id,
  (newId) => {
    if (newId) {
      getComments()
    }
  },
  {
    immediate: true,
  },
)
</script>

<style lang="scss" scoped>
.comment-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 20px;
  box-sizing: border-box;
  .title-count {
    display: flex;
    align-items: start;
    font-weight: bold;
    gap: 5px;
    .title {
      width: fit-content;
    }
    .count {
      font-size: 14px;
    }
  }
  .comment-list {
    display: flex;
    flex-direction: column;
    gap: 20px;
    .comment-item {
      display: flex;
      gap: 10px;
      padding: 20px 0;
      box-sizing: border-box;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      .avatar {
        width: 40px;
        height: 40px;
        border-radius: 50%;
      }
      .comment-wrapper {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 5px;
        .nickname {
          flex-shrink: 0;
          width: fit-content;
          text-align: left;
        }
        .el-link {
          --el-link-text-color: #5e7cbd;
        }
        .comment-content {
          color: #ffffff;
          padding: 5px 0;
          .at-comment {
            display: flex;
            align-items: start;
            margin-top: 5px;
            padding: 0 5px;
            border-left: 1px solid rgba(255, 255, 255, 0.1);
            color: #b0b0b0;
          }
        }
        .comment-footer {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: space-between;
          .publish-time {
            font-size: 12px;
            color: #a9a6b1;
            font-weight: bold;
          }
          .btns {
            display: flex;
            align-items: center;
            .liked-count {
              font-size: 12px;
              color: #a9a6b1;
              font-weight: bold;
              margin-right: 5px;
            }
            .icon-button {
              margin-right: 20px;
            }
          }
        }
      }
    }
  }
}
.comment-input {
  border-radius: var(--el-input-border-radius);
  backdrop-filter: blur(20px);
}
.send-comment-btn {
  margin-top: 10px;
}
</style>
