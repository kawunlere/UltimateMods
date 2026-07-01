import React, { useState } from 'react';
import { View, Text, StyleSheet, StatusBar, TouchableOpacity, SafeAreaView, Alert } from 'react-native';

const API_URL = "https://ultimate-mods-api.kawunlere.workers.dev";

export default function App() {
  const [key, setKey] = useState("Tap to unlock");

  const fetchKey = async () => {
    try {
      const res = await fetch(`${API_URL}/get-key/FreeFire`);
      const data = await res.text();
      setKey(data);
      Alert.alert("Your Key", data);
    } catch (e) {
      Alert.alert("Error", "Cannot reach server");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      <View style={styles.header}>
        <Text style={styles.logoText}>ULTIMATE <Text style={styles.goldText}>MODS</Text></Text>
      </View>

      <View style={styles.body}>
        <Text style={styles.welcome}>Welcome to the Divine Hub</Text>
        <Text style={styles.subtitle}>Premium Games & Secure Tools</Text>
        
        <TouchableOpacity style={styles.card} onPress={fetchKey}>
          <Text style={styles.cardTitle}>FREE FIRE MOD</Text>
          <Text style={styles.cardPrice}>{key}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <Text style={styles.promoText}>Powered by Cloudflare KV</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  header: { height: 80, justifyContent: 'center', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
  logoText: { fontSize: 24, fontWeight: '900', color: '#87CEEB', letterSpacing: 1 },
  goldText: { color: '#FFD700' },
  body: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20 },
  welcome: { fontSize: 20, fontWeight: '600', color: '#333' },
  subtitle: { fontSize: 14, color: '#AAA', marginTop: 5 },
  card: { width: '100%', backgroundColor: '#FFFFFF', padding: 25, borderRadius: 20, marginTop: 30, alignItems: 'center',
    borderWidth: 2, borderColor: '#FFD700' },
  cardTitle: { fontSize: 18, fontWeight: 'bold', color: '#DAA520' },
  cardPrice: { fontSize: 12, color: '#87CEEB', marginTop: 5 },
  footer: { padding: 20, alignItems: 'center' },
  promoText: { fontSize: 10, color: '#DDD', letterSpacing: 2 }
});
