import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useTastings, Tasting } from './TastingContext';
import { WhiskeyGlassIcon } from './WhiskeyGlassIcon';
import { theme } from '../theme';

interface ProfilePageProps {
  onEditTasting?: () => void;
}

// Icon Components
function StarIcon({ filled, color, size = 16 }: { filled: boolean; color: string; size?: number }) {
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

function CalendarIcon({ color, size = 16 }: { color: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M3 4h18M3 4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h18a2 2 0 0 0-2-2V6a2 2 0 0 0-2-2M3 4V2m18 2V2M3 10h18"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function MapPinIcon({ color, size = 16 }: { color: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function WineIcon({ color, size = 16 }: { color: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M8 22h8M12 11v11M12 11c-2.5 0-5-2.5-5-6V2h10v3c0 3.5-2.5 6-5 6z"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function EditIcon({ color, size = 16 }: { color: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function DeleteIcon({ color, size = 16 }: { color: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6h14z"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M10 11v6M14 11v6"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function FilterIcon({ color, size = 16 }: { color: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function ProfilePage({ onEditTasting }: ProfilePageProps) {
  const { tastings, setEditingTasting, deleteTasting } = useTastings();
  const [sortBy, setSortBy] = useState<'date' | 'rating'>('date');
  const [filterByRating, setFilterByRating] = useState<string>('all');

  const filteredTastings = tastings
    .filter(tasting => {
      if (filterByRating === 'all') return true;
      return tasting.rating >= parseInt(filterByRating);
    })
    .sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      }
      return b.rating - a.rating;
    });

  const averageRating = tastings.length > 0 
    ? tastings.reduce((sum, tasting) => sum + tasting.rating, 0) / tastings.length 
    : 0;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const handleEditTasting = (tasting: Tasting) => {
    setEditingTasting(tasting);
    if (onEditTasting) {
      onEditTasting();
    }
  };

  const handleDeleteTasting = (tasting: Tasting) => {
    Alert.alert(
      'Delete Tasting',
      `Are you sure you want to delete your tasting of ${tasting.whiskey.name}? This action cannot be undone.`,
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            deleteTasting(tasting.id);
            Alert.alert('Success', 'Tasting deleted successfully.');
          }
        }
      ]
    );
  };

  const Tag = ({ tag }: { tag: string }) => (
    <View style={styles.tag}>
      <Text style={styles.tagText}>{tag}</Text>
    </View>
  );

  const TastingCard = ({ item }: { item: Tasting }) => (
    <View style={styles.tastingCard}>
      {/* Header */}
      <View style={styles.tastingHeader}>
        <View style={styles.tastingInfo}>
          <Text style={styles.whiskeyName}>{item.whiskey.name}</Text>
          <Text style={styles.whiskeyDetails}>
            {item.whiskey.distillery} • {item.whiskey.type}
          </Text>
          <View style={styles.whiskeyMeta}>
            {item.whiskey.abv && <Text style={styles.metaText}>{item.whiskey.abv}% ABV</Text>}
            {item.whiskey.age && <Text style={styles.metaText}>{item.whiskey.age} years</Text>}
            {item.whiskey.region && <Text style={styles.metaText}>{item.whiskey.region}</Text>}
          </View>
          
          {/* Context Information */}
          <View style={styles.contextContainer}>
            {item.location && (
              <View style={styles.contextItem}>
                <MapPinIcon color={theme.colors.mutedForeground} size={12} />
                <Text style={styles.contextText}>{item.location}</Text>
              </View>
            )}
            {item.preparation.length > 0 && (
              <View style={styles.contextItem}>
                <WineIcon color={theme.colors.mutedForeground} size={12} />
                <Text style={styles.contextText}>{item.preparation.join(', ')}</Text>
              </View>
            )}
          </View>
        </View>
        
        <View style={styles.tastingMeta}>
          <View style={styles.ratingContainer}>
            {[...Array(5)].map((_, index) => (
              <StarIcon
                key={index}
                filled={index < item.rating}
                color={index < item.rating ? theme.colors.primary : theme.colors.mutedForeground}
                size={16}
              />
            ))}
          </View>
          <View style={styles.dateContainer}>
            <CalendarIcon color={theme.colors.mutedForeground} size={12} />
            <Text style={styles.dateText}>{formatDate(item.date)}</Text>
          </View>
        </View>
      </View>

      {/* Tags */}
      <View style={styles.tagsSection}>
        {item.appearance.length > 0 && (
          <View style={styles.tagGroup}>
            <Text style={styles.tagGroupLabel}>Appearance:</Text>
            <View style={styles.tagList}>
              {item.appearance.map((tag, index) => <Tag key={index} tag={tag} />)}
            </View>
          </View>
        )}
        
        {item.nose.length > 0 && (
          <View style={styles.tagGroup}>
            <Text style={styles.tagGroupLabel}>Nose:</Text>
            <View style={styles.tagList}>
              {item.nose.map((tag, index) => <Tag key={index} tag={tag} />)}
            </View>
          </View>
        )}
        
        {item.palate.length > 0 && (
          <View style={styles.tagGroup}>
            <Text style={styles.tagGroupLabel}>Palate:</Text>
            <View style={styles.tagList}>
              {item.palate.map((tag, index) => <Tag key={index} tag={tag} />)}
            </View>
          </View>
        )}
        
        {item.finish.length > 0 && (
          <View style={styles.tagGroup}>
            <Text style={styles.tagGroupLabel}>Finish:</Text>
            <View style={styles.tagList}>
              {item.finish.map((tag, index) => <Tag key={index} tag={tag} />)}
            </View>
          </View>
        )}
      </View>

      {/* Notes */}
      {item.notes && (
        <View style={styles.notesSection}>
          <Text style={styles.notesText}>"{item.notes}"</Text>
        </View>
      )}

      {/* Bottom Actions */}
      <View style={styles.bottomActions}>
        <TouchableOpacity
          onPress={() => handleEditTasting(item)}
          style={styles.editButton}
        >
          <EditIcon color={theme.colors.foreground} size={12} />
          <Text style={styles.editButtonText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleDeleteTasting(item)}
          style={styles.deleteButton}
        >
          <DeleteIcon color={theme.colors.foreground} size={12} />
          <Text style={styles.deleteButtonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const EmptyState = () => (
    <View style={styles.emptyState}>
      <WhiskeyGlassIcon size={48} color={theme.colors.mutedForeground} />
      <Text style={styles.emptyStateTitle}>No tastings yet!</Text>
      <Text style={styles.emptyStateText}>Add your first tasting to get started.</Text>
    </View>
  );

  const FilterSection = () => (
    <View style={styles.filterSection}>
      <FilterIcon color={theme.colors.mutedForeground} size={16} />
      <TouchableOpacity 
        onPress={() => setSortBy(sortBy === 'date' ? 'rating' : 'date')}
        style={styles.filterButton}
      >
        <Text style={styles.filterButtonText}>
          {sortBy === 'date' ? 'Latest' : 'Top Rated'}
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        onPress={() => setFilterByRating(filterByRating === 'all' ? '4' : filterByRating === '4' ? '3' : 'all')}
        style={styles.filterButton}
      >
        <Text style={styles.filterButtonText}>
          {filterByRating === 'all' ? 'All Ratings' : filterByRating === '4' ? '4+ Stars' : '3+ Stars'}
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {tastings.length > 0 ? (
        <FlatList
          data={filteredTastings}
          renderItem={TastingCard}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
        />
      ) : (
        <EmptyState />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  profileHeader: {
    backgroundColor: theme.colors.card,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: 20,
    marginBottom: 20,
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  profileIcon: {
    backgroundColor: theme.colors.primary + '1A',
    padding: 12,
    borderRadius: 50,
  },
  profileText: {
    flex: 1,
  },
  profileTitle: {
    fontSize: 18,
    fontFamily: theme.fontFamily.semibold,
    color: theme.colors.foreground,
    marginBottom: 4,
  },
  profileStats: {
    fontSize: 13,
    color: theme.colors.mutedForeground,
  },
  filterSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  filterButton: {
    backgroundColor: theme.colors.input,
    borderWidth: 1,
    borderColor: theme.colors.border,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  filterButtonText: {
    fontSize: 13,
    color: theme.colors.foreground,
  },
  listContainer: {
    gap: 16,
  },
  tastingCard: {
    backgroundColor: theme.colors.card,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: 20,
  },
  tastingHeader: {
    marginBottom: 16,
  },
  tastingInfo: {
    marginBottom: 12,
  },
  whiskeyName: {
    fontSize: 13,
    fontFamily: theme.fontFamily.medium,
    color: theme.colors.foreground,
    marginBottom: 4,
  },
  whiskeyDetails: {
    fontSize: 13,
    color: theme.colors.mutedForeground,
    marginBottom: 4,
  },
  whiskeyMeta: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 8,
  },
  metaText: {
    fontSize: 11,
    color: theme.colors.mutedForeground,
  },
  contextContainer: {
    flexDirection: 'row',
    gap: 16,
  },
  contextItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  contextText: {
    fontSize: 13,
    color: theme.colors.mutedForeground,
  },
  tastingMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  bottomActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  ratingContainer: {
    flexDirection: 'row',
    gap: 2,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dateText: {
    fontSize: 13,
    color: theme.colors.mutedForeground,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: theme.colors.border,
    flex: 1,
    justifyContent: 'center',
    marginRight: 8,
  },
  editButtonText: {
    fontSize: 13,
    color: theme.colors.foreground,
    fontFamily: theme.fontFamily.medium,
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: theme.colors.border,
    flex: 1,
    justifyContent: 'center',
    marginLeft: 8,
  },
  deleteButtonText: {
    fontSize: 13,
    color: theme.colors.foreground,
    fontFamily: theme.fontFamily.medium,
  },
  tagsSection: {
    gap: 8,
    marginBottom: 16,
  },
  tagGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  tagGroupLabel: {
    fontSize: 11,
    color: theme.colors.mutedForeground,
    minWidth: 70,
  },
  tagList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    flex: 1,
  },
  tag: {
    backgroundColor: theme.colors.secondary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  tagText: {
    fontSize: 11,
    color: theme.colors.secondaryForeground,
  },
  notesSection: {
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  notesText: {
    fontSize: 13,
    color: theme.colors.mutedForeground,
    fontStyle: 'italic',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.card,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: 48,
  },
  emptyStateTitle: {
    fontSize: 13,
    color: theme.colors.mutedForeground,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 13,
    color: theme.colors.mutedForeground,
    textAlign: 'center',
  },
});