import type { DiscoveryFeedItem } from './types';
import { router } from 'expo-router';
import * as React from 'react';
import { StyleSheet, useWindowDimensions } from 'react-native';

import { Pressable, ScrollView, Text, View } from '@/components/ui';
import { hifiColors, HifiScreen, HifiSheet } from './components/hifi';
import { discoveryFeed } from './mock-data';
import { usePrototypeStore } from './store';

type SheetKind = 'comment' | 'consult' | null;

export function HealthScreen() {
  const [channel, setChannel] = React.useState<'follow' | 'recommend'>('recommend');
  const [sheet, setSheet] = React.useState<SheetKind>(null);
  const { height } = useWindowDimensions();
  const itemHeight = Math.max(height - 86, 640);

  return (
    <HifiScreen dark>
      <View style={styles.feedScreen}>
        <FeedHeader channel={channel} onChange={setChannel} />
        <ScrollView
          alwaysBounceVertical
          contentInsetAdjustmentBehavior="never"
          keyboardShouldPersistTaps="handled"
          nestedScrollEnabled
          pagingEnabled
          scrollEnabled
          scrollEventThrottle={16}
          showsVerticalScrollIndicator={false}
          snapToInterval={itemHeight}
          style={styles.feedScroll}
        >
          {discoveryFeed.map(item => (
            <FeedItem
              item={item}
              itemHeight={itemHeight}
              key={item.id}
              onOpenSheet={setSheet}
            />
          ))}
        </ScrollView>
        <CommentSheet onClose={() => setSheet(null)} visible={sheet === 'comment'} />
        <ConsultSheet onClose={() => setSheet(null)} visible={sheet === 'consult'} />
      </View>
    </HifiScreen>
  );
}

function FeedHeader({
  channel,
  onChange,
}: {
  channel: 'follow' | 'recommend';
  onChange: (channel: 'follow' | 'recommend') => void;
}) {
  return (
    <View style={styles.feedHeader}>
      <Pressable onPress={() => router.push('/health')} style={styles.feedSearch}>
        <Text style={styles.headerText}>⌕</Text>
      </Pressable>
      <View style={styles.feedChannels}>
        <FeedTab
          active={channel === 'recommend'}
          label="推荐"
          onPress={() => onChange('recommend')}
        />
        <FeedTab
          active={channel === 'follow'}
          label="关注"
          onPress={() => onChange('follow')}
        />
      </View>
      <Pressable onPress={() => router.push('/live')} style={styles.liveLink}>
        <Text style={styles.liveLinkText}>直播</Text>
      </Pressable>
    </View>
  );
}

function FeedTab({
  active,
  label,
  onPress,
}: {
  active: boolean;
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={styles.feedTab}>
      <Text style={[styles.feedTabText, active && styles.feedTabTextActive]}>
        {label}
      </Text>
      {active ? <View style={styles.feedTabLine} /> : null}
    </Pressable>
  );
}

function FeedItem({
  item,
  itemHeight,
  onOpenSheet,
}: {
  item: DiscoveryFeedItem;
  itemHeight: number;
  onOpenSheet: (sheet: SheetKind) => void;
}) {
  return (
    <View style={[styles.feedItem, { height: itemHeight }]}>
      <PosterBackground tone={item.tone} />
      <View style={styles.feedGradient} />
      <PosterFigure />
      <FeedActions item={item} onOpenSheet={onOpenSheet} />
      <FeedCopy item={item} onOpenSheet={onOpenSheet} />
    </View>
  );
}

function PosterBackground({ tone }: { tone: DiscoveryFeedItem['tone'] }) {
  return (
    <View style={[styles.posterBg, posterTone[tone]]}>
      <View style={styles.posterHaloOne} />
      <View style={styles.posterHaloTwo} />
    </View>
  );
}

function PosterFigure() {
  return (
    <View style={styles.posterFigure}>
      <View style={styles.figureHead} />
      <View style={styles.figureBody} />
      <View style={styles.figureArm} />
    </View>
  );
}

