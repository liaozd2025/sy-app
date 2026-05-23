import type { Href } from 'expo-router';
import { router } from 'expo-router';
import * as React from 'react';
import { StyleSheet } from 'react-native';

import { Pressable, Text, View } from '@/components/ui';
import {
  Card,
  HifiButton,
  hifiColors,
  HifiScreen,
  HifiScroll,
  Kicker,
  SchemeAction,
  SectionHead,
  SectionTitle,
  Tag,
} from './components/hifi';
import { ProgressLine } from './components/primitives';
import { liveSessions, profileSummary, todayQuiz } from './mock-data';
import { usePrototypeStore } from './store';

export function QuizScreen() {
  const quizAnswers = usePrototypeStore.use.quizAnswers();
  const answerQuestion = usePrototypeStore.use.answerQuestion();
  const selectedAnswer = quizAnswers[todayQuiz.id];
  const answered = Boolean(selectedAnswer);

  return (
    <HifiScreen>
      <HifiScroll>
        <StudyTop />
        <StudyHero />
        <LearningMenu />
        <ContinueStrip />
        <PracticeCard />
        <QuestionCard
          answered={answered}
          onSelect={optionId => answerQuestion(todayQuiz.id, optionId)}
          selectedAnswer={selectedAnswer}
        />
        <RelatedCards />
      </HifiScroll>
    </HifiScreen>
  );
}

function StudyTop() {
  return (
    <View style={styles.schemeTop}>
      <Pressable onPress={() => router.push('/quiz')} style={styles.search}>
        <Text style={styles.searchText}>今天继续学习</Text>
      </Pressable>
      <SchemeAction active label="继续学习" onPress={() => router.push('/course/season-care')}>
        ▶
      </SchemeAction>
      <SchemeAction label="笔记" onPress={() => router.push('/content/sleep-90')}>
        □
      </SchemeAction>
      <SchemeAction label="我的" onPress={() => router.push('/profile')}>
        ◉
      </SchemeAction>
    </View>
  );
}

