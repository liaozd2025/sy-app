import type { LiveSession } from './types';
import { router, useLocalSearchParams } from 'expo-router';
import * as React from 'react';
import { StyleSheet } from 'react-native';

import { Pressable, Text, View } from '@/components/ui';
import {
  AppBar,
  Card,
  HifiButton,
  hifiColors,
  HifiScreen,
  HifiScroll,
  HifiSheet,
  IconButton,
  SectionHead,
  Tag,
  VideoSurface,
} from './components/hifi';
import { ProgressLine } from './components/primitives';
import { chatMessages, courseChapters, liveMaterials, liveSessions } from './mock-data';
import {
  canOpenLiveRoom,
  openLiveRoom,
  showLiveRoomOpenError,
} from './native/live-room';
import { usePrototypeStore } from './store';

export function CourseDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const session = liveSessions.find(item => item.id === id) ?? liveSessions[0];
  const isLiveRoom = session.id === 'sleep-live' || session.status === 'live';

  return isLiveRoom
    ? <LiveRoomScreen session={session} />
    : <ReplayDetailScreen sessionId={session.id} />;
}

function LiveRoomScreen({ session }: { session: LiveSession }) {
  const [consultOpen, setConsultOpen] = React.useState(false);
  const favoriteContentIds = usePrototypeStore.use.favoriteContentIds();
  const toggleFavorite = usePrototypeStore.use.toggleFavorite();
  const favorite = favoriteContentIds.includes(session.id);
  const canOpenVolcano = canOpenLiveRoom(session);
  const handleOpenVolcano = React.useCallback(() => {
    if (canOpenVolcano) {
      void openLiveRoom(session.h5Url).catch(showLiveRoomOpenError);
    }
  }, [canOpenVolcano, session.h5Url]);

  return (
    <HifiScreen>
      <AppBar
        action={(
          <IconButton label="收藏" onPress={() => toggleFavorite(session.id)}>
            {favorite ? '♥' : '♡'}
          </IconButton>
        )}
        backTo="/live"
        eyebrow="直播中"
        title={session.title.replace('：稳定节奏', '')}
      />
      <HifiScroll noTab>
        <PlayerShell live session={session} />
        <HostCard />
        <MaterialSection />
        <ChatSection />
      </HifiScroll>
      <View style={styles.liveBottomAction}>
        {canOpenVolcano && (
          <HifiButton onPress={handleOpenVolcano} style={styles.livePrimaryButton}>
            进入火山直播
          </HifiButton>
        )}
        <HifiButton
          onPress={() => setConsultOpen(true)}
          secondary={canOpenVolcano}
          style={styles.liveSecondaryButton}
        >
          课后咨询
        </HifiButton>
      </View>
      <HifiSheet
        onClose={() => setConsultOpen(false)}
        title="课后咨询"
        visible={consultOpen}
      >
        <Text style={styles.sheetText}>请描述今晚直播后的问题，助教会整理给讲师选择性回复。</Text>
        <HifiButton onPress={() => setConsultOpen(false)} style={styles.sheetButton}>
          提交咨询
        </HifiButton>
      </HifiSheet>
    </HifiScreen>
  );
}

function ReplayDetailScreen({ sessionId }: { sessionId: string }) {
  const session = liveSessions.find(item => item.id === sessionId) ?? liveSessions[3];
  const favoriteContentIds = usePrototypeStore.use.favoriteContentIds();
  const toggleFavorite = usePrototypeStore.use.toggleFavorite();
  const favorite = favoriteContentIds.includes(session.id);

  return (
    <HifiScreen>
      <AppBar
        action={(
          <IconButton label="收藏" onPress={() => toggleFavorite(session.id)}>
            {favorite ? '♥' : '♡'}
          </IconButton>
        )}
        backTo="/"
        eyebrow="Replay"
        title="四季养护入门"
      />
      <HifiScroll noTab>
        <PlayerShell session={session} />
        <Card style={styles.section}>
          <Text style={styles.bigTitle}>把直播内容沉淀成可复看的会员课程。</Text>
          <Text style={styles.muted}>{session.description}</Text>
        </Card>
        <ChapterSection />
        <HifiButton onPress={() => router.push('/quiz')} style={styles.fullAction}>
          做 5 道课后题
        </HifiButton>
      </HifiScroll>
    </HifiScreen>
  );
}

