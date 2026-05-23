import { router } from 'expo-router';
import * as React from 'react';
import { StyleSheet } from 'react-native';

import { Pressable, Text, View } from '@/components/ui';
import {
  HifiButton,
  hifiColors,
  HifiScreen,
  HifiScroll,
  HifiSheet,
  SchemeAction,
  SectionTitle,
} from './components/hifi';
import { liveSessions, profileSummary } from './mock-data';
import { usePrototypeStore } from './store';

type SheetKind = 'assistant' | 'edit' | 'logout' | 'settings' | 'wallet' | null;

export function ProfileScreen() {
  const [sheet, setSheet] = React.useState<SheetKind>(null);
  const reservedSessionIds = usePrototypeStore.use.reservedSessionIds();
  const favoriteContentIds = usePrototypeStore.use.favoriteContentIds();

  return (
    <HifiScreen>
      <HifiScroll>
        <ProfileTop onOpenSheet={setSheet} />
        <UserCard
          favoriteCount={favoriteContentIds.length}
          onOpenSheet={setSheet}
          reservedCount={reservedSessionIds.length}
        />
        <AccountCard onOpenSheet={setSheet} />
        <ContentCard onOpenSheet={setSheet} />
        <ServiceCard onOpenSheet={setSheet} />
        <ReminderStrip />
      </HifiScroll>
      <ProfileSheets active={sheet} onClose={() => setSheet(null)} />
    </HifiScreen>
  );
}

function ProfileTop({ onOpenSheet }: { onOpenSheet: (sheet: SheetKind) => void }) {
  return (
    <View style={styles.schemeTop}>
      <Pressable onPress={() => onOpenSheet('edit')} style={styles.search}>
        <Text style={styles.searchText}>我的资料与权益</Text>
      </Pressable>
      <SchemeAction label="钱包" onPress={() => onOpenSheet('wallet')}>
        ◈
      </SchemeAction>
      <SchemeAction label="设置" onPress={() => onOpenSheet('settings')}>
        ⚙
      </SchemeAction>
      <SchemeAction active label="助手" onPress={() => onOpenSheet('assistant')}>
        AI
      </SchemeAction>
    </View>
  );
}

function UserCard({
  favoriteCount,
  onOpenSheet,
  reservedCount,
}: {
  favoriteCount: number;
  onOpenSheet: (sheet: SheetKind) => void;
  reservedCount: number;
}) {
  const memberLine = `私域会员 · 连续学习 ${profileSummary.streakDays} 天`;

  return (
    <View style={styles.userCard}>
      <View style={styles.userHead}>
        <View style={styles.profileRow}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>周</Text>
          </View>
          <View style={styles.userCopy}>
            <Text style={styles.userName}>{profileSummary.name}</Text>
            <Text style={styles.muted}>{memberLine}</Text>
          </View>
        </View>
        <Pressable onPress={() => onOpenSheet('edit')} style={styles.studentBadge}>
          <Text style={styles.studentBadgeText}>资料</Text>
        </Pressable>
      </View>
      <View style={styles.scoreRow}>
        <Score value={reservedCount} label="预约" />
        <Score value={favoriteCount} label="收藏" />
        <Score value={`${profileSummary.quizProgress}%`} label="题库" />
        <Score value="1280" label="积分" />
      </View>
      <Pressable onPress={() => onOpenSheet('assistant')} style={styles.aiStrip}>
        <View>
          <Text style={styles.aiTitle}>我的 AI 健康学习助手</Text>
          <Text style={styles.muted}>整理直播问题、学习报告和资料包。</Text>
        </View>
        <HifiButton style={styles.aiButton}>打开</HifiButton>
      </Pressable>
    </View>
  );
}

function Score({ label, value }: { label: string; value: number | string }) {
  return (
    <View style={styles.scoreTile}>
      <Text style={styles.scoreValue}>{value}</Text>
      <Text style={styles.scoreLabel}>{label}</Text>
    </View>
  );
}

function AccountCard({ onOpenSheet }: { onOpenSheet: (sheet: SheetKind) => void }) {
  return (
    <SchemeCard title="我的账户">
      <SchemeGridItem icon="▣" label="卡券" meta="4 张可用" onPress={() => onOpenSheet('wallet')} />
      <SchemeGridItem icon="▤" label="订单" meta="课程资料" onPress={() => router.push('/course/season-care')} />
      <SchemeGridItem icon="▥" label="直播预约" meta="3 场" onPress={() => router.push('/live')} />
      <SchemeGridItem icon="◈" label="会员" meta="Lv.3" onPress={() => onOpenSheet('settings')} />
      <SchemeGridItem icon="▢" label="题库积分" meta="1280" onPress={() => router.push('/quiz')} />
    </SchemeCard>
  );
}

