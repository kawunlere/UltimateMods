import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, SafeAreaView, ScrollView, Alert, Linking, ActivityIndicator } from 'react-native';
import { getKey } from '../services/api';

export default function ModDetailScreen({ route }) {
  const { mod } = route.params;
  const [key, setKey] = useState(null);
  const [loading, setLoading] = useState(false);

  const unlock = async () => {
    setLoading(true);
    const k = await getKey(mod.name);
    setKey(k);
    setLoading(false);
  };

  const download = () => {
    if (!mod.downloadUrl) {
      Alert.alert("No Link", "Download link not set yet.");
      return;
    }
    Linking.openURL(mod.downloadUrl);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <Image source={{ uri: mod.img || 'https://placehold.co/400x300/FFD700/FFF?text=MOD' }} style={styles.img} />
        <Text style={styles.name}>{mod.name}</Text>
        <Text style={styles.desc}>{mod.desc}</Text>

        {mod.features ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>✨ Features</Text>
            <Text style={styles.sectionText}>{mod.features}</Text>
          </View>
        ) : null}

        {mod.version ? (
          <View style={styles.row}>
            <Text style={styles.label}>Version:</Text>
            <Text style={styles.value}>{mod.version}</Text>
          </View>
        ) : null}

        {mod.size ? (
          <View style={styles.row}>
            <Text style={styles.label}>Size:</Text>
            <Text style={styles.value}>{mod.size}</Text>
          </View>
        ) : null}

        <View style={styles.safeBadge}>
          <Text style={styles.safeText}>✅ Scanned & Safe</Text>
        </View>

        {key ? (
          <View style={styles.keyBox}>
            <Text style={styles.keyLabel}>YOUR LICENSE KEY</Text>
            <Text style={styles.keyValue}>{key}</Text>
          </View>
        ) : (
          <TouchableOpacity style={styles.unlockBtn} onPress={unlock} disabled={loading}>
            {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.btnText}>🔓 UNLOCK KEY</Text>}
          </TouchableOpacity>
        )}

        <TouchableOpacity style={styles.downloadBtn} onPress={download}>
          <Text style={styles.btnText}>⬇ DOWNLOAD MOD</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  img: { width: '100%', height: 220, borderRadius: 15, backgroundColor: '#F5F5F5' },
  name: { fontSize: 24, fontWeight: 'bold', color: '#333', marginTop: 15 },
  desc: { fontSize: 14, color: '#666', marginTop: 5 },
  section: { marginTop: 20, backgroundColor: '#F9F9F9', padding: 15, borderRadius: 10 },
  sectionTitle: { fontWeight: 'bold', color: '#DAA520', marginBottom: 5 },
  sectionText: { color: '#555', fontSize: 13 },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10, paddingHorizontal: 5 },
  label: { color: '#888' },
  value: { fontWeight: 'bold', color: '#333' },
  safeBadge: { backgroundColor: '#E8F5E9', padding: 10, borderRadius: 8, marginTop: 15, alignItems: 'center' },
  safeText: { color: '#2E7D32', fontWeight: 'bold' },
  keyBox: { backgroundColor: '#FFF9E6', padding: 20, borderRadius: 12, marginTop: 20, borderWidth: 2, borderColor: '#FFD700', alignItems: 'center' },
  keyLabel: { fontSize: 12, color: '#DAA520', fontWeight: 'bold' },
  keyValue: { fontSize: 18, fontWeight: 'bold', color: '#333', marginTop: 8 },
  unlockBtn: { backgroundColor: '#FFD700', padding: 16, borderRadius: 12, marginTop: 20, alignItems: 'center' },
  downloadBtn: { backgroundColor: '#87CEEB', padding: 16, borderRadius: 12, marginTop: 12, alignItems: 'center' },
  btnText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 }
});
