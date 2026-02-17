/**
 * Professional Calendar View for Barbers
 * Industry-focused scheduling with time blocks and walk-ins
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
  Dimensions,
} from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import { format, addDays, startOfWeek, isSameDay } from 'date-fns';
import { Colors, Typography, Spacing, BorderRadius } from '../constants/theme';
import { formatPrice } from '../data/mockData';

const { width } = Dimensions.get('window');

interface TimeBlock {
  id: string;
  clientName?: string;
  service: string;
  startTime: Date;
  endTime: Date;
  status: 'confirmed' | 'checked_in' | 'walk_in' | 'blocked' | 'available';
  amount?: number;
  depositPaid: boolean;
  clientPhone?: string;
}

export const CalendarScheduleScreen = ({ navigation }: any) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'day' | 'week'>('day');
  
  const weekStart = startOfWeek(selectedDate);
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  
  // Mock schedule data
  const todaySchedule: TimeBlock[] = [
    {
      id: '1',
      clientName: 'James Wilson',
      service: 'Signature Fade',
      startTime: new Date(2026, 1, 17, 9, 0),
      endTime: new Date(2026, 1, 17, 9, 45),
      status: 'confirmed',
      amount: 4500,
      depositPaid: true,
      clientPhone: '+1-416-555-0100',
    },
    {
      id: '2',
      clientName: 'Walk-in',
      service: 'Beard Trim',
      startTime: new Date(2026, 1, 17, 10, 0),
      endTime: new Date(2026, 1, 17, 10, 30),
      status: 'walk_in',
      amount: 3000,
      depositPaid: false,
    },
    {
      id: '3',
      clientName: 'David Chen',
      service: 'Hot Towel Shave',
      startTime: new Date(2026, 1, 17, 11, 0),
      endTime: new Date(2026, 1, 17, 11, 40),
      status: 'confirmed',
      amount: 5500,
      depositPaid: true,
      clientPhone: '+1-416-555-0200',
    },
    {
      id: '4',
      service: 'Lunch Break',
      startTime: new Date(2026, 1, 17, 12, 0),
      endTime: new Date(2026, 1, 17, 13, 0),
      status: 'blocked',
      depositPaid: false,
    },
    {
      id: '5',
      clientName: 'Michael Brown',
      service: 'Signature Fade + Beard',
      startTime: new Date(2026, 1, 17, 14, 0),
      endTime: new Date(2026, 1, 17, 15, 15),
      status: 'confirmed',
      amount: 7500,
      depositPaid: true,
      clientPhone: '+1-416-555-0300',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return Colors.success;
      case 'checked_in':
        return Colors.info;
      case 'walk_in':
        return Colors.warning;
      case 'blocked':
        return Colors.gray[600];
      default:
        return Colors.gray[700];
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'Confirmed';
      case 'checked_in':
        return 'Checked In';
      case 'walk_in':
        return 'Walk-In';
      case 'blocked':
        return 'Blocked';
      default:
        return 'Available';
    }
  };

  const renderTimeBlock = (block: TimeBlock) => {
    const startHour = format(block.startTime, 'h:mm a');
    const endHour = format(block.endTime, 'h:mm a');
    const duration = (block.endTime.getTime() - block.startTime.getTime()) / 60000;
    const heightMultiplier = duration / 15; // 15 min = base unit
    
    return (
      <TouchableOpacity
        key={block.id}
        style={[
          styles.timeBlock,
          { minHeight: 60 * heightMultiplier },
          { borderLeftColor: getStatusColor(block.status) },
        ]}
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          if (block.clientName && block.status !== 'blocked') {
            // Navigate to appointment details
          }
        }}
      >
        <View style={styles.timeBlockHeader}>
          <Text style={styles.timeBlockTime}>{startHour}</Text>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(block.status) + '20' }]}>
            <Text style={[styles.statusText, { color: getStatusColor(block.status) }]}>
              {getStatusLabel(block.status)}
            </Text>
          </View>
        </View>

        {block.clientName && (
          <>
            <Text style={styles.clientName}>{block.clientName}</Text>
            <Text style={styles.serviceName}>{block.service}</Text>
            
            <View style={styles.timeBlockFooter}>
              <View style={styles.duration}>
                <Ionicons name="time-outline" size={14} color={Colors.text.tertiary} />
                <Text style={styles.durationText}>{duration} min</Text>
              </View>
              
              {block.amount && (
                <Text style={styles.amount}>
                  {formatPrice(block.amount, 'CAD')}
                </Text>
              )}
            </View>

            {block.depositPaid && (
              <View style={styles.depositBadge}>
                <Ionicons name="shield-checkmark" size={12} color={Colors.accent} />
                <Text style={styles.depositText}>Deposit Secured</Text>
              </View>
            )}

            {block.status === 'confirmed' && (
              <View style={styles.quickActions}>
                <TouchableOpacity style={styles.quickActionButton}>
                  <Ionicons name="call" size={16} color={Colors.text.primary} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.quickActionButton}>
                  <Ionicons name="chatbubble" size={16} color={Colors.text.primary} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.quickActionButton}>
                  <Ionicons name="checkmark-circle" size={16} color={Colors.success} />
                </TouchableOpacity>
              </View>
            )}
          </>
        )}

        {block.status === 'blocked' && (
          <Text style={styles.blockedText}>{block.service}</Text>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Schedule</Text>
        
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.todayButton}>
            <Text style={styles.todayText}>Today</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="add-circle-outline" size={24} color={Colors.accent} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Week View */}
      <Animated.View entering={FadeInDown.delay(100).springify()}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.weekScroll}
        >
          {weekDays.map((day) => {
            const isSelected = isSameDay(day, selectedDate);
            const isToday = isSameDay(day, new Date());
            
            return (
              <TouchableOpacity
                key={day.toISOString()}
                style={[styles.dayCard, isSelected && styles.dayCardSelected]}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setSelectedDate(day);
                }}
              >
                <Text style={[styles.dayName, isSelected && styles.dayTextSelected]}>
                  {format(day, 'EEE')}
                </Text>
                <Text style={[styles.dayNumber, isSelected && styles.dayTextSelected]}>
                  {format(day, 'd')}
                </Text>
                {isToday && !isSelected && (
                  <View style={styles.todayDot} />
                )}
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </Animated.View>

      {/* Stats Bar */}
      <View style={styles.statsBar}>
        <View style={styles.stat}>
          <Text style={styles.statValue}>5</Text>
          <Text style={styles.statLabel}>Booked</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.stat}>
          <Text style={styles.statValue}>$225</Text>
          <Text style={styles.statLabel}>Revenue</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.stat}>
          <Text style={styles.statValue}>75%</Text>
          <Text style={styles.statLabel}>Utilization</Text>
        </View>
      </View>

      {/* Schedule */}
      <ScrollView 
        style={styles.schedule}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.scheduleDate}>
          {format(selectedDate, 'EEEE, MMMM d, yyyy')}
        </Text>
        
        <View style={styles.timeBlocks}>
          {todaySchedule.map(renderTimeBlock)}
        </View>

        {/* Add Walk-In Button */}
        <TouchableOpacity style={styles.addWalkInButton}>
          <Ionicons name="person-add" size={20} color={Colors.accent} />
          <Text style={styles.addWalkInText}>Add Walk-In</Text>
        </TouchableOpacity>
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
  headerActions: {
    flexDirection: 'row',
    gap: Spacing.sm,
    alignItems: 'center',
  },
  todayButton: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.md,
  },
  todayText: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.accent,
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.card,
    justifyContent: 'center',
    alignItems: 'center',
  },
  weekScroll: {
    paddingHorizontal: Spacing.md,
    gap: Spacing.sm,
    paddingVertical: Spacing.sm,
  },
  dayCard: {
    width: 60,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    position: 'relative',
  },
  dayCardSelected: {
    backgroundColor: Colors.accent,
  },
  dayName: {
    fontSize: Typography.fontSize.xs,
    color: Colors.text.tertiary,
    marginBottom: Spacing.xs,
    fontWeight: Typography.fontWeight.medium,
  },
  dayNumber: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text.primary,
  },
  dayTextSelected: {
    color: Colors.primary,
  },
  todayDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.accent,
    position: 'absolute',
    bottom: 8,
  },
  statsBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    marginHorizontal: Spacing.md,
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.md,
  },
  stat: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.accent,
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
  schedule: {
    flex: 1,
    paddingHorizontal: Spacing.md,
  },
  scheduleDate: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.primary,
    marginBottom: Spacing.md,
  },
  timeBlocks: {
    gap: Spacing.sm,
  },
  timeBlock: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    borderLeftWidth: 4,
  },
  timeBlockHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  timeBlockTime: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.tertiary,
  },
  statusBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs / 2,
    borderRadius: BorderRadius.sm,
  },
  statusText: {
    fontSize: Typography.fontSize.xs,
    fontWeight: Typography.fontWeight.semibold,
  },
  clientName: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text.primary,
    marginBottom: Spacing.xs / 2,
  },
  serviceName: {
    fontSize: Typography.fontSize.base,
    color: Colors.text.secondary,
    marginBottom: Spacing.sm,
  },
  timeBlockFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  duration: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  durationText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.tertiary,
  },
  amount: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.accent,
  },
  depositBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    backgroundColor: Colors.accent + '20',
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
    alignSelf: 'flex-start',
    marginBottom: Spacing.sm,
  },
  depositText: {
    fontSize: Typography.fontSize.xs,
    color: Colors.accent,
    fontWeight: Typography.fontWeight.semibold,
  },
  quickActions: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  quickActionButton: {
    width: 32,
    height: 32,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.backgroundSecondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  blockedText: {
    fontSize: Typography.fontSize.base,
    color: Colors.text.tertiary,
    fontStyle: 'italic',
  },
  addWalkInButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.card,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    marginTop: Spacing.md,
    marginBottom: Spacing.xl,
    borderWidth: 2,
    borderColor: Colors.border,
    borderStyle: 'dashed',
  },
  addWalkInText: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.accent,
  },
});
