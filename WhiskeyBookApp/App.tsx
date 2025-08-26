/**
 * Whiskey Book App - React Native Port
 * @format
 */

import React, { useState } from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { TastingForm } from './components/TastingForm';
import { ProfilePage } from './components/ProfilePage';
import { BottomNavigation } from './components/BottomNavigation';
import { TastingProvider, useTastings } from './components/TastingContext';
import { WhiskeyGlassIcon } from './components/WhiskeyGlassIcon';
import { theme } from './theme';

type ActiveTab = 'add' | 'profile';

function AppContent(): React.JSX.Element {
  const [activeTab, setActiveTab] = useState<ActiveTab>('add');
  const { editingTasting } = useTastings();

  const getPageTitle = () => {
    if (editingTasting) {
      return {
        title: 'Whiskey Book',
        subtitle: 'Edit your tasting'
      };
    }
    
    switch (activeTab) {
      case 'add':
        return {
          title: 'Whiskey Book',
          subtitle: 'Record and rate your whiskey tastings'
        };
      case 'profile':
        return {
          title: 'Whiskey Book',
          subtitle: 'Your tasting journey'
        };
      default:
        return {
          title: 'Whiskey Book',
          subtitle: 'Record and rate your whiskey tastings'
        };
    }
  };

  const handleEditTasting = () => {
    setActiveTab('add');
  };

  const handleCancelEdit = () => {
    setActiveTab('profile');
  };

  const pageInfo = getPageTitle();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={theme.colors.background} />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.headerIcon}>
            <WhiskeyGlassIcon />
          </View>
          <View style={styles.headerText}>
            <Text style={styles.title}>{pageInfo.title}</Text>
            <Text style={styles.subtitle}>{pageInfo.subtitle}</Text>
          </View>
        </View>
      </View>

      {/* Main Content */}
      <View style={styles.main}>
        {(activeTab === 'add' || editingTasting) && (
          <TastingForm onCancelEdit={handleCancelEdit} />
        )}
        {activeTab === 'profile' && !editingTasting && (
          <ProfilePage onEditTasting={handleEditTasting} />
        )}
      </View>

      {/* Bottom Navigation - hide when editing */}
      {!editingTasting && (
        <BottomNavigation activeTab={activeTab} onTabChange={setActiveTab} />
      )}
    </SafeAreaView>
  );
}

function App(): React.JSX.Element {
  return (
    <TastingProvider>
      <AppContent />
    </TastingProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    backgroundColor: theme.colors.card,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 12,
  },
  headerIcon: {
    backgroundColor: theme.colors.primary + '1A', // 10% opacity
    padding: 8,
    borderRadius: 8,
  },
  headerText: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontFamily: theme.fontFamily.medium,
    color: theme.colors.foreground,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 12,
    fontFamily: theme.fontFamily.regular,
    color: theme.colors.mutedForeground,
  },
  main: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 20,
    paddingBottom: 100, // Space for bottom navigation
  },
});

export default App;
