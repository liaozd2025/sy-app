import { router, useLocalSearchParams } from 'expo-router';
import * as React from 'react';
import { StyleSheet } from 'react-native';

import { Text, View } from '@/components/ui';
import {
  AppBar,
  HifiButton,
  hifiColors,
  HifiScreen,
  HifiScroll,
  IconButton,
  Tag,
  VideoSurface,
} from './components/hifi';
import { healthContents } from './mock-data';
import { usePrototypeStore } from './store';

export function ContentDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const content = healthContents.find(item => item.id === id) ?? healthContents[0];
  const favoriteContentIds = usePrototypeStore.use.favoriteContentIds();
  const toggleFavorite = usePrototypeStore.use.toggleFavorite();
  const favorite = favoriteContentIds.includes(content.id);

  return (
    <HifiScreen>
      <AppBar
        action={(
          <IconButton label="收藏" onPress={() => toggleFavorite(content.id)}>
            {favorite ? '♥' : '♡'}
          </IconButton>
        )}
        backTo="/health"
        eyebrow="Article"
        title="健康科普"
      />
      <HifiScroll noTab>
        <ArticleHero />
        <VideoSummary />
        <ArticleBody body={content.body} />
        <HifiButton onPress={() => router.push('/quiz')} style={styles.fullAction}>
          做睡眠主题 5 题
        </HifiButton>
      </HifiScroll>
    </HifiScreen>
  );
}

function ArticleHero() {
  return (
    <View style={styles.articleHero}>
      <View>
        <Tag>睡眠 · 图文 + 视频</Tag>
        <Text style={styles.heroTitle}>睡前 90 分钟，如何把身体切回休息模式</Text>
        <Text style={styles.muted}>林静 · 今日直播延展阅读 · 6 分钟读完</Text>
      </View>
    </View>
  );
}

function VideoSummary() {
  return (
    <View style={styles.section}>
      <View style={styles.playerShell}>
        <VideoSurface paper style={styles.videoPaper}>
          <View style={styles.playButton}>
            <Text style={styles.playText}>播放</Text>
          </View>
          <View style={styles.videoCopy}>
            <Tag>短视频摘要</Tag>
            <Text style={styles.videoTitle}>3 个睡前信号</Text>
          </View>
        </VideoSurface>
      </View>
    </View>
  );
}

function ArticleBody({ body }: { body: string[] }) {
  return (
    <View style={[styles.articleBody, styles.section]}>
      <Text style={styles.bodyTitle}>先稳定节奏，再谈补充。</Text>
      {body.map(paragraph => (
        <Text key={paragraph} style={styles.bodyText}>{paragraph}</Text>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  articleBody: {
    backgroundColor: hifiColors.surface,
    borderRadius: 24,
    padding: 18,
  },
  articleHero: {
    backgroundColor: hifiColors.surface,
    borderColor: hifiColors.fg,
    borderRadius: 28,
    borderWidth: 1.5,
    justifyContent: 'flex-end',
    minHeight: 232,
    padding: 18,
  },
  bodyText: {
    color: hifiColors.fg,
    fontSize: 16,
    lineHeight: 26,
    marginBottom: 14,
  },
  bodyTitle: {
    color: hifiColors.fg,
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 10,
  },
  fullAction: {
    marginTop: 18,
  },
  heroTitle: {
    color: hifiColors.fg,
    fontSize: 31,
    fontWeight: '900',
    lineHeight: 34,
    marginTop: 8,
  },
  muted: {
    color: hifiColors.muted,
    fontSize: 12,
    lineHeight: 17,
    marginTop: 8,
  },
  playButton: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.88)',
    borderRadius: 999,
    height: 64,
    justifyContent: 'center',
    position: 'absolute',
    right: 18,
    top: 18,
    width: 64,
    zIndex: 2,
  },
  playText: {
    color: hifiColors.fg,
    fontSize: 13,
    fontWeight: '800',
  },
  playerShell: {
    backgroundColor: hifiColors.surface,
    borderColor: hifiColors.fg,
    borderRadius: 28,
    borderWidth: 1.5,
    overflow: 'hidden',
  },
  section: {
    marginTop: 18,
  },
  videoCopy: {
    bottom: 16,
    gap: 8,
    left: 16,
    position: 'absolute',
    right: 16,
  },
  videoPaper: {
    borderRadius: 0,
    minHeight: 146,
  },
  videoTitle: {
    color: hifiColors.fg,
    fontSize: 25,
    fontWeight: '900',
  },
});
