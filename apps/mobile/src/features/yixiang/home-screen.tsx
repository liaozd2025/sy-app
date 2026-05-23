import type { Href } from 'expo-router';
import { router } from 'expo-router';
import * as React from 'react';
import { StyleSheet } from 'react-native';

import { Pressable, ScrollView, Text, View } from '@/components/ui';
import { PageScroll, Screen, SerifText } from './components/primitives';
import { usePrototypeStore } from './store';

type HomeSection = 'featured' | 'recent' | 'upcoming';

type ChannelItem = {
  active?: boolean;
  label: string;
  menu?: boolean;
  route: Href;
};

type MiniLive = {
  action: 'favorite' | 'reserve';
  id: string;
  meta: string;
  posterTitle: string;
  route: Href;
  time: string;
  title: string;
  tone: 'amber' | 'dark' | 'warm';
};

const channels: ChannelItem[] = [
  { active: true, label: '推荐', route: '/' },
  { label: '直播', route: '/live' },
  { label: '课程', route: '/course/season-care' },
  { label: '科普', route: '/content/sleep-90' },
  { label: 'AI 学习圈', route: '/quiz' },
  { label: '', menu: true, route: '/encyclopedia' },
];

const miniLives: MiniLive[] = [
  {
    action: 'reserve',
    id: 'after-meal',
    meta: '269人已预约',
    posterTitle: '618 健康知识擂台赛开打',
    route: '/course/sleep-live',
    time: '05月21日 20:00',
    title: '健康知识擂台赛开打，积分等你带回家！',
    tone: 'warm',
  },
  {
    action: 'reserve',
    id: 'dinner-sleep',
    meta: '246人已预约',
    posterTitle: '深夜精神食堂：你的困惑，总有人回答',
    route: '/course/sleep-live',
    time: '05月22日 20:00',
    title: '睡不好、易疲惫，先从晚间节律开始',
    tone: 'amber',
  },
  {
    action: 'favorite',
    id: 'solar-terms',
    meta: '1.2万人看过',
    posterTitle: '四季养护入门：饮食与作息',
    route: '/course/season-care',
    time: '回放可看',
    title: '5 月会员专属回放，已更新第 4 讲',
    tone: 'dark',
  },
];

const recentItems = [
  {
    meta: '已学 42% · 继续第 3 节',
    route: '/course/season-care' as Href,
    title: '睡眠修复课',
    tone: 'peach',
  },
  {
    meta: '图文科普 · 还剩 4 分钟',
    route: '/content/sleep-90' as Href,
    title: '饭后活动指南',
    tone: 'teal',
  },
  {
    meta: '今日 6 题 · 正确率 82%',
    route: '/quiz' as Href,
    title: '控糖基础题库',
    tone: 'umber',
  },
  {
    meta: '已收藏 12 个词条',
    route: '/encyclopedia' as Href,
    title: '养生百科词条',
    tone: 'ink',
  },
] as const;

export function HomeScreen() {
  const pointsClaimed = usePrototypeStore.use.pointsClaimed();
  const togglePoints = usePrototypeStore.use.togglePoints();
  const [hiddenSections, setHiddenSections] = React.useState<HomeSection[]>([]);

  const dismissSection = React.useCallback((section: HomeSection) => {
    setHiddenSections(current => (
      current.includes(section) ? current : [...current, section]
    ));
  }, []);

  return (
    <Screen style={styles.screen}>
      <PageScroll
        contentContainerStyle={styles.feedContent}
        style={styles.feedScroll}
      >
        <HomeTop
          pointsClaimed={pointsClaimed}
          onTogglePoints={togglePoints}
        />
        {!hiddenSections.includes('featured') && (
          <FeaturedLiveBlock onDismiss={() => dismissSection('featured')} />
        )}
        {!hiddenSections.includes('upcoming') && (
          <MiniLiveBlock onDismiss={() => dismissSection('upcoming')} />
        )}
        {!hiddenSections.includes('recent') && (
          <RecentLearningBlock onDismiss={() => dismissSection('recent')} />
        )}
      </PageScroll>
    </Screen>
  );
}