function FeedActions({
  item,
  onOpenSheet,
}: {
  item: DiscoveryFeedItem;
  onOpenSheet: (sheet: SheetKind) => void;
}) {
  const likedFeedIds = usePrototypeStore.use.likedFeedIds();
  const savedFeedIds = usePrototypeStore.use.savedFeedIds();
  const toggleLikeFeed = usePrototypeStore.use.toggleLikeFeed();
  const toggleSaveFeed = usePrototypeStore.use.toggleSaveFeed();
  const liked = likedFeedIds.includes(item.id);
  const saved = savedFeedIds.includes(item.id);

  return (
    <View style={styles.feedActions}>
      <ActionButton active={liked} label={item.likes} onPress={() => toggleLikeFeed(item.id)}>
        ♥
      </ActionButton>
      <ActionButton label={item.comments} onPress={() => onOpenSheet('comment')}>
        ●
      </ActionButton>
      <ActionButton active={saved} label={item.favorites} onPress={() => toggleSaveFeed(item.id)}>
        ▤
      </ActionButton>
      <ActionButton label="分享" onPress={() => onOpenSheet('consult')}>
        ↗
      </ActionButton>
    </View>
  );
}

function ActionButton({
  active = false,
  children,
  label,
  onPress,
}: {
  active?: boolean;
  children: React.ReactNode;
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={styles.feedAction}>
      <Text style={[styles.actionIcon, active && styles.actionActive]}>{children}</Text>
      <Text style={styles.actionLabel}>{label}</Text>
    </Pressable>
  );
}

function FeedCopy({
  item,
  onOpenSheet,
}: {
  item: DiscoveryFeedItem;
  onOpenSheet: (sheet: SheetKind) => void;
}) {
  const followedCreatorIds = usePrototypeStore.use.followedCreatorIds();
  const toggleFollowCreator = usePrototypeStore.use.toggleFollowCreator();
  const followed = followedCreatorIds.includes(item.author);

  return (
    <View style={styles.feedCopy}>
      <View style={styles.creatorRow}>
        <View style={styles.creatorAvatar}>
          <Text style={styles.creatorAvatarText}>{item.avatar}</Text>
        </View>
        <Text numberOfLines={1} style={styles.creatorName}>{item.author}</Text>
        <Pressable
          onPress={() => toggleFollowCreator(item.author)}
          style={[styles.followPill, followed && styles.followedPill]}
        >
          <Text style={styles.followText}>{followed ? '已关注' : '关注'}</Text>
        </Pressable>
      </View>
      <Text style={styles.feedTitle}>{item.title}</Text>
      <Text style={styles.feedDesc}>{item.description}</Text>
      <View style={styles.metaRow}>
        <Pressable onPress={() => router.push(item.route)} style={styles.metaPill}>
          <Text style={styles.metaText}>{item.primaryAction}</Text>
        </Pressable>
        <Pressable onPress={() => onOpenSheet('consult')} style={styles.metaPill}>
          <Text style={styles.metaText}>{item.secondaryAction}</Text>
        </Pressable>
      </View>
    </View>
  );
}

function CommentSheet({ onClose, visible }: { onClose: () => void; visible: boolean }) {
  return (
    <HifiSheet onClose={onClose} title="评论" visible={visible}>
      {['今晚几点开始？', '老师讲得很清楚', '想要睡眠自查表'].map(text => (
        <View key={text} style={styles.sheetRow}>
          <Text style={styles.sheetRowTitle}>{text}</Text>
          <Text style={styles.sheetRowMeta}>会员留言 · 讲师选择性回复</Text>
        </View>
      ))}
    </HifiSheet>
  );
}

function ConsultSheet({ onClose, visible }: { onClose: () => void; visible: boolean }) {
  return (
    <HifiSheet onClose={onClose} title="咨询助教" visible={visible}>
      <Text style={styles.sheetText}>已为你保留当前学习内容，课后助教会按会员问题集中回复。</Text>
      <Pressable onPress={onClose} style={styles.consultButton}>
        <Text style={styles.consultButtonText}>提交咨询</Text>
      </Pressable>
    </HifiSheet>
  );
}

const posterTone = StyleSheet.create({
  food: {
    backgroundColor: '#6c583a',
  },
  live: {
    backgroundColor: '#782d2d',
  },
  sleep: {
    backgroundColor: '#58614f',
  },
});

