import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { format, addDays } from 'date-fns';
import { Colors, Typography, Spacing, BorderRadius } from '../constants/theme';
import { Button } from '../components/Button';
import { mockServices, formatPrice, generateTimeSlots } from '../data/mockData';
import { BarberWithDistance, Service } from '../types';

export const BookingScreen = ({ route, navigation }: any) => {
  const { barber } = route.params as { barber: BarberWithDistance };
  
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [selectedServices, setSelectedServices] = useState<Service[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('');

  const services = mockServices;
  const dates = Array.from({ length: 7 }, (_, i) => addDays(new Date(), i));
  const timeSlots = generateTimeSlots(selectedDate);

  const toggleService = (service: Service) => {
    if (selectedServices.find(s => s.id === service.id)) {
      setSelectedServices(selectedServices.filter(s => s.id !== service.id));
    } else {
      setSelectedServices([...selectedServices, service]);
    }
  };

  const totalPrice = selectedServices.reduce((sum, s) => sum + s.priceCents, 0);
  const totalDuration = selectedServices.reduce((sum, s) => sum + s.durationMinutes, 0);
  const depositAmount = Math.floor(totalPrice * 0.2); // 20% deposit

  const canProceed = () => {
    switch (step) {
      case 1:
        return selectedServices.length > 0;
      case 2:
        return selectedDate !== null;
      case 3:
        return selectedTimeSlot !== '';
      case 4:
        return true;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (step < 4 && canProceed()) {
      setStep((step + 1) as 1 | 2 | 3 | 4);
    } else if (step === 4) {
      // Navigate to confirmation
      navigation.navigate('BookingConfirmation', {
        barber,
        services: selectedServices,
        date: selectedDate,
        timeSlot: selectedTimeSlot,
        totalPrice,
        depositAmount,
      });
    }
  };

  const renderServiceSelection = () => (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>Select Services</Text>
      <Text style={styles.stepSubtitle}>
        Choose one or more services for your appointment
      </Text>

      <View style={styles.servicesList}>
        {services.map((service) => {
          const isSelected = selectedServices.find(s => s.id === service.id);
          return (
            <TouchableOpacity
              key={service.id}
              style={[styles.serviceCard, isSelected && styles.serviceCardSelected]}
              onPress={() => toggleService(service)}
            >
              <View style={styles.serviceContent}>
                <View style={styles.serviceHeader}>
                  <Text style={styles.serviceName}>{service.name}</Text>
                  {isSelected && (
                    <Ionicons name="checkmark-circle" size={24} color={Colors.accent} />
                  )}
                </View>
                
                <Text style={styles.serviceDescription}>{service.description}</Text>
                
                <View style={styles.serviceFooter}>
                  <View style={styles.serviceDuration}>
                    <Ionicons name="time-outline" size={16} color={Colors.text.tertiary} />
                    <Text style={styles.serviceDurationText}>{service.durationMinutes} min</Text>
                  </View>
                  <Text style={styles.servicePrice}>
                    {formatPrice(service.priceCents, service.currency)}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );

  const renderDateSelection = () => (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>Choose Date</Text>
      <Text style={styles.stepSubtitle}>
        Select a date that works for you
      </Text>

      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.datesScroll}
      >
        {dates.map((date) => {
          const isSelected = format(date, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd');
          const isToday = format(date, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');
          
          return (
            <TouchableOpacity
              key={date.toISOString()}
              style={[styles.dateCard, isSelected && styles.dateCardSelected]}
              onPress={() => setSelectedDate(date)}
            >
              <Text style={[styles.dateDayName, isSelected && styles.dateTextSelected]}>
                {format(date, 'EEE')}
              </Text>
              <Text style={[styles.dateDay, isSelected && styles.dateTextSelected]}>
                {format(date, 'd')}
              </Text>
              {isToday && (
                <View style={styles.todayIndicator}>
                  <Text style={styles.todayText}>Today</Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <View style={styles.availabilityInfo}>
        <Ionicons name="information-circle-outline" size={20} color={Colors.info} />
        <Text style={styles.availabilityText}>
          Showing available slots based on your selected services ({totalDuration} min)
        </Text>
      </View>
    </View>
  );

  const renderTimeSelection = () => (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>Select Time</Text>
      <Text style={styles.stepSubtitle}>
        {format(selectedDate, 'EEEE, MMMM d, yyyy')}
      </Text>

      <View style={styles.timeSlotsGrid}>
        {timeSlots.map((slot) => {
          const slotTime = new Date(slot);
          const isSelected = selectedTimeSlot === slot;
          const isPast = slotTime < new Date();
          const isAvailable = !isPast && Math.random() > 0.3; // Mock availability
          
          if (isPast) return null;
          
          return (
            <TouchableOpacity
              key={slot}
              style={[
                styles.timeSlot,
                isSelected && styles.timeSlotSelected,
                !isAvailable && styles.timeSlotUnavailable,
              ]}
              onPress={() => isAvailable && setSelectedTimeSlot(slot)}
              disabled={!isAvailable}
            >
              <Text style={[
                styles.timeSlotText,
                isSelected && styles.timeSlotTextSelected,
                !isAvailable && styles.timeSlotTextUnavailable,
              ]}>
                {format(slotTime, 'h:mm a')}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );

  const renderPaymentReview = () => (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>Review & Pay</Text>
      <Text style={styles.stepSubtitle}>
        Confirm your booking details and pay deposit
      </Text>

      <View style={styles.reviewCard}>
        <Text style={styles.reviewSectionTitle}>Services</Text>
        {selectedServices.map((service) => (
          <View key={service.id} style={styles.reviewItem}>
            <Text style={styles.reviewItemName}>{service.name}</Text>
            <Text style={styles.reviewItemPrice}>
              {formatPrice(service.priceCents, service.currency)}
            </Text>
          </View>
        ))}
      </View>

      <View style={styles.reviewCard}>
        <Text style={styles.reviewSectionTitle}>Appointment</Text>
        <View style={styles.reviewItem}>
          <View style={styles.reviewItemLeft}>
            <Ionicons name="calendar-outline" size={20} color={Colors.text.tertiary} />
            <Text style={styles.reviewItemText}>
              {format(selectedDate, 'EEEE, MMMM d, yyyy')}
            </Text>
          </View>
        </View>
        <View style={styles.reviewItem}>
          <View style={styles.reviewItemLeft}>
            <Ionicons name="time-outline" size={20} color={Colors.text.tertiary} />
            <Text style={styles.reviewItemText}>
              {format(new Date(selectedTimeSlot), 'h:mm a')} ({totalDuration} min)
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.reviewCard}>
        <Text style={styles.reviewSectionTitle}>Pricing</Text>
        <View style={styles.reviewItem}>
          <Text style={styles.reviewItemText}>Subtotal</Text>
          <Text style={styles.reviewItemPrice}>{formatPrice(totalPrice, 'CAD')}</Text>
        </View>
        <View style={styles.reviewItem}>
          <Text style={styles.reviewItemText}>Deposit (20%)</Text>
          <Text style={styles.reviewItemPrice}>{formatPrice(depositAmount, 'CAD')}</Text>
        </View>
        <View style={[styles.reviewItem, styles.totalRow]}>
          <Text style={styles.totalLabel}>Due now</Text>
          <Text style={styles.totalPrice}>{formatPrice(depositAmount, 'CAD')}</Text>
        </View>
        <View style={styles.reviewItem}>
          <Text style={styles.reviewItemText}>Remaining at appointment</Text>
          <Text style={styles.reviewItemPrice}>{formatPrice(totalPrice - depositAmount, 'CAD')}</Text>
        </View>
      </View>

      <View style={styles.policyCard}>
        <Ionicons name="shield-checkmark-outline" size={24} color={Colors.accent} />
        <View style={styles.policyText}>
          <Text style={styles.policyTitle}>Cancellation Policy</Text>
          <Text style={styles.policyDescription}>
            Cancel or reschedule up to 24 hours before your appointment for a full refund. 
            Late cancellations or no-shows will forfeit the deposit.
          </Text>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => step > 1 ? setStep((step - 1) as 1 | 2 | 3 | 4) : navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={Colors.text.primary} />
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>Book Appointment</Text>
        
        <TouchableOpacity style={styles.closeButton} onPress={() => navigation.goBack()}>
          <Ionicons name="close" size={24} color={Colors.text.primary} />
        </TouchableOpacity>
      </View>

      {/* Progress Indicator */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${(step / 4) * 100}%` }]} />
        </View>
        <Text style={styles.progressText}>Step {step} of 4</Text>
      </View>

      {/* Content */}
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {step === 1 && renderServiceSelection()}
        {step === 2 && renderDateSelection()}
        {step === 3 && renderTimeSelection()}
        {step === 4 && renderPaymentReview()}
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        {selectedServices.length > 0 && (
          <View style={styles.footerSummary}>
            <View>
              <Text style={styles.footerTotal}>{formatPrice(totalPrice, 'CAD')}</Text>
              <Text style={styles.footerDetails}>
                {selectedServices.length} service{selectedServices.length > 1 ? 's' : ''} • {totalDuration} min
              </Text>
            </View>
          </View>
        )}
        
        <Button
          title={step === 4 ? 'Confirm & Pay' : 'Continue'}
          onPress={handleNext}
          disabled={!canProceed()}
          fullWidth
        />
      </View>
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
  closeButton: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.card,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text.primary,
  },
  progressContainer: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
  },
  progressBar: {
    height: 4,
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.sm,
    overflow: 'hidden',
    marginBottom: Spacing.sm,
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.accent,
  },
  progressText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.tertiary,
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
  },
  stepContent: {
    padding: Spacing.md,
  },
  stepTitle: {
    fontSize: Typography.fontSize['2xl'],
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text.primary,
    marginBottom: Spacing.xs,
  },
  stepSubtitle: {
    fontSize: Typography.fontSize.base,
    color: Colors.text.tertiary,
    marginBottom: Spacing.lg,
  },
  servicesList: {
    gap: Spacing.md,
  },
  serviceCard: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  serviceCardSelected: {
    borderColor: Colors.accent,
    backgroundColor: Colors.cardHover,
  },
  serviceContent: {
    gap: Spacing.sm,
  },
  serviceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  serviceName: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.primary,
  },
  serviceDescription: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.secondary,
    lineHeight: Typography.lineHeight.relaxed * Typography.fontSize.sm,
  },
  serviceFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  serviceDuration: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  serviceDurationText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.tertiary,
  },
  servicePrice: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.accent,
  },
  datesScroll: {
    gap: Spacing.md,
    paddingBottom: Spacing.md,
  },
  dateCard: {
    width: 70,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  dateCardSelected: {
    borderColor: Colors.accent,
    backgroundColor: Colors.cardHover,
  },
  dateDayName: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.tertiary,
    marginBottom: Spacing.xs,
  },
  dateDay: {
    fontSize: Typography.fontSize['2xl'],
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text.primary,
  },
  dateTextSelected: {
    color: Colors.accent,
  },
  todayIndicator: {
    marginTop: Spacing.xs,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    backgroundColor: Colors.accent,
    borderRadius: BorderRadius.sm,
  },
  todayText: {
    fontSize: Typography.fontSize.xs,
    color: Colors.primary,
    fontWeight: Typography.fontWeight.semibold,
  },
  availabilityInfo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.sm,
    backgroundColor: Colors.card,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    marginTop: Spacing.md,
  },
  availabilityText: {
    flex: 1,
    fontSize: Typography.fontSize.sm,
    color: Colors.text.secondary,
    lineHeight: Typography.lineHeight.relaxed * Typography.fontSize.sm,
  },
  timeSlotsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  timeSlot: {
    width: '31%',
    paddingVertical: Spacing.md,
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  timeSlotSelected: {
    borderColor: Colors.accent,
    backgroundColor: Colors.cardHover,
  },
  timeSlotUnavailable: {
    opacity: 0.4,
  },
  timeSlotText: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.text.primary,
  },
  timeSlotTextSelected: {
    color: Colors.accent,
    fontWeight: Typography.fontWeight.semibold,
  },
  timeSlotTextUnavailable: {
    color: Colors.text.tertiary,
  },
  reviewCard: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  reviewSectionTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.primary,
    marginBottom: Spacing.md,
  },
  reviewItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
  },
  reviewItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  reviewItemName: {
    fontSize: Typography.fontSize.base,
    color: Colors.text.secondary,
  },
  reviewItemText: {
    fontSize: Typography.fontSize.base,
    color: Colors.text.secondary,
  },
  reviewItemPrice: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.primary,
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    marginTop: Spacing.sm,
    paddingTop: Spacing.md,
  },
  totalLabel: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.primary,
  },
  totalPrice: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.accent,
  },
  policyCard: {
    flexDirection: 'row',
    gap: Spacing.md,
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  policyText: {
    flex: 1,
  },
  policyTitle: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.primary,
    marginBottom: Spacing.xs,
  },
  policyDescription: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.secondary,
    lineHeight: Typography.lineHeight.relaxed * Typography.fontSize.sm,
  },
  footer: {
    padding: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    gap: Spacing.md,
  },
  footerSummary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footerTotal: {
    fontSize: Typography.fontSize['2xl'],
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text.primary,
  },
  footerDetails: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.tertiary,
  },
});
