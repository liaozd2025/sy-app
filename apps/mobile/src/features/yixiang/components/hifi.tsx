/* eslint-disable react-refresh/only-export-components */
import type { Href } from 'expo-router';
import type { StyleProp, ViewStyle } from 'react-native';
import { router } from 'expo-router';
import * as React from 'react';
import { Modal, Platform, StyleSheet } from 'react-native';

import { Pressable, SafeAreaView, Text, View } from '@/components/ui';
import { ManualScroll, SerifText } from './primitives';

export const hifiColors = {
  accent: '#df6439',
  accentSoft: '#fff1e8',
  bg: '#f6f7fb',
  border: '#e7e9ef',
  danger: '#b64d45',
  fg: '#252832',
  muted: '#858b97',
  surface: '#fff',
  surfaceWarm: '#f8f9fb',
};

export function HifiScreen({
  children,
  dark = false,
}: {
  children: React.ReactNode;
  dark?: boolean;
}) {
  return (
    <SafeAreaView style={[styles.screen, dark && styles.darkScreen]}>
      <View style={styles.screenBody}>{children}</View>
    </SafeAreaView>
  );
}

export function HifiScroll({
  children,
  noTab = false,
  style,
}: {
  children: React.ReactNode;
  noTab?: boolean;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <ManualScroll
      contentContainerStyle={[
        styles.scrollContent,
        noTab && styles.noTabScrollContent,
      ]}
      style={[styles.scroll, style]}
    >
      {children}
    </ManualScroll>
  );
}

export function AppBar({
  action,
  backTo,
  eyebrow,
  title,
}: {
  action?: React.ReactNode;
  backTo?: Href;
  eyebrow?: string;
  title: string;
}) {
  return (
    <View style={styles.appTop}>
      <View style={styles.appBar}>
        {backTo
          ? <IconButton label="返回" onPress={() => router.push(backTo)}>‹</IconButton>
          : null}
        <View style={styles.appTitleWrap}>
          {eyebrow ? <Kicker>{eyebrow}</Kicker> : null}
          <SerifText style={styles.appTitle}>{title}</SerifText>
        </View>
        {action ?? <View style={styles.iconPlaceholder} />}
      </View>
    </View>
  );
}

export function IconButton({
  children,
  label,
  onPress,
}: {
  children: React.ReactNode;
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityLabel={label}
      accessibilityRole="button"
      onPress={onPress}
      style={styles.iconButton}
    >
      <Text style={styles.iconText}>{children}</Text>
    </Pressable>
  );
}

export function Kicker({ children }: { children: React.ReactNode }) {
  return <Text style={styles.kicker}>{children}</Text>;
}

export function Card({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}) {
  return <View style={[styles.card, style]}>{children}</View>;
}

export function SectionTitle({ children }: { children: React.ReactNode }) {
  return <SerifText style={styles.sectionTitle}>{children}</SerifText>;
}

export function SectionHead({
  action,
  caption,
  title,
}: {
  action?: React.ReactNode;
  caption?: string;
  title: string;
}) {
  return (
    <View style={styles.sectionHead}>
      <SectionTitle>{title}</SectionTitle>
      {action ?? (caption ? <Text style={styles.caption}>{caption}</Text> : null)}
    </View>
  );
}

export function Tag({ children }: { children: React.ReactNode }) {
  return (
    <View style={styles.tag}>
      <Text style={styles.tagText}>{children}</Text>
    </View>
  );
}

export function HifiButton({
  children,
  onPress,
  secondary = false,
  style,
}: {
  children: React.ReactNode;
  onPress?: () => void;
  secondary?: boolean;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.button, secondary && styles.buttonSecondary, style]}
    >
      <Text style={[styles.buttonText, secondary && styles.buttonTextSecondary]}>
        {children}
      </Text>
    </Pressable>
  );
}

export function Chip({
  active = false,
  children,
  onPress,
}: {
  active?: boolean;
  children: React.ReactNode;
  onPress?: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={[styles.chip, active && styles.chipActive]}
    >
      <Text style={[styles.chipText, active && styles.chipTextActive]}>
        {children}
      </Text>
    </Pressable>
  );
}

export function SchemeAction({
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
    <Pressable
      accessibilityLabel={label}
      accessibilityRole="button"
      onPress={onPress}
      style={styles.schemeAction}
    >
      <Text style={[styles.schemeActionText, active && styles.schemeActionHot]}>
        {children}
      </Text>
    </Pressable>
  );
}

export function VideoSurface({
  children,
  paper = false,
  style,
}: {
  children: React.ReactNode;
  paper?: boolean;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <View style={[styles.videoSurface, paper && styles.videoSurfacePaper, style]}>
      <View style={styles.videoGlow} />
      <View style={styles.videoGridLineOne} />
      <View style={styles.videoGridLineTwo} />
      {children}
    </View>
  );
}

