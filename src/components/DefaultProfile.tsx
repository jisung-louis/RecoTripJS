import React from 'react';
import { View } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';

const DefaultProfile = () => (
  <View style={{ width: 100, height: 100, alignItems: 'center', justifyContent: 'center' }}>
    <Svg width={100} height={100} viewBox="0 0 100 100">
      {/* 원형 배경 */}
      <Circle cx={50} cy={50} r={50} fill="#e0e0e0" />
      {/* 사람 실루엣 */}
      <Path
        d="M50 55c-10 0-20 5-20 15v5h40v-5c0-10-10-15-20-15z"
        fill="#bdbdbd"
      />
      <Circle cx={50} cy={40} r={13} fill="#bdbdbd" />
    </Svg>
  </View>
);

export default DefaultProfile; 