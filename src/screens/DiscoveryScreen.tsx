import React, { useState } from 'react';
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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius } from '../constants/theme';
import { BarberCard } from '../components/BarberCard';
import { mockBarbers, mockShops, mockLocations } from '../data/mockData';
import { BarberWithDistance } from '../types';

export const DiscoveryScreen = ({ navigation }: any) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>([]);
  const [barbers, setBarbers] = useState<BarberWithDistance[]>(
    mockBarbers.map((barber, index) => ({
      ...barber,
      shop: mockShops[index % mockShops.length],
      location: mockLocations[index % mockLocations.length],
    }))
  );

  const allSpecialties = ['Skin Fade', 'Taper Fade', 'Beard Sculpting', 'Hot Towel Shave', 'Kids Cuts', 'Textured Cuts', 'Lineup', 'Classic Cuts'];

  const toggleSpecialty = (specialty: string) => {
    if (selectedSpecialties.includes(specialty)) {
      setSelectedSpecialties(selectedSpecialties.filter(s => s !== specialty));
    } else {
      setSelectedSpecialties([...selectedSpecialties, specialty]);
    }
  };

  const filteredBarbers = barbers.filter(barber => {
    const matchesSearch = 
      barber.user.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      barber.specialties.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesSpecialties = 
      selectedSpecialties.length === 0 ||
      selectedSpecialties.some(s => barber.specialties.includes(s));
    
    return matchesSearch && matchesSpecialties;
  });

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.background} />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.greeting}>Find Your Barber</Text>
            <View style={styles.locationRow}>
              <Ionicons name="location" size={16} color={Colors.accent} />
              <Text style={styles.location}>Toronto, ON</Text>
              <Ionicons name="chevron-down" size={16} color={Colors.text.tertiary} />
            </View>
          </View>
          
          <TouchableOpacity style={styles.notificationButton}>
            <Ionicons name="notifications-outline" size={24} color={Colors.text.primary} />
            <View style={styles.notificationBadge} />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color={Colors.text.tertiary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search barbers, styles, or shops..."
            placeholderTextColor={Colors.text.tertiary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color={Colors.text.tertiary} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Specialty Filters */}
      <View style={styles.filtersSection}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtersContent}
        >
          <TouchableOpacity style={styles.filterButton}>
            <Ionicons name="options-outline" size={18} color={Colors.text.primary} />
            <Text style={styles.filterButtonText}>Filters</Text>
          </TouchableOpacity>
          
          {allSpecialties.map((specialty) => (
            <TouchableOpacity
              key={specialty}
              style={[
                styles.specialtyFilter,
                selectedSpecialties.includes(specialty) && styles.specialtyFilterActive,
              ]}
              onPress={() => toggleSpecialty(specialty)}
            >
              <Text
                style={[
                  styles.specialtyFilterText,
                  selectedSpecialties.includes(specialty) && styles.specialtyFilterTextActive,
                ]}
              >
                {specialty}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Stats Bar */}
      <View style={styles.statsBar}>
        <Text style={styles.statsText}>
          {filteredBarbers.length} barbers found
        </Text>
        <TouchableOpacity style={styles.sortButton}>
          <Text style={styles.sortText}>Sort by</Text>
          <Ionicons name="chevron-down" size={14} color={Colors.text.tertiary} />
        </TouchableOpacity>
      </View>

      {/* Barber List */}
      <FlatList
        data={filteredBarbers}
        renderItem={({ item }) => (
          <BarberCard
            barber={item}
            onPress={() => navigation.navigate('BarberProfile', { barber: item })}
          />
        )}
        keyExtractor={(item) => item.barberId}
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
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.md,
  },
  greeting: {
    fontSize: Typography.fontSize['3xl'],
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text.primary,
    marginBottom: Spacing.xs,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  location: {
    fontSize: Typography.fontSize.base,
    color: Colors.text.secondary,
    fontWeight: Typography.fontWeight.medium,
  },
  notificationButton: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.card,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.accent,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    gap: Spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: Typography.fontSize.base,
    color: Colors.text.primary,
    padding: 0,
  },
  filtersSection: {
    paddingVertical: Spacing.sm,
  },
  filtersContent: {
    paddingHorizontal: Spacing.md,
    gap: Spacing.sm,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  filterButtonText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.primary,
    fontWeight: Typography.fontWeight.medium,
  },
  specialtyFilter: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  specialtyFilterActive: {
    backgroundColor: Colors.accent,
    borderColor: Colors.accent,
  },
  specialtyFilterText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.secondary,
    fontWeight: Typography.fontWeight.medium,
  },
  specialtyFilterTextActive: {
    color: Colors.primary,
    fontWeight: Typography.fontWeight.semibold,
  },
  statsBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  statsText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.secondary,
    fontWeight: Typography.fontWeight.medium,
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  sortText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.tertiary,
  },
  listContent: {
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.xl,
  },
});
