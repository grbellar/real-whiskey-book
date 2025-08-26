import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { StarRating } from './StarRating';
import { TagSelector } from './TagSelector';
import { AddWhiskeyModal } from './AddWhiskeyModal';
import { useTastings, Whiskey } from './TastingContext';
import { theme } from '../theme';

interface TastingData {
  whiskey: Whiskey | null;
  location: string;
  preparation: string[];
  appearance: string[];
  nose: string[];
  palate: string[];
  finish: string[];
  rating: number;
  notes: string;
}

interface AvailableTags {
  preparation: string[];
  appearance: string[];
  nose: string[];
  palate: string[];
  finish: string[];
}

const STEPS = [
  { id: 1, title: 'Select Whiskey', description: 'Choose or add a whiskey' },
  { id: 2, title: 'Tasting Context', description: 'Where and how you tasted it' },
  { id: 3, title: 'Tasting Notes', description: 'Record your impressions' }
];

interface TastingFormProps {
  onCancelEdit?: () => void;
}

// Icon Components
function ChevronLeftIcon({ color, size = 20 }: { color: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M15 18l-6-6 6-6" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function ChevronRightIcon({ color, size = 20 }: { color: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M9 18l6-6-6-6" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function XIcon({ color, size = 20 }: { color: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M18 6L6 18M6 6l12 12" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export function TastingForm({ onCancelEdit }: TastingFormProps) {
  const { addTasting, updateTasting, editingTasting, setEditingTasting, whiskeyDatabase } = useTastings();
  const [currentStep, setCurrentStep] = useState(1);
  const [showAddWhiskeyModal, setShowAddWhiskeyModal] = useState(false);
  const isEditing = !!editingTasting;
  
  const [tastingData, setTastingData] = useState<TastingData>({
    whiskey: null,
    location: '',
    preparation: [],
    appearance: [],
    nose: [],
    palate: [],
    finish: [],
    rating: 0,
    notes: ''
  });

  const [availableTags, setAvailableTags] = useState<AvailableTags>({
    preparation: ['Neat', 'On the rocks', 'Drop of water', 'With ice', 'Glencairn glass', 'Tumbler'],
    appearance: ['Amber', 'Golden', 'Dark', 'Clear', 'Rich', 'Copper', 'Pale', 'Deep'],
    nose: ['Vanilla', 'Oak', 'Smoke', 'Fruit', 'Spice', 'Honey', 'Floral', 'Citrus', 'Caramel', 'Nuts'],
    palate: ['Sweet', 'Spicy', 'Smooth', 'Complex', 'Rich', 'Dry', 'Fruity', 'Peppery', 'Warm', 'Balanced'],
    finish: ['Long', 'Short', 'Warm', 'Clean', 'Lingering', 'Smooth', 'Spicy', 'Sweet', 'Dry', 'Complex']
  });

  // Load editing data when component mounts or editingTasting changes
  useEffect(() => {
    if (editingTasting) {
      setTastingData({
        whiskey: editingTasting.whiskey,
        location: editingTasting.location,
        preparation: editingTasting.preparation,
        appearance: editingTasting.appearance,
        nose: editingTasting.nose,
        palate: editingTasting.palate,
        finish: editingTasting.finish,
        rating: editingTasting.rating,
        notes: editingTasting.notes
      });
      setCurrentStep(2);
    } else {
      // Reset form for new tasting
      setTastingData({
        whiskey: null,
        location: '',
        preparation: [],
        appearance: [],
        nose: [],
        palate: [],
        finish: [],
        rating: 0,
        notes: ''
      });
      setCurrentStep(1);
    }
  }, [editingTasting]);

  const addTag = (category: keyof AvailableTags, tag: string) => {
    setAvailableTags(prev => ({
      ...prev,
      [category]: [...prev[category], tag]
    }));
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return !!tastingData.whiskey;
      case 2:
        return tastingData.location.trim() !== '' && tastingData.preparation.length > 0;
      case 3:
        return tastingData.rating > 0;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (canProceed() && currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > (isEditing ? 2 : 1)) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleCancel = () => {
    setEditingTasting(null);
    if (onCancelEdit) {
      onCancelEdit();
    }
  };


  const handleSubmit = () => {
    if (!canProceed()) {
      Alert.alert('Error', 'Please complete all required fields');
      return;
    }

    const tastingPayload = {
      whiskey: tastingData.whiskey!,
      location: tastingData.location,
      preparation: tastingData.preparation,
      appearance: tastingData.appearance,
      nose: tastingData.nose,
      palate: tastingData.palate,
      finish: tastingData.finish,
      rating: tastingData.rating,
      notes: tastingData.notes
    };

    if (isEditing && editingTasting) {
      updateTasting(editingTasting.id, tastingPayload);
      Alert.alert('Success', 'Tasting updated successfully!');
      setEditingTasting(null);
      if (onCancelEdit) {
        onCancelEdit();
      }
    } else {
      addTasting(tastingPayload);
      Alert.alert('Success', 'Tasting saved successfully!');
      
      // Reset form
      setTastingData({
        whiskey: null,
        location: '',
        preparation: [],
        appearance: [],
        nose: [],
        palate: [],
        finish: [],
        rating: 0,
        notes: ''
      });
      setCurrentStep(1);
    }
  };

  const selectWhiskey = (whiskey: Whiskey) => {
    setTastingData(prev => ({ ...prev, whiskey }));
  };

  const handleAddNewWhiskey = () => {
    setShowAddWhiskeyModal(true);
  };

  const handleWhiskeyAdded = (whiskey: Whiskey) => {
    selectWhiskey(whiskey);
    setShowAddWhiskeyModal(false);
  };

  const progress = (currentStep / STEPS.length) * 100;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.card}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>
              {isEditing ? 'Edit Whiskey Tasting' : 'New Whiskey Tasting'}
            </Text>
            {isEditing && (
              <TouchableOpacity onPress={handleCancel} style={styles.cancelButton}>
                <XIcon color={theme.colors.foreground} size={16} />
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
            )}
          </View>
          
          {/* Progress indicator */}
          <View style={styles.progressContainer}>
            <View style={styles.stepsContainer}>
              {STEPS.map((step) => (
                <View key={step.id} style={styles.stepItem}>
                  <View style={[
                    styles.stepCircle,
                    step.id === currentStep && styles.currentStep,
                    step.id < currentStep && styles.completedStep,
                    isEditing && step.id === 1 && styles.disabledStep
                  ]}>
                    <Text style={[
                      styles.stepNumber,
                      (step.id === currentStep || step.id < currentStep || (isEditing && step.id === 1)) && styles.activeStepNumber
                    ]}>
                      {step.id}
                    </Text>
                  </View>
                  <Text style={[
                    styles.stepTitle,
                    step.id === currentStep && styles.currentStepTitle,
                    isEditing && step.id === 1 && styles.disabledStepTitle
                  ]}>
                    {step.title}
                  </Text>
                </View>
              ))}
            </View>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${progress}%` }]} />
            </View>
          </View>
        </View>

        {/* Content */}
        <View style={styles.content}>
          {/* Step 1: Select Whiskey */}
          {currentStep === 1 && !isEditing && (
            <View style={styles.stepContent}>
              <Text style={styles.stepHeading}>Select a Whiskey</Text>
              <Text style={styles.stepDescription}>
                Choose from existing whiskies in your collection or add a new one.
              </Text>
              
              <View style={styles.whiskeyList}>
                {whiskeyDatabase.map((whiskey) => (
                  <TouchableOpacity
                    key={whiskey.id}
                    onPress={() => selectWhiskey(whiskey)}
                    style={[
                      styles.whiskeyItem,
                      tastingData.whiskey?.id === whiskey.id && styles.selectedWhiskeyItem
                    ]}
                  >
                    <View style={styles.whiskeyInfo}>
                      <Text style={styles.whiskeyName}>{whiskey.name}</Text>
                      <Text style={styles.whiskeyDetails}>
                        {whiskey.distillery} • {whiskey.type}
                      </Text>
                      {whiskey.abv && (
                        <Text style={styles.whiskeyMeta}>{whiskey.abv}% ABV</Text>
                      )}
                    </View>
                  </TouchableOpacity>
                ))}
                <TouchableOpacity
                  onPress={handleAddNewWhiskey}
                  style={styles.addNewWhiskeyItem}
                >
                  <View style={styles.addNewIcon}>
                    <Text style={styles.addNewIconText}>+</Text>
                  </View>
                  <View style={styles.addNewContent}>
                    <Text style={styles.addNewTitle}>Add New Whiskey</Text>
                  </View>
                </TouchableOpacity>
              </View>
              
            </View>
          )}

          {/* Show selected whiskey info when editing */}
          {isEditing && tastingData.whiskey && (
            <View style={styles.editingWhiskeyCard}>
              <Text style={styles.editingTitle}>Editing Tasting For:</Text>
              <Text style={styles.whiskeyName}>{tastingData.whiskey.name}</Text>
              <Text style={styles.whiskeyDetails}>
                {tastingData.whiskey.distillery} • {tastingData.whiskey.type}
              </Text>
            </View>
          )}

          {/* Step 2: Tasting Context */}
          {currentStep === 2 && (
            <View style={styles.stepContent}>
              <Text style={styles.stepHeading}>Tasting Context</Text>
              <Text style={styles.stepDescription}>
                Tell us where and how you enjoyed this whiskey.
              </Text>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Where did you taste this whiskey? *</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="e.g., Home, Local bar, Distillery tour..."
                  placeholderTextColor={theme.colors.mutedForeground}
                  value={tastingData.location}
                  onChangeText={(text) => setTastingData(prev => ({ ...prev, location: text }))}
                />
              </View>

              <TagSelector
                label="How did you try it? *"
                availableTags={availableTags.preparation}
                selectedTags={tastingData.preparation}
                onTagsChange={(tags) => setTastingData(prev => ({ ...prev, preparation: tags }))}
                onAddTag={(tag) => addTag('preparation', tag)}
              />
            </View>
          )}

          {/* Step 3: Tasting Notes */}
          {currentStep === 3 && (
            <View style={styles.stepContent}>
              <Text style={styles.stepHeading}>Tasting Notes</Text>
              <Text style={styles.stepDescription}>
                Record your sensory impressions and overall rating.
              </Text>

              <TagSelector
                label="Appearance"
                availableTags={availableTags.appearance}
                selectedTags={tastingData.appearance}
                onTagsChange={(tags) => setTastingData(prev => ({ ...prev, appearance: tags }))}
                onAddTag={(tag) => addTag('appearance', tag)}
              />

              <View style={styles.separator} />

              <TagSelector
                label="Nose"
                availableTags={availableTags.nose}
                selectedTags={tastingData.nose}
                onTagsChange={(tags) => setTastingData(prev => ({ ...prev, nose: tags }))}
                onAddTag={(tag) => addTag('nose', tag)}
              />

              <View style={styles.separator} />

              <TagSelector
                label="Palate"
                availableTags={availableTags.palate}
                selectedTags={tastingData.palate}
                onTagsChange={(tags) => setTastingData(prev => ({ ...prev, palate: tags }))}
                onAddTag={(tag) => addTag('palate', tag)}
              />

              <View style={styles.separator} />

              <TagSelector
                label="Finish"
                availableTags={availableTags.finish}
                selectedTags={tastingData.finish}
                onTagsChange={(tags) => setTastingData(prev => ({ ...prev, finish: tags }))}
                onAddTag={(tag) => addTag('finish', tag)}
              />

              <View style={styles.separator} />

              <StarRating
                rating={tastingData.rating}
                onRatingChange={(rating) => setTastingData(prev => ({ ...prev, rating }))}
              />

              <View style={styles.separator} />

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Additional Notes</Text>
                <TextInput
                  style={[styles.textInput, styles.textArea]}
                  placeholder="Share your thoughts about this whiskey..."
                  placeholderTextColor={theme.colors.mutedForeground}
                  value={tastingData.notes}
                  onChangeText={(text) => setTastingData(prev => ({ ...prev, notes: text }))}
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                />
              </View>
            </View>
          )}
        </View>


        {/* Navigation buttons */}
        <View style={styles.navigationContainer}>
          <TouchableOpacity
            onPress={handlePrevious}
            disabled={currentStep === (isEditing ? 2 : 1)}
            style={[
              styles.navButton,
              styles.previousButton,
              currentStep === (isEditing ? 2 : 1) && styles.disabledButton
            ]}
          >
            <ChevronLeftIcon color={theme.colors.foreground} />
            <Text style={styles.navButtonText}>Previous</Text>
          </TouchableOpacity>

          {currentStep < STEPS.length ? (
            <TouchableOpacity
              onPress={handleNext}
              disabled={!canProceed()}
              style={[
                styles.navButton,
                styles.nextButton,
                !canProceed() && styles.disabledButton
              ]}
            >
              <Text style={styles.navButtonText}>Next</Text>
              <ChevronRightIcon color={theme.colors.primaryForeground} />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={handleSubmit}
              disabled={!canProceed()}
              style={[
                styles.navButton,
                styles.submitButton,
                !canProceed() && styles.disabledButton
              ]}
            >
              <Text style={styles.submitButtonText}>
                {isEditing ? 'Update Tasting' : 'Save Tasting'}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <AddWhiskeyModal
        visible={showAddWhiskeyModal}
        onClose={() => setShowAddWhiskeyModal(false)}
        onWhiskeyAdded={handleWhiskeyAdded}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  card: {
    backgroundColor: theme.colors.card,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: 20,
  },
  header: {
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    padding: 20,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 13,
    fontFamily: theme.fontFamily.semibold,
    color: theme.colors.foreground,
  },
  cancelButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  cancelText: {
    fontSize: 13,
    fontFamily: theme.fontFamily.regular,
    color: theme.colors.foreground,
  },
  progressContainer: {
    gap: 12,
  },
  stepsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  stepItem: {
    alignItems: 'center',
    flex: 1,
  },
  stepCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: theme.colors.border,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  currentStep: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.primary + '1A',
  },
  completedStep: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.primary,
  },
  disabledStep: {
    opacity: 0.5,
  },
  stepNumber: {
    fontSize: 13,
    fontFamily: theme.fontFamily.medium,
    color: theme.colors.mutedForeground,
  },
  activeStepNumber: {
    color: theme.colors.primary,
  },
  stepTitle: {
    fontSize: 11,
    fontFamily: theme.fontFamily.medium,
    color: theme.colors.mutedForeground,
    textAlign: 'center',
  },
  currentStepTitle: {
    color: theme.colors.primary,
  },
  disabledStepTitle: {
    opacity: 0.5,
  },
  progressBar: {
    height: 8,
    backgroundColor: theme.colors.border,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: theme.colors.primary,
  },
  content: {
    padding: 20,
  },
  stepContent: {
    gap: 16,
  },
  stepHeading: {
    fontSize: 13,
    fontFamily: theme.fontFamily.medium,
    color: theme.colors.foreground,
  },
  stepDescription: {
    fontSize: 13,
    color: theme.colors.mutedForeground,
  },
  whiskeyList: {
    gap: 12,
  },
  addNewWhiskeyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.primary + '0A',
    gap: 12,
  },
  addNewIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addNewIconText: {
    fontSize: 13,
    fontFamily: theme.fontFamily.medium,
    color: theme.colors.primaryForeground,
  },
  addNewContent: {
    flex: 1,
  },
  addNewTitle: {
    fontSize: 13,
    fontFamily: theme.fontFamily.medium,
    color: theme.colors.foreground,
    marginBottom: 4,
  },
  addNewDescription: {
    fontSize: 13,
    color: theme.colors.mutedForeground,
  },
  whiskeyItem: {
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.inputBackground,
  },
  selectedWhiskeyItem: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.primary + '1A',
  },
  whiskeyInfo: {
    gap: 4,
  },
  whiskeyName: {
    fontSize: 13,
    fontFamily: theme.fontFamily.medium,
    color: theme.colors.foreground,
  },
  whiskeyDetails: {
    fontSize: 13,
    color: theme.colors.mutedForeground,
  },
  whiskeyMeta: {
    fontSize: 11,
    color: theme.colors.mutedForeground,
  },
  editingWhiskeyCard: {
    backgroundColor: theme.colors.accent + '33',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: 20,
  },
  editingTitle: {
    fontSize: 13,
    fontFamily: theme.fontFamily.medium,
    color: theme.colors.foreground,
    marginBottom: 8,
  },
  inputGroup: {
    gap: 8,
  },
  inputLabel: {
    fontSize: 13,
    fontFamily: theme.fontFamily.medium,
    color: theme.colors.foreground,
  },
  textInput: {
    backgroundColor: theme.colors.input,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 13,
    fontFamily: theme.fontFamily.regular,
    color: theme.colors.foreground,
  },
  textArea: {
    minHeight: 100,
    paddingTop: 12,
  },
  separator: {
    height: 1,
    backgroundColor: theme.colors.border,
    marginVertical: 16,
  },
  navigationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 6,
  },
  previousButton: {
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  nextButton: {
    backgroundColor: theme.colors.primary,
  },
  submitButton: {
    backgroundColor: theme.colors.primary,
  },
  disabledButton: {
    opacity: 0.5,
  },
  navButtonText: {
    fontSize: 13,
    fontFamily: theme.fontFamily.medium,
    color: theme.colors.foreground,
  },
  submitButtonText: {
    fontSize: 13,
    fontFamily: theme.fontFamily.medium,
    color: theme.colors.primaryForeground,
  },
});