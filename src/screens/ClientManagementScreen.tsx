/**
 * Client Management Screen
 * Track client history, preferences, and behavior
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  TextInput,
  Image,
} from 'react-native';
import Animated, { FadeInRight } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';
import { Colors, Typography, Spacing, BorderRadius } from '../constants/theme';
import { formatPrice } from '../data/mockData';

interface Client {
  id: string;
  name: string;
  phone: string;
  email?: string;
  avatarUrl?: string;
  lastVisit: Date;
  totalVisits: number;
  totalSpent: number;
  preferredServices: string[];
  notes?: string;
  noShowCount: number;
  cancelCount: number;
  lifetimeValue: number;
  averageRating: number;
  tags: string[];
}

export const ClientManagementScreen = ({ navigation }: any) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTag, setFilterTag] = useState<string>('all');

  const clients: Client[] = [
    {
      id: 'c1',
      name: 'James Wilson',
      phone: '+1-416-555-0100',
      email: 'james@example.com',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
      lastVisit: new Date(2026, 1, 10),
      totalVisits: 24,
      totalSpent: 108000, // $1,080
      preferredServices: ['Signature Fade', 'Beard Trim'],
      notes: 'Prefers mid fade, likes to chat about sports. Always tips well.',
      noShowCount: 0,
      cancelCount: 1,
      lifetimeValue: 108000,
      averageRating: 5,
      tags: ['VIP', 'Regular', 'High Value'],
    },
    {
      id: 'c2',
      name: 'David Chen',
      phone: '+1-416-555-0200',
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200',
      lastVisit: new Date(2026, 1, 5),
      totalVisits: 12,
      totalSpent: 54000,
      preferredServices: ['Hot Towel Shave'],
      notes: 'Sensitive skin, use premium products only.',
      noShowCount: 0,
      cancelCount: 0,
      lifetimeValue: 54000,
      averageRating: 5,
      tags: ['Regular'],
    },
    {
      id: 'c3',
      name: 'Michael Brown',
      phone: '+1-416-555-0300',
      lastVisit: new Date(2026, 0, 20),
      totalVisits: 6,
      totalSpent: 27000,
      preferredServices: ['Signature Fade'],
      noShowCount: 1,
      cancelCount: 2,
      lifetimeValue: 27000,
      averageRating: 4,
      tags: ['At Risk'],
    },
  ];

  const filteredClients = clients.filter(client => {
    const matchesSearch = 
      client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.phone.includes(searchQuery);
    
    const matchesFilter = 
      filterTag === 'all' ||
      client.tags.includes(filterTag);
    
    return matchesSearch && matchesFilter;
  });

  const renderClientCard = (client: Client) => {
    const daysSinceVisit = Math.floor(
      (new Date().getTime() - client.lastVisit.getTime()) / (1000 * 60 * 60 * 24)
    );

    return (
      <TouchableOpacity
        key={client.id}
        style={styles.clientCard}
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          navigation.navigate('ClientDetails', { client });
        }}
      >
        <View style={styles.clientHeader}>
          {client.avatarUrl ? (
            <Image source={{ uri: client.avatarUrl }} style={styles.avatar} />
          ) : (
            <View style={[styles.avatar, styles.avatarPlaceholder]}>
              <Text style={styles.avatarInitial}>{client.name.charAt(0)}</Text>
            </View>
          )}
          
          <View style={styles.clientInfo}>
            <View style={styles.nameRow}>
              <Text style={styles.clientName}>{client.name}</Text>
              {client.tags.includes('VIP') && (
                <View style={styles.vipBadge}>
                  <Ionicons name="star" size={12} color={Colors.accent} />
                </View>
              )}
            </View>
            <Text style={styles.clientPhone}>{client.phone}</Text>
            <Text style={styles.lastVisit}>
              Last visit {daysSinceVisit} day{daysSinceVisit !== 1 ? 's' : ''} ago
            </Text>
          </View>

          <TouchableOpacity style={styles.callButton}>
            <Ionicons name="call" size={20} color={Colors.accent} />
          </TouchableOpacity>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{client.totalVisits}</Text>
            <Text style={styles.statLabel}>Visits</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{formatPrice(client.lifetimeValue, 'CAD')}</Text>
            <Text style={styles.statLabel}>Lifetime</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={[
              styles.statValue,
              client.noShowCount > 0 && { color: Colors.warning }
            ]}>
              {client.noShowCount}
            </Text>
            <Text style={styles.statLabel}>No-Shows</Text>
          </View>
        </View>

        <View style={styles.tagsRow}>
          {client.tags.map((tag, index) => (
            <View 
              key={index} 
              style={[
                styles.tag,
                tag === 'VIP' && styles.tagVIP,
                tag === 'At Risk' && styles.tagRisk,
              ]}
            >
              <Text style={[
                styles.tagText,
                tag === 'VIP' && styles.tagTextVIP,
                tag === 'At Risk' && styles.tagTextRisk,
              ]}>
                {tag}
              </Text>
            </View>
          ))}
        </View>

        {client.preferredServices.length > 0 && (
          <View style={styles.preferredServices}>
            <Ionicons name="cut-outline" size={14} color={Colors.text.tertiary} />
            <Text style={styles.preferredText}>
              Prefers: {client.preferredServices.join(', ')}
            </Text>
          </View>
        )}

        {client.notes && (
          <View style={styles.notesPreview}>
            <Ionicons name="document-text-outline" size={14} color={Colors.info} />
            <Text style={styles.notesText} numberOfLines={2}>
              {client.notes}
            </Text>
          </View>
        )}

        <View style={styles.clientActions}>
          <TouchableOpacity style={styles.clientActionButton}>
            <Ionicons name="calendar" size={16} color={Colors.text.primary} />
            <Text style={styles.clientActionText}>Book</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.clientActionButton}>
            <Ionicons name="chatbubble" size={16} color={Colors.text.primary} />
            <Text style={styles.clientActionText}>Message</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.clientActionButton}>
            <Ionicons name="arrow-forward" size={16} color={Colors.text.primary} />
            <Text style={styles.clientActionText}>History</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Clients</Text>
        <TouchableOpacity style={styles.addClientButton}>
          <Ionicons name="person-add" size={24} color={Colors.accent} />
        </TouchableOpacity>
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color={Colors.text.tertiary} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by name or phone..."
          placeholderTextColor={Colors.text.tertiary}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Filter Tags */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filtersContent}
      >
        {['all', 'VIP', 'Regular', 'High Value', 'At Risk', 'New'].map((tag) => (
          <TouchableOpacity
            key={tag}
            style={[
              styles.filterChip,
              filterTag === tag && styles.filterChipActive,
            ]}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              setFilterTag(tag);
            }}
          >
            <Text style={[
              styles.filterText,
              filterTag === tag && styles.filterTextActive,
            ]}>
              {tag.charAt(0).toUpperCase() + tag.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Summary Stats */}
      <View style={styles.summaryBar}>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryValue}>{clients.length}</Text>
          <Text style={styles.summaryLabel}>Total Clients</Text>
        </View>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryValue}>
            {formatPrice(clients.reduce((sum, c) => sum + c.lifetimeValue, 0), 'CAD')}
          </Text>
          <Text style={styles.summaryLabel}>Total LTV</Text>
        </View>
      </View>

      {/* Client List */}
      <ScrollView 
        style={styles.clientList}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      >
        {filteredClients.map((client) => renderClientCard(client))}
      </ScrollView>
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
    paddingVertical: Spacing.md,
  },
  headerTitle: {
    fontSize: Typography.fontSize['3xl'],
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text.primary,
  },
  addClientButton: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.card,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    gap: Spacing.sm,
    marginHorizontal: Spacing.md,
    marginBottom: Spacing.md,
  },
  searchInput: {
    flex: 1,
    fontSize: Typography.fontSize.base,
    color: Colors.text.primary,
    padding: 0,
  },
  filtersContent: {
    paddingHorizontal: Spacing.md,
    gap: Spacing.sm,
    paddingBottom: Spacing.sm,
  },
  filterChip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  filterChipActive: {
    backgroundColor: Colors.accent,
    borderColor: Colors.accent,
  },
  filterText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.secondary,
    fontWeight: Typography.fontWeight.medium,
  },
  filterTextActive: {
    color: Colors.primary,
    fontWeight: Typography.fontWeight.semibold,
  },
  summaryBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: Spacing.md,
    marginHorizontal: Spacing.md,
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.md,
  },
  summaryItem: {
    alignItems: 'center',
  },
  summaryValue: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.accent,
    marginBottom: Spacing.xs / 2,
  },
  summaryLabel: {
    fontSize: Typography.fontSize.xs,
    color: Colors.text.tertiary,
  },
  clientList: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.xl,
  },
  clientCard: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  clientHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
    gap: Spacing.sm,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: BorderRadius.xl,
  },
  avatarPlaceholder: {
    backgroundColor: Colors.accent + '20',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarInitial: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.accent,
  },
  clientInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    marginBottom: Spacing.xs / 2,
  },
  clientName: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text.primary,
  },
  vipBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: Colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
  },
  clientPhone: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.tertiary,
    marginBottom: Spacing.xs / 2,
  },
  lastVisit: {
    fontSize: Typography.fontSize.xs,
    color: Colors.text.tertiary,
  },
  callButton: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.backgroundSecondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.md,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text.primary,
    marginBottom: Spacing.xs / 2,
  },
  statLabel: {
    fontSize: Typography.fontSize.xs,
    color: Colors.text.tertiary,
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: Colors.border,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xs,
    marginBottom: Spacing.sm,
  },
  tag: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs / 2,
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  tagVIP: {
    backgroundColor: Colors.accent + '20',
    borderColor: Colors.accent,
  },
  tagRisk: {
    backgroundColor: Colors.warning + '20',
    borderColor: Colors.warning,
  },
  tagText: {
    fontSize: Typography.fontSize.xs,
    color: Colors.text.secondary,
    fontWeight: Typography.fontWeight.medium,
  },
  tagTextVIP: {
    color: Colors.accent,
  },
  tagTextRisk: {
    color: Colors.warning,
  },
  preferredServices: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    marginBottom: Spacing.sm,
  },
  preferredText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.secondary,
  },
  notesPreview: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.xs,
    backgroundColor: Colors.info + '10',
    padding: Spacing.sm,
    borderRadius: BorderRadius.sm,
    marginBottom: Spacing.md,
  },
  notesText: {
    flex: 1,
    fontSize: Typography.fontSize.sm,
    color: Colors.text.secondary,
    lineHeight: Typography.lineHeight.normal * Typography.fontSize.sm,
  },
  clientActions: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  clientActionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: BorderRadius.md,
  },
  clientActionText: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.text.primary,
  },
});
