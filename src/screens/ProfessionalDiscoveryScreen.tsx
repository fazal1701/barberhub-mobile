/**
 * Professional Discovery Screen
 * Industry-focused barber discovery with map and list views
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
  ScrollView,
  Dimensions,
} from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius } from '../constants/theme';
import { BarberCard } from '../components/BarberCard';
import { SkeletonBarberCard } from '../components/Skeleton';
import { mockBarbers, mockShops, mockLocations } from '../data/mockData';
import { BarberWithDistance } from '../types';

const { width } = Dimensions.get('window');

export const ProfessionalDiscoveryScreen = ({ navigation }: any) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [sortBy, setSortBy] = useState<'distance' | 'rating' | 'availability'>('distance');
  const [loading, setLoading] = useState(true);
  const [barbers, setBarbers] = useState<BarberWithDistance[]>([]);

  const allSpecialties = [
    'Skin Fade', 
    'Taper Fade', 
    'Beard Sculpting', 
    'Hot Towel Shave', 
    'Kids Cuts', 
    'Textured Cuts', 
    'Lineup', 
    'Classic Cuts',
    'Loc Maintenance',
    'Color Services'
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setBarbers(
        mockBarbers.map((barber, index) => ({
          ...barber,
          shop: mockShops[index % mockShops.length],
          location: mockLocations[index % mockLocations.length],
        }))
      );
      setLoading(false);
    }, 1200);
  }, []);

  const toggleSpecialty = (specialty: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (selectedSpecialties.includes(specialty)) {
      setSelectedSpecialties(selectedSpecialties.filter(s => s !== specialty));
    } else {
      setSelectedSpecialties([...selectedSpecialties, specialty]);
    }
  };

  const filteredBarbers = barbers.filter(barber => {
    const matchesSearch = 
      barber.user.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      barber.specialties.some(s => s.toLowerCase().includes(searchQuery.toLowerCase())) ||
      barber.shop?.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesSpecialties = 
      selectedSpecialties.length === 0 ||
      selectedSpecialties.some(s => barber.specialties.includes(s));
    
    return matchesSearch && matchesSpecialties;
  });

  // Sort barbers
  const sortedBarbers = [...filteredBarbers].sort((a, b) => {
    switch (sortBy) {
      case 'distance':
        return (a.distance || 0) - (b.distance || 0);
      case 'rating':
        return b.ratingAvg - a.ratingAvg;
      case 'availability':
        return a.nextAvailableSlot && b.nextAvailableSlot
          ? new Date(a.nextAvailableSlot).getTime() - new Date(b.nextAvailableSlot).getTime()
          : 0;
      default:
        return 0;
    }
  });

  const renderHeader = () => (
    <Animated.View entering={FadeInDown.delay(100).springify()}>
      {/* Location and View Toggle */}
      <View style={styles.headerTop}>
        <TouchableOpacity style={styles.locationButton}>
          <Ionicons name="location" size={20} color={Colors.accent} />
          <Text style={styles.locationText}>Toronto, ON</Text>
          <Ionicons name="chevron-down" size={16} color={Colors.text.tertiary} />
        </TouchableOpacity>
        
        <View style={styles.headerActions}>
          <TouchableOpacity 
            style={[styles.viewToggle, viewMode === 'list' && styles.viewToggleActive]}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              setViewMode('list');
            }}
          >
            <Ionicons name="list" size={20} color={viewMode === 'list' ? Colors.accent : Colors.text.tertiary} />
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.viewToggle, viewMode === 'map' && styles.viewToggleActive]}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              setViewMode('map');
            }}
          >
            <Ionicons name="map" size={20} color={viewMode === 'map' ? Colors.accent : Colors.text.tertiary} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color={Colors.text.tertiary} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search barbers, shops, or specialties..."
          placeholderTextColor={Colors.text.tertiary}
          value={searchQuery}
          onChangeText={setSearchQuery}
          onFocus={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Ionicons name="close-circle" size={20} color={Colors.text.tertiary} />
          </TouchableOpacity>
        )}
      </View>

      {/* Specialty Filters */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filtersContent}
      >
        {allSpecialties.map((specialty) => (
          <TouchableOpacity
            key={specialty}
            style={[
              styles.specialtyChip,
              selectedSpecialties.includes(specialty) && styles.specialtyChipActive,
            ]}
            onPress={() => toggleSpecialty(specialty)}
          >
            <Text
              style={[
                styles.specialtyText,
                selectedSpecialties.includes(specialty) && styles.specialtyTextActive,
              ]}
            >
              {specialty}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Results and Sort */}
      <View style={styles.resultsBar}>
        <Text style={styles.resultsText}>
          {sortedBarbers.length} barber{sortedBarbers.length !== 1 ? 's' : ''} available
        </Text>
        
        <View style={styles.sortContainer}>
          <TouchableOpacity 
            style={[styles.sortOption, sortBy === 'distance' && styles.sortOptionActive]}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              setSortBy('distance');
            }}
          >
            <Ionicons name="navigate" size={14} color={sortBy === 'distance' ? Colors.accent : Colors.text.tertiary} />
            <Text style={[styles.sortText, sortBy === 'distance' && styles.sortTextActive]}>Near</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.sortOption, sortBy === 'rating' && styles.sortOptionActive]}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              setSortBy('rating');
            }}
          >
            <Ionicons name="star" size={14} color={sortBy === 'rating' ? Colors.accent : Colors.text.tertiary} />
            <Text style={[styles.sortText, sortBy === 'rating' && styles.sortTextActive]}>Top</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.sortOption, sortBy === 'availability' && styles.sortOptionActive]}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              setSortBy('availability');
            }}
          >
            <Ionicons name="time" size={14} color={sortBy === 'availability' ? Colors.accent : Colors.text.tertiary} />
            <Text style={[styles.sortText, sortBy === 'availability' && styles.sortTextActive]}>Soon</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Animated.View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" />
        <View style={styles.header}>
          <Text style={styles.title}>Find a Barber</Text>
        </View>
        <View style={styles.loadingContainer}>
          <SkeletonBarberCard />
          <SkeletonBarberCard />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.background} />
      
      <View style={styles.header}>
        <Text style={styles.title}>Find a Barber</Text>
      </View>

      <FlatList
        data={sortedBarbers}
        renderItem={({ item, index }) => (
          <Animated.View entering={FadeInUp.delay(index * 50).springify()}>
            <BarberCard
              barber={item}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                navigation.navigate('BarberProfile', { barber: item });
              }}
            />
          </Animated.View>
        )}
        keyExtractor={(item) => item.barberId}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.sm,
  },
  title: {
    fontSize: Typography.fontSize['3xl'],
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text.primary,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  locationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    backgroundColor: Colors.card,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.lg,
  },
  locationText: {
    fontSize: Typography.fontSize.base,
    color: Colors.text.primary,
    fontWeight: Typography.fontWeight.medium,
  },
  headerActions: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  viewToggle: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.card,
    justifyContent: 'center',
    alignItems: 'center',
  },
  viewToggleActive: {
    backgroundColor: Colors.backgroundSecondary,
    borderWidth: 1,
    borderColor: Colors.accent,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  searchInput: {
    flex: 1,
    fontSize: Typography.fontSize.base,
    color: Colors.text.primary,
    padding: 0,
  },
  filtersContent: {
    paddingRight: Spacing.md,
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  specialtyChip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  specialtyChipActive: {
    backgroundColor: Colors.accent,
    borderColor: Colors.accent,
  },
  specialtyText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.secondary,
    fontWeight: Typography.fontWeight.medium,
  },
  specialtyTextActive: {
    color: Colors.primary,
    fontWeight: Typography.fontWeight.semibold,
  },
  resultsBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  resultsText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.secondary,
    fontWeight: Typography.fontWeight.medium,
  },
  sortContainer: {
    flexDirection: 'row',
    gap: Spacing.xs,
  },
  sortOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs / 2,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  sortOptionActive: {
    backgroundColor: Colors.backgroundSecondary,
    borderColor: Colors.accent,
  },
  sortText: {
    fontSize: Typography.fontSize.xs,
    color: Colors.text.tertiary,
    fontWeight: Typography.fontWeight.medium,
  },
  sortTextActive: {
    color: Colors.accent,
    fontWeight: Typography.fontWeight.semibold,
  },
  listContent: {
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.xl,
  },
  loadingContainer: {
    padding: Spacing.md,
  },
});
