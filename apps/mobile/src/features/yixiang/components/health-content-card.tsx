import type { HealthContent } from '../types';
import { router } from 'expo-router';

import * as React from 'react';
import { Pressable, Text, View } from '@/components/ui';
import { usePrototypeStore } from '../store';
import { SerifText } from './primitives';

type Props = {
  content: HealthContent;
};

export function HealthContentCard({ content }: Props) {
  const favoriteContentIds = usePrototypeStore.use.favoriteContentIds();
  const toggleFavorite = usePrototypeStore.use.toggleFavorite();
  const favorite = favoriteContentIds.includes(content.id);
  const badge = content.kind === 'video'
    ? `视频 ${content.durationLabel}`
    : content.readTimeLabel;

  return (
    <View className="mb-4 flex-row rounded-[28px] border border-yx-line bg-white p-4">
      <Pressable
        onPress={() => router.push(`/content/${content.id}`)}
        className="mr-4 size-28 rounded-3xl border border-yx-line bg-yx-soft"
      />
      <Pressable
        onPress={() => router.push(`/content/${content.id}`)}
        className="flex-1 justify-center"
      >
        <View className="mb-3 self-start rounded-full border border-yx-line bg-white px-4 py-2">
          <Text className="text-base font-semibold text-yx-muted">{badge}</Text>
        </View>
        <SerifText className="mb-2 text-2xl text-yx-ink">
          {content.title}
        </SerifText>
        <Text className="text-base/6 text-yx-muted">{content.summary}</Text>
      </Pressable>
      <Pressable
        onPress={() => toggleFavorite(content.id)}
        className="ml-2 size-10 items-center justify-center rounded-full"
      >
        <Text className={`text-xl ${favorite ? 'text-yx-red' : 'text-yx-muted'}`}>
          {favorite ? '♥' : '♡'}
        </Text>
      </Pressable>
    </View>
  );
}
