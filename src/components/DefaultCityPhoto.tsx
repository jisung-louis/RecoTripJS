import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import TravelIllustration from './TravelIllustration';

interface DefaultCityPhotoProps {
  cityName?: string;
  style?: ViewStyle;
  width?: number;
  height?: number;
}

const DefaultCityPhoto: React.FC<DefaultCityPhotoProps> = ({ cityName = '여행', style, width = 260, height = 120 }) => {
  return (
    <View style={[styles.container, { width, height }, style]}>
      <TravelIllustration width={width} height={height} style={styles.illust} />
      <View style={styles.overlay} />
      <Text style={styles.cityText}>{cityName}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#B6F2E6',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  illust: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
    opacity: 0.7,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(28,181,163,0.18)',
  },
  cityText: {
    color: '#197C6B',
    fontWeight: 'bold',
    fontSize: 22,
    textShadowColor: 'rgba(255,255,255,0.7)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
    zIndex: 2,
  },
});

export default DefaultCityPhoto; 