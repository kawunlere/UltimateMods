import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, StatusBar } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

export default function SplashScreen({ navigation }) {
  const fade = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fade, { toValue: 1, duration: 800, useNativeDriver: true }),
      Animated.spring(scale, { toValue: 1, friction: 4, useNativeDriver: true })
    ]).start();

    const timer = setTimeout(() => {
      navigation.replace('Main');
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0A0A0A" />
      <Animated.View style={[styles.logoBox, { opacity: fade, transform: [{ scale }] }]}>
        <View style={styles.circle}>
          <Icon name="diamond" size={70} color="#FFD700" />
        </View>
        <Text style={styles.title}>ULTIMATE <Text style={styles.gold}>MODS</Text></Text>
        <Text style={styles.tagline}>Premium Games & Secure Tools</Text>
      </Animated.View>
      <Animated.Text style={[styles.footer, { opacity: fade }]}>v1.0 • Powered by You</Animated.Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0A0A', alignItems: 'center', justifyContent: 'center' },
  logoBox: { alignItems: 'center' },
  circle: { width: 130, height: 130, borderRadius: 65, backgroundColor: '#1a1500', justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#FFD700' },
  title: { fontSize: 28, color: '#4A90E2', fontWeight: '900', letterSpacing: 3, marginTop: 25 },
  gold: { color: '#FFD700' },
  tagline: { color: '#888', marginTop: 8, fontSize: 12, letterSpacing: 1 },
  footer: { position: 'absolute', bottom: 40, color: '#333', fontSize: 11 }
});
