/**
 * Financial Dashboard
 * Track revenue, deposits, no-shows, and commission
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
import { format, startOfWeek, addDays } from 'date-fns';
import { Colors, Typography, Spacing, BorderRadius } from '../constants/theme';
import { formatPrice } from '../data/mockData';

const { width } = Dimensions.get('window');

interface Transaction {
  id: string;
  type: 'deposit' | 'payment' | 'no_show_fee' | 'refund' | 'tip';
  clientName: string;
  service: string;
  amount: number;
  date: Date;
  status: 'pending' | 'completed' | 'refunded';
  appointmentId: string;
}

interface PayoutSummary {
  totalRevenue: number;
  depositsCollected: number;
  noShowFees: number;
  refundedAmount: number;
  platformFee: number;
  netPayout: number;
  chairRent?: number;
  commission?: number;
}

export const FinancialDashboardScreen = ({ navigation }: any) => {
  const [period, setPeriod] = useState<'day' | 'week' | 'month'>('week');

  const transactions: Transaction[] = [
    {
      id: 't1',
      type: 'deposit',
      clientName: 'James Wilson',
      service: 'Signature Fade',
      amount: 900,
      date: new Date(2026, 1, 15),
      status: 'completed',
      appointmentId: 'a1',
    },
    {
      id: 't2',
      type: 'payment',
      clientName: 'David Chen',
      service: 'Hot Towel Shave',
      amount: 5500,
      date: new Date(2026, 1, 16),
      status: 'completed',
      appointmentId: 'a2',
    },
    {
      id: 't3',
      type: 'no_show_fee',
      clientName: 'John Doe',
      service: 'Signature Fade',
      amount: 900,
      date: new Date(2026, 1, 16),
      status: 'completed',
      appointmentId: 'a3',
    },
    {
      id: 't4',
      type: 'tip',
      clientName: 'Michael Brown',
      service: 'Beard Trim',
      amount: 1000,
      date: new Date(2026, 1, 17),
      status: 'completed',
      appointmentId: 'a4',
    },
  ];

  const payout: PayoutSummary = {
    totalRevenue: 245000, // $2,450
    depositsCollected: 18000, // $180
    noShowFees: 2700, // $27
    refundedAmount: 4500, // $45
    platformFee: 24500, // $245 (10%)
    netPayout: 220500, // $2,205
    chairRent: 50000, // $500/week for chair renters
    commission: 61250, // 25% for employees
  };

  const weekStart = startOfWeek(new Date());
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  const dailyRevenue = [450, 650, 520, 750, 620, 800, 510].map(v => v * 100);

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'deposit':
        return 'shield-checkmark';
      case 'payment':
        return 'card';
      case 'no_show_fee':
        return 'alert-circle';
      case 'refund':
        return 'return-down-back';
      case 'tip':
        return 'gift';
      default:
        return 'cash';
    }
  };

  const getTransactionColor = (type: string) => {
    switch (type) {
      case 'deposit':
        return Colors.info;
      case 'payment':
        return Colors.success;
      case 'no_show_fee':
        return Colors.warning;
      case 'refund':
        return Colors.error;
      case 'tip':
        return Colors.accent;
      default:
        return Colors.text.primary;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Financials</Text>
        
        <View style={styles.periodSelector}>
          {(['day', 'week', 'month'] as const).map((p) => (
            <TouchableOpacity
              key={p}
              style={[styles.periodButton, period === p && styles.periodButtonActive]}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setPeriod(p);
              }}
            >
              <Text style={[
                styles.periodText,
                period === p && styles.periodTextActive,
              ]}>
                {p.charAt(0).toUpperCase() + p.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Main Revenue Card */}
        <Animated.View entering={FadeInDown.delay(100).springify()}>
          <View style={styles.revenueCard}>
            <View style={styles.revenueHeader}>
              <View>
                <Text style={styles.revenueLabel}>Net Payout</Text>
                <Text style={styles.revenueAmount}>
                  {formatPrice(payout.netPayout, 'CAD')}
                </Text>
              </View>
              <TouchableOpacity style={styles.exportButton}>
                <Ionicons name="download-outline" size={20} color={Colors.accent} />
              </TouchableOpacity>
            </View>
            
            <View style={styles.revenueMeta}>
              <View style={styles.changeIndicator}>
                <Ionicons name="trending-up" size={16} color={Colors.success} />
                <Text style={styles.changeText}>+12.5% vs last {period}</Text>
              </View>
            </View>
          </View>
        </Animated.View>

        {/* Revenue Breakdown */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Revenue Breakdown</Text>
          
          <View style={styles.breakdownCard}>
            <View style={styles.breakdownRow}>
              <View style={styles.breakdownLeft}>
                <View style={[styles.breakdownDot, { backgroundColor: Colors.success }]} />
                <Text style={styles.breakdownLabel}>Total Revenue</Text>
              </View>
              <Text style={styles.breakdownAmount}>
                {formatPrice(payout.totalRevenue, 'CAD')}
              </Text>
            </View>

            <View style={styles.breakdownRow}>
              <View style={styles.breakdownLeft}>
                <View style={[styles.breakdownDot, { backgroundColor: Colors.info }]} />
                <Text style={styles.breakdownLabel}>Deposits Collected</Text>
              </View>
              <Text style={styles.breakdownAmount}>
                {formatPrice(payout.depositsCollected, 'CAD')}
              </Text>
            </View>

            <View style={styles.breakdownRow}>
              <View style={styles.breakdownLeft}>
                <View style={[styles.breakdownDot, { backgroundColor: Colors.warning }]} />
                <Text style={styles.breakdownLabel}>No-Show Fees</Text>
              </View>
              <Text style={styles.breakdownAmount}>
                {formatPrice(payout.noShowFees, 'CAD')}
              </Text>
            </View>

            <View style={styles.breakdownRow}>
              <View style={styles.breakdownLeft}>
                <View style={[styles.breakdownDot, { backgroundColor: Colors.error }]} />
                <Text style={styles.breakdownLabel}>Refunds</Text>
              </View>
              <Text style={[styles.breakdownAmount, { color: Colors.error }]}>
                -{formatPrice(payout.refundedAmount, 'CAD')}
              </Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.breakdownRow}>
              <Text style={styles.breakdownLabelBold}>Platform Fee (10%)</Text>
              <Text style={[styles.breakdownAmount, { color: Colors.text.tertiary }]}>
                -{formatPrice(payout.platformFee, 'CAD')}
              </Text>
            </View>

            {payout.chairRent && (
              <View style={styles.breakdownRow}>
                <Text style={styles.breakdownLabelBold}>Chair Rent</Text>
                <Text style={[styles.breakdownAmount, { color: Colors.text.tertiary }]}>
                  -{formatPrice(payout.chairRent, 'CAD')}
                </Text>
              </View>
            )}

            <View style={[styles.breakdownRow, styles.totalRow]}>
              <Text style={styles.totalLabel}>Net Payout</Text>
              <Text style={styles.totalAmount}>
                {formatPrice(payout.netPayout, 'CAD')}
              </Text>
            </View>
          </View>
        </View>

        {/* Week Chart */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Daily Revenue</Text>
          
          <View style={styles.chartCard}>
            <View style={styles.chartBars}>
              {dailyRevenue.map((amount, index) => {
                const maxRevenue = Math.max(...dailyRevenue);
                const heightPercentage = (amount / maxRevenue) * 100;
                
                return (
                  <View key={index} style={styles.barContainer}>
                    <View style={styles.barWrapper}>
                      <View style={[
                        styles.bar,
                        { height: `${heightPercentage}%` }
                      ]} />
                    </View>
                    <Text style={styles.barLabel}>
                      {format(weekDays[index], 'EEE')}
                    </Text>
                    <Text style={styles.barValue}>
                      ${Math.floor(amount / 100)}
                    </Text>
                  </View>
                );
              })}
            </View>
          </View>
        </View>

        {/* Recent Transactions */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Transactions</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>

          {transactions.map((transaction) => (
            <View key={transaction.id} style={styles.transactionCard}>
              <View style={[
                styles.transactionIcon,
                { backgroundColor: getTransactionColor(transaction.type) + '20' }
              ]}>
                <Ionicons 
                  name={getTransactionIcon(transaction.type) as any}
                  size={20}
                  color={getTransactionColor(transaction.type)}
                />
              </View>

              <View style={styles.transactionInfo}>
                <Text style={styles.transactionClient}>{transaction.clientName}</Text>
                <Text style={styles.transactionService}>{transaction.service}</Text>
                <Text style={styles.transactionDate}>
                  {format(transaction.date, 'MMM d, h:mm a')}
                </Text>
              </View>

              <View style={styles.transactionAmount}>
                <Text style={[
                  styles.transactionValue,
                  { color: getTransactionColor(transaction.type) }
                ]}>
                  {transaction.type === 'refund' ? '-' : '+'}
                  {formatPrice(transaction.amount, 'CAD')}
                </Text>
                <View style={[
                  styles.transactionStatus,
                  { backgroundColor: Colors.success + '20' }
                ]}>
                  <Text style={[styles.transactionStatusText, { color: Colors.success }]}>
                    {transaction.status}
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* No-Show Protection Info */}
        <View style={styles.infoCard}>
          <Ionicons name="shield-checkmark-outline" size={32} color={Colors.accent} />
          <View style={styles.infoContent}>
            <Text style={styles.infoTitle}>Deposit Protection Active</Text>
            <Text style={styles.infoText}>
              ${(payout.depositsCollected / 100).toFixed(0)} in deposits secured this week. 
              No-show fees collected: ${(payout.noShowFees / 100).toFixed(0)}
            </Text>
          </View>
        </View>
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
  periodSelector: {
    flexDirection: 'row',
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.md,
    padding: 2,
  },
  periodButton: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
  },
  periodButtonActive: {
    backgroundColor: Colors.backgroundSecondary,
  },
  periodText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.tertiary,
    fontWeight: Typography.fontWeight.medium,
  },
  periodTextActive: {
    color: Colors.accent,
    fontWeight: Typography.fontWeight.semibold,
  },
  content: {
    flex: 1,
  },
  revenueCard: {
    marginHorizontal: Spacing.md,
    padding: Spacing.lg,
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.xl,
    marginBottom: Spacing.md,
  },
  revenueHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.sm,
  },
  revenueLabel: {
    fontSize: Typography.fontSize.base,
    color: Colors.text.tertiary,
    marginBottom: Spacing.xs,
  },
  revenueAmount: {
    fontSize: Typography.fontSize['4xl'],
    fontWeight: Typography.fontWeight.bold,
    color: Colors.accent,
  },
  exportButton: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.backgroundSecondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  revenueMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  changeIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    backgroundColor: Colors.success + '20',
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
  },
  changeText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.success,
    fontWeight: Typography.fontWeight.semibold,
  },
  section: {
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text.primary,
  },
  seeAllText: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.accent,
  },
  breakdownCard: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
  },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
  },
  breakdownLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  breakdownDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  breakdownLabel: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.secondary,
  },
  breakdownLabelBold: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.primary,
    fontWeight: Typography.fontWeight.semibold,
  },
  breakdownAmount: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.primary,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: Spacing.sm,
  },
  totalRow: {
    backgroundColor: Colors.backgroundSecondary,
    marginHorizontal: -Spacing.md,
    marginBottom: -Spacing.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    borderBottomLeftRadius: BorderRadius.lg,
    borderBottomRightRadius: BorderRadius.lg,
  },
  totalLabel: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text.primary,
  },
  totalAmount: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.accent,
  },
  chartCard: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
  },
  chartBars: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 150,
  },
  barContainer: {
    flex: 1,
    alignItems: 'center',
  },
  barWrapper: {
    width: '100%',
    height: 120,
    justifyContent: 'flex-end',
    paddingHorizontal: 2,
  },
  bar: {
    width: '100%',
    backgroundColor: Colors.accent,
    borderRadius: BorderRadius.sm,
  },
  barLabel: {
    fontSize: Typography.fontSize.xs,
    color: Colors.text.tertiary,
    marginTop: Spacing.xs,
  },
  barValue: {
    fontSize: Typography.fontSize.xs,
    color: Colors.text.secondary,
    fontWeight: Typography.fontWeight.semibold,
  },
  transactionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    gap: Spacing.sm,
  },
  transactionIcon: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  transactionInfo: {
    flex: 1,
  },
  transactionClient: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.primary,
    marginBottom: Spacing.xs / 2,
  },
  transactionService: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.secondary,
    marginBottom: Spacing.xs / 2,
  },
  transactionDate: {
    fontSize: Typography.fontSize.xs,
    color: Colors.text.tertiary,
  },
  transactionAmount: {
    alignItems: 'flex-end',
  },
  transactionValue: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.bold,
    marginBottom: Spacing.xs / 2,
  },
  transactionStatus: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
  },
  transactionStatusText: {
    fontSize: Typography.fontSize.xs,
    fontWeight: Typography.fontWeight.semibold,
  },
  infoCard: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginHorizontal: Spacing.md,
    padding: Spacing.md,
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.accent + '30',
    marginBottom: Spacing.xl,
  },
  infoContent: {
    flex: 1,
  },
  infoTitle: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.primary,
    marginBottom: Spacing.xs,
  },
  infoText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.secondary,
    lineHeight: Typography.lineHeight.relaxed * Typography.fontSize.sm,
  },
});
