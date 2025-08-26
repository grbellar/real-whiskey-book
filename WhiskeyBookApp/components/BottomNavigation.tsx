import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { theme } from '../theme';

interface BottomNavigationProps {
  activeTab: 'add' | 'profile';
  onTabChange: (tab: 'add' | 'profile') => void;
}

// Plus Icon Component
function PlusIcon({ color, size = 24 }: { color: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 5v14M5 12h14"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

// User Icon Component  
function UserIcon({ color, size = 24 }: { color: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function BottomNavigation({ activeTab, onTabChange }: BottomNavigationProps) {
  const TabButton = ({ 
    tab, 
    icon, 
    label 
  }: { 
    tab: 'add' | 'profile'; 
    icon: JSX.Element; 
    label: string; 
  }) => {
    const isActive = activeTab === tab;
    const color = isActive ? theme.colors.primary : theme.colors.mutedForeground;
    const backgroundColor = isActive ? theme.colors.primary + '1A' : 'transparent';

    return (
      <TouchableOpacity
        onPress={() => onTabChange(tab)}
        style={[styles.tabButton, { backgroundColor }]}
        activeOpacity={0.7}
      >
        {React.cloneElement(icon, { color })}
        <Text style={[styles.tabLabel, { color }]}>{label}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.tabContainer}>
          <TabButton
            tab="add"
            icon={<PlusIcon color={theme.colors.mutedForeground} />}
            label="Add Tasting"
          />
          <TabButton
            tab="profile"
            icon={<UserIcon color={theme.colors.mutedForeground} />}
            label="Profile"
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: theme.colors.card,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  content: {
    paddingHorizontal: 16,
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 32,
    paddingVertical: 16,
  },
  tabButton: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  tabLabel: {
    fontSize: 11,
    fontFamily: theme.fontFamily.medium,
  },
});