function ContentCard({ onOpenSheet }: { onOpenSheet: (sheet: SheetKind) => void }) {
  return (
    <SchemeCard title="我的内容">
      <SchemeGridItem icon="◷" label="最近学习" onPress={() => router.push('/course/season-care')} />
      <SchemeGridItem icon="↓" label="下载资料" onPress={() => router.push('/content/sleep-90')} />
      <SchemeGridItem icon="♡" label="收藏/清单" onPress={() => router.push('/content/sleep-90')} />
      <SchemeGridItem icon="◎" label="学习报告" onPress={() => router.push('/quiz')} />
      <SchemeGridItem icon="⌕" label="百科记录" onPress={() => router.push('/encyclopedia')} />
      <SchemeGridItem icon="×" label="退出登录" onPress={() => onOpenSheet('logout')} danger />
    </SchemeCard>
  );
}

function ServiceCard({ onOpenSheet }: { onOpenSheet: (sheet: SheetKind) => void }) {
  return (
    <View style={styles.serviceCard}>
      <SectionTitle>服务与记录</SectionTitle>
      <View style={styles.serviceStack}>
        <ServiceRow
          action="查看"
          label="咨询记录"
          meta="2 条待运营回复"
          onPress={() => onOpenSheet('assistant')}
        />
        <ServiceRow
          action="去学习"
          label="本周计划"
          meta="睡眠专题 4/5，饮食专题 8/10"
          onPress={() => router.push('/quiz')}
        />
        <ServiceRow
          action="管理"
          label="提醒设置"
          meta="直播前 15 分钟提醒"
          onPress={() => onOpenSheet('settings')}
        />
      </View>
    </View>
  );
}

function ServiceRow({
  action,
  label,
  meta,
  onPress,
}: {
  action: string;
  label: string;
  meta: string;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={styles.serviceRow}>
      <View style={styles.stripCopy}>
        <Text style={styles.serviceLabel}>{label}</Text>
        <Text style={styles.muted}>{meta}</Text>
      </View>
      <Text style={styles.serviceAction}>{action}</Text>
    </Pressable>
  );
}

function SchemeCard({ children, title }: { children: React.ReactNode; title: string }) {
  return (
    <View style={styles.schemeCard}>
      <SectionTitle>{title}</SectionTitle>
      <View style={styles.schemeGrid}>{children}</View>
    </View>
  );
}

function SchemeGridItem({
  danger = false,
  icon,
  label,
  meta,
  onPress,
}: {
  danger?: boolean;
  icon: string;
  label: string;
  meta?: string;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={styles.schemeItem}>
      <Text style={[styles.schemeIcon, danger && styles.dangerText]}>{icon}</Text>
      <Text style={[styles.schemeLabel, danger && styles.dangerText]}>{label}</Text>
      {meta ? <Text style={styles.schemeMeta}>{meta}</Text> : null}
    </Pressable>
  );
}

function ReminderStrip() {
  const session = liveSessions.find(item => item.id === 'after-meal') ?? liveSessions[0];

  return (
    <Pressable onPress={() => router.push('/course/sleep-live')} style={styles.learningStrip}>
      <View style={styles.stripCopy}>
        <Text style={styles.stripTitle}>今晚 20:00 直播提醒</Text>
        <Text style={styles.muted}>{session.title}</Text>
      </View>
      <HifiButton onPress={() => router.push('/course/sleep-live')} style={styles.compactButton}>
        查看
      </HifiButton>
    </Pressable>
  );
}

function ProfileSheets({
  active,
  onClose,
}: {
  active: SheetKind;
  onClose: () => void;
}) {
  return (
    <>
      <SimpleSheet active={active} name="edit" onClose={onClose} title="资料编辑">
        <SheetLine title="昵称" body="周女士" />
        <SheetLine title="关注方向" body="睡眠、饮食、控糖" />
      </SimpleSheet>
      <SimpleSheet active={active} name="settings" onClose={onClose} title="设置">
        <SheetLine title="直播提醒" body="已开启" />
        <SheetLine title="资料下载" body="仅 Wi-Fi 自动缓存" />
      </SimpleSheet>
      <SimpleSheet active={active} name="wallet" onClose={onClose} title="钱包明细">
        <SheetLine title="签到积分" body="+10 积分 · 已入账" />
        <SheetLine title="直播预约奖励" body="+30 积分 · 饭后活动专场" />
      </SimpleSheet>
      <SimpleSheet active={active} name="assistant" onClose={onClose} title="AI 健康学习助手">
        <SheetLine title="今日建议" body="先完成睡眠专题第 2 题，再回看四季养护第 3 节。" />
      </SimpleSheet>
      <SimpleSheet active={active} name="logout" onClose={onClose} title="退出登录">
        <Text style={styles.sheetText}>原型不会真的退出账号，仅展示确认流程。</Text>
      </SimpleSheet>
    </>
  );
}

