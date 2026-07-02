import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions, StatusBar } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

const slides = [
  {
    icon: 'diamond',
    title: 'Welcome to Ultimate Mods',
    desc: 'Your trusted hub for premium modded games, secure tools & VIP features.',
    color: '#FFD700'
  },
  {
    icon: 'shield-checkmark',
    title: '100% Safe & Verified',
    desc: 'Every mod is scanned and tested. Download with confidence.',
    color: '#4CAF50'
  },
  {
    icon: 'flash',
    title: 'Exclusive License Keys',
    desc: 'Unlock premium mods with our secure key system.',
    color: '#4A90E2'
  },
  {
    icon: 'gift',
    title: 'Earn Points Daily',
    desc: 'Check in every day, refer friends, and unlock rewards.',
    color: '#E91E63'
  }
];

export default function OnboardingScreen({ navigation }) {
  const [current, setCurrent] = useState(0);
  const scrollRef = useRef(null);

  const finish = async () => {
    await AsyncStorage.setItem('ONBOARDING_DONE', 'true');
    navigation.replace('Main');
  };

  const next = () => {
    if (current < slides.length - 1) {
      scrollRef.current.scrollTo({ x: width * (current + 1), animated: true });
      setCurrent(current + 1);
    } else {
      finish();
    }
  };

  const handleScroll = (e) => {
    const idx = Math.round(e.nativeEvent.contentOffset.x / width);
    setCurrent(idx);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0A0A0A" />
      
      <TouchableOpacity style={styles.skipBtn} onPress={finish}>
        <Text style={styles.skipText}>Skip</Text>
      </TouchableOpacity>

      <ScrollView 
        ref={scrollRef}
        horizontal 
        pagingEnabled 
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScroll}
      >
        {slides.map((s, i) => (
          <View key={i} style={styles.slide}>
            <View style={[styles.iconCircle, { borderColor: s.color }]}>
              <Icon name={s.icon} size={80} color={s.color} />
            </View>
            <Text style={styles.title}>{s.title}</Text>
            <Text style={styles.desc}>{s.desc}</Text>
          </View>
        ))}
      </ScrollView>

      <View style={styles.dots}>
        {slides.map((_, i) => (
          <View key={i} style={[styles.dot, current === i && styles.dotActive]} />
        ))}
      </View>

      <TouchableOpacity style={styles.nextBtn} onPress={next}>
        <Text style={styles.nextText}>{current === slides.length - 1 ? 'GET STARTED' : 'NEXT'}</Text>
        <Icon name="arrow-forward" size={20} color="#000" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0A0A' },
  skipBtn: { position: 'absolute', top: 50, right: 20, zIndex: 10, padding: 10 },
  skipText: { color: '#888', fontSize: 14 },
  slide: { width, justifyContent: 'center', alignItems: 'center', padding: 40 },
  iconCircle: { width: 180, height: 180, borderRadius: 90, backgroundColor: '#1a1a1a', justifyContent: 'center', alignItems: 'center', borderWidth: 3, marginBottom: 40 },
  title: { color: '#FFF', fontSize: 26, fontWeight: 'bold', textAlign: 'center', marginBottom: 15 },
  desc: { color: '#AAA', fontSize: 15, textAlign: 'center', lineHeight: 22 },
  dots: { flexDirection: 'row', justifyContent: 'center', marginBottom: 30 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#333', marginHorizontal: 4 },
  dotActive: { backgroundColor: '#FFD700', width: 24 },
  nextBtn: { flexDirection: 'row', backgroundColor: '#FFD700', margin: 20, padding: 18, borderRadius: 30, justifyContent: 'center', alignItems: 'center' },
  nextText: { color: '#000', fontWeight: 'bold', letterSpacing: 1, marginRight: 8 }
});
