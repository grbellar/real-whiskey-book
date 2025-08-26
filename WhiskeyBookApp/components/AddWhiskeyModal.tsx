import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useTastings, Whiskey } from './TastingContext';
import { theme } from '../theme';

interface AddWhiskeyModalProps {
  visible: boolean;
  onClose: () => void;
  onWhiskeyAdded: (whiskey: Whiskey) => void;
}

function XIcon({ color, size = 20 }: { color: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M18 6L6 18M6 6l12 12" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export function AddWhiskeyModal({ visible, onClose, onWhiskeyAdded }: AddWhiskeyModalProps) {
  const { addWhiskey } = useTastings();
  
  const [formData, setFormData] = useState({
    name: '',
    distillery: '',
    type: '',
    abv: '',
    age: '',
    region: '',
    description: ''
  });

  const whiskeyTypes = [
    'Single Malt Scotch',
    'Blended Scotch',
    'Bourbon',
    'Rye',
    'Irish Whiskey',
    'Japanese Whisky',
    'Canadian Whisky',
    'Other'
  ];

  const regions = [
    'Speyside',
    'Highlands',
    'Lowlands',
    'Islay',
    'Campbeltown',
    'Kentucky',
    'Tennessee',
    'Ireland',
    'Japan',
    'Canada',
    'Other'
  ];

  const [selectedType, setSelectedType] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('');
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);
  const [showRegionDropdown, setShowRegionDropdown] = useState(false);

  const handleSubmit = () => {
    if (!formData.name.trim()) {
      Alert.alert('Error', 'Please enter a whiskey name');
      return;
    }
    
    if (!formData.distillery.trim()) {
      Alert.alert('Error', 'Please enter a distillery name');
      return;
    }

    if (!selectedType) {
      Alert.alert('Error', 'Please select a whiskey type');
      return;
    }

    const whiskeyData = {
      name: formData.name.trim(),
      distillery: formData.distillery.trim(),
      type: selectedType,
      abv: formData.abv ? parseFloat(formData.abv) : undefined,
      age: formData.age ? parseInt(formData.age, 10) : undefined,
      region: selectedRegion || undefined,
      description: formData.description.trim() || undefined
    };

    const newWhiskey = addWhiskey(whiskeyData);
    onWhiskeyAdded(newWhiskey);
    handleClose();
  };

  const handleClose = () => {
    setFormData({
      name: '',
      distillery: '',
      type: '',
      abv: '',
      age: '',
      region: '',
      description: ''
    });
    setSelectedType('');
    setSelectedRegion('');
    setShowTypeDropdown(false);
    setShowRegionDropdown(false);
    onClose();
  };

  return (
    <Modal visible={visible} animationType="fade" transparent>
      <View style={styles.overlay}>
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <View style={styles.modal}>
            <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
              {/* Header */}
              <View style={styles.header}>
                <View style={styles.headerLeft}>
                  <View style={styles.iconContainer}>
                    <Text style={styles.iconText}>🥃</Text>
                  </View>
                  <View>
                    <Text style={styles.title}>Add New Whiskey</Text>
                    <Text style={styles.subtitle}>Add a new whiskey to your collection with detailed information.</Text>
                  </View>
                </View>
                <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
                  <XIcon color={theme.colors.mutedForeground} size={24} />
                </TouchableOpacity>
              </View>

              {/* Form */}
              <View style={styles.form}>
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Name *</Text>
                  <TextInput
                    style={styles.textInput}
                    placeholder="e.g., Macallan 18"
                    placeholderTextColor={theme.colors.mutedForeground}
                    value={formData.name}
                    onChangeText={(text) => setFormData(prev => ({ ...prev, name: text }))}
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Distillery *</Text>
                  <TextInput
                    style={styles.textInput}
                    placeholder="e.g., Macallan"
                    placeholderTextColor={theme.colors.mutedForeground}
                    value={formData.distillery}
                    onChangeText={(text) => setFormData(prev => ({ ...prev, distillery: text }))}
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Type *</Text>
                  <TouchableOpacity
                    style={[styles.textInput, styles.dropdown]}
                    onPress={() => setShowTypeDropdown(!showTypeDropdown)}
                  >
                    <Text style={[styles.dropdownText, !selectedType && styles.placeholderText]}>
                      {selectedType || 'Select whiskey type'}
                    </Text>
                  </TouchableOpacity>
                  {showTypeDropdown && (
                    <View style={styles.dropdownList}>
                      <ScrollView showsVerticalScrollIndicator={true} nestedScrollEnabled={true}>
                        {whiskeyTypes.map((type) => (
                          <TouchableOpacity
                            key={type}
                            style={styles.dropdownItem}
                            onPress={() => {
                              setSelectedType(type);
                              setShowTypeDropdown(false);
                            }}
                          >
                            <Text style={styles.dropdownItemText}>{type}</Text>
                          </TouchableOpacity>
                        ))}
                      </ScrollView>
                    </View>
                  )}
                </View>

                <View style={styles.row}>
                  <View style={[styles.inputGroup, styles.halfWidth]}>
                    <Text style={styles.inputLabel}>ABV (%)</Text>
                    <TextInput
                      style={styles.textInput}
                      placeholder="e.g., 43"
                      placeholderTextColor={theme.colors.mutedForeground}
                      value={formData.abv}
                      onChangeText={(text) => setFormData(prev => ({ ...prev, abv: text }))}
                      keyboardType="numeric"
                    />
                  </View>

                  <View style={[styles.inputGroup, styles.halfWidth]}>
                    <Text style={styles.inputLabel}>Age (years)</Text>
                    <TextInput
                      style={styles.textInput}
                      placeholder="e.g., 18"
                      placeholderTextColor={theme.colors.mutedForeground}
                      value={formData.age}
                      onChangeText={(text) => setFormData(prev => ({ ...prev, age: text }))}
                      keyboardType="numeric"
                    />
                  </View>
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Region</Text>
                  <TouchableOpacity
                    style={[styles.textInput, styles.dropdown]}
                    onPress={() => setShowRegionDropdown(!showRegionDropdown)}
                  >
                    <Text style={[styles.dropdownText, !selectedRegion && styles.placeholderText]}>
                      {selectedRegion || 'Select region'}
                    </Text>
                  </TouchableOpacity>
                  {showRegionDropdown && (
                    <View style={styles.dropdownList}>
                      <ScrollView showsVerticalScrollIndicator={true} nestedScrollEnabled={true}>
                        {regions.map((region) => (
                          <TouchableOpacity
                            key={region}
                            style={styles.dropdownItem}
                            onPress={() => {
                              setSelectedRegion(region);
                              setShowRegionDropdown(false);
                            }}
                          >
                            <Text style={styles.dropdownItemText}>{region}</Text>
                          </TouchableOpacity>
                        ))}
                      </ScrollView>
                    </View>
                  )}
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Description</Text>
                  <TextInput
                    style={[styles.textInput, styles.textArea]}
                    placeholder="Brief description of the whiskey..."
                    placeholderTextColor={theme.colors.mutedForeground}
                    value={formData.description}
                    onChangeText={(text) => setFormData(prev => ({ ...prev, description: text }))}
                    multiline
                    numberOfLines={3}
                    textAlignVertical="top"
                  />
                </View>
              </View>

              {/* Footer */}
              <View style={styles.footer}>
                <TouchableOpacity onPress={handleClose} style={styles.cancelButton}>
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleSubmit} style={styles.addButton}>
                  <Text style={styles.addButtonText}>Add Whiskey</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  keyboardView: {
    width: '100%',
    maxWidth: 400,
  },
  modal: {
    backgroundColor: theme.colors.card,
    borderRadius: 12,
    maxHeight: '90%',
    width: '100%',
  },
  scrollView: {
    maxHeight: '100%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    padding: 24,
    paddingBottom: 0,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    flex: 1,
  },
  iconContainer: {
    backgroundColor: theme.colors.primary + '1A',
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconText: {
    fontSize: 18,
  },
  title: {
    fontSize: 18,
    fontFamily: theme.fontFamily.semibold,
    color: theme.colors.foreground,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    fontFamily: theme.fontFamily.regular,
    color: theme.colors.mutedForeground,
    lineHeight: 20,
  },
  closeButton: {
    padding: 8,
    marginTop: -8,
    marginRight: -8,
  },
  form: {
    padding: 24,
    gap: 20,
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
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 13,
    fontFamily: theme.fontFamily.regular,
    color: theme.colors.foreground,
  },
  textArea: {
    minHeight: 80,
    paddingTop: 12,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  halfWidth: {
    flex: 1,
  },
  dropdown: {
    justifyContent: 'center',
  },
  dropdownText: {
    fontSize: 13,
    fontFamily: theme.fontFamily.regular,
    color: theme.colors.foreground,
  },
  placeholderText: {
    color: theme.colors.mutedForeground,
  },
  dropdownList: {
    backgroundColor: theme.colors.card,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 8,
    marginTop: 4,
    maxHeight: 200,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  dropdownItem: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  dropdownItemText: {
    fontSize: 13,
    fontFamily: theme.fontFamily.regular,
    color: theme.colors.foreground,
  },
  footer: {
    flexDirection: 'row',
    gap: 12,
    padding: 24,
    paddingTop: 0,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.colors.border,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 13,
    fontFamily: theme.fontFamily.medium,
    color: theme.colors.foreground,
  },
  addButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
  },
  addButtonText: {
    fontSize: 13,
    fontFamily: theme.fontFamily.medium,
    color: theme.colors.primaryForeground,
  },
});