function SimpleSheet({
  active,
  children,
  name,
  onClose,
  title,
}: {
  active: SheetKind;
  children: React.ReactNode;
  name: Exclude<SheetKind, null>;
  onClose: () => void;
  title: string;
}) {
  return (
    <HifiSheet onClose={onClose} title={title} visible={active === name}>
      {children}
    </HifiSheet>
  );
}

function SheetLine({ body, title }: { body: string; title: string }) {
  return (
    <View style={styles.sheetLine}>
      <Text style={styles.sheetTitle}>{title}</Text>
      <Text style={styles.sheetText}>{body}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  aiButton: {
    backgroundColor: hifiColors.surface,
    minHeight: 38,
  },
  aiStrip: {
    alignItems: 'center',
    backgroundColor: hifiColors.accentSoft,
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'space-between',
    marginHorizontal: -18,
    padding: 18,
  },
  aiTitle: {
    color: hifiColors.fg,
    fontSize: 18,
    fontWeight: '800',
  },
  avatar: {
    alignItems: 'center',
    backgroundColor: '#f0f2f7',
    borderRadius: 999,
    height: 68,
    justifyContent: 'center',
    width: 68,
  },
  avatarText: {
    color: hifiColors.muted,
    fontSize: 26,
    fontWeight: '800',
  },
  compactButton: {
    minHeight: 38,
    paddingHorizontal: 12,
  },
  dangerText: {
    color: hifiColors.danger,
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
  profileRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
  },
  schemeCard: {
    backgroundColor: hifiColors.surface,
    borderRadius: 24,
    marginTop: 16,
    padding: 18,
  },
  schemeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 16,
  },
  schemeIcon: {
    color: hifiColors.accent,
    fontSize: 24,
    fontWeight: '900',
  },
  schemeItem: {
    alignItems: 'center',
    gap: 5,
    width: '29%',
  },
  schemeLabel: {
    color: hifiColors.fg,
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'center',
  },
  schemeMeta: {
    color: hifiColors.muted,
    fontSize: 11,
    textAlign: 'center',
  },
  schemeTop: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
    marginBottom: 14,
  },
  serviceAction: {
    color: hifiColors.accent,
    fontSize: 13,
    fontWeight: '800',
  },
  serviceCard: {
    backgroundColor: hifiColors.surface,
    borderRadius: 24,
    marginTop: 16,
    padding: 18,
  },
  serviceLabel: {
    color: hifiColors.fg,
    fontSize: 16,
    fontWeight: '800',
  },
  serviceRow: {
    alignItems: 'center',
    borderColor: hifiColors.border,
    borderTopWidth: 1,
    flexDirection: 'row',
    gap: 12,
    paddingVertical: 14,
  },
  serviceStack: {
    marginTop: 12,
  },
  scoreLabel: {
    color: hifiColors.fg,
    fontSize: 14,
    marginTop: 7,
    textAlign: 'center',
  },
  scoreRow: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 22,
    paddingBottom: 22,
  },
  scoreTile: {
    flex: 1,
  },
  scoreValue: {
    color: hifiColors.fg,
    fontSize: 25,
    fontWeight: '900',
    textAlign: 'center',
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
  sheetLine: {
    backgroundColor: hifiColors.surfaceWarm,
    borderRadius: 16,
    marginBottom: 10,
    padding: 12,
  },
  sheetText: {
    color: hifiColors.muted,
    fontSize: 14,
    lineHeight: 20,
  },
  sheetTitle: {
    color: hifiColors.fg,
    fontSize: 15,
    fontWeight: '800',
    marginBottom: 4,
  },
  stripCopy: {
    flex: 1,
  },
  stripTitle: {
    color: hifiColors.fg,
    fontSize: 16,
    fontWeight: '800',
  },
  studentBadge: {
    backgroundColor: '#f0f2f7',
    borderBottomLeftRadius: 13,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  studentBadgeText: {
    color: hifiColors.muted,
    fontSize: 13,
  },
  userCard: {
    backgroundColor: hifiColors.surface,
    borderRadius: 24,
    overflow: 'hidden',
    paddingHorizontal: 18,
    paddingTop: 18,
  },
  userCopy: {
    flex: 1,
  },
  userHead: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  userName: {
    color: hifiColors.fg,
    fontSize: 25,
    fontWeight: '800',
  },
});