function HomeTop({
  onTogglePoints,
  pointsClaimed,
}: {
  onTogglePoints: () => void;
  pointsClaimed: boolean;
}) {
  return (
    <View style={styles.top}>
      <View style={styles.toolRow}>
        <Pressable
          accessibilityRole="search"
          onPress={() => router.push('/health')}
          style={styles.search}
        >
          <View style={styles.searchIcon}>
            <View style={styles.searchHandle} />
          </View>
          <Text numberOfLines={1} style={styles.searchText}>
            1万人看过「睡眠修复课」
          </Text>
        </Pressable>
        <Pressable onPress={onTogglePoints} style={styles.pointsPill}>
          <View style={styles.pointsIcon}>
            <Text style={styles.pointsIconText}>礼</Text>
          </View>
          <Text style={styles.pointsText}>
            {pointsClaimed ? '已领取' : '领 4 积分'}
          </Text>
        </Pressable>
        <HeaderAction label="观看历史" onPress={() => router.push('/course/season-care')}>
          ↶
        </HeaderAction>
        <HeaderAction hasBadge label="消息" onPress={() => router.push('/profile')}>
          □
        </HeaderAction>
      </View>
      <ScrollView
        alwaysBounceVertical={false}
        directionalLockEnabled
        horizontal
        contentContainerStyle={styles.channelTabs}
        showsHorizontalScrollIndicator={false}
      >
        {channels.map(item => (
          <Pressable
            key={item.menu ? 'menu' : item.label}
            onPress={() => router.push(item.route)}
            style={styles.channelItem}
          >
            {item.menu
              ? <MenuGlyph />
              : (
                  <>
                    <Text style={[styles.channelText, item.active && styles.channelTextActive]}>
                      {item.label}
                    </Text>
                    {item.active ? <View style={styles.channelActiveBar} /> : null}
                  </>
                )}
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

function HeaderAction({
  children,
  hasBadge = false,
  label,
  onPress,
}: {
  children: React.ReactNode;
  hasBadge?: boolean;
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityLabel={label}
      accessibilityRole="button"
      onPress={onPress}
      style={styles.headerAction}
    >
      <Text style={styles.headerActionText}>{children}</Text>
      {hasBadge && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>3</Text>
        </View>
      )}
    </Pressable>
  );
}

function MenuGlyph() {
  return (
    <View style={styles.menuGlyph}>
      <View style={styles.menuLine} />
      <View style={styles.menuLine} />
      <View style={styles.menuLine} />
    </View>
  );
}

function FeaturedLiveBlock({ onDismiss }: { onDismiss: () => void }) {
  const reservedSessionIds = usePrototypeStore.use.reservedSessionIds();
  const toggleReservation = usePrototypeStore.use.toggleReservation();
  const reserved = reservedSessionIds.includes('after-meal');

  return (
    <View style={styles.liveBlock}>
      <DismissButton onPress={onDismiss} />
      <SerifText style={styles.blockTitleLarge}>最新直播·今日 19:00</SerifText>
      <View style={styles.featuredCard}>
        <View style={styles.featuredPoster}>
          <View style={styles.posterSide} />
          <View style={styles.posterGlow} />
          <View style={styles.posterPerson} />
          <View style={styles.posterGlasses} />
          <Text style={styles.posterTime}>今日 19:00</Text>
          <Text style={styles.posterSeries}>养生直播间 第 3 期</Text>
          <Text style={styles.featuredTitle}>实测：睡前 30 分钟怎么安排</Text>
          <Text style={styles.featuredMeta}>4,430 人已预约</Text>
          <Text style={styles.posterHost}>{'林静\n主讲'}</Text>
          <Pressable
            accessibilityRole="button"
            onPress={() => router.push('/course/sleep-live')}
            style={styles.enterLiveCta}
          >
            <Text style={styles.enterLiveText}>进入</Text>
          </Pressable>
        </View>
        <Pressable
          onPress={() => toggleReservation('after-meal')}
          style={[styles.reserveCta, reserved && styles.reserveCtaActive]}
        >
          <Text style={styles.reserveText}>{reserved ? '已预约' : '预约'}</Text>
        </Pressable>
      </View>
    </View>
  );
}

function MiniLiveBlock({ onDismiss }: { onDismiss: () => void }) {
  return (
    <View style={[styles.liveBlock, styles.blockSpacing]}>
      <DismissButton onPress={onDismiss} />
      <View style={styles.blockTitleRow}>
        <SerifText style={styles.blockTitle}>直播·05月21日 20:00</SerifText>
        <Pressable onPress={() => router.push('/live')} style={styles.morePill}>
          <Text style={styles.moreText}>更多 ›</Text>
        </Pressable>
      </View>
      <ScrollView
        alwaysBounceVertical={false}
        directionalLockEnabled
        horizontal
        contentContainerStyle={styles.miniRail}
        showsHorizontalScrollIndicator={false}
      >
        {miniLives.map(item => <MiniLiveCard item={item} key={item.id} />)}
      </ScrollView>
    </View>
  );
}

function MiniLiveCard({ item }: { item: MiniLive }) {
  const favoriteContentIds = usePrototypeStore.use.favoriteContentIds();
  const reservedSessionIds = usePrototypeStore.use.reservedSessionIds();
  const toggleFavorite = usePrototypeStore.use.toggleFavorite();
  const toggleReservation = usePrototypeStore.use.toggleReservation();
  const active = item.action === 'reserve'
    ? reservedSessionIds.includes(item.id)
    : favoriteContentIds.includes(item.id);

  const handleAction = () => {
    if (item.action === 'reserve') {
      toggleReservation(item.id);
      return;
    }
    toggleFavorite(item.id);
  };

  return (
    <View style={styles.miniCard}>
      <View style={[styles.miniPoster, posterToneStyles[item.tone]]}>
        <View style={styles.miniPosterCircle} />
        <Text style={styles.miniTime}>{item.time}</Text>
        <Text style={styles.miniPosterTitle}>{item.posterTitle}</Text>
      </View>
      <View style={styles.miniCopy}>
        <Text numberOfLines={2} style={styles.miniTitle}>{item.title}</Text>
        <View style={styles.miniActionRow}>
          <Text numberOfLines={1} style={styles.miniMeta}>{item.meta}</Text>
          <Pressable onPress={handleAction} style={styles.miniButton}>
            <Text style={styles.miniButtonText}>
              {getMiniActionLabel(item.action, active)}
            </Text>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            onPress={() => router.push(item.route)}
            style={styles.miniGhostButton}
          >
            <Text style={styles.miniGhostText}>查看</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

function RecentLearningBlock({ onDismiss }: { onDismiss: () => void }) {
  return (
    <View style={[styles.liveBlock, styles.blockSpacing]}>
      <DismissButton onPress={onDismiss} />
      <View style={styles.blockTitleRow}>
        <SerifText style={styles.blockTitle}>最近学习</SerifText>
        <Pressable onPress={() => router.push('/quiz')} style={styles.morePill}>
          <Text style={styles.moreText}>更多 ›</Text>
        </Pressable>
      </View>
      <ScrollView
        alwaysBounceVertical={false}
        directionalLockEnabled
        horizontal
        contentContainerStyle={styles.recentRail}
        showsHorizontalScrollIndicator={false}
      >
        {recentItems.map(item => (
          <Pressable
            key={item.title}
            onPress={() => router.push(item.route)}
            style={styles.recentCard}
          >
            <View style={[styles.recentCover, recentToneStyles[item.tone]]} />
            <Text numberOfLines={2} style={styles.recentTitle}>{item.title}</Text>
            <Text numberOfLines={2} style={styles.recentMeta}>{item.meta}</Text>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

function DismissButton({ onPress }: { onPress: () => void }) {
  return (
    <Pressable
      accessibilityLabel="不再展示"
      accessibilityRole="button"
      onPress={onPress}
      style={styles.dismiss}
    >
      <Text style={styles.dismissText}>×</Text>
    </Pressable>
  );
}

function getMiniActionLabel(action: MiniLive['action'], active: boolean) {
  if (action === 'reserve') {
    return active ? '已预约' : '预约';
  }
  return active ? '已收藏' : '收藏';
}

const posterToneStyles = {
  amber: {
    backgroundColor: '#d97922',
  },
  dark: {
    backgroundColor: '#4f2330',
  },
  warm: {
    backgroundColor: '#ee5d38',
  },
} as const;

const recentToneStyles = {
  ink: {
    backgroundColor: '#252832',
  },
  peach: {
    backgroundColor: '#f07845',
  },
  teal: {
    backgroundColor: '#3a9ca0',
  },
  umber: {
    backgroundColor: '#7a5137',
  },
} as const;

const styles = StyleSheet.create({
  badge: {
    alignItems: 'center',
    backgroundColor: '#df6439',
    borderRadius: 999,
    height: 18,
    justifyContent: 'center',
    position: 'absolute',
    right: 0,
    top: 1,
    width: 18,
  },
  badgeText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '800',
  },
  blockSpacing: {
    marginTop: 14,
  },
  blockTitle: {
    color: '#111',
    fontSize: 25,
    fontWeight: '900',
    lineHeight: 28,
  },
  blockTitleLarge: {
    color: '#111',
    fontSize: 29,
    fontWeight: '900',
    lineHeight: 32,
    marginBottom: 14,
    marginRight: 28,
  },
  blockTitleRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
    marginBottom: 14,
    marginRight: 28,
  },
  channelActiveBar: {
    alignSelf: 'center',
    backgroundColor: '#df6439',
    borderRadius: 999,
    height: 4,
    marginTop: 4,
    width: 30,
  },
  channelItem: {
    flexShrink: 0,
    justifyContent: 'center',
    minHeight: 38,
  },
  channelTabs: {
    alignItems: 'center',
    gap: 26,
    paddingBottom: 7,
    paddingHorizontal: 14,
  },
  channelText: {
    color: '#4f5460',
    fontSize: 18,
    fontWeight: '600',
  },
  channelTextActive: {
    color: '#111',
    fontSize: 25,
    fontWeight: '900',
  },
  dismiss: {
    alignItems: 'center',
    height: 30,
    justifyContent: 'center',
    position: 'absolute',
    right: 12,
    top: 13,
    width: 30,
    zIndex: 10,
  },
  dismissText: {
    color: '#c7cad2',
    fontSize: 25,
    lineHeight: 28,
  },
  enterLiveCta: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
    borderRadius: 999,
    minHeight: 36,
    minWidth: 64,
    justifyContent: 'center',
    paddingHorizontal: 13,
    position: 'absolute',
    right: 13,
    top: 14,
    zIndex: 5,
  },
  enterLiveText: {
    color: '#252832',
    fontSize: 14,
    fontWeight: '900',
  },
  featuredCard: {
    backgroundColor: '#09183c',
    borderRadius: 11,
    minHeight: 206,
    overflow: 'hidden',
    position: 'relative',
  },
  featuredMeta: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 15,
    fontWeight: '600',
    marginTop: 7,
    maxWidth: 220,
    zIndex: 2,
  },
  featuredPoster: {
    backgroundColor: '#102d72',
    justifyContent: 'flex-end',
    minHeight: 206,
    overflow: 'hidden',
    paddingBottom: 18,
    paddingLeft: 16,
    paddingRight: 150,
  },
  featuredTitle: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '900',
    lineHeight: 30,
    maxWidth: 220,
    zIndex: 2,
  },
  feedContent: {
    paddingBottom: 150,
    paddingHorizontal: 10,
    paddingTop: 0,
  },
  feedScroll: {
    backgroundColor: '#f6f7fb',
  },
  headerAction: {
    alignItems: 'center',
    height: 38,
    justifyContent: 'center',
    position: 'relative',
    width: 38,
  },
  headerActionText: {
    color: '#252832',
    fontSize: 24,
    fontWeight: '700',
    lineHeight: 28,
  },
  liveBlock: {
    backgroundColor: '#fff',
    borderRadius: 22,
    paddingBottom: 16,
    paddingHorizontal: 12,
    paddingTop: 20,
    position: 'relative',
    shadowColor: '#23272f',
    shadowOffset: { height: 10, width: 0 },
    shadowOpacity: 0.05,
    shadowRadius: 28,
  },
  menuGlyph: {
    gap: 6,
    justifyContent: 'center',
    width: 28,
  },
  menuLine: {
    backgroundColor: '#4f5460',
    borderRadius: 999,
    height: 2.5,
    width: 24,
  },
  miniActionRow: {
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  miniButton: {
    alignItems: 'center',
    backgroundColor: '#df6439',
    borderRadius: 999,
    justifyContent: 'center',
    minHeight: 36,
    minWidth: 62,
    paddingHorizontal: 9,
  },
  miniButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '800',
  },
  miniCard: {
    backgroundColor: '#f8f9fb',
    borderRadius: 12,
    overflow: 'hidden',
    width: 170,
  },
  miniCopy: {
    paddingBottom: 13,
    paddingHorizontal: 11,
    paddingTop: 12,
  },
  miniLiveCardSpacer: {
    width: 14,
  },
  miniMeta: {
    color: '#8a909c',
    flexBasis: '100%',
    fontSize: 13,
    marginBottom: 2,
  },
  miniGhostButton: {
    alignItems: 'center',
    backgroundColor: '#fff',
    borderColor: '#e5e8ef',
    borderRadius: 999,
    borderWidth: 1,
    justifyContent: 'center',
    minHeight: 36,
    minWidth: 56,
    paddingHorizontal: 9,
  },
  miniGhostText: {
    color: '#606673',
    fontSize: 14,
    fontWeight: '800',
  },
  miniPoster: {
    justifyContent: 'space-between',
    minHeight: 136,
    overflow: 'hidden',
    padding: 12,
    position: 'relative',
  },
  miniPosterCircle: {
    backgroundColor: 'rgba(255, 255, 255, 0.55)',
    borderRadius: 30,
    height: 60,
    position: 'absolute',
    right: 16,
    top: 32,
    width: 60,
  },
  miniPosterTitle: {
    color: '#fff',
    fontSize: 21,
    fontWeight: '900',
    lineHeight: 24,
    maxWidth: 150,
    zIndex: 2,
  },
  miniRail: {
    gap: 14,
    paddingBottom: 4,
    paddingHorizontal: 2,
  },
  miniTime: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 999,
    color: '#6f7786',
    fontSize: 12,
    fontWeight: '800',
    overflow: 'hidden',
    paddingHorizontal: 9,
    paddingVertical: 5,
    zIndex: 2,
  },
  miniTitle: {
    color: '#30333b',
    fontSize: 18,
    fontWeight: '800',
    lineHeight: 24,
    marginBottom: 12,
    minHeight: 48,
  },
  morePill: {
    alignItems: 'center',
    backgroundColor: '#fff',
    borderColor: '#edf0f4',
    borderRadius: 999,
    borderWidth: 1,
    justifyContent: 'center',
    minHeight: 32,
    paddingHorizontal: 12,
  },
  moreText: {
    color: '#7f8490',
    fontSize: 14,
    fontWeight: '600',
  },
  pointsIcon: {
    alignItems: 'center',
    backgroundColor: '#df6439',
    borderRadius: 7,
    height: 22,
    justifyContent: 'center',
    width: 22,
  },
  pointsIconText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '800',
    lineHeight: 16,
  },
  pointsPill: {
    alignItems: 'center',
    backgroundColor: '#fff5e9',
    borderRadius: 999,
    flexDirection: 'row',
    gap: 6,
    minHeight: 44,
    paddingHorizontal: 13,
  },
  pointsText: {
    color: '#df6439',
    fontSize: 14,
    fontWeight: '800',
  },
  posterGlasses: {
    borderColor: '#111827',
    borderRadius: 10,
    borderWidth: 3,
    bottom: 104,
    height: 18,
    position: 'absolute',
    right: 61,
    width: 50,
    zIndex: 2,
  },
  posterGlow: {
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
    borderRadius: 78,
    height: 156,
    position: 'absolute',
    right: 6,
    top: 20,
    width: 156,
  },
  posterHost: {
    backgroundColor: '#1269d8',
    borderRadius: 999,
    bottom: 74,
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
    lineHeight: 14,
    paddingHorizontal: 5,
    paddingVertical: 8,
    position: 'absolute',
    right: 14,
    textAlign: 'center',
    zIndex: 3,
  },
  posterPerson: {
    backgroundColor: '#10141b',
    borderRadius: 52,
    bottom: -28,
    height: 188,
    position: 'absolute',
    right: 36,
    width: 102,
    zIndex: 1,
  },
  posterSeries: {
    alignSelf: 'flex-start',
    borderColor: 'rgba(255, 255, 255, 0.82)',
    borderWidth: 2,
    color: '#fff',
    fontSize: 14,
    fontWeight: '900',
    marginBottom: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    zIndex: 2,
  },
  posterSide: {
    backgroundColor: '#75c3f8',
    bottom: 0,
    opacity: 0.85,
    position: 'absolute',
    right: 0,
    top: 0,
    width: '42%',
  },
  posterTime: {
    backgroundColor: 'rgba(255, 255, 255, 0.94)',
    borderRadius: 999,
    color: '#677083',
    fontSize: 13,
    fontWeight: '800',
    left: 14,
    overflow: 'hidden',
    paddingHorizontal: 12,
    paddingVertical: 6,
    position: 'absolute',
    top: 14,
    zIndex: 2,
  },
  recentCard: {
    borderRadius: 12,
    width: 110,
  },
  recentCover: {
    borderRadius: 10,
    height: 82,
    marginBottom: 9,
  },
  recentMeta: {
    color: '#8c929e',
    fontSize: 11,
    lineHeight: 15,
  },
  recentRail: {
    gap: 14,
    paddingBottom: 4,
    paddingHorizontal: 2,
  },
  recentTitle: {
    color: '#22252c',
    fontSize: 14,
    fontWeight: '800',
    lineHeight: 18,
    marginBottom: 4,
  },
  reserveCta: {
    alignItems: 'center',
    backgroundColor: '#df6439',
    borderRadius: 999,
    bottom: 14,
    justifyContent: 'center',
    minHeight: 50,
    minWidth: 92,
    paddingHorizontal: 22,
    position: 'absolute',
    right: 13,
    zIndex: 4,
  },
  reserveCtaActive: {
    backgroundColor: '#252832',
  },
  reserveText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '900',
  },
  screen: {
    backgroundColor: '#f6f7fb',
  },
  search: {
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 999,
    flex: 1,
    flexDirection: 'row',
    gap: 10,
    minHeight: 48,
    minWidth: 0,
    paddingHorizontal: 15,
    shadowColor: '#23272f',
    shadowOffset: { height: 10, width: 0 },
    shadowOpacity: 0.05,
    shadowRadius: 28,
  },
  searchHandle: {
    backgroundColor: '#8f95a3',
    borderRadius: 999,
    bottom: -3,
    height: 2,
    position: 'absolute',
    right: -5,
    transform: [{ rotate: '45deg' }],
    width: 8,
  },
  searchIcon: {
    borderColor: '#8f95a3',
    borderRadius: 999,
    borderWidth: 2,
    height: 19,
    position: 'relative',
    width: 19,
  },
  searchText: {
    color: '#8f95a3',
    flex: 1,
    fontSize: 15,
  },
  top: {
    backgroundColor: '#f6f7fb',
    borderBottomColor: 'rgba(225, 227, 233, 0.72)',
    borderBottomWidth: StyleSheet.hairlineWidth,
    paddingBottom: 8,
    paddingHorizontal: 14,
    paddingTop: 12,
  },
  toolRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
  },
});
