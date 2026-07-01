import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, SafeAreaView, RefreshControl, ActivityIndicator } from 'react-native';
import { getConfig } from '../services/api';

export default function HomeScreen({ navigation }) {
  const [mods, setMods] = useState([]);
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const cfg = await getConfig();
    setMods(cfg.mods || []);
    setSettings(cfg.settings || {});
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: settings.bgColor || '#FFF' }]}>
      <View style={styles.header}>
        <Text style={styles.logo}>{settings.appName || 'ULTIMATE'} <Text style={styles.gold}>{settings.appNameGold || 'MODS'}</Text></Text>
      </View>

      {settings.banner ? (
        <View style={styles.banner}>
          <Text style={styles.bannerText}>{settings.banner}</Text>
        </View>
      ) : null}

      {loading ? (
        <ActivityIndicator size="large" color="#FFD700" style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={mods}
          numColumns={2}
          keyExtractor={(i, idx) => idx.toString()}
          contentContainerStyle={{ padding: 10 }}
          refreshControl={<RefreshControl refreshing={loading} onRefresh={load} />}
          ListEmptyComponent={<Text style={styles.empty}>No mods yet. Add from Admin Panel.</Text>}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('ModDetail', { mod: item })}>
              <Image source={{ uri: item.img || 'https://placehold.co/200x200/FFD700/FFF?text=MOD' }} style={styles.img} />
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.desc}>{item.desc}</Text>
            </TouchableOpacity>
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { padding: 15, borderBottomWidth: 1, borderBottomColor: '#F0F0F0', alignItems: 'center' },
  logo: { fontSize: 24, fontWeight: '900', color: '#87CEEB', letterSpacing: 1 },
  gold: { color: '#FFD700' },
  banner: { backgroundColor: '#FFF9E6', padding: 12, marginHorizontal: 10, marginTop: 10, borderRadius: 10, borderLeftWidth: 4, borderLeftColor: '#FFD700' },
  bannerText: { color: '#DAA520', fontWeight: '600' },
  card: { flex: 1, margin: 5, backgroundColor: '#FFF', borderRadius: 15, padding: 12, borderWidth: 1, borderColor: '#FFD700', alignItems: 'center', elevation: 2 },
  img: { width: 120, height: 120, borderRadius: 10, backgroundColor: '#F5F5F5' },
  name: { marginTop: 10, fontWeight: 'bold', color: '#333', fontSize: 14 },
  desc: { fontSize: 11, color: '#888', textAlign: 'center', marginTop: 4 },
  empty: { textAlign: 'center', marginTop: 40, color: '#AAA' }
});
