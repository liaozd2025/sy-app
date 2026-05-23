import type {
  StyleProp,
  TextProps,
  ViewStyle,
} from 'react-native';
import * as React from 'react';
import { Animated, PanResponder, Platform, StyleSheet } from 'react-native';

import { Pressable, SafeAreaView, Text, View } from '@/components/ui';

const screenPadding = 24;
export function Screen({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <SafeAreaView style={[styles.screen, style]}>
      {children}
    </SafeAreaView>
  );
}

export function PageScroll({
  children,
  contentContainerStyle,
  style,
}: {
  children: React.ReactNode;
  contentContainerStyle?: StyleProp<ViewStyle>;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <ManualScroll
      contentContainerStyle={[styles.scrollContent, contentContainerStyle]}
      style={[styles.scroll, style]}
    >
      {children}
    </ManualScroll>
  );
}

export function ManualScroll({
  children,
  contentContainerStyle,
  style,
}: {
  children: React.ReactNode;
  contentContainerStyle?: StyleProp<ViewStyle>;
  style?: StyleProp<ViewStyle>;
}) {
  const scrollY = React.useRef(new Animated.Value(0)).current;
  const offsetRef = React.useRef(0);
  const maxScrollRef = React.useRef(0);
  const [contentHeight, setContentHeight] = React.useState(0);
  const [layoutHeight, setLayoutHeight] = React.useState(0);
  const maxScroll = Math.max(contentHeight - layoutHeight, 0);

  React.useEffect(() => {
    maxScrollRef.current = maxScroll;
    if (offsetRef.current > maxScroll) {
      offsetRef.current = maxScroll;
      scrollY.setValue(maxScroll);
    }
  }, [maxScroll, scrollY]);

  const panResponder = React.useMemo(() => PanResponder.create({
    onMoveShouldSetPanResponder: (_, gesture) => {
      return shouldCaptureVerticalPan(gesture.dx, gesture.dy, maxScrollRef.current);
    },
    onMoveShouldSetPanResponderCapture: (_, gesture) => {
      return shouldCaptureVerticalPan(gesture.dx, gesture.dy, maxScrollRef.current);
    },
    onPanResponderGrant: () => {
      scrollY.stopAnimation((value) => {
        offsetRef.current = clampScroll(value, maxScrollRef.current);
      });
    },
    onPanResponderMove: (_, gesture) => {
      const nextOffset = clampScroll(offsetRef.current - gesture.dy, maxScrollRef.current);
      scrollY.setValue(nextOffset);
    },
    onPanResponderRelease: (_, gesture) => {
      const nextOffset = clampScroll(
        offsetRef.current - gesture.dy - gesture.vy * 120,
        maxScrollRef.current,
      );
      offsetRef.current = nextOffset;
      Animated.timing(scrollY, {
        duration: 140,
        toValue: nextOffset,
        useNativeDriver: true,
      }).start();
    },
    onPanResponderTerminate: () => {
      scrollY.stopAnimation((value) => {
        offsetRef.current = clampScroll(value, maxScrollRef.current);
      });
    },
  }), [scrollY]);

  const scrollable = maxScroll > 1;
  const thumbHeight = getThumbHeight(layoutHeight, contentHeight);
  const thumbTravel = Math.max(layoutHeight - thumbHeight - 24, 1);
  const thumbTranslateY = scrollY.interpolate({
    extrapolate: 'clamp',
    inputRange: [0, Math.max(maxScroll, 1)],
    outputRange: [0, thumbTravel],
  });

  return (
    <View
      onLayout={event => setLayoutHeight(event.nativeEvent.layout.height)}
      style={[styles.manualScrollFrame, style]}
      {...panResponder.panHandlers}
    >
      <Animated.View
        onLayout={event => setContentHeight(event.nativeEvent.layout.height)}
        style={[
          styles.manualScrollContent,
          contentContainerStyle,
          { transform: [{ translateY: Animated.multiply(scrollY, -1) }] },
        ]}
      >
        {children}
      </Animated.View>
      {scrollable && (
        <View pointerEvents="none" style={styles.manualScrollTrack}>
          <Animated.View
            style={[
              styles.manualScrollThumb,
              {
                height: thumbHeight,
                transform: [{ translateY: thumbTranslateY }],
              },
            ]}
          />
        </View>
      )}
    </View>
  );
}

export function SerifText({
  className = '',
  style,
  ...props
}: TextProps & { className?: string }) {
  return (
    <Text
      className={className}
      style={[styles.serif, style]}
      {...props}
    />
  );
}

export function SectionHeader({
  action,
  title,
}: {
  action?: string;
  title: string;
}) {
  return (
    <View className="mt-7 mb-5 flex-row items-center justify-between">
      <SerifText className="text-4xl text-yx-ink">{title}</SerifText>
      {action
        ? <Text className="text-base font-semibold text-yx-red">{action}</Text>
        : null}
    </View>
  );
}

export function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <Text className="mb-3 text-sm font-semibold tracking-[1.5px] text-yx-red uppercase">
      {children}
    </Text>
  );
}

export function RoundIconButton({ children }: { children: React.ReactNode }) {
  return (
    <View className="size-16 items-center justify-center rounded-full border border-yx-line bg-white">
      <Text className="text-2xl font-bold text-yx-ink">{children}</Text>
    </View>
  );
}

export function Pill({
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
      onPress={onPress}
      className={`mr-3 rounded-full border px-5 py-3 ${
        active
          ? 'border-yx-ink bg-yx-ink'
          : 'border-yx-line bg-white'
      }`}
    >
      <Text className={`text-lg font-semibold ${active ? 'text-white' : 'text-yx-muted'}`}>
        {children}
      </Text>
    </Pressable>
  );
}

export function ProgressLine({
  progress,
  trackClassName = 'bg-yx-line',
}: {
  progress: number;
  trackClassName?: string;
}) {
  return (
    <View className={`h-2 overflow-hidden rounded-full ${trackClassName}`}>
      <View
        className="h-full rounded-full bg-yx-red"
        style={{ width: `${Math.min(Math.max(progress, 0), 100)}%` }}
      />
    </View>
  );
}

function shouldCaptureVerticalPan(dx: number, dy: number, maxScroll: number) {
  return maxScroll > 1 && Math.abs(dy) > 6 && Math.abs(dy) > Math.abs(dx) * 1.2;
}

function clampScroll(value: number, maxScroll: number) {
  return Math.min(Math.max(value, 0), Math.max(maxScroll, 0));
}

function getThumbHeight(layoutHeight: number, contentHeight: number) {
  if (layoutHeight <= 0 || contentHeight <= 0) {
    return 44;
  }
  return Math.max(Math.min((layoutHeight / contentHeight) * layoutHeight, layoutHeight), 44);
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: '#FAF8F4',
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 176,
    paddingHorizontal: screenPadding,
  },
  manualScrollContent: {
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
  },
  manualScrollFrame: {
    flex: 1,
    overflow: 'hidden',
    position: 'relative',
  },
  manualScrollThumb: {
    backgroundColor: '#A9554E',
    borderRadius: 999,
    opacity: 0.7,
    width: 4,
  },
  manualScrollTrack: {
    bottom: 112,
    position: 'absolute',
    right: 6,
    top: 16,
    width: 4,
  },
  serif: {
    fontFamily: Platform.select({
      android: 'serif',
      default: 'serif',
      ios: 'Songti SC',
    }),
  },
});
