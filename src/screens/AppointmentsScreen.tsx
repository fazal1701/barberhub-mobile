import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../constants/theme';
import { Button } from '../components/Button';
import { mockAppointments, formatPrice } from '../data/mockData';
import { Appointment } from '../types';

export const AppointmentsScreen = ({ navigation }: any) => {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');

  const upcomingAppointments = mockAppointments.filter(
    a => a.status === 'confirmed' || a.status === 'checked_in'
  );
  const pastAppointments = mockAppointments.filter(
    a => a.status === 'completed' || a.status === 'canceled'
  );

  const renderAppointmentCard = (appointment: Appointment) => {
    const isUpcoming = activeTab === 'upcoming';
    const appointmentDate = new Date(appointment.startAt);
    
    return (
      <TouchableOpacity
        key={appointment.id}
        style={styles.appointmentCard}
        onPress={() => navigation.navigate('AppointmentDetails', { appointment })}
      >
        <View style={styles.appointmentHeader}>
          <Image
            source={{ uri: appointment.barber?.portfolioCoverUrl }}
            style={styles.appointmentImage}
          />
          
          <View style={styles.appointmentInfo}>
            <Text style={styles.appointmentBarber}>
              {appointment.barber?.user.displayName}
            </Text>
            <Text style={styles.appointmentShop}>
              {appointment.shop?.name}
            </Text>
            <View style={styles.appointmentRating}>
              <Ionicons name="star" size={14} color={Colors.accent} />
              <Text style={styles.ratingText}>
                {appointment.barber?.ratingAvg}
              </Text>
            </View>
          </View>

          <View style={styles.appointmentRight}>
            <Text style={styles.appointmentPrice}>
              {formatPrice(appointment.quotedTotalCents, 'CAD')}
            </Text>
            {isUpcoming && (
              <View style={[
                styles.statusBadge,
                { backgroundColor: Colors.success + '20' }
              ]}>
                <Text style={[styles.statusText, { color: Colors.success }]}>
                  Confirmed
                </Text>
              </View>
            )}
          </View>
        </View>

        <View style={styles.appointmentDetails}>
          <View style={styles.detailRow}>
            <Ionicons name="calendar-outline" size={18} color={Colors.text.tertiary} />
            <Text style={styles.detailText}>
              {format(appointmentDate, 'EEEE, MMMM d, yyyy')}
            </Text>
          </View>
          
          <View style={styles.detailRow}>
            <Ionicons name="time-outline" size={18} color={Colors.text.tertiary} />
            <Text style={styles.detailText}>
              {format(appointmentDate, 'h:mm a')}
            </Text>
          </View>

          {appointment.location && (
            <View style={styles.detailRow}>
              <Ionicons name="location-outline" size={18} color={Colors.text.tertiary} />
              <Text style={styles.detailText}>
                {appointment.location.addressLine1}, {appointment.location.city}
              </Text>
            </View>
          )}
        </View>

        <View style={styles.servicesRow}>
          {appointment.services?.slice(0, 2).map((service, index) => (
            <View key={service.id} style={styles.serviceTag}>
              <Text style={styles.serviceTagText}>{service.name}</Text>
            </View>
          ))}
          {appointment.services && appointment.services.length > 2 && (
            <View style={styles.serviceTag}>
              <Text style={styles.serviceTagText}>
                +{appointment.services.length - 2} more
              </Text>
            </View>
          )}
        </View>

        {isUpcoming && (
          <View style={styles.appointmentActions}>
            <Button
              title="Cancel"
              variant="outline"
              size="sm"
              onPress={() => {}}
              style={styles.actionButton}
            />
            <Button
              title="Reschedule"
              variant="secondary"
              size="sm"
              onPress={() => {}}
              style={styles.actionButton}
            />
            <Button
              title="Get Directions"
              variant="primary"
              size="sm"
              onPress={() => {}}
              style={styles.actionButton}
            />
          </View>
        )}

        {!isUpcoming && appointment.status === 'completed' && (
          <View style={styles.appointmentActions}>
            <Button
              title="Leave Review"
              variant="primary"
              size="sm"
              onPress={() => {}}
              fullWidth
            />
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Appointments</Text>
        <TouchableOpacity style={styles.notificationButton}>
          <Ionicons name="notifications-outline" size={24} color={Colors.text.primary} />
          <View style={styles.notificationBadge} />
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'upcoming' && styles.tabActive]}
          onPress={() => setActiveTab('upcoming')}
        >
          <Text style={[styles.tabText, activeTab === 'upcoming' && styles.tabTextActive]}>
            Upcoming
          </Text>
          {upcomingAppointments.length > 0 && (
            <View style={styles.tabBadge}>
              <Text style={styles.tabBadgeText}>{upcomingAppointments.length}</Text>
            </View>
          )}
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, activeTab === 'past' && styles.tabActive]}
          onPress={() => setActiveTab('past')}
        >
          <Text style={[styles.tabText, activeTab === 'past' && styles.tabTextActive]}>
            Past
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {activeTab === 'upcoming' && upcomingAppointments.length === 0 && (
          <View style={styles.emptyState}>
            <Ionicons name="calendar-outline" size={64} color={Colors.text.tertiary} />
            <Text style={styles.emptyTitle}>No upcoming appointments</Text>
            <Text style={styles.emptyText}>
              Book your next appointment to see it here
            </Text>
            <Button
              title="Find a Barber"
              onPress={() => navigation.navigate('Discovery')}
              style={styles.emptyButton}
            />
          </View>
        )}

        {activeTab === 'upcoming' && upcomingAppointments.map(renderAppointmentCard)}
        {activeTab === 'past' && pastAppointments.map(renderAppointmentCard)}
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
  tabs: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.md,
    gap: Spacing.sm,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.xs,
    paddingVertical: Spacing.sm,
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
  tabBadge: {
    backgroundColor: Colors.accent,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.full,
  },
  tabBadgeText: {
    fontSize: Typography.fontSize.xs,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.primary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.md,
  },
  appointmentCard: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.xl,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    ...Shadows.md,
  },
  appointmentHeader: {
    flexDirection: 'row',
    marginBottom: Spacing.md,
  },
  appointmentImage: {
    width: 60,
    height: 60,
    borderRadius: BorderRadius.lg,
    marginRight: Spacing.sm,
  },
  appointmentInfo: {
    flex: 1,
  },
  appointmentBarber: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text.primary,
    marginBottom: Spacing.xs / 2,
  },
  appointmentShop: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.tertiary,
    marginBottom: Spacing.xs,
  },
  appointmentRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs / 2,
  },
  ratingText: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.primary,
  },
  appointmentRight: {
    alignItems: 'flex-end',
  },
  appointmentPrice: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.accent,
    marginBottom: Spacing.xs,
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
  appointmentDetails: {
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  detailText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.secondary,
  },
  servicesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  serviceTag: {
    backgroundColor: Colors.backgroundSecondary,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  serviceTagText: {
    fontSize: Typography.fontSize.xs,
    color: Colors.text.secondary,
    fontWeight: Typography.fontWeight.medium,
  },
  appointmentActions: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  actionButton: {
    flex: 1,
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
    marginBottom: Spacing.lg,
  },
  emptyButton: {
    minWidth: 200,
  },
});
