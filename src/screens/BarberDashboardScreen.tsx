import React from 'react';
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
import { Ionicons } from '@expo/vector-icons';
import { format, startOfWeek, addDays } from 'date-fns';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../constants/theme';
import { formatPrice } from '../data/mockData';

const { width } = Dimensions.get('window');

export const BarberDashboardScreen = ({ navigation }: any) => {
  const today = new Date();
  const weekStart = startOfWeek(today);
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  // Mock analytics data
  const analytics = {
    todayRevenue: 38500,
    todayAppointments: 8,
    weekRevenue: 245000,
    monthRevenue: 1050000,
    averageRating: 4.9,
    repeatClientRate: 78,
    upcomingToday: 5,
    completedToday: 3,
    revenueChange: 12.5,
    appointmentsChange: 8.2,
  };

  const upcomingAppointments = [
    {
      id: '1',
      clientName: 'James Wilson',
      service: 'Signature Fade',
      time: '2:00 PM',
      duration: 45,
      amount: 4500,
      status: 'confirmed',
    },
    {
      id: '2',
      clientName: 'David Chen',
      service: 'Beard Trim & Hot Towel Shave',
      time: '3:00 PM',
      duration: 70,
      amount: 8500,
      status: 'confirmed',
    },
    {
      id: '3',
      clientName: 'Michael Brown',
      service: 'Kids Cut',
      time: '4:30 PM',
      duration: 30,
      amount: 3500,
      status: 'pending',
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Good afternoon,</Text>
          <Text style={styles.name}>Marcus</Text>
        </View>
        
        <TouchableOpacity style={styles.settingsButton}>
          <Ionicons name="settings-outline" size={24} color={Colors.text.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Quick Stats */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Today's Overview</Text>
          
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <View style={styles.statHeader}>
                <Ionicons name="cash-outline" size={24} color={Colors.accent} />
                <View style={styles.changePositive}>
                  <Ionicons name="trending-up" size={12} color={Colors.success} />
                  <Text style={styles.changeText}>+{analytics.revenueChange}%</Text>
                </View>
              </View>
              <Text style={styles.statValue}>{formatPrice(analytics.todayRevenue, 'CAD')}</Text>
              <Text style={styles.statLabel}>Today's Revenue</Text>
            </View>

            <View style={styles.statCard}>
              <View style={styles.statHeader}>
                <Ionicons name="calendar-outline" size={24} color={Colors.info} />
                <View style={styles.changePositive}>
                  <Ionicons name="trending-up" size={12} color={Colors.success} />
                  <Text style={styles.changeText}>+{analytics.appointmentsChange}%</Text>
                </View>
              </View>
              <Text style={styles.statValue}>{analytics.todayAppointments}</Text>
              <Text style={styles.statLabel}>Appointments</Text>
            </View>

            <View style={styles.statCard}>
              <View style={styles.statHeader}>
                <Ionicons name="star-outline" size={24} color={Colors.accent} />
              </View>
              <Text style={styles.statValue}>{analytics.averageRating}</Text>
              <Text style={styles.statLabel}>Average Rating</Text>
            </View>

            <View style={styles.statCard}>
              <View style={styles.statHeader}>
                <Ionicons name="repeat-outline" size={24} color={Colors.success} />
              </View>
              <Text style={styles.statValue}>{analytics.repeatClientRate}%</Text>
              <Text style={styles.statLabel}>Repeat Clients</Text>
            </View>
          </View>
        </View>

        {/* Week Revenue Chart */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Week Performance</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllLink}>See All</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.chartCard}>
            <View style={styles.chartHeader}>
              <Text style={styles.chartValue}>{formatPrice(analytics.weekRevenue, 'CAD')}</Text>
              <Text style={styles.chartLabel}>This Week</Text>
            </View>

            <View style={styles.chartBars}>
              {[45, 78, 62, 85, 72, 90, 58].map((percentage, index) => (
                <View key={index} style={styles.barContainer}>
                  <View style={styles.barWrapper}>
                    <View style={[styles.bar, { height: `${percentage}%` }]} />
                  </View>
                  <Text style={styles.barLabel}>
                    {format(weekDays[index], 'EEE')}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Upcoming Appointments */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Upcoming Today</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Calendar')}>
              <Text style={styles.seeAllLink}>View Calendar</Text>
            </TouchableOpacity>
          </View>

          {upcomingAppointments.map((appointment) => (
            <TouchableOpacity key={appointment.id} style={styles.appointmentCard}>
              <View style={styles.appointmentTime}>
                <Text style={styles.appointmentTimeText}>{appointment.time}</Text>
                <Text style={styles.appointmentDuration}>{appointment.duration} min</Text>
              </View>

              <View style={styles.appointmentDetails}>
                <View style={styles.appointmentHeader}>
                  <Text style={styles.clientName}>{appointment.clientName}</Text>
                  <View style={[
                    styles.statusBadge,
                    appointment.status === 'confirmed' 
                      ? styles.statusConfirmed 
                      : styles.statusPending
                  ]}>
                    <Text style={styles.statusText}>
                      {appointment.status === 'confirmed' ? 'Confirmed' : 'Pending'}
                    </Text>
                  </View>
                </View>

                <Text style={styles.serviceText}>{appointment.service}</Text>
                
                <View style={styles.appointmentFooter}>
                  <Text style={styles.amountText}>
                    {formatPrice(appointment.amount, 'CAD')}
                  </Text>
                  
                  <View style={styles.appointmentActions}>
                    <TouchableOpacity style={styles.iconButton}>
                      <Ionicons name="chatbubble-outline" size={18} color={Colors.text.primary} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.iconButton}>
                      <Ionicons name="checkmark-circle-outline" size={18} color={Colors.success} />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          
          <View style={styles.actionsGrid}>
            <TouchableOpacity style={styles.actionCard}>
              <View style={[styles.actionIcon, { backgroundColor: Colors.info + '20' }]}>
                <Ionicons name="calendar-outline" size={24} color={Colors.info} />
              </View>
              <Text style={styles.actionText}>Manage Schedule</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionCard}>
              <View style={[styles.actionIcon, { backgroundColor: Colors.success + '20' }]}>
                <Ionicons name="people-outline" size={24} color={Colors.success} />
              </View>
              <Text style={styles.actionText}>Client List</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionCard}>
              <View style={[styles.actionIcon, { backgroundColor: Colors.accent + '20' }]}>
                <Ionicons name="stats-chart-outline" size={24} color={Colors.accent} />
              </View>
              <Text style={styles.actionText}>Analytics</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionCard}>
              <View style={[styles.actionIcon, { backgroundColor: Colors.warning + '20' }]}>
                <Ionicons name="pricetag-outline" size={24} color={Colors.warning} />
              </View>
              <Text style={styles.actionText}>Services</Text>
            </TouchableOpacity>
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
  greeting: {
    fontSize: Typography.fontSize.base,
    color: Colors.text.tertiary,
    marginBottom: Spacing.xs / 2,
  },
  name: {
    fontSize: Typography.fontSize['3xl'],
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text.primary,
  },
  settingsButton: {
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
  seeAllLink: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.accent,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  statCard: {
    width: (width - Spacing.md * 2 - Spacing.sm) / 2,
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    ...Shadows.sm,
  },
  statHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  changePositive: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs / 2,
    backgroundColor: Colors.success + '20',
    paddingHorizontal: Spacing.xs,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
  },
  changeText: {
    fontSize: Typography.fontSize.xs,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.success,
  },
  statValue: {
    fontSize: Typography.fontSize['2xl'],
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text.primary,
    marginBottom: Spacing.xs / 2,
  },
  statLabel: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.tertiary,
  },
  chartCard: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    ...Shadows.sm,
  },
  chartHeader: {
    marginBottom: Spacing.lg,
  },
  chartValue: {
    fontSize: Typography.fontSize['2xl'],
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text.primary,
    marginBottom: Spacing.xs / 2,
  },
  chartLabel: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.tertiary,
  },
  chartBars: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 120,
  },
  barContainer: {
    flex: 1,
    alignItems: 'center',
  },
  barWrapper: {
    width: '100%',
    height: 100,
    justifyContent: 'flex-end',
    paddingHorizontal: Spacing.xs / 2,
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
  appointmentCard: {
    flexDirection: 'row',
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    ...Shadows.sm,
  },
  appointmentTime: {
    width: 80,
    alignItems: 'flex-start',
    paddingRight: Spacing.sm,
    borderRightWidth: 2,
    borderRightColor: Colors.accent,
  },
  appointmentTimeText: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text.primary,
    marginBottom: Spacing.xs / 2,
  },
  appointmentDuration: {
    fontSize: Typography.fontSize.xs,
    color: Colors.text.tertiary,
  },
  appointmentDetails: {
    flex: 1,
    paddingLeft: Spacing.md,
  },
  appointmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  clientName: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.primary,
  },
  statusBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs / 2,
    borderRadius: BorderRadius.sm,
  },
  statusConfirmed: {
    backgroundColor: Colors.success + '20',
  },
  statusPending: {
    backgroundColor: Colors.warning + '20',
  },
  statusText: {
    fontSize: Typography.fontSize.xs,
    fontWeight: Typography.fontWeight.semibold,
  },
  serviceText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.secondary,
    marginBottom: Spacing.sm,
  },
  appointmentFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  amountText: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.accent,
  },
  appointmentActions: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  iconButton: {
    width: 32,
    height: 32,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.backgroundSecondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  actionCard: {
    width: (width - Spacing.md * 2 - Spacing.sm) / 2,
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    alignItems: 'center',
    ...Shadows.sm,
  },
  actionIcon: {
    width: 56,
    height: 56,
    borderRadius: BorderRadius.xl,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  actionText: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.text.primary,
    textAlign: 'center',
  },
});
