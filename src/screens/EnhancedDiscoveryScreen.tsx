import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
  ScrollView,
  Modal,
} from 'react-native';
import Animated, {
  FadeInDown,
  FadeInUp,
  Layout,
  SlideInRight,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius } from '../constants/theme';
import { SwipeableBarberCard } from '../components/SwipeableBarberCard';
import { BarberStories, StoryViewer } from '../components/BarberStories';
import { SkeletonBarberCard } from '../components/Skeleton';
import { AnimatedButton } from '../components/AnimatedButton';
import { mockBarbers, mockShops, mockLocations } from '../data/mockData';
import { BarberWithDistance } from '../types';

export const EnhancedDiscoveryScreen = ({ navigation }: any) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'swipe' | 'list'>('swipe');
  const [barbers, setBarbers] = useState<BarberWithDistance[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [storyBarber, setStoryBarber] = useState<BarberWithDistance | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const allSpecialties = ['Skin Fade', 'Taper Fade', 'Beard Sculpting', 'Hot Towel Shave', 'Kids Cuts', 'Textured Cuts', 'Lineup', 'Classic Cuts'];

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setBarbers(
        mockBarbers.map((barber, index) => ({
          ...barber,
          shop: mockShops[index % mockShops.length],
          location: mockLocations[index % mockLocations.length],
        }))
      );
      setLoading(false);
    }, 1500);
  }, []);

  const toggleSpecialty = (specialty: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (selectedSpecialties.includes(specialty)) {
      setSelectedSpecialties(selectedSpecialties.filter(s => s !== specialty));
    } else {
      setSelectedSpecialties([...selectedSpecialties, specialty]);
    }
  };

  const handleSwipeLeft = (barber: BarberWithDistance) => {
    setCurrentIndex(currentIndex + 1);
  };

  const handleSwipeRight = (barber: BarberWithDistance) => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    navigation.navigate('BarberProfile', { barber });
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

  const currentBarber = filteredBarbers[currentIndex];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.background} />
      
      {/* Header */}
      <Animated.View 
        entering={FadeInDown.delay(100).springify()}
        style={styles.header}
      >
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.greeting}>Discover</Text>
            <TouchableOpacity style={styles.locationRow}>
              <Ionicons name="location" size={16} color={Colors.accent} />
              <Text style={styles.location}>Toronto, ON</Text>
              <Ionicons name="chevron-down" size={16} color={Colors.text.tertiary} />
            </TouchableOpacity>
          </View>
          
          <View style={styles.headerActions}>
            <TouchableOpacity 
              style={styles.iconButton}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setViewMode(viewMode === 'swipe' ? 'list' : 'swipe');
              }}
            >
              <Ionicons 
                name={viewMode === 'swipe' ? 'list' : 'albums'} 
                size={24} 
                color={Colors.text.primary} 
              />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton}>
              <Ionicons name="notifications-outline" size={24} color={Colors.text.primary} />
              <View style={styles.notificationBadge} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Search Bar */}
        <Animated.View 
          entering={FadeInDown.delay(200).springify()}
          style={styles.searchContainer}
        >
          <Ionicons name="search" size={20} color={Colors.text.tertiary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search barbers, styles..."
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
          <TouchableOpacity 
            style={styles.filterButton}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              setShowFilters(true);
            }}
          >
            <Ionicons name="options-outline" size={20} color={Colors.text.primary} />
            {selectedSpecialties.length > 0 && (
              <View style={styles.filterBadge}>
                <Text style={styles.filterBadgeText}>{selectedSpecialties.length}</Text>
              </View>
            )}
          </TouchableOpacity>
        </Animated.View>
      </Animated.View>

      {/* Stories */}
      {!loading && (
        <Animated.View entering={FadeInUp.delay(300).springify()}>
          <BarberStories
            barbers={barbers}
            onStoryPress={(barber) => setStoryBarber(barber)}
            onViewProfile={(barber) => navigation.navigate('BarberProfile', { barber })}
          />
        </Animated.View>
      )}

      {/* Content */}
      {loading ? (
        <View style={styles.content}>
          <SkeletonBarberCard />
        </View>
      ) : viewMode === 'swipe' ? (
        <Animated.View 
          entering={FadeInUp.delay(400).springify()}
          style={styles.swipeContainer}
        >
          {currentBarber ? (
            <SwipeableBarberCard
              barber={currentBarber}
              onSwipeLeft={handleSwipeLeft}
              onSwipeRight={handleSwipeRight}
              onPress={(barber) => navigation.navigate('BarberProfile', { barber })}
            />
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="checkmark-circle" size={80} color={Colors.accent} />
              <Text style={styles.emptyTitle}>All Caught Up</Text>
              <Text style={styles.emptyText}>
                You've seen all available barbers. Check back later for new profiles.
              </Text>
              <AnimatedButton
                title="Reset"
                onPress={() => setCurrentIndex(0)}
                variant="gradient"
                style={styles.resetButton}
              />
            </View>
          )}

          {currentBarber && (
            <View style={styles.swipeActions}>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => handleSwipeLeft(currentBarber)}
              >
                <View style={[styles.actionButtonInner, styles.skipButton]}>
                  <Ionicons name="close" size={32} color={Colors.error} />
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => navigation.navigate('BarberProfile', { barber: currentBarber })}
              >
                <View style={[styles.actionButtonInner, styles.infoButton]}>
                  <Ionicons name="information" size={32} color={Colors.info} />
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => handleSwipeRight(currentBarber)}
              >
                <View style={[styles.actionButtonInner, styles.bookButton]}>
                  <Ionicons name="heart" size={32} color={Colors.success} />
                </View>
              </TouchableOpacity>
            </View>
          )}
        </Animated.View>
      ) : (
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {filteredBarbers.map((barber, index) => (
            <Animated.View
              key={barber.barberId}
              entering={FadeInUp.delay(index * 100).springify()}
            >
              {/* List view content */}
            </Animated.View>
          ))}
        </ScrollView>
      )}

      {/* Story Viewer Modal */}
      {storyBarber && (
        <Modal visible={true} animationType="fade" statusBarTranslucent>
          <StoryViewer
            barber={storyBarber}
            onClose={() => setStoryBarber(null)}
            onViewProfile={() => {
              setStoryBarber(null);
              navigation.navigate('BarberProfile', { barber: storyBarber });
            }}
          />
        </Modal>
      )}

      {/* Filters Modal */}
      <Modal
        visible={showFilters}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.filtersModal}>
          <View style={styles.filtersHeader}>
            <Text style={styles.filtersTitle}>Filters</Text>
            <TouchableOpacity 
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setShowFilters(false);
              }}
            >
              <Ionicons name="close" size={28} color={Colors.text.primary} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.filtersContent}>
            <Text style={styles.filterSection}>Specialties</Text>
            <View style={styles.filtersGrid}>
              {allSpecialties.map((specialty) => (
                <TouchableOpacity
                  key={specialty}
                  style={[
                    styles.filterChip,
                    selectedSpecialties.includes(specialty) && styles.filterChipActive,
                  ]}
                  onPress={() => toggleSpecialty(specialty)}
                >
                  <Text
                    style={[
                      styles.filterChipText,
                      selectedSpecialties.includes(specialty) && styles.filterChipTextActive,
                    ]}
                  >
                    {specialty}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>

          <View style={styles.filtersFooter}>
            <AnimatedButton
              title="Clear All"
              variant="outline"
              onPress={() => setSelectedSpecialties([])}
              style={styles.filterFooterButton}
            />
            <AnimatedButton
              title="Apply Filters"
              variant="gradient"
              onPress={() => setShowFilters(false)}
              style={styles.filterFooterButton}
            />
          </View>
        </View>
      </Modal>
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
  headerActions: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  iconButton: {
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
  filterButton: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.backgroundSecondary,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  filterBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: Colors.accent,
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  filterBadgeText: {
    fontSize: Typography.fontSize.xs,
    color: Colors.primary,
    fontWeight: Typography.fontWeight.bold,
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.md,
  },
  swipeContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: Spacing.md,
  },
  swipeActions: {
    flexDirection: 'row',
    gap: Spacing.lg,
    paddingVertical: Spacing.xl,
  },
  actionButton: {
    padding: Spacing.xs,
  },
  actionButtonInner: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  skipButton: {
    backgroundColor: Colors.card,
  },
  infoButton: {
    backgroundColor: Colors.card,
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  bookButton: {
    backgroundColor: Colors.card,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing['3xl'],
    paddingHorizontal: Spacing.xl,
  },
  emptyTitle: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text.primary,
    marginTop: Spacing.md,
    marginBottom: Spacing.xs,
  },
  emptyText: {
    fontSize: Typography.fontSize.base,
    color: Colors.text.tertiary,
    textAlign: 'center',
    marginBottom: Spacing.lg,
    lineHeight: Typography.lineHeight.relaxed * Typography.fontSize.base,
  },
  resetButton: {
    minWidth: 200,
  },
  filtersModal: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  filtersHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  filtersTitle: {
    fontSize: Typography.fontSize['2xl'],
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text.primary,
  },
  filtersContent: {
    flex: 1,
    padding: Spacing.md,
  },
  filterSection: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.primary,
    marginBottom: Spacing.md,
  },
  filtersGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  filterChip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.full,
    borderWidth: 2,
    borderColor: Colors.border,
  },
  filterChipActive: {
    backgroundColor: Colors.accent,
    borderColor: Colors.accent,
  },
  filterChipText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.secondary,
    fontWeight: Typography.fontWeight.medium,
  },
  filterChipTextActive: {
    color: Colors.primary,
    fontWeight: Typography.fontWeight.semibold,
  },
  filtersFooter: {
    flexDirection: 'row',
    gap: Spacing.sm,
    padding: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  filterFooterButton: {
    flex: 1,
  },
});
