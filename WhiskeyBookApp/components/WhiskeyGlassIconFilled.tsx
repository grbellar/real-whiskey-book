import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { theme } from '../theme';

interface WhiskeyGlassIconFilledProps {
  size?: number;
  color?: string;
  backgroundColor?: string;
}

export function WhiskeyGlassIconFilled({ 
  size = 32, 
  color = '#FFFFFF',
  backgroundColor = theme.colors.primary 
}: WhiskeyGlassIconFilledProps) {
  return (
    <View style={[
      styles.container, 
      { 
        width: size, 
        height: size,
        backgroundColor,
        borderRadius: size * 0.2, // Rounded corners for app icon
      }
    ]}>
      <Svg width={size * 0.7} height={size * 0.7} viewBox="0 0 24 24" fill="none">
        {/* Glass body filled */}
        <Path
          d="M5 12V7a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v5l-2 7H7l-2-7Z"
          fill={color}
          opacity={0.9}
        />
        {/* Glass rim */}
        <Path
          d="M5 12h14"
          stroke={color}
          strokeWidth={1.5}
          strokeLinecap="round"
        />
        {/* Whiskey level */}
        <Path
          d="M6.5 14h11l-1 5H7.5l-1-5Z"
          fill={color}
          opacity={0.6}
        />
        {/* Glass stems/legs */}
        <Path
          d="M9 6V4M15 6V4M12 6V2"
          stroke={color}
          strokeWidth={2}
          strokeLinecap="round"
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
