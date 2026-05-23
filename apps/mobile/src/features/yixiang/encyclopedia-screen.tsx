import type { EncyclopediaCategory } from './types';
import * as React from 'react';
import { StyleSheet } from 'react-native';

import { ScrollView, Text, View } from '@/components/ui';
import {
  AppBar,
  Chip,
  hifiColors,
  HifiScreen,
  HifiScroll,
  IconButton,
  Tag,
} from './components/hifi';
import { encyclopediaEntries } from './mock-data';

const categories: { label: string; value: EncyclopediaCategory }[] = [
  { label: '全部', value: 'all' },
  { label: '节气', value: 'season' },
  { label: '食材', value: 'food' },
  { label: '习惯', value: 'habit' },
];

export function EncyclopediaScreen() {
  const [category, setCategory] = React.useState<EncyclopediaCategory>('all');
  const entries = category === 'all'
    ? encyclopediaEntries
    : encyclopediaEntries.filter(item => item.category === category);

  return (
    <HifiScreen>
      <AppBar
        action={<IconButton label="搜索" onPress={() => setCategory('all')}>⌕</IconButton>}
        backTo="/health"
        eyebrow="Encyclopedia"
        title="养生百科"
      />
      <HifiScroll noTab>
        <ScrollView
          horizontal
          contentContainerStyle={styles.chips}
          showsHorizontalScrollIndicator={false}
        >
          {categories.map(item => (
            <Chip
              active={item.value === category}
              key={item.value}
              onPress={() => setCategory(item.value)}
            >
              {item.label}
            </Chip>
          ))}
        </ScrollView>
        <View style={styles.stack}>
          {entries.map(item => (
            <View key={item.id} style={styles.entry}>
              <View style={styles.entryCopy}>
                <Text style={styles.entryTitle}>{item.title}</Text>
                <Text style={styles.muted}>{item.description}</Text>
              </View>
              <Tag>{item.tag}</Tag>
            </View>
          ))}
        </View>
        <View style={styles.noteCard}>
          <Text style={styles.noteText}>
            <Text style={styles.noteStrong}>百科定位</Text>
            {'\n'}
            用于快速理解概念和日常护理，不展示诊断结论。
          </Text>
        </View>
      </HifiScroll>
    </HifiScreen>
  );
}

const styles = StyleSheet.create({
  chips: {
    gap: 8,
    marginBottom: 18,
    paddingBottom: 2,
  },
  entry: {
    alignItems: 'center',
    backgroundColor: hifiColors.surface,
    borderRadius: 18,
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'space-between',
    padding: 14,
  },
  entryCopy: {
    flex: 1,
  },
  entryTitle: {
    color: hifiColors.fg,
    fontSize: 16,
    fontWeight: '800',
  },
  muted: {
    color: hifiColors.muted,
    fontSize: 12,
    lineHeight: 17,
    marginTop: 4,
  },
  noteCard: {
    backgroundColor: hifiColors.accentSoft,
    borderRadius: 18,
    marginTop: 18,
    padding: 14,
  },
  noteStrong: {
    color: hifiColors.fg,
    fontWeight: '900',
  },
  noteText: {
    color: hifiColors.fg,
    fontSize: 14,
    lineHeight: 21,
  },
  stack: {
    gap: 12,
  },
});
