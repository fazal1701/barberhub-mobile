import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../constants/theme';
import { Button } from '../components/Button';
import { mockReviews, mockServices, formatPrice } from '../data/mockData';
import { BarberWithDistance, Review } from '../types';

const { width } = Dimensions.get('window');

export const BarberProfileScreen = ({ route, navigation }: any) => {
  const { barber } = route.params as { barber: BarberWithDistance };
  const [activeTab, setActiveTab] = useState<'portfolio' | 'reviews' | 'about'>('portfolio');
  const [selectedImage, setSelectedImage] = useState(barber.portfolioCoverUrl);

  const reviews = mockReviews.filter(r => r.barberUserId === barber.barberId);
  const services = mockServices.slice(0, 4); // Showing sample services

  const renderPortfolio = () => (
    <View style={styles.portfolioContainer}>
      <Image source={{ uri: selectedImage }} style={styles.featuredImage} />
      
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.thumbnailScroll}
        contentContainerStyle={styles.thumbnailContent}
      >
        {barber.portfolioImages.map((image, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => setSelectedImage(image)}
            style={[
              styles.thumbnail,
              selectedImage === image && styles.thumbnailActive,
            ]}
          >
            <Image source={{ uri: image }} style={styles.thumbnailImage} />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  const renderReviews = () => (
    <View style={styles.reviewsContainer}>
      {reviews.map((review) => (
        <View key={review.id} style={styles.reviewCard}>
          <View style={styles.reviewHeader}>
            <Image 
              source={{ uri: review.client?.avatarUrl }} 
              style={styles.reviewAvatar} 
            />
            <View style={styles.reviewHeaderText}>
              <Text style={styles.reviewName}>{review.client?.displayName}</Text>
              <View style={styles.reviewRating}>
                {[...Array(5)].map((_, i) => (
                  <Ionicons
                    key={i}
                    name={i < review.rating ? 'star' : 'star-outline'}
                    size={14}
                    color={Colors.accent}
                  />
                ))}
              </View>
            </View>
            <Text style={styles.reviewDate}>
              {new Date(review.createdAt).toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric' 
              })}
            </Text>
          </View>
          <Text style={styles.reviewText}>{review.text}</Text>
        </View>
      ))}
    </View>
  );

  const renderAbout = () => (
    <View style={styles.aboutContainer}>
      <View style={styles.aboutSection}>
        <Text style={styles.aboutTitle}>Bio</Text>
        <Text style={styles.aboutText}>{barber.bio}</Text>
      </View>

      <View style={styles.aboutSection}>
        <Text style={styles.aboutTitle}>Experience</Text>
        <Text style={styles.aboutText}>{barber.yearsExperience} years in the industry</Text>
      </View>

      <View style={styles.aboutSection}>
        <Text style={styles.aboutTitle}>Languages</Text>
        <View style={styles.languageChips}>
          {barber.languages.map((lang, index) => (
            <View key={index} style={styles.chip}>
              <Text style={styles.chipText}>{lang}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.aboutSection}>
        <Text style={styles.aboutTitle}>Specialties</Text>
        <View style={styles.specialtiesGrid}>
          {barber.specialties.map((specialty, index) => (
            <View key={index} style={styles.specialtyChip}>
              <Ionicons name="checkmark-circle" size={16} color={Colors.accent} />
              <Text style={styles.specialtyChipText}>{specialty}</Text>
            </View>
          ))}
        </View>
      </View>

      {barber.shop && (
        <View style={styles.aboutSection}>
          <Text style={styles.aboutTitle}>Location</Text>
          <View style={styles.shopCard}>
            <View style={styles.shopInfo}>
              <Ionicons name="business" size={20} color={Colors.accent} />
              <Text style={styles.shopName}>{barber.shop.name}</Text>
            </View>
            {barber.location && (
              <View style={styles.addressRow}>
                <Ionicons name="location" size={16} color={Colors.text.tertiary} />
                <Text style={styles.addressText}>
                  {barber.location.addressLine1}, {barber.location.city}
                </Text>
              </View>
            )}
          </View>
        </View>
      )}

      {barber.instagramHandle && (
        <TouchableOpacity style={styles.socialButton}>
          <Ionicons name="logo-instagram" size={20} color={Colors.text.primary} />
          <Text style={styles.socialText}>{barber.instagramHandle}</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={Colors.text.primary} />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.shareButton}>
          <Ionicons name="share-outline" size={24} color={Colors.text.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <Image 
            source={{ uri: barber.user.avatarUrl }} 
            style={styles.profileAvatar} 
          />
          
          <View style={styles.profileInfo}>
            <View style={styles.nameRow}>
              <Text style={styles.profileName}>{barber.user.displayName}</Text>
              {barber.verificationStatus === 'verified' && (
                <Ionicons name="checkmark-circle" size={24} color={Colors.accent} />
              )}
            </View>
            
            <View style={styles.statsRow}>
              <View style={styles.stat}>
                <Ionicons name="star" size={18} color={Colors.accent} />
                <Text style={styles.statValue}>{barber.ratingAvg}</Text>
                <Text style={styles.statLabel}>({barber.ratingCount} reviews)</Text>
              </View>
              
              <View style={styles.statDivider} />
              
              <View style={styles.stat}>
                <Ionicons name="time-outline" size={18} color={Colors.accent} />
                <Text style={styles.statValue}>{barber.yearsExperience}</Text>
                <Text style={styles.statLabel}>years exp</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Services Preview */}
        <View style={styles.servicesSection}>
          <Text style={styles.sectionTitle}>Services</Text>
          {services.slice(0, 3).map((service) => (
            <View key={service.id} style={styles.serviceItem}>
              <View style={styles.serviceInfo}>
                <Text style={styles.serviceName}>{service.name}</Text>
                <Text style={styles.serviceDetails}>
                  {service.durationMinutes} min • {formatPrice(service.priceCents, service.currency)}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Tabs */}
        <View style={styles.tabs}>
          {(['portfolio', 'reviews', 'about'] as const).map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[styles.tab, activeTab === tab && styles.tabActive]}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Tab Content */}
        {activeTab === 'portfolio' && renderPortfolio()}
        {activeTab === 'reviews' && renderReviews()}
        {activeTab === 'about' && renderAbout()}
      </ScrollView>

      {/* Book Now Button */}
      <BlurView intensity={80} tint="dark" style={styles.bookingBar}>
        <View style={styles.bookingBarContent}>
          <View>
            <Text style={styles.bookingPrice}>From {formatPrice(4500, 'CAD')}</Text>
            <Text style={styles.bookingSubtext}>45 min • Next available today</Text>
          </View>
          <Button
            title="Book Now"
            onPress={() => navigation.navigate('Booking', { barber })}
            size="md"
          />
        </View>
      </BlurView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.card,
    justifyContent: 'center',
    alignItems: 'center',
  },
  shareButton: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.card,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  profileHeader: {
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.lg,
  },
  profileAvatar: {
    width: 100,
    height: 100,
    borderRadius: BorderRadius.full,
    borderWidth: 3,
    borderColor: Colors.accent,
    marginBottom: Spacing.md,
  },
  profileInfo: {
    gap: Spacing.sm,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  profileName: {
    fontSize: Typography.fontSize['3xl'],
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text.primary,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  statValue: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.primary,
  },
  statLabel: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.tertiary,
  },
  statDivider: {
    width: 1,
    height: 20,
    backgroundColor: Colors.border,
  },
  servicesSection: {
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text.primary,
    marginBottom: Spacing.md,
  },
  serviceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  serviceInfo: {
    flex: 1,
  },
  serviceName: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.primary,
    marginBottom: Spacing.xs / 2,
  },
  serviceDetails: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.tertiary,
  },
  tabs: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.md,
    gap: Spacing.sm,
  },
  tab: {
    flex: 1,
    paddingVertical: Spacing.sm,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: Colors.accent,
  },
  tabText: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.text.tertiary,
  },
  tabTextActive: {
    color: Colors.accent,
    fontWeight: Typography.fontWeight.semibold,
  },
  portfolioContainer: {
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing['3xl'],
  },
  featuredImage: {
    width: '100%',
    height: 400,
    borderRadius: BorderRadius.xl,
    marginBottom: Spacing.md,
    backgroundColor: Colors.gray[800],
  },
  thumbnailScroll: {
    marginHorizontal: -Spacing.md,
  },
  thumbnailContent: {
    paddingHorizontal: Spacing.md,
    gap: Spacing.sm,
  },
  thumbnail: {
    width: 80,
    height: 80,
    borderRadius: BorderRadius.md,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  thumbnailActive: {
    borderColor: Colors.accent,
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
  },
  reviewsContainer: {
    paddingHorizontal: Spacing.md,
    gap: Spacing.md,
    marginBottom: Spacing['3xl'],
  },
  reviewCard: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  reviewAvatar: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.full,
    marginRight: Spacing.sm,
  },
  reviewHeaderText: {
    flex: 1,
  },
  reviewName: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.primary,
    marginBottom: Spacing.xs / 2,
  },
  reviewRating: {
    flexDirection: 'row',
    gap: Spacing.xs / 2,
  },
  reviewDate: {
    fontSize: Typography.fontSize.xs,
    color: Colors.text.tertiary,
  },
  reviewText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.secondary,
    lineHeight: Typography.lineHeight.relaxed * Typography.fontSize.sm,
  },
  aboutContainer: {
    paddingHorizontal: Spacing.md,
    gap: Spacing.lg,
    marginBottom: Spacing['3xl'],
  },
  aboutSection: {
    gap: Spacing.sm,
  },
  aboutTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.primary,
  },
  aboutText: {
    fontSize: Typography.fontSize.base,
    color: Colors.text.secondary,
    lineHeight: Typography.lineHeight.relaxed * Typography.fontSize.base,
  },
  languageChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  chip: {
    backgroundColor: Colors.card,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  chipText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.secondary,
    fontWeight: Typography.fontWeight.medium,
  },
  specialtiesGrid: {
    gap: Spacing.sm,
  },
  specialtyChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.card,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  specialtyChipText: {
    fontSize: Typography.fontSize.base,
    color: Colors.text.primary,
    fontWeight: Typography.fontWeight.medium,
  },
  shopCard: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    gap: Spacing.sm,
  },
  shopInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  shopName: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.primary,
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  addressText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.tertiary,
    flex: 1,
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.card,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  socialText: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.text.primary,
  },
  bookingBar: {
    borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
    overflow: 'hidden',
  },
  bookingBarContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
  },
  bookingPrice: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text.primary,
  },
  bookingSubtext: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.tertiary,
  },
});
