import { SplashScreen, Tabs } from 'expo-router';
import * as React from 'react';
import { useCallback, useEffect } from 'react';
import { StyleSheet } from 'react-native';

import { Text, View } from '@/components/ui';

const tabScreens = [
  { icon: '⌂', name: 'index', title: '首页' },
  { icon: '⌕', name: 'health', title: '发现' },
  { icon: '▤', name: 'quiz', title: '学习' },
  { icon: '◉', name: 'profile', title: '我的' },
] as const;

export default function TabLayout() {
  const hideSplash = useCallback(async () => {
    await SplashScreen.hideAsync();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      hideSplash();
    }, 300);

    return () => clearTimeout(timer);
  }, [hideSplash]);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#df6439',
        tabBarInactiveTintColor: '#7c808a',
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '700',
          marginTop: 3,
        },
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopWidth: 0,
          height: 86,
          paddingBottom: 18,
          paddingTop: 8,
          shadowColor: '#1e232d',
          shadowOffset: { height: -6, width: 0 },
          shadowOpacity: 0.04,
          shadowRadius: 18,
        },
      }}
    >
      {tabScreens.map(screen => (
        <Tabs.Screen
          key={screen.name}
          name={screen.name}
          options={{
            ...(screen.name === 'health'
              ? {
                  tabBarActiveTintColor: '#df6439',
                  tabBarInactiveTintColor: 'rgba(255, 255, 255, 0.62)',
                  tabBarStyle: {
                    backgroundColor: '#050505',
                    borderTopColor: 'rgba(255, 255, 255, 0.08)',
                    borderTopWidth: 1,
                    height: 86,
                    paddingBottom: 18,
                    paddingTop: 8,
                  },
                }
              : {}),
            title: screen.title,
            tabBarButtonTestID: `${screen.name}-tab`,
            tabBarIcon: ({ color, focused }) => (
              <TabGlyph color={color} focused={focused} icon={screen.icon} />
            ),
          }}
        />
      ))}
      <Tabs.Screen
        name="live"
        options={{
          href: null,
          title: '直播',
        }}
      />
    </Tabs>
  );
}

function TabGlyph({
  color,
  focused,
  icon,
}: {
  color: string;
  focused: boolean;
  icon: string;
}) {
  return (
    <View
      style={[
        styles.tabIcon,
        focused ? styles.tabIconActive : styles.tabIconInactive,
        { borderColor: color },
      ]}
    >
      <Text style={[styles.tabIconText, { color }]}>{icon}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  tabIcon: {
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1.8,
    height: 28,
    justifyContent: 'center',
    width: 28,
  },
  tabIconActive: {
    backgroundColor: '#fff1e8',
  },
  tabIconInactive: {
    backgroundColor: '#fff',
  },
  tabIconText: {
    fontSize: 15,
    fontWeight: '800',
    lineHeight: 18,
  },
});
