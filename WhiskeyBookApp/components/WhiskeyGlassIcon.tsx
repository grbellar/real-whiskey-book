import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { theme } from '../theme';

interface WhiskeyGlassIconProps {
  size?: number;
  color?: string;
}

export function WhiskeyGlassIcon({ 
  size = 32, 
  color = theme.colors.primary 
}: WhiskeyGlassIconProps) {
  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Path
          d="M5 12V7a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v5M5 12l2 7h10l2-7M5 12h14M9 6V4M15 6V4M12 6V2"
          stroke={color}
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});