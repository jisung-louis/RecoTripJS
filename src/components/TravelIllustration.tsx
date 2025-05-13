import React from 'react';
import Svg, { Circle, Path, Ellipse, G } from 'react-native-svg';

interface TravelIllustrationProps {
  width?: number;
  height?: number;
  style?: any;
}

const TravelIllustration: React.FC<TravelIllustrationProps> = ({ width = 260, height = 120, style }) => (
  <Svg width={width} height={height} viewBox="0 0 260 120" style={style}>
    {/* 하늘 배경 */}
    <Ellipse cx="130" cy="100" rx="120" ry="40" fill="#A8FFCE" />
    {/* 구름 */}
    <Ellipse cx="60" cy="40" rx="22" ry="10" fill="#E0F7F3" />
    <Ellipse cx="80" cy="45" rx="16" ry="8" fill="#E0F7F3" />
    <Ellipse cx="200" cy="30" rx="18" ry="8" fill="#E0F7F3" />
    <Ellipse cx="180" cy="38" rx="12" ry="6" fill="#E0F7F3" />
    {/* 지구 */}
    <Circle cx="130" cy="90" r="32" fill="#1CB5A3" />
    {/* 대륙 */}
    <Path d="M120 90 Q125 80 140 85 Q145 100 130 100 Q125 95 120 90 Z" fill="#B6F2E6" />
    <Path d="M140 100 Q150 95 145 85 Q155 90 150 105 Q145 105 140 100 Z" fill="#B6F2E6" />
    {/* 비행기 */}
    <G>
      <Path d="M60 80 L120 90 L110 95 Z" fill="#fff" stroke="#197C6B" strokeWidth="1.5" />
      <Path d="M120 90 L135 70 L140 75 L125 95 Z" fill="#fff" stroke="#197C6B" strokeWidth="1.5" />
      <Path d="M135 70 L140 75" stroke="#197C6B" strokeWidth="2" />
      <Circle cx="120" cy="90" r="2.5" fill="#197C6B" />
    </G>
    {/* 여행선 */}
    <Path d="M80 110 Q130 120 180 110" stroke="#197C6B" strokeWidth="2" fill="none" opacity="0.2" />
  </Svg>
);

export default TravelIllustration; 