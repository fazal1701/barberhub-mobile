/**
 * Walk-In Queue Management
 * Real-time queue for walk-in customers
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
  Modal,
} from 'react-native';
import Animated, { FadeInDown, Layout } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';
import { Colors, Typography, Spacing, BorderRadius } from '../constants/theme';
import { AnimatedButton } from '../components/AnimatedButton';
import { formatPrice } from '../data/mockData';

interface QueueCustomer {
  id: string;
  name: string;
  phone?: string;
  service: string;
  estimatedDuration: number;
  addedAt: Date;
  status: 'waiting' | 'in_progress' | 'completed' | 'no_show';
  notes?: string;
}

export const WalkInQueueScreen = ({ navigation }: any) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [queue, setQueue] = useState<QueueCustomer[]>([
    {
      id: '1',
      name: 'John Smith',
      phone: '+1-416-555-0400',
      service: 'Signature Fade',
      estimatedDuration: 45,
      addedAt: new Date(Date.now() - 15 * 60000), // 15 min ago
      status: 'waiting',
      notes: 'Regular client, prefers mid fade',
    },
    {
      id: '2',
      name: 'Alex Johnson',
      service: 'Beard Trim',
      estimatedDuration: 30,
      addedAt: new Date(Date.now() - 8 * 60000), // 8 min ago
      status: 'waiting',
    },
    {
      id: '3',
      name: 'Marcus Lee',
      phone: '+1-416-555-0500',
      service: 'Kids Cut',
      estimatedDuration: 30,
      addedAt: new Date(Date.now() - 3 * 60000), // 3 min ago
      status: 'waiting',
      notes: 'First time, 7 years old',
    },
  ]);

  const waitingQueue = queue.filter(c => c.status === 'waiting');
  const inProgress = queue.find(c => c.status === 'in_progress');
  
  const totalWaitTime = waitingQueue.reduce((sum, c) => sum + c.estimatedDuration, 0);
  const estimatedRevenue = waitingQueue.length * 4500; // Average

  const getWaitTime = (customer: QueueCustomer) => {
    const now = new Date();
    const minutesWaiting = Math.floor((now.getTime() - customer.addedAt.getTime()) / 60000);
    return minutesWaiting;
  };

  const startService = (customerId: string) => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setQueue(queue.map(c => 
      c.id === customerId ? { ...c, status: 'in_progress' } : c
    ));
  };

  const completeService = (customerId: string) => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setQueue(queue.map(c => 
      c.id === customerId ? { ...c, status: 'completed' } : c
    ));
    // Remove from queue after delay
    setTimeout(() => {
      setQueue(queue.filter(c => c.id !== customerId));
    }, 2000);
  };

  const markNoShow = (customerId: string) => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    setQueue(queue.filter(c => c.id !== customerId));
  };

  const renderQueueCard = (customer: QueueCustomer, position: number) => {
    const waitTime = getWaitTime(customer);
    
    return (
      <Animated.View
        key={customer.id}
        layout={Layout.springify()}
      >
        <View style={styles.queueCard}>
          <View style={styles.queueHeader}>
            <View style={styles.position}>
              <Text style={styles.positionNumber}>#{position + 1}</Text>
            </View>
            
            <View style={styles.queueInfo}>
              <Text style={styles.customerName}>{customer.name}</Text>
              {customer.phone && (
                <Text style={styles.customerPhone}>{customer.phone}</Text>
              )}
            </View>

            <TouchableOpacity
              style={styles.callButton}
              onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
            >
              <Ionicons name="call" size={20} color={Colors.accent} />
            </TouchableOpacity>
          </View>

          <View style={styles.queueDetails}>
            <View style={styles.serviceRow}>
              <Ionicons name="cut" size={16} color={Colors.text.tertiary} />
              <Text style={styles.serviceText}>{customer.service}</Text>
            </View>
            
            <View style={styles.serviceRow}>
              <Ionicons name="time-outline" size={16} color={Colors.text.tertiary} />
              <Text style={styles.serviceText}>{customer.estimatedDuration} min</Text>
            </View>

            <View style={styles.serviceRow}>
              <Ionicons name="hourglass-outline" size={16} color={Colors.text.tertiary} />
              <Text style={[
                styles.serviceText,
                waitTime > 20 && { color: Colors.warning }
              ]}>
                Waiting {waitTime} min
              </Text>
            </View>
          </View>

          {customer.notes && (
            <View style={styles.notesContainer}>
              <Ionicons name="information-circle-outline" size={14} color={Colors.info} />
              <Text style={styles.notesText}>{customer.notes}</Text>
            </View>
          )}

          <View style={styles.queueActions}>
            <TouchableOpacity
              style={[styles.actionButton, styles.noShowButton]}
              onPress={() => markNoShow(customer.id)}
            >
              <Ionicons name="close" size={18} color={Colors.error} />
              <Text style={[styles.actionText, { color: Colors.error }]}>No Show</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.actionButton, styles.startButton]}
              onPress={() => startService(customer.id)}
            >
              <Ionicons name="play" size={18} color={Colors.accent} />
              <Text style={[styles.actionText, { color: Colors.accent }]}>Start Service</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Walk-In Queue</Text>
          <Text style={styles.headerSubtitle}>
            {waitingQueue.length} customer{waitingQueue.length !== 1 ? 's' : ''} waiting
          </Text>
        </View>
        
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            setShowAddModal(true);
          }}
        >
          <Ionicons name="add" size={28} color={Colors.primary} />
        </TouchableOpacity>
      </View>

      {/* Summary Stats */}
      <View style={styles.summaryCard}>
        <View style={styles.summaryItem}>
          <Ionicons name="time-outline" size={24} color={Colors.warning} />
          <View style={styles.summaryText}>
            <Text style={styles.summaryValue}>{totalWaitTime} min</Text>
            <Text style={styles.summaryLabel}>Total Wait</Text>
          </View>
        </View>
        
        <View style={styles.summaryDivider} />
        
        <View style={styles.summaryItem}>
          <Ionicons name="cash-outline" size={24} color={Colors.accent} />
          <View style={styles.summaryText}>
            <Text style={styles.summaryValue}>{formatPrice(estimatedRevenue, 'CAD')}</Text>
            <Text style={styles.summaryLabel}>Est. Revenue</Text>
          </View>
        </View>
      </View>

      {/* Current Service */}
      {inProgress && (
        <View style={styles.currentService}>
          <View style={styles.currentHeader}>
            <View style={styles.pulsingDot} />
            <Text style={styles.currentTitle}>Current Service</Text>
          </View>
          
          <View style={styles.currentCard}>
            <Text style={styles.currentName}>{inProgress.name}</Text>
            <Text style={styles.currentService}>{inProgress.service}</Text>
            
            <AnimatedButton
              title="Complete Service"
              variant="gradient"
              onPress={() => completeService(inProgress.id)}
              fullWidth
              size="md"
            />
          </View>
        </View>
      )}

      {/* Queue List */}
      <ScrollView style={styles.queueList} showsVerticalScrollIndicator={false}>
        <Text style={styles.queueTitle}>Waiting ({waitingQueue.length})</Text>
        {waitingQueue.map((customer, index) => renderQueueCard(customer, index))}
        
        {waitingQueue.length === 0 && (
          <View style={styles.emptyState}>
            <Ionicons name="people-outline" size={64} color={Colors.text.tertiary} />
            <Text style={styles.emptyTitle}>No Walk-Ins</Text>
            <Text style={styles.emptyText}>
              Add customers to the queue as they arrive
            </Text>
          </View>
        )}
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
    paddingTop: Spacing.md,
    paddingBottom: Spacing.sm,
  },
  headerTitle: {
    fontSize: Typography.fontSize['3xl'],
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text.primary,
  },
  headerSubtitle: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.tertiary,
    marginTop: Spacing.xs / 2,
  },
  addButton: {
    width: 56,
    height: 56,
    borderRadius: BorderRadius.xl,
    backgroundColor: Colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
  },
  summaryCard: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.md,
  },
  summaryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  summaryText: {
    gap: Spacing.xs / 2,
  },
  summaryValue: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text.primary,
  },
  summaryLabel: {
    fontSize: Typography.fontSize.xs,
    color: Colors.text.tertiary,
  },
  summaryDivider: {
    width: 1,
    height: 40,
    backgroundColor: Colors.border,
  },
  currentService: {
    marginHorizontal: Spacing.md,
    marginBottom: Spacing.md,
  },
  currentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  pulsingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.success,
  },
  currentTitle: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.primary,
  },
  currentCard: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    borderLeftWidth: 4,
    borderLeftColor: Colors.success,
  },
  currentName: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text.primary,
    marginBottom: Spacing.xs,
  },
  currentService: {
    fontSize: Typography.fontSize.base,
    color: Colors.text.secondary,
    marginBottom: Spacing.md,
  },
  queueList: {
    flex: 1,
    paddingHorizontal: Spacing.md,
  },
  queueTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.primary,
    marginBottom: Spacing.md,
  },
  queueCard: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    borderLeftWidth: 4,
    borderLeftColor: Colors.warning,
  },
  queueHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
    gap: Spacing.sm,
  },
  position: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.warning + '20',
    justifyContent: 'center',
    alignItems: 'center',
  },
  positionNumber: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.warning,
  },
  queueInfo: {
    flex: 1,
  },
  customerName: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text.primary,
    marginBottom: Spacing.xs / 2,
  },
  customerPhone: {
    fontSize: Typography.fontSize.sm,
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
  queueDetails: {
    gap: Spacing.xs,
    marginBottom: Spacing.md,
  },
  serviceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  serviceText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.secondary,
  },
  notesContainer: {
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
    color: Colors.info,
    lineHeight: Typography.lineHeight.relaxed * Typography.fontSize.sm,
  },
  queueActions: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
  },
  noShowButton: {
    backgroundColor: Colors.error + '10',
    borderColor: Colors.error,
  },
  startButton: {
    backgroundColor: Colors.accent + '10',
    borderColor: Colors.accent,
  },
  actionText: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.semibold,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing['3xl'],
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
  },
});