function PlayerShell({
  live = false,
  session,
}: {
  live?: boolean;
  session: LiveSession;
}) {
  const canOpenVolcano = canOpenLiveRoom(session);
  const handleOpenVolcano = React.useCallback(() => {
    if (canOpenVolcano) {
      void openLiveRoom(session.h5Url).catch(showLiveRoomOpenError);
    }
  }, [canOpenVolcano, session.h5Url]);

  return (
    <View style={styles.playerShell}>
      <VideoSurface style={styles.playerSurface}>
        <Pressable
          disabled={!canOpenVolcano}
          onPress={handleOpenVolcano}
          style={[styles.playButton, !canOpenVolcano && styles.playButtonDisabled]}
        >
          <Text style={styles.playText}>
            {canOpenVolcano ? (live ? '火山直播' : '火山回放') : '播放'}
          </Text>
        </Pressable>
        <View style={styles.videoCopy}>
          <Tag>{live ? '8,216 人在线' : '已看到第 3 节'}</Tag>
          <Text style={styles.videoTitle}>
            {live ? '睡前 90 分钟的三件事' : '春夏作息与饮食节律'}
          </Text>
        </View>
      </VideoSurface>
      <View style={styles.playerControls}>
        <View style={styles.controlRow}>
          <Text style={styles.controlText}>{live ? '19:00' : '18:06'}</Text>
          <ProgressLine progress={live ? 42 : 58} />
          <Text style={styles.controlText}>42:30</Text>
        </View>
      </View>
    </View>
  );
}

function HostCard() {
  return (
    <Card style={styles.section}>
      <View style={styles.hostRow}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>林</Text>
        </View>
        <View style={styles.hostCopy}>
          <Text style={styles.cardTitle}>林静 主讲</Text>
          <Text style={styles.muted}>营养与生活方式管理方向 · 内容仅作科普参考</Text>
        </View>
      </View>
    </Card>
  );
}

