import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, ScrollView, TextInput, RefreshControl, ActivityIndicator, Dimensions, StatusBar } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { getConfig } from '../services/api';

const { width } = Dimensions.get('window');

export default function HomeScreen({ navigation }) {
  const [apps, setApps] = useState([]);
  const [featured, setFeatured] = useState([]);
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('For You');
  const [tapCount, setTapCount] = useState(0);
  const tapTimer = useRef(null);

  const categories = ['For You', 'Top Charts', 'New', 'Games', 'Apps', 'MODs'];

  const load = async () => {
    setLoading(true);
    const cfg = await getConfig();
    setApps(cfg.apps || []);
    setFeatured(cfg.featured || []);
    setSettings(cfg.settings || {});
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  // Hidden Admin: tap logo 7 times
  const handleLogoTap = () => {
    const next = tapCount + 1;
    setTapCount(next);
    clearTimeout(tapTimer.current);
    if (next >= 7) {
      setTapCount(0);
      navigation.navigate('Admin');
    } else {
      tapTimer.current = setTimeout(() => setTapCount(0), 2000);
    }
  };

  const filteredApps = category === 'For You' ? apps : apps.filter(a => a.category === category || a.type === category);
  const mustHave = apps.filter(a => a.topApp).slice(0, 6);
  const editorsChoice = apps.filter(a => a.editorsChoice).slice(0, 6);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0A0A0A" />
      
      {/* Search Bar */}
      <View style={styles.searchBar}>
        <Icon name="search" size={20} color="#888" />
        <TextInput style={styles.searchInput} placeholder="Search apps & mods..." placeholderTextColor="#666" />
        <TouchableOpacity onPress={handleLogoTap}>
          <Icon name="diamond" size={22} color="#FFD700" />
        </TouchableOpacity>
      </View>

      {/* Categories */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.catBar}>
        {categories.map(c => (
          <TouchableOpacity key={c} onPress={() => setCategory(c)} style={styles.catBtn}>
            <Text style={[styles.catText, category === c && styles.catActive]}>{c}</Text>
            {category === c && <View style={styles.catLine} />}
          </TouchableOpacity>
        ))}
      </ScrollView>

      {loading ? (
        <ActivityIndicator size="large" color="#FFD700" style={{ marginTop: 50 }} />
      ) : (
        <ScrollView refreshControl={<RefreshControl refreshing={loading} onRefresh={load} tintColor="#FFD700" />}>
          
          {/* Featured Carousel */}
          {featured.length > 0 && (
            <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false} style={styles.carousel}>
              {featured.map((f, i) => (
                <TouchableOpacity key={i} style={styles.featuredCard}>
                  <Image source={{ uri: f.image }} style={styles.featuredImg} />
                  <View style={styles.featuredOverlay}>
                    <Text style={styles.featuredTitle}>{f.title}</Text>
                    <View style={styles.featuredBtn}><Text style={styles.featuredBtnText}>View</Text></View>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}

          {/* Must Have */}
          {mustHave.length > 0 && (
            <View>
              <View style={styles.sectionHead}>
                <Text style={styles.sectionTitle}>Must Have</Text>
                <Icon name="chevron-forward" size={20} color="#888" />
              </View>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 10 }}>
                {mustHave.map((a, i) => <AppCard key={i} app={a} nav={navigation} />)}
              </ScrollView>
            </View>
          )}

          {/* Editor's Choice */}
          {editorsChoice.length > 0 && (
            <View>
              <View style={styles.sectionHead}>
                <Text style={styles.sectionTitle}>You May Like</Text>
                <Icon name="chevron-forward" size={20} color="#888" />
              </View>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 10 }}>
                {editorsChoice.map((a, i) => <AppCard key={i} app={a} nav={navigation} />)}
              </ScrollView>
            </View>
          )}

          {/* All Apps */}
          <View style={styles.sectionHead}>
            <Text style={styles.sectionTitle}>All {category}</Text>
          </View>
          {filteredApps.length === 0 ? (
            <Text style={styles.empty}>No apps yet</Text>
          ) : (
            <View style={styles.grid}>
              {filteredApps.map((a, i) => <AppCard key={i} app={a} nav={navigation} />)}
            </View>
          )}
          <View style={{ height: 30 }} />
        </ScrollView>
      )}
    </View>
  );
}

function AppCard({ app, nav }) {
  return (
    <TouchableOpacity style={styles.card} onPress={() => nav.navigate('AppDetail', { app })}>
      <Image source={{ uri: app.icon || 'https://placehold.co/120x120/1a1a1a/FFD700?text=?' }} style={styles.cardIcon} />
      <Text style={styles.cardName} numberOfLines={1}>{app.name || 'Unnamed'}</Text>
      <View style={styles.cardRow}>
        <Icon name="star" size={11} color="#4A90E2" />
        <Text style={styles.cardRating}>{app.rating || '0.0'}</Text>
        <Text style={styles.cardSize}>{app.size || ''}</Text>
      </View>
      <View style={styles.getBtn}>
        <Text style={styles.getBtnText}>{app.paid ? 'Buy' : 'Get'}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0A0A' },
  searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1a1a1a', margin: 12, padding: 10, borderRadius: 25, paddingHorizontal: 15 },
  searchInput: { flex: 1, color: '#FFF', marginLeft: 10, fontSize: 14 },
  catBar: { paddingHorizontal: 10, maxHeight: 45 },
  catBtn: { paddingHorizontal: 15, paddingVertical: 10, alignItems: 'center' },
  catText: { color: '#888', fontSize: 14, fontWeight: '500' },
  catActive: { color: '#4A90E2', fontWeight: 'bold' },
  catLine: { height: 2, width: 20, backgroundColor: '#4A90E2', marginTop: 4, borderRadius: 2 },
  carousel: { marginTop: 10 },
  featuredCard: { width: width - 30, height: 180, marginHorizontal: 15, borderRadius: 15, overflow: 'hidden', backgroundColor: '#1a1a1a' },
  featuredImg: { width: '100%', height: '100%' },
  featuredOverlay: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 15, backgroundColor: 'rgba(0,0,0,0.5)', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  featuredTitle: { color: '#FFF', fontSize: 16, fontWeight: 'bold', flex: 1 },
  featuredBtn: { backgroundColor: '#B8860B', paddingHorizontal: 20, paddingVertical: 8, borderRadius: 20 },
  featuredBtnText: { color: '#FFF', fontWeight: 'bold', fontSize: 12 },
  sectionHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 15, marginTop: 10 },
  sectionTitle: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
  card: { width: 100, marginHorizontal: 6, alignItems: 'center' },
  cardIcon: { width: 70, height: 70, borderRadius: 15, backgroundColor: '#1a1a1a' },
  cardName: { color: '#FFF', fontSize: 12, fontWeight: '600', marginTop: 6, textAlign: 'center' },
  cardRow: { flexDirection: 'row', alignItems: 'center', marginTop: 3 },
  cardRating: { color: '#888', fontSize: 10, marginLeft: 2, marginRight: 6 },
  cardSize: { color: '#666', fontSize: 10 },
  getBtn: { backgroundColor: '#1a3a5c', paddingHorizontal: 20, paddingVertical: 5, borderRadius: 15, marginTop: 6 },
  getBtnText: { color: '#4A90E2', fontSize: 11, fontWeight: 'bold' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-around', paddingHorizontal: 5 },
  empty: { color: '#666', textAlign: 'center', marginTop: 30 }
});
