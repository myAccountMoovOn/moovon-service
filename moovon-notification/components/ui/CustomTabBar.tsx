import React, { useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import Animated, { useAnimatedStyle, withTiming, useSharedValue, interpolateColor } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { BlurView } from 'expo-blur';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function CustomTabBar({ state, descriptors, navigation }: any) {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  
  // Adjust bottom spacing to avoid overlapping with phone's system navigation
  const bottomSpacing = insets.bottom > 0 ? insets.bottom + 10 : 25;

  // Moovon Primary Blue color for the active icon
  const activeColor = '#0057e7'; 
  const inactiveColor = '#888888';
  
  // Matching glassy blue background for the selected item
  const activeBg = 'rgba(0, 87, 231, 0.12)';

  const focusedRoute = state.routes[state.index];
  const focusedOptions = descriptors[focusedRoute.key].options;

  if (focusedOptions.tabBarStyle?.display === 'none') {
    return null;
  }

  return (
    <View style={[styles.container, { bottom: bottomSpacing }]}>
      <BlurView 
        intensity={100} 
        tint="light"
        style={[
          styles.tabBar,
          {
            backgroundColor: 'rgba(255, 255, 255, 0.4)',
            borderWidth: 1,
            borderColor: 'rgba(255, 255, 255, 0.6)',
          }
        ]}
      >
        {state.routes.map((route: any, index: number) => {
          const { options } = descriptors[route.key];
          if (options.href === null || options.tabBarStyle?.display === 'none') {
            return null;
          }

          const label =
            options.tabBarLabel !== undefined
              ? options.tabBarLabel
              : options.title !== undefined
              ? options.title
              : route.name;

          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name, route.params);
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: 'tabLongPress',
              target: route.key,
            });
          };

          let iconName = 'home-outline';
          let tabLabel = 'Home';
          
          if (route.name === 'index') { 
            iconName = isFocused ? 'home' : 'home-outline'; 
            tabLabel = 'Dashboard'; 
          }
          else if (route.name === 'services') {
            iconName = isFocused ? 'briefcase' : 'briefcase-outline';
            tabLabel = 'Services';
          }
          else if (route.name === 'customers') {
            iconName = isFocused ? 'people' : 'people-outline';
            tabLabel = 'Customers';
          }
          else if (route.name === 'subscriptions') {
            iconName = isFocused ? 'card' : 'card-outline';
            tabLabel = 'Subs';
          }
          else if (route.name === 'profile') { 
            iconName = isFocused ? 'person' : 'person-outline'; 
            tabLabel = 'Profile'; 
          }

          return (
            <TabBarButton
              key={route.key}
              onPress={onPress}
              onLongPress={onLongPress}
              isFocused={isFocused}
              iconName={iconName}
              label={tabLabel}
              activeColor={activeColor}
              inactiveColor={inactiveColor}
              activeBg={activeBg}
            />
          );
        })}
      </BlurView>
    </View>
  );
}

const TabBarButton = ({ onPress, onLongPress, isFocused, iconName, label, activeColor, inactiveColor, activeBg }: any) => {
  const progress = useSharedValue(isFocused ? 1 : 0);

  useEffect(() => {
    progress.value = withTiming(isFocused ? 1 : 0, { duration: 250 });
  }, [isFocused]);

  const animatedInnerStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      progress.value,
      [0, 1],
      ['rgba(0,0,0,0)', activeBg]
    );

    return {
      backgroundColor,
    };
  });

  return (
    <TouchableOpacity
      onPress={onPress}
      onLongPress={onLongPress}
      style={styles.touchable}
      activeOpacity={0.8}
    >
      <Animated.View style={[styles.innerButton, animatedInnerStyle]}>
        <Ionicons name={iconName as any} size={24} color={isFocused ? activeColor : inactiveColor} />
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  tabBar: {
    flexDirection: 'row',
    minHeight: 64,
    paddingVertical: 8,
    borderRadius: 32,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'space-between',
    overflow: 'hidden', 
    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
    elevation: 4,
  },
  touchable: {
    flex: 1, 
    alignItems: 'center',
    justifyContent: 'center',
  },
  innerButton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '90%',
    height: 48,
    borderRadius: 24,
  },
});
