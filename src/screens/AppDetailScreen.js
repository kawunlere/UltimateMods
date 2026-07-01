import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Alert, Linking, ActivityIndicator, Share, Dimensions, StatusBar } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getKey } from '../services/api';

const { width } = Dimensions.get('window');

export default function AppDetailScreen({ route, navigation }) {
  const { app } = route.params;
  const [key, setKey] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isFav, setIsFav] = useState(false);

  useEffect(() => {
    (async () => {
      const w = await AsyncStorage.getItem('wishlist');
      const list = w ? JSON.parse(w) : [];
      setIsFav(list.some(x => x.name === app.name));
    })();
  }, []);

  const toggleFav = async () => {
    const w = await AsyncStorage.getItem('wishlist');
    let list = w ? JSON.parse(w) : [];
    if (isFav) {
      list = list.filter(x => x.name !== app.name);
      setIsFav(false);
    } else {
      list.push(app);
      setIsFav(true);
    }
    await AsyncStorage.setItem('wishlist', JSON.stringify(list));
  };

  const unlock = async () => {
    setLoading(true);
    const k = await getKey(app.name);
    setKey(k);
    setLoading(false);
  };

  const download = () => {
    if (!app.downloadUrl) return Alert.alert("No Link", "Download link not set.");
    Linking.openURL(app.downloadUrl);
  };

  const openPlayStore = () => {
    if (app.playStoreUrl) Linking.openURL(app.playStoreUrl);
  };

  const shareApp = async () => {
    try {
      await Share.share({ message: `Check out ${app.name} on Ultimate Mods!\n${app.downloadUrl || ''}` });
    } catch (e) {}
  };

  const screenshots = app.screenshots ? app.screenshots.split(',').map(s => s.trim()).filter(Boolean) : [];
  const rating = parseFloat(app.rating) || 0;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0A0A0A" />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="chevron-back" size={26} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>{app.name}</Text>
        <TouchableOpacity onPress={toggleFav} style={{ marginRight: 10 }}>
          <Icon name={isFav ? "heart" : "heart-outline"} size={24} color={isFav ? "#E91E63" : "#FFF"} />
        </TouchableOpacity>
        <TouchableOpacity onPress={shareApp}>
          <Icon name="share-social" size={22} color="#FFF" />
        </TouchableOpacity>
      </View>

      <ScrollView>
        {app.cover && <Image source={{ uri: app.cover }} style={styles.cover} />}

        <View style={styles.info}>
          <Image source={{ uri: app.icon || 'https://placehold.co/120/1a1a1a/FFD700?text=?' }} style={styles.icon} />
          <View style={styles.infoRight}>
            <Text style={styles.name}>{app.name}</Text>
            <Text style={styles.dev}>{app.developer || 'Unknown Developer'}</Text>
            <View style={styles.ratingRow}>
              {[1,2,3,4,5].map(i => (
                <Icon key={i} name={i <= rating ? "star" : "star-outline"} size={13} color="#FFD700" />
              ))}
              <Text style={styles.ratingText}>{rating.toFixed(1)}</Text>
              <Text style={styles.ratingCount}>({app.totalRatings || 0})</Text>
            </View>
            {app.paid && <View style={styles.paidTag}><Text style={styles.paidText}>PAID</Text></View>}
          </View>
        </View>

        <View style={styles.stats}>
          <View style={styles.stat}>
            <Text style={styles.statValue}>{app.size || '—'}</Text>
            <Text style={styles.statLabel}>Size</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statValue}>{app.version || '—'}</Text>
            <Text style={styles.statLabel}>Version</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statValue}>{app.category || 'App'}</Text>
            <Text style={styles.statLabel}>Category</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statValue}>{app.type || 'Free'}</Text>
            <Text style={styles.statLabel}>Type</Text>
          </View>
        </View>

        {screenshots.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Screenshots</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {screenshots.map((s, i) => (
                <Image key={i} source={{ uri: s }} style={styles.screenshot} />
              ))}
            </ScrollView>
          </View>
        )}

        {app.modInfo && (
          <View style={styles.modBox}>
            <View style={styles.modHead}>
              <Icon name="flash" size={18} color="#FFD700" />
              <Text style={styles.modTitle}>MOD FEATURES</Text>
            </View>
            <Text style={styles.modText}>{app.modInfo}</Text>
          </View>
        )}

        {app.description && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>About</Text>
            <Text style={styles.description}>{app.description}</Text>
          </View>
        )}

        <View style={styles.safeBadge}>
          <Icon name="shield-checkmark" size={18} color="#4CAF50" />
          <Text style={styles.safeText}>Scanned & Verified Safe</Text>
        </View>

        {key && (
          <View style={styles.keyBox}>
            <Text style={styles.keyLabel}>YOUR LICENSE KEY</Text>
            <Text style={styles.keyValue}>{key}</Text>
          </View>
        )}

        <View style={styles.actions}>
          {!key && (
            <TouchableOpacity style={styles.unlockBtn} onPress={unlock} disabled={loading}>
              {loading ? <ActivityIndicator color="#000" /> : (
                <>
                  <Icon name="lock-open" size={18} color="#000" />
                  <Text style={styles.unlockText}>UNLOCK KEY</Text>
                </>
              )}
            </TouchableOpacity>
          )}
          <TouchableOpacity style={styles.downloadBtn} onPress={download}>
            <Icon name="download" size={18} color="#FFF" />
            <Text style={styles.downloadText}>DOWNLOAD</Text>
          </TouchableOpacity>
          {app.playStoreUrl && (
            <TouchableOpacity style={styles.playBtn} onPress={openPlayStore}>
              <Icon name="logo-google-playstore" size={18} color="#FFF" />
              <Text style={styles.playText}>Play Store</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={{ height: 30 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0A0A' },
  header: { flexDirection: 'row', alignItems: 'center', padding: 15, backgroundColor: '#0A0A0A', borderBottomWidth: 1, borderBottomColor: '#1a1a1a' },
  headerTitle: { flex: 1, color: '#FFF', fontSize: 16, fontWeight: 'bold', marginLeft: 10 },
  cover: { width: '100%', height: 140, opacity: 0.6 },
  info: { flexDirection: 'row', padding: 15, marginTop: -50 },
  icon: { width: 90, height: 90, borderRadius: 20, backgroundColor: '#1a1a1a', borderWidth: 3, borderColor: '#0A0A0A' },
  infoRight: { flex: 1, marginLeft: 15, justifyContent: 'center' },
  name: { color: '#FFF', fontSize: 20, fontWeight: 'bold' },
  dev: { color: '#4A90E2', fontSize: 12, marginTop: 3 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', marginTop: 5 },
  ratingText: { color: '#FFD700', fontWeight: 'bold', marginLeft: 5, fontSize: 12 },
  ratingCount: { color: '#666', fontSize: 11, marginLeft: 4 },
  paidTag: { backgroundColor: '#B8860B', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4, alignSelf: 'flex-start', marginTop: 5 },
  paidText: { color: '#FFF', fontSize: 10, fontWeight: 'bold' },
  stats: { flexDirection: 'row', backgroundColor: '#1a1a1a', marginHorizontal: 15, borderRadius: 12, padding: 12, justifyContent: 'space-around' },
  stat: { alignItems: 'center' },
  statValue: { color: '#FFF', fontSize: 13, fontWeight: 'bold' },
  statLabel: { color: '#666', fontSize: 10, marginTop: 3 },
  section: { padding: 15 },
  sectionTitle: { color: '#FFF', fontSize: 16, fontWeight: 'bold', marginBottom: 10 },
  screenshot: { width: 180, height: 320, borderRadius: 10, marginRight: 10, backgroundColor: '#1a1a1a' },
  modBox: { backgroundColor: '#1a1500', margin: 15, padding: 15, borderRadius: 12, borderLeftWidth: 3, borderLeftColor: '#FFD700' },
  modHead: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  modTitle: { color: '#FFD700', fontWeight: 'bold', marginLeft: 6, letterSpacing: 1 },
  modText: { color: '#DDD', fontSize: 13, lineHeight: 20 },
  description: { color: '#AAA', fontSize: 13, lineHeight: 20 },
  safeBadge: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', margin: 15, padding: 10, backgroundColor: '#0d2818', borderRadius: 10 },
  safeText: { color: '#4CAF50', marginLeft: 8, fontWeight: '600', fontSize: 12 },
  keyBox: { margin: 15, padding: 20, backgroundColor: '#1a1500', borderRadius: 12, borderWidth: 1, borderColor: '#FFD700', alignItems: 'center' },
  keyLabel: { color: '#FFD700', fontSize: 11, fontWeight: 'bold', letterSpacing: 1 },
  keyValue: { color: '#FFF', fontSize: 18, fontWeight: 'bold', marginTop: 8 },
  actions: { padding: 15 },
  unlockBtn: { flexDirection: 'row', backgroundColor: '#FFD700', padding: 15, borderRadius: 25, alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
  unlockText: { color: '#000', fontWeight: 'bold', marginLeft: 8, letterSpacing: 1 },
  downloadBtn: { flexDirection: 'row', backgroundColor: '#4A90E2', padding: 15, borderRadius: 25, alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
  downloadText: { color: '#FFF', fontWeight: 'bold', marginLeft: 8, letterSpacing: 1 },
  playBtn: { flexDirection: 'row', backgroundColor: '#333', padding: 12, borderRadius: 25, alignItems: 'center', justifyContent: 'center' },
  playText: { color: '#FFF', marginLeft: 8 }
});