function MaterialSection() {
  return (
    <View style={styles.section}>
      <SectionHead
        action={<Text style={styles.textLink}>复制链接</Text>}
        title="直播资料"
      />
      <View style={styles.stack}>
        {liveMaterials.map(item => (
          <View key={item.id} style={styles.moduleCard}>
            <Tag>{item.label}</Tag>
            <View>
              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={styles.muted}>{item.description}</Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

function ChatSection() {
  return (
    <View style={styles.section}>
      <SectionHead caption="讲师选择性回复" title="互动区" />
      <View style={styles.stack}>
        {chatMessages.map(item => (
          <View
            key={item.id}
            style={[styles.chatBubble, item.host && styles.hostBubble]}
          >
            <Text style={styles.chatAuthor}>{item.author}</Text>
            <Text style={styles.chatText}>{item.message}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

function ChapterSection() {
  return (
    <View style={styles.section}>
      <SectionHead action={<Text style={styles.textLink}>资料包</Text>} title="课程章节" />
      <View style={styles.stack}>
        {courseChapters.map((chapter, index) => (
          <View key={chapter.id} style={styles.chapter}>
            <View style={styles.chapterNum}>
              <Text style={styles.chapterNumText}>{String(index + 1).padStart(2, '0')}</Text>
            </View>
            <View style={styles.hostCopy}>
              <Text style={styles.chapterTitle}>{chapter.title}</Text>
              <Text style={styles.muted}>{chapter.duration}</Text>
            </View>
            <Tag>{getChapterStatus(chapter.status)}</Tag>
          </View>
        ))}
      </View>
    </View>
  );
}

function getChapterStatus(status: string) {
  if (status === 'complete') {
    return '完成';
  }
  if (status === 'current') {
    return '继续';
  }
  return '待学';
}

const styles = StyleSheet.create({
  avatar: {
    alignItems: 'center',
    backgroundColor: hifiColors.accentSoft,
    borderRadius: 999,
    height: 44,
    justifyContent: 'center',
    width: 44,
  },
  avatarText: {
    color: hifiColors.accent,
    fontSize: 18,
    fontWeight: '900',
  },
  bigTitle: {
    color: hifiColors.fg,
    fontSize: 22,
    fontWeight: '800',
    lineHeight: 28,
    marginBottom: 10,
  },
  cardTitle: {
    color: hifiColors.fg,
    fontSize: 15,
    fontWeight: '800',
  },
  chapter: {
    alignItems: 'center',
    backgroundColor: hifiColors.surface,
    borderRadius: 16,
    flexDirection: 'row',
    gap: 10,
    padding: 12,
  },
  chapterNum: {
    alignItems: 'center',
    backgroundColor: hifiColors.accentSoft,
    borderRadius: 999,
    height: 34,
    justifyContent: 'center',
    width: 34,
  },
  chapterNumText: {
    color: hifiColors.accent,
    fontFamily: 'Menlo',
    fontSize: 12,
  },
  chapterTitle: {
    color: hifiColors.fg,
    fontSize: 15,
    fontWeight: '800',
  },
  chatAuthor: {
    color: hifiColors.fg,
    fontSize: 13,
    fontWeight: '800',
    marginBottom: 3,
  },
  chatBubble: {
    backgroundColor: hifiColors.surface,
    borderRadius: 16,
    padding: 12,
  },
  chatText: {
    color: hifiColors.fg,
    fontSize: 13,
    lineHeight: 19,
  },
  controlRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
  },
  controlText: {
    color: hifiColors.muted,
    fontSize: 12,
  },
  fullAction: {
    marginTop: 18,
  },
  hostBubble: {
    backgroundColor: hifiColors.accentSoft,
  },
  hostCopy: {
    flex: 1,
  },
  hostRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
  },
  liveBottomAction: {
    backgroundColor: '#fafbfe',
    flexDirection: 'row',
    gap: 10,
    paddingBottom: 16,
    paddingHorizontal: 14,
    paddingTop: 10,
  },
  livePrimaryButton: {
    flex: 1,
  },
  liveSecondaryButton: {
    flex: 1,
  },
  moduleCard: {
    backgroundColor: hifiColors.surface,
    borderRadius: 24,
    gap: 14,
    minHeight: 118,
    padding: 13,
  },
  muted: {
    color: hifiColors.muted,
    fontSize: 12,
    lineHeight: 17,
    marginTop: 4,
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
  playButtonDisabled: {
    opacity: 0.55,
  },
  playText: {
    color: hifiColors.fg,
    fontSize: 13,
    fontWeight: '800',
  },
  playerControls: {
    gap: 10,
    paddingBottom: 16,
    paddingHorizontal: 14,
    paddingTop: 12,
  },
  playerShell: {
    backgroundColor: hifiColors.surface,
    borderColor: hifiColors.fg,
    borderRadius: 28,
    borderWidth: 1.5,
    overflow: 'hidden',
  },
  playerSurface: {
    borderRadius: 0,
    minHeight: 236,
  },
  section: {
    marginTop: 18,
  },
  sheetButton: {
    marginTop: 12,
  },
  sheetText: {
    color: hifiColors.muted,
    fontSize: 14,
    lineHeight: 20,
  },
  stack: {
    gap: 10,
  },
  textLink: {
    color: hifiColors.accent,
    fontSize: 13,
    fontWeight: '800',
  },
  videoCopy: {
    bottom: 16,
    gap: 8,
    left: 16,
    position: 'absolute',
    right: 16,
  },
  videoTitle: {
    color: '#fff',
    fontSize: 25,
    fontWeight: '900',
    lineHeight: 30,
  },
  wideButton: {
    width: '100%',
  },
});
