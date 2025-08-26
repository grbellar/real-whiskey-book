import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { theme } from '../theme';

interface StarRatingProps {
  rating: number;
  onRatingChange: (rating: number) => void;
  maxRating?: number;
}

function StarIcon({ 
  filled, 
  color, 
  size = 24 
}: { 
  filled: boolean; 
  color: string; 
  size?: number; 
}) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? color : 'none'}>
      <Path
        d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function StarRating({ rating, onRatingChange, maxRating = 5 }: StarRatingProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Overall Rating</Text>
      <View style={styles.starsContainer}>
        {[...Array(maxRating)].map((_, index) => {
          const starNumber = index + 1;
          const isFilled = starNumber <= rating;
          const color = isFilled ? theme.colors.primary : theme.colors.mutedForeground;

          return (
            <TouchableOpacity
              key={index}
              onPress={() => onRatingChange(starNumber)}
              style={styles.starButton}
              activeOpacity={0.7}
            >
              <StarIcon filled={isFilled} color={color} />
            </TouchableOpacity>
          );
        })}
      </View>
      <Text style={styles.ratingText}>
        {rating > 0 ? `${rating} out of ${maxRating} stars` : 'Tap to rate'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 12,
  },
  label: {
    fontSize: 16,
    fontFamily: theme.fontFamily.medium,
    color: theme.colors.foreground,
    marginBottom: 12,
  },
  starsContainer: {
    flexDirection: 'row',
    gap: 4,
    marginBottom: 12,
  },
  starButton: {
    padding: 4,
  },
  ratingText: {
    fontSize: 14,
    color: theme.colors.mutedForeground,
  },
});