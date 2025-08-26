import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  TextInput, 
  StyleSheet
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { theme } from '../theme';

interface TagSelectorProps {
  label: string;
  availableTags: string[];
  selectedTags: string[];
  onTagsChange: (tags: string[]) => void;
  onAddTag: (tag: string) => void;
}

// X Icon Component
function XIcon({ color, size = 16 }: { color: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M18 6L6 18M6 6l12 12"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

// Plus Icon Component
function PlusIcon({ color, size = 16 }: { color: string; size?: number }) {
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

export function TagSelector({ 
  label, 
  availableTags, 
  selectedTags, 
  onTagsChange, 
  onAddTag 
}: TagSelectorProps) {
  const [newTag, setNewTag] = useState('');
  const [showInput, setShowInput] = useState(false);

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      onTagsChange(selectedTags.filter(t => t !== tag));
    } else {
      onTagsChange([...selectedTags, tag]);
    }
  };

  const handleAddTag = () => {
    if (newTag.trim() && !availableTags.includes(newTag.trim())) {
      onAddTag(newTag.trim());
      onTagsChange([...selectedTags, newTag.trim()]);
      setNewTag('');
      setShowInput(false);
    }
  };

  const Tag = ({ 
    tag, 
    isSelected, 
    onPress 
  }: { 
    tag: string; 
    isSelected: boolean; 
    onPress: () => void; 
  }) => (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.tag,
        isSelected ? styles.selectedTag : styles.unselectedTag
      ]}
      activeOpacity={0.7}
    >
      <Text
        style={[
          styles.tagText,
          isSelected ? styles.selectedTagText : styles.unselectedTagText
        ]}
      >
        {tag}
      </Text>
      {isSelected && (
        <View style={styles.tagIcon}>
          <XIcon color={theme.colors.primaryForeground} size={12} />
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      
      <View style={styles.tagsContainer}>
        {availableTags.map((tag) => (
          <Tag
            key={tag}
            tag={tag}
            isSelected={selectedTags.includes(tag)}
            onPress={() => toggleTag(tag)}
          />
        ))}
        
        {showInput ? (
          <View style={styles.inputContainer}>
            <TextInput
              value={newTag}
              onChangeText={setNewTag}
              placeholder="New tag..."
              placeholderTextColor={theme.colors.mutedForeground}
              style={styles.input}
              onSubmitEditing={handleAddTag}
              autoFocus
              blurOnSubmit={false}
            />
            <TouchableOpacity onPress={handleAddTag} style={styles.addButton}>
              <PlusIcon color={theme.colors.primaryForeground} size={12} />
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            onPress={() => setShowInput(true)}
            style={styles.addTagButton}
            activeOpacity={0.7}
          >
            <PlusIcon color={theme.colors.mutedForeground} size={12} />
            <Text style={styles.addTagText}>Add tag</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 12,
  },
  label: {
    fontSize: 13,
    fontFamily: theme.fontFamily.medium,
    color: theme.colors.foreground,
    marginBottom: 12,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    paddingHorizontal: 4,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 4,
  },
  selectedTag: {
    backgroundColor: theme.colors.primary,
  },
  unselectedTag: {
    backgroundColor: theme.colors.secondary,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  tagText: {
    fontSize: 13,
    fontFamily: theme.fontFamily.medium,
  },
  selectedTagText: {
    color: theme.colors.primaryForeground,
  },
  unselectedTagText: {
    color: theme.colors.secondaryForeground,
  },
  tagIcon: {
    marginLeft: 2,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.input,
    borderRadius: 16,
    paddingHorizontal: 8,
    minWidth: 120,
  },
  input: {
    flex: 1,
    color: theme.colors.foreground,
    fontSize: 13,
    fontFamily: theme.fontFamily.regular,
    paddingVertical: 6,
    paddingHorizontal: 4,
  },
  addButton: {
    backgroundColor: theme.colors.primary,
    padding: 4,
    borderRadius: 8,
    marginLeft: 4,
  },
  addTagButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderStyle: 'dashed',
    gap: 4,
  },
  addTagText: {
    fontSize: 13,
    color: theme.colors.mutedForeground,
  },
});