const styles = StyleSheet.create({
  actionActive: {
    color: hifiColors.accent,
  },
  actionIcon: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '900',
    textAlign: 'center',
  },
  actionLabel: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
    textAlign: 'center',
  },
  consultButton: {
    alignItems: 'center',
    backgroundColor: hifiColors.accent,
    borderRadius: 999,
    marginTop: 10,
    minHeight: 44,
    justifyContent: 'center',
  },
  consultButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '800',
  },
  creatorAvatar: {
    alignItems: 'center',
    backgroundColor: '#111',
    borderColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 999,
    borderWidth: 2,
    height: 42,
    justifyContent: 'center',
    width: 42,
  },
  creatorAvatarText: {
    color: '#fff',
    fontWeight: '900',
  },
  creatorName: {
    color: '#fff',
    flex: 1,
    fontSize: 22,
    fontWeight: '900',
  },
  creatorRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
  },
  feedAction: {
    alignItems: 'center',
    gap: 7,
    width: 58,
  },
  feedActions: {
    bottom: 66,
    gap: 19,
    position: 'absolute',
    right: 10,
    zIndex: 5,
  },
  feedChannels: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 24,
    justifyContent: 'center',
  },
  feedCopy: {
    bottom: 18,
    gap: 9,
    left: 14,
    position: 'absolute',
    right: 78,
    zIndex: 4,
  },
  feedDesc: {
    color: 'rgba(255, 255, 255, 0.72)',
    fontSize: 14,
    lineHeight: 20,
  },
  feedGradient: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.18)',
    zIndex: 1,
  },
  feedHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'space-between',
    left: 0,
    paddingHorizontal: 14,
    paddingTop: 14,
    position: 'absolute',
    right: 0,
    top: 0,
    zIndex: 20,
  },
  feedItem: {
    backgroundColor: '#111',
    overflow: 'hidden',
  },
  feedScreen: {
    backgroundColor: '#050505',
    flex: 1,
  },
  feedScroll: {
    backgroundColor: '#050505',
    flex: 1,
  },
  feedSearch: {
    alignItems: 'center',
    height: 40,
    justifyContent: 'center',
    width: 44,
  },
  feedTab: {
    alignItems: 'center',
    minHeight: 40,
  },
  feedTabLine: {
    backgroundColor: '#fff',
    borderRadius: 999,
    height: 3,
    marginTop: 2,
    width: 24,
  },
  feedTabText: {
    color: 'rgba(255, 255, 255, 0.62)',
    fontSize: 18,
    fontWeight: '800',
  },
  feedTabTextActive: {
    color: '#fff',
  },
  feedTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '900',
    lineHeight: 25,
  },
  figureArm: {
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    borderRadius: 22,
    height: 160,
    position: 'absolute',
    right: -12,
    top: 115,
    transform: [{ rotate: '-18deg' }],
    width: 34,
  },
  figureBody: {
    backgroundColor: 'rgba(238, 238, 232, 0.28)',
    borderRadius: 56,
    height: 208,
    left: 16,
    position: 'absolute',
    top: 83,
    width: 178,
  },
  figureHead: {
    backgroundColor: 'rgba(244, 214, 190, 0.75)',
    borderRadius: 999,
    height: 86,
    left: 58,
    position: 'absolute',
    top: 0,
    width: 86,
  },
  followPill: {
    alignItems: 'center',
    backgroundColor: hifiColors.accent,
    borderRadius: 999,
    minHeight: 34,
    paddingHorizontal: 18,
    justifyContent: 'center',
  },
  followText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '800',
  },
  followedPill: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  headerText: {
    color: '#fff',
    fontSize: 26,
    fontWeight: '800',
  },
  liveLink: {
    alignItems: 'center',
    height: 40,
    justifyContent: 'center',
    width: 54,
  },
  liveLinkText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '800',
  },
  metaPill: {
    backgroundColor: 'rgba(255, 255, 255, 0.16)',
    borderRadius: 999,
    minHeight: 32,
    paddingHorizontal: 12,
    justifyContent: 'center',
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  metaText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '800',
  },
  posterBg: {
    ...StyleSheet.absoluteFillObject,
  },
  posterFigure: {
    height: 330,
    left: '50%',
    marginLeft: -105,
    position: 'absolute',
    top: '23%',
    width: 210,
    zIndex: 2,
  },
  posterHaloOne: {
    backgroundColor: 'rgba(255, 225, 198, 0.45)',
    borderRadius: 108,
    height: 216,
    position: 'absolute',
    right: 48,
    top: 160,
    width: 216,
  },
  posterHaloTwo: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 160,
    height: 320,
    left: 44,
    position: 'absolute',
    top: 260,
    width: 320,
  },
  sheetRow: {
    backgroundColor: hifiColors.surfaceWarm,
    borderRadius: 16,
    marginBottom: 8,
    padding: 12,
  },
  sheetRowMeta: {
    color: hifiColors.muted,
    fontSize: 12,
    marginTop: 4,
  },
  sheetRowTitle: {
    color: hifiColors.fg,
    fontSize: 15,
    fontWeight: '700',
  },
  sheetText: {
    color: hifiColors.muted,
    fontSize: 14,
    lineHeight: 20,
  },
});