export function HifiSheet({
  children,
  onClose,
  title,
  visible,
}: {
  children: React.ReactNode;
  onClose: () => void;
  title: string;
  visible: boolean;
}) {
  return (
    <Modal
      animationType="slide"
      onRequestClose={onClose}
      transparent
      visible={visible}
    >
      <View style={styles.modalBackdrop}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
        <View style={styles.sheet}>
          <View style={styles.sheetHead}>
            <SectionTitle>{title}</SectionTitle>
            <IconButton label="关闭" onPress={onClose}>×</IconButton>
          </View>
          {children}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  appBar: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'space-between',
  },
  appTitle: {
    color: hifiColors.fg,
    fontSize: 23,
    fontWeight: '900',
    lineHeight: 27,
  },
  appTitleWrap: {
    flex: 1,
  },
  appTop: {
    backgroundColor: '#fafbfe',
    paddingBottom: 10,
    paddingHorizontal: 12,
    paddingTop: 12,
  },
  button: {
    alignItems: 'center',
    backgroundColor: hifiColors.accent,
    borderRadius: 999,
    justifyContent: 'center',
    minHeight: 44,
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  buttonSecondary: {
    backgroundColor: '#f1f3f7',
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '800',
  },
  buttonTextSecondary: {
    color: hifiColors.fg,
  },
  caption: {
    color: hifiColors.muted,
    fontSize: 12,
  },
  card: {
    backgroundColor: hifiColors.surface,
    borderRadius: 24,
    padding: 18,
    shadowColor: '#1e232d',
    shadowOffset: { height: 8, width: 0 },
    shadowOpacity: 0.04,
    shadowRadius: 22,
  },
  chip: {
    alignItems: 'center',
    backgroundColor: hifiColors.surface,
    borderColor: hifiColors.border,
    borderRadius: 999,
    borderWidth: 1,
    justifyContent: 'center',
    minHeight: 36,
    paddingHorizontal: 12,
  },
  chipActive: {
    backgroundColor: hifiColors.fg,
    borderColor: hifiColors.fg,
  },
  chipText: {
    color: hifiColors.muted,
    fontSize: 13,
    fontWeight: '600',
  },
  chipTextActive: {
    color: '#fff',
  },
  darkScreen: {
    backgroundColor: '#050505',
  },
  iconButton: {
    alignItems: 'center',
    borderRadius: 999,
    height: 42,
    justifyContent: 'center',
    width: 42,
  },
  iconPlaceholder: {
    height: 42,
    width: 42,
  },
  iconText: {
    color: hifiColors.fg,
    fontSize: 26,
    fontWeight: '800',
    lineHeight: 30,
  },
  kicker: {
    color: hifiColors.accent,
    fontFamily: Platform.select({ default: 'Menlo', ios: 'Menlo' }),
    fontSize: 11,
    letterSpacing: 0.4,
    marginBottom: 7,
    textTransform: 'uppercase',
  },
  modalBackdrop: {
    backgroundColor: 'rgba(0, 0, 0, 0.28)',
    flex: 1,
    justifyContent: 'flex-end',
    padding: 10,
  },
  noTabScrollContent: {
    paddingBottom: 28,
  },
  schemeAction: {
    alignItems: 'center',
    borderRadius: 15,
    height: 42,
    justifyContent: 'center',
    width: 42,
  },
  schemeActionHot: {
    color: hifiColors.accent,
  },
  schemeActionText: {
    color: hifiColors.fg,
    fontSize: 21,
    fontWeight: '800',
  },
  screen: {
    backgroundColor: hifiColors.bg,
    flex: 1,
  },
  screenBody: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 156,
    paddingHorizontal: 12,
    paddingTop: 12,
  },
  sectionHead: {
    alignItems: 'flex-end',
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sectionTitle: {
    color: hifiColors.fg,
    fontSize: 24,
    fontWeight: '900',
    lineHeight: 29,
  },
  sheet: {
    backgroundColor: hifiColors.surface,
    borderRadius: 28,
    padding: 18,
  },
  sheetHead: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  tag: {
    alignSelf: 'flex-start',
    backgroundColor: hifiColors.accentSoft,
    borderRadius: 999,
    paddingHorizontal: 9,
    paddingVertical: 5,
  },
  tagText: {
    color: hifiColors.accent,
    fontSize: 12,
    fontWeight: '800',
  },
  videoGlow: {
    backgroundColor: 'rgba(255, 255, 255, 0.28)',
    borderRadius: 68,
    height: 136,
    position: 'absolute',
    right: 24,
    top: 32,
    width: 136,
  },
  videoGridLineOne: {
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    height: 1,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 72,
  },
  videoGridLineTwo: {
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    bottom: 0,
    position: 'absolute',
    top: 0,
    width: 1,
  },
  videoSurface: {
    backgroundColor: hifiColors.accent,
    borderRadius: 22,
    minHeight: 198,
    overflow: 'hidden',
    padding: 16,
  },
  videoSurfacePaper: {
    backgroundColor: '#f5efe5',
  },
});
