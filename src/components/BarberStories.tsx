/**
 * Stories-style Barber Showcase
 * Instagram/Snapchat inspired feature for Gen Z engagement
 */

import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius } from '../constants/theme';
import { BarberWithDistance } from '../types';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface BarberStoriesProps {
  barbers: BarberWithDistance[];
  onStoryPress: (barber: BarberWithDistance) => void;
  onViewProfile: (barber: BarberWithDistance) => void;
}

export const BarberStories: React.FC<BarberStoriesProps> = ({
  barbers,
  onStoryPress,
  onViewProfile,
}) => {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.storiesContainer}
    >
      {barbers.map((barber) => (
        <StoryItem
          key={barber.barberId}
          barber={barber}
          onPress={() => onStoryPress(barber)}
        />
      ))}
    </ScrollView>
  );
};

interface StoryItemProps {
  barber: BarberWithDistance;
  onPress: () => void;
}

const StoryItem: React.FC<StoryItemProps> = ({ barber, onPress }) => {
  const scale = useSharedValue(1);

  const handlePressIn = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    scale.value = withSpring(0.9);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={[styles.storyItem, animatedStyle]}>
      <TouchableOpacity
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={1}
      >
        <LinearGradient
          colors={['#D4AF37', '#F4C542', '#D4AF37']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.storyGradient}
        >
          <View style={styles.storyImageContainer}>
            <Image
              source={{ uri: barber.user.avatarUrl }}
              style={styles.storyImage}
            />
          </View>
        </LinearGradient>
        <Text style={styles.storyName} numberOfLines={1}>
          {barber.user.displayName.split(' ')[0]}
        </Text>
        {barber.verificationStatus === 'verified' && (
          <View style={styles.verifiedBadge}>
            <Ionicons name="checkmark-circle" size={16} color={Colors.accent} />
          </View>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};

interface StoryViewerProps {
  barber: BarberWithDistance;
  onClose: () => void;
  onViewProfile: () => void;
}

export const StoryViewer: React.FC<StoryViewerProps> = ({
  barber,
  onClose,
  onViewProfile,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const progress = useSharedValue(0);
  const opacity = useSharedValue(1);

  const images = barber.portfolioImages || [];

  const handleNext = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (currentIndex < images.length - 1) {
      setCurrentIndex(currentIndex + 1);
      progress.value = 0;
    } else {
      onClose();
    }
  };

  const handlePrevious = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      progress.value = 0;
    }
  };

  const tap = Gesture.Tap()
    .onEnd((event) => {
      runOnJS(Haptics.impactAsync)(Haptics.ImpactFeedbackStyle.Light);
      if (event.x > SCREEN_WIDTH / 2) {
        runOnJS(handleNext)();
      } else {
        runOnJS(handlePrevious)();
      }
    });

  const longPress = Gesture.LongPress()
    .minDuration(200)
    .onStart(() => {
      opacity.value = withTiming(0.5, { duration: 200 });
    })
    .onEnd(() => {
      opacity.value = withTiming(1, { duration: 200 });
    });

  const composed = Gesture.Race(longPress, tap);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <View style={styles.storyViewer}>
      <GestureDetector gesture={composed}>
        <Animated.View style={[styles.storyContent, animatedStyle]}>
          <Image
            source={{ uri: images[currentIndex] }}
            style={styles.storyFullImage}
            resizeMode="cover"
          />
          
          <LinearGradient
            colors={['rgba(0,0,0,0.6)', 'transparent', 'rgba(0,0,0,0.8)']}
            style={styles.storyOverlay}
          >
            {/* Progress Bars */}
            <View style={styles.progressContainer}>
              {images.map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.progressBar,
                    index < currentIndex && styles.progressBarComplete,
                  ]}
                />
              ))}
            </View>

            {/* Header */}
            <View style={styles.storyHeader}>
              <View style={styles.storyHeaderLeft}>
                <Image
                  source={{ uri: barber.user.avatarUrl }}
                  style={styles.storyHeaderAvatar}
                />
                <View>
                  <Text style={styles.storyHeaderName}>
                    {barber.user.displayName}
                  </Text>
                  <View style={styles.storyHeaderInfo}>
                    <Ionicons name="star" size={12} color={Colors.accent} />
                    <Text style={styles.storyHeaderRating}>
                      {barber.ratingAvg}
                    </Text>
                    <Text style={styles.storyHeaderSeparator}>·</Text>
                    <Text style={styles.storyHeaderDistance}>
                      {barber.distance?.toFixed(1)} km away
                    </Text>
                  </View>
                </View>
              </View>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <Ionicons name="close" size={28} color={Colors.white} />
              </TouchableOpacity>
            </View>

            {/* Footer */}
            <View style={styles.storyFooter}>
              <TouchableOpacity
                style={styles.viewProfileButton}
                onPress={onViewProfile}
              >
                <LinearGradient
                  colors={['#D4AF37', '#F4C542']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.viewProfileGradient}
                >
                  <Text style={styles.viewProfileText}>View Profile</Text>
                  <Ionicons name="arrow-forward" size={18} color={Colors.primary} />
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </Animated.View>
      </GestureDetector>
    </View>
  );
};

const styles = StyleSheet.create({
  storiesContainer: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    gap: Spacing.md,
  },
  storyItem: {
    alignItems: 'center',
  },
  storyGradient: {
    width: 76,
    height: 76,
    borderRadius: 38,
    padding: 3,
  },
  storyImageContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    overflow: 'hidden',
    backgroundColor: Colors.card,
  },
  storyImage: {
    width: '100%',
    height: '100%',
  },
  storyName: {
    marginTop: Spacing.xs,
    fontSize: Typography.fontSize.xs,
    color: Colors.text.primary,
    fontWeight: Typography.fontWeight.medium,
    maxWidth: 76,
    textAlign: 'center',
  },
  verifiedBadge: {
    position: 'absolute',
    right: 2,
    bottom: 20,
    backgroundColor: Colors.card,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: Colors.background,
  },
  storyViewer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: Colors.black,
  },
  storyContent: {
    flex: 1,
  },
  storyFullImage: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
  },
  storyOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'space-between',
  },
  progressContainer: {
    flexDirection: 'row',
    gap: 4,
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.xl + 20,
  },
  progressBar: {
    flex: 1,
    height: 2,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 1,
  },
  progressBarComplete: {
    backgroundColor: Colors.white,
  },
  storyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.sm,
  },
  storyHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  storyHeaderAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: Colors.accent,
  },
  storyHeaderName: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.white,
  },
  storyHeaderInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  storyHeaderRating: {
    fontSize: Typography.fontSize.xs,
    color: Colors.white,
    fontWeight: Typography.fontWeight.medium,
  },
  storyHeaderSeparator: {
    fontSize: Typography.fontSize.xs,
    color: Colors.white,
  },
  storyHeaderDistance: {
    fontSize: Typography.fontSize.xs,
    color: Colors.white,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  storyFooter: {
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.xl + 20,
  },
  viewProfileButton: {
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
  },
  viewProfileGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.md,
  },
  viewProfileText: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.primary,
  },
});
