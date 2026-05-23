import type { LiveSession } from '../types';
import { router } from 'expo-router';

import * as React from 'react';
import { Pressable, Text, View } from '@/components/ui';
import {
  canOpenLiveRoom,
  openLiveRoom,
  showLiveRoomOpenError,
} from '../native/live-room';
import { usePrototypeStore } from '../store';
import { ProgressLine, SerifText } from './primitives';

type Props = {
  compact?: boolean;
  session: LiveSession;
};

const statusCopy = {
  live: '进入',
  replay: '继续',
  scheduled: '预约',
};

export function LiveCard({ compact = false, session }: Props) {
  const reservedSessionIds = usePrototypeStore.use.reservedSessionIds();
  const toggleReservation = usePrototypeStore.use.toggleReservation();
  const reserved = reservedSessionIds.includes(session.id);
  const action = getActionLabel(session, reserved);

  const handleAction = () => {
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
    <Pressable
      onPress={() => router.push(`/course/${session.id}`)}
      className={`rounded-[28px] border border-yx-line bg-white p-6 ${
        compact ? 'mr-5 w-[270px]' : 'mb-5'
      }`}
    >
      <Text className="mb-5 text-sm font-semibold text-yx-red uppercase">
        {session.timeLabel}
      </Text>
      <SerifText className="mb-4 text-3xl text-yx-ink">
        {session.title}
      </SerifText>
      <Text className="mb-8 text-lg/7 text-yx-muted">
        {session.teacher}
        {session.audience ? ` · ${session.audience}` : ''}
        {' · '}
        {session.subtitle}
      </Text>
      {session.progress ? <ProgressLine progress={session.progress} /> : null}
      <View className="mt-6 flex-row items-center justify-between">
        <Text className="text-base text-yx-muted">{session.topic}</Text>
        <Pressable
          onPress={handleAction}
          className={`size-20 items-center justify-center rounded-full border ${
            session.status === 'live'
              ? 'border-yx-red bg-yx-red'
              : 'border-yx-line bg-white'
          }`}
        >
          <Text
            className={`text-center text-xl font-bold ${
              session.status === 'live' ? 'text-white' : 'text-yx-ink'
            }`}
          >
            {action}
          </Text>
        </Pressable>
      </View>
    </Pressable>
  );
}

function getActionLabel(session: LiveSession, reserved: boolean) {
  if (session.status === 'scheduled') {
    return reserved ? '已约' : statusCopy.scheduled;
  }

  return statusCopy[session.status];
}
