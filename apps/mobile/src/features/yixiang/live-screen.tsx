import type { LiveFilter, LiveSession } from './types';
import { router } from 'expo-router';
import * as React from 'react';
import { StyleSheet } from 'react-native';

import { Pressable, ScrollView, Text, View } from '@/components/ui';
import {
  Chip,
  HifiButton,
  hifiColors,
  HifiScreen,
  HifiScroll,
  Kicker,
  SchemeAction,
} from './components/hifi';
import { liveSessions } from './mock-data';
import {
  canOpenLiveRoom,
  openLiveRoom,
  showLiveRoomOpenError,
} from './native/live-room';
import { usePrototypeStore } from './store';

const filters: { label: string; value: LiveFilter }[] = [
  { label: '全部', value: 'all' },
  { label: '直播中', value: 'live' },
  { label: '可预约', value: 'scheduled' },
  { label: '可回放', value: 'replay' },
];

export function LiveScreen() {
  const activeLiveFilter = usePrototypeStore.use.activeLiveFilter();
  const setLiveFilter = usePrototypeStore.use.setLiveFilter();
  const sessions = activeLiveFilter === 'all'
    ? liveSessions
    : liveSessions.filter(session => session.status === activeLiveFilter);

  return (
    <HifiScreen>
      <HifiScroll>
        <LiveTop />
        <View style={styles.brief}>
          <Kicker>Live List</Kicker>
          <Text style={styles.briefTitle}>
            把私域直播整理成可预约、可回看、可领取资料的学习列表。
          </Text>
        </View>
        <ScrollView
          horizontal
          contentContainerStyle={styles.chips}
          showsHorizontalScrollIndicator={false}
        >
          {filters.map(filter => (
            <Chip
              active={filter.value === activeLiveFilter}
              key={filter.value}
              onPress={() => setLiveFilter(filter.value)}
            >
              {filter.label}
            </Chip>
          ))}
        </ScrollView>
        <View style={styles.stack}>
          {sessions.map(session => <TimelineCard key={session.id} session={session} />)}
        </View>
      </HifiScroll>
    </HifiScreen>
  );
}

function LiveTop() {
  return (
    <View style={styles.schemeTop}>
      <Pressable onPress={() => router.push('/health')} style={styles.search}>
        <Text style={styles.searchIcon}>⌕</Text>
        <Text style={styles.searchText}>搜索直播、课程、资料</Text>
      </Pressable>
      <SchemeAction active label="正在直播" onPress={() => router.push('/course/sleep-live')}>
        直
      </SchemeAction>
      <SchemeAction label="发现" onPress={() => router.push('/health')}>
        ⌕
      </SchemeAction>
      <SchemeAction label="我的" onPress={() => router.push('/profile')}>
        ◉
      </SchemeAction>
    </View>
  );
}

function TimelineCard({ session }: { session: LiveSession }) {
  const reservedSessionIds = usePrototypeStore.use.reservedSessionIds();
  const toggleReservation = usePrototypeStore.use.toggleReservation();
  const reserved = reservedSessionIds.includes(session.id);
  const action = getAction(session, reserved);

  const handlePress = () => {
    if (session.status === 'scheduled') {
      toggleReservation(session.id);
      return;
    }

    if (canOpenLiveRoom(session)) {
      void openLiveRoom(session.h5Url).catch(showLiveRoomOpenError);
      return;
    }

    router.push(`/course/${session.id}`);
  };

  return (
    <View style={styles.timelineCard}>
      <Text style={styles.timeBadge}>{session.timeLabel}</Text>
      <View style={styles.timelineCopy}>
        <Text style={styles.cardTitle}>{session.title}</Text>
        <Text style={styles.muted}>
          {session.teacher}
          {session.audience ? ` · ${session.audience}` : ''}
          {' · '}
          {session.subtitle}
        </Text>
      </View>
      <HifiButton
        onPress={handlePress}
        secondary={session.status !== 'live'}
        style={styles.cardButton}
      >
        {action}
      </HifiButton>
    </View>
  );
}

function getAction(session: LiveSession, reserved: boolean) {
  if (session.status === 'live') {
    return '进入';
  }
  if (session.status === 'scheduled') {
    return reserved ? '已预约' : '预约';
  }
  return session.progress ? '继续' : '查看';
}

const styles = StyleSheet.create({
  brief: {
    backgroundColor: hifiColors.surface,
    borderRadius: 24,
    marginBottom: 18,
    padding: 18,
    shadowColor: '#1e232d',
    shadowOffset: { height: 8, width: 0 },
    shadowOpacity: 0.04,
    shadowRadius: 22,
  },
  briefTitle: {
    color: hifiColors.fg,
    fontSize: 26,
    fontWeight: '800',
    lineHeight: 31,
  },
  cardButton: {
    alignSelf: 'flex-start',
    marginTop: 10,
  },
  cardTitle: {
    color: hifiColors.fg,
    fontSize: 17,
    fontWeight: '800',
    lineHeight: 22,
  },
  chips: {
    gap: 8,
    marginBottom: 12,
    paddingBottom: 2,
  },
  muted: {
    color: hifiColors.muted,
    fontSize: 12,
    lineHeight: 17,
    marginTop: 5,
  },
  schemeTop: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
    marginBottom: 14,
  },
  search: {
    alignItems: 'center',
    backgroundColor: hifiColors.surface,
    borderRadius: 999,
    flex: 1,
    flexDirection: 'row',
    gap: 10,
    minHeight: 52,
    paddingHorizontal: 16,
  },
  searchIcon: {
    color: hifiColors.muted,
    fontSize: 20,
  },
  searchText: {
    color: hifiColors.muted,
    flex: 1,
    fontSize: 15,
  },
  stack: {
    gap: 12,
  },
  timeBadge: {
    color: hifiColors.accent,
    fontFamily: 'Menlo',
    fontSize: 12,
  },
  timelineCard: {
    backgroundColor: hifiColors.surface,
    borderRadius: 20,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    padding: 14,
  },
  timelineCopy: {
    flex: 1,
    minWidth: 0,
  },
});