function StudyHero() {
  return (
    <Card style={styles.hero}>
      <Kicker>Study</Kicker>
      <Text style={styles.heroTitle}>今天继续把睡眠专题学完。</Text>
      <View style={styles.studyGrid}>
        <Stat value="6" label="连续天数" />
        <Stat value="64%" label="题库完成" />
        <Stat value="1280" label="积分" />
      </View>
    </Card>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.statTile}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function LearningMenu() {
  return (
    <Card style={styles.section}>
      <SectionTitle>我的学习</SectionTitle>
      <View style={styles.schemeGrid}>
        <SchemeItem icon="▶" label="继续看" meta="第 3 节" route="/course/season-care" />
        <SchemeItem icon="▤" label="学习笔记" meta="8 条" route="/content/sleep-90" />
        <SchemeItem icon="◎" label="健康题库" meta="64%" route="/quiz" />
        <SchemeItem icon="◈" label="证书" meta="0 张" route="/profile" />
      </View>
    </Card>
  );
}

function SchemeItem({
  icon,
  label,
  meta,
  route,
}: {
  icon: string;
  label: string;
  meta: string;
  route: Href;
}) {
  return (
    <Pressable onPress={() => router.push(route)} style={styles.schemeItem}>
      <Text style={styles.schemeIcon}>{icon}</Text>
      <Text style={styles.schemeLabel}>{label}</Text>
      <Text style={styles.schemeMeta}>{meta}</Text>
    </Pressable>
  );
}

function ContinueStrip() {
  const session = liveSessions.find(item => item.id === 'season-care') ?? liveSessions[0];
  const progressLine = `已看到第 3 节 · 18:06 / ${session.durationLabel}`;

  return (
    <Pressable onPress={() => router.push('/course/season-care')} style={styles.learningStrip}>
      <View style={styles.stripCopy}>
        <Text style={styles.stripTitle}>{session.title}</Text>
        <Text style={styles.muted}>{progressLine}</Text>
      </View>
      <HifiButton onPress={() => router.push('/course/season-care')} style={styles.compactButton}>
        继续
      </HifiButton>
    </Pressable>
  );
}

function PracticeCard() {
  return (
    <Card style={styles.section}>
      <SectionHead
        caption={`${todayQuiz.topic} · 第 ${todayQuiz.index} 题`}
        title="今日练习"
      />
      <ProgressLine progress={profileSummary.quizProgress} />
    </Card>
  );
}

function QuestionCard({
  answered,
  onSelect,
  selectedAnswer,
}: {
  answered: boolean;
  onSelect: (optionId: string) => void;
  selectedAnswer?: string;
}) {
  return (
    <View style={styles.quizCard}>
      <Kicker>Single Choice</Kicker>
      <Text style={styles.questionTitle}>{todayQuiz.prompt}</Text>
      {todayQuiz.options.map(option => (
        <OptionButton
          answered={answered}
          key={option.id}
          label={option.label}
          onSelect={onSelect}
          optionId={option.id}
          selectedAnswer={selectedAnswer}
        />
      ))}
      <View style={styles.resultBox}>
        <Text style={styles.resultText}>
          {answered ? todayQuiz.explanation : '选择答案后显示解析。'}
        </Text>
      </View>
    </View>
  );
}

function OptionButton({
  answered,
  label,
  onSelect,
  optionId,
  selectedAnswer,
}: {
  answered: boolean;
  label: string;
  onSelect: (optionId: string) => void;
  optionId: string;
  selectedAnswer?: string;
}) {
  const optionStyle = getOptionStyle(answered, optionId, selectedAnswer);

  return (
    <Pressable
      disabled={answered}
      onPress={() => onSelect(optionId)}
      style={[styles.option, optionStyle]}
    >
      <Text style={styles.optionText}>{label}</Text>
      <View style={styles.optionCircle} />
    </Pressable>
  );
}

function RelatedCards() {
  return (
    <View style={styles.relatedGrid}>
      <RelatedCard badge="复习" body="饭后活动安排。" route="/content/sleep-90" title="相关科普" />
      <RelatedCard badge="视频" body="四季养护入门。" route="/course/season-care" title="回看课程" />
    </View>
  );
}

function RelatedCard({
  badge,
  body,
  route,
  title,
}: {
  badge: string;
  body: string;
  route: Href;
  title: string;
}) {
  return (
    <Pressable onPress={() => router.push(route)} style={styles.relatedCard}>
      <Tag>{badge}</Tag>
      <Text style={styles.relatedTitle}>{title}</Text>
      <Text style={styles.muted}>{body}</Text>
    </Pressable>
  );
}

function getOptionStyle(answered: boolean, optionId: string, selectedAnswer?: string) {
  if (!answered) {
    return styles.optionDefault;
  }
  if (optionId === todayQuiz.answerId) {
    return styles.optionCorrect;
  }
  if (optionId === selectedAnswer) {
    return styles.optionWrong;
  }
  return styles.optionDefault;
}

const styles = StyleSheet.create({
  compactButton: {
    minHeight: 38,
    paddingHorizontal: 12,
  },
  hero: {
    marginBottom: 16,
  },
  heroTitle: {
    color: hifiColors.fg,
    fontSize: 26,
    fontWeight: '800',
    lineHeight: 31,
  },
  learningStrip: {
    alignItems: 'center',
    backgroundColor: hifiColors.surface,
    borderRadius: 24,
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
    padding: 14,
  },
  muted: {
    color: hifiColors.muted,
    fontSize: 12,
    lineHeight: 17,
    marginTop: 4,
  },
  option: {
    alignItems: 'center',
    borderRadius: 16,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    minHeight: 52,
    paddingHorizontal: 14,
    paddingVertical: 13,
  },
  optionCircle: {
    borderColor: hifiColors.fg,
    borderRadius: 999,
    borderWidth: 2,
    height: 20,
    width: 20,
  },
  optionCorrect: {
    backgroundColor: '#eaf7ef',
    borderColor: '#2f8a5a',
  },
  optionDefault: {
    backgroundColor: hifiColors.surface,
    borderColor: hifiColors.border,
  },
  optionText: {
    color: hifiColors.fg,
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 22,
  },
  optionWrong: {
    backgroundColor: '#faecea',
    borderColor: hifiColors.danger,
  },
  questionTitle: {
    color: hifiColors.fg,
    fontSize: 24,
    fontWeight: '900',
    lineHeight: 30,
    marginBottom: 8,
  },
  quizCard: {
    backgroundColor: hifiColors.surface,
    borderColor: hifiColors.fg,
    borderRadius: 28,
    borderWidth: 1.5,
    marginTop: 18,
    padding: 16,
  },
  relatedCard: {
    backgroundColor: hifiColors.surface,
    borderRadius: 24,
    flex: 1,
    gap: 16,
    minHeight: 118,
    padding: 13,
  },
  relatedGrid: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 18,
  },
  relatedTitle: {
    color: hifiColors.fg,
    fontSize: 20,
    fontWeight: '800',
  },
  resultBox: {
    backgroundColor: hifiColors.surfaceWarm,
    borderRadius: 16,
    marginTop: 12,
    minHeight: 76,
    padding: 12,
  },
  resultText: {
    color: hifiColors.muted,
    fontSize: 13,
    lineHeight: 19,
  },
  schemeGrid: {
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'space-between',
    marginTop: 16,
  },
  schemeIcon: {
    color: hifiColors.accent,
    fontSize: 24,
    fontWeight: '900',
  },
  schemeItem: {
    alignItems: 'center',
    flex: 1,
    gap: 5,
  },
  schemeLabel: {
    color: hifiColors.fg,
    fontSize: 14,
    fontWeight: '700',
  },
  schemeMeta: {
    color: hifiColors.muted,
    fontSize: 11,
  },
  schemeTop: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
    marginBottom: 14,
  },
  search: {
    backgroundColor: hifiColors.surface,
    borderRadius: 999,
    flex: 1,
    justifyContent: 'center',
    minHeight: 52,
    paddingHorizontal: 16,
  },
  searchText: {
    color: hifiColors.muted,
    fontSize: 15,
  },
  section: {
    marginTop: 16,
  },
  statLabel: {
    color: hifiColors.muted,
    fontSize: 11,
    marginTop: 4,
    textAlign: 'center',
  },
  statTile: {
    backgroundColor: hifiColors.surfaceWarm,
    borderRadius: 15,
    flex: 1,
    padding: 11,
  },
  statValue: {
    color: hifiColors.fg,
    fontSize: 21,
    fontWeight: '900',
    textAlign: 'center',
  },
  stripCopy: {
    flex: 1,
  },
  stripTitle: {
    color: hifiColors.fg,
    fontSize: 16,
    fontWeight: '800',
  },
  studyGrid: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 14,
  },
});
