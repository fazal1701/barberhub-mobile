import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BarberWithDistance } from '../types';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../constants/theme';
import { formatPrice } from '../data/mockData';

interface BarberCardProps {
  barber: BarberWithDistance;
  onPress: () => void;
}

export const BarberCard: React.FC<BarberCardProps> = ({ barber, onPress }) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.9}>
      <Image source={{ uri: barber.portfolioCoverUrl }} style={styles.image} />
      
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Image source={{ uri: barber.user.avatarUrl }} style={styles.avatar} />
            <View style={styles.info}>
              <View style={styles.nameRow}>
                <Text style={styles.name}>{barber.user.displayName}</Text>
                {barber.verificationStatus === 'verified' && (
                  <Ionicons name="checkmark-circle" size={16} color={Colors.accent} />
                )}
              </View>
              {barber.distance !== undefined && (
                <Text style={styles.distance}>{barber.distance.toFixed(1)} km away</Text>
              )}
            </View>
          </View>
          
          <View style={styles.rating}>
            <Ionicons name="star" size={14} color={Colors.accent} />
            <Text style={styles.ratingText}>{barber.ratingAvg}</Text>
            <Text style={styles.ratingCount}>({barber.ratingCount})</Text>
          </View>
        </View>

        <View style={styles.specialties}>
          {barber.specialties.slice(0, 3).map((specialty, index) => (
            <View key={index} style={styles.specialtyTag}>
              <Text style={styles.specialtyText}>{specialty}</Text>
            </View>
          ))}
          {barber.specialties.length > 3 && (
            <View style={styles.specialtyTag}>
              <Text style={styles.specialtyText}>+{barber.specialties.length - 3}</Text>
            </View>
          )}
        </View>

        {barber.shop && (
          <View style={styles.shopInfo}>
            <Ionicons name="location-outline" size={14} color={Colors.text.tertiary} />
            <Text style={styles.shopName}>{barber.shop.name}</Text>
          </View>
        )}

        {barber.nextAvailableSlot && (
          <View style={styles.availability}>
            <Ionicons name="time-outline" size={14} color={Colors.success} />
            <Text style={styles.availabilityText}>
              Next available today at {new Date(barber.nextAvailableSlot).toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: '2-digit',
                hour12: true,
              })}
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.xl,
    marginBottom: Spacing.md,
    overflow: 'hidden',
    ...Shadows.md,
  },
  image: {
    width: '100%',
    height: 200,
    backgroundColor: Colors.gray[800],
  },
  content: {
    padding: Spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.md,
  },
  headerLeft: {
    flexDirection: 'row',
    flex: 1,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.full,
    marginRight: Spacing.sm,
    borderWidth: 2,
    borderColor: Colors.accent,
  },
  info: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    marginBottom: Spacing.xs / 2,
  },
  name: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text.primary,
  },
  distance: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.tertiary,
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.backgroundSecondary,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.md,
    gap: Spacing.xs / 2,
  },
  ratingText: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.primary,
  },
  ratingCount: {
    fontSize: Typography.fontSize.xs,
    color: Colors.text.tertiary,
  },
  specialties: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  specialtyTag: {
    backgroundColor: Colors.backgroundSecondary,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  specialtyText: {
    fontSize: Typography.fontSize.xs,
    color: Colors.text.secondary,
    fontWeight: Typography.fontWeight.medium,
  },
  shopInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    marginBottom: Spacing.xs,
  },
  shopName: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.tertiary,
  },
  availability: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    backgroundColor: Colors.backgroundSecondary,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
    alignSelf: 'flex-start',
  },
  availabilityText: {
    fontSize: Typography.fontSize.xs,
    color: Colors.success,
    fontWeight: Typography.fontWeight.medium,
  },
});
