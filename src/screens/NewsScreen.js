import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Modal, StatusBar, RefreshControl, ActivityIndicator, Linking } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { getConfigFresh } from '../services/api';

export default function NewsScreen({ navigation }) {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  const load = async () => {
    setLoading(true);
    const cfg = await getConfigFresh();
    setNews(cfg.news || []);
    setLoading(false);
  };

  useEffect(() => {
    load();
    const unsub = navigation.addListener('focus', load);
    return unsub;
  }, [navigation]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0A0A0A" />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>📰 News & Updates</Text>
        <Text style={styles.headerSub}>Latest from Ultimate Mods</Text>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#FFD700" style={{ marginTop: 50 }} />
      ) : news.length === 0 ? (
        <View style={styles.emptyBox}>
          <Icon name="newspaper-outline" size={60} color="#333" />
          <Text style={styles.empty}>No news yet</Text>
        </View>
      ) : (
        <ScrollView 
          contentContainerStyle={{ padding: 15, paddingBottom: 30 }}
          refreshControl={<RefreshControl refreshing={loading} onRefresh={load} tintColor="#FFD700" />}
        >
          {news.map((item, i) => (
            <TouchableOpacity key={i} style={styles.card} onPress={() => setSelected(item)}>
              {item.image ? <Image source={{ uri: item.image }} style={styles.cardImg} /> : null}
              <View style={styles.cardBody}>
                <View style={styles.categoryTag}>
                  <Text style={styles.categoryText}>{item.category || 'NEWS'}</Text>
                </View>
                <Text style={styles.cardTitle} numberOfLines={2}>{item.title}</Text>
                <Text style={styles.cardExcerpt} numberOfLines={2}>{item.excerpt || item.content}</Text>
                <View style={styles.cardFoot}>
                  <Icon name="time-outline" size={12} color="#666" />
                  <Text style={styles.cardDate}>{item.date || 'Recent'}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      <Modal visible={!!selected} animationType="slide" onRequestClose={() => setSelected(null)}>
        {selected && (
          <View style={styles.modalContainer}>
            <View style={styles.modalHead}>
              <TouchableOpacity onPress={() => setSelected(null)}>
                <Icon name="chevron-back" size={26} color="#FFF" />
              </TouchableOpacity>
              <Text style={styles.modalHeadTitle}>Article</Text>
              <View style={{ width: 26 }} />
            </View>
            <ScrollView contentContainerStyle={{ padding: 20 }}>
              {selected.image ? <Image source={{ uri: selected.image }} style={styles.modalImg} /> : null}
              <View style={styles.categoryTag}>
                <Text style={styles.categoryText}>{selected.category || 'NEWS'}</Text>
              </View>
              <Text style={styles.modalTitle}>{selected.title}</Text>
              <View style={styles.modalMeta}>
                <Icon name="time-outline" size={13} color="#666" />
                <Text style={styles.modalDate}>{selected.date || 'Recent'}</Text>
              </View>
              <Text style={styles.modalContent}>{selected.content}</Text>
              {selected.link && (
                <TouchableOpacity style={styles.linkBtn} onPress={() => Linking.openURL(selected.link)}>
                  <Icon name="open-outline" size={18} color="#000" />
                  <Text style={styles.linkBtnText}>READ MORE</Text>
                </TouchableOpacity>
              )}
            </ScrollView>
          </View>
        )}
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0A0A' },
  header: { padding: 20, backgroundColor: '#1a1a1a' },
  headerTitle: { color: '#FFF', fontSize: 22, fontWeight: 'bold' },
  headerSub: { color: '#888', fontSize: 12, marginTop: 3 },
  emptyBox: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  empty: { color: '#666', marginTop: 10 },
  card: { backgroundColor: '#1a1a1a', borderRadius: 12, marginBottom: 15, overflow: 'hidden' },
  cardImg: { width: '100%', height: 160, backgroundColor: '#0A0A0A' },
  cardBody: { padding: 15 },
  categoryTag: { alignSelf: 'flex-start', backgroundColor: '#FFD700', paddingHorizontal: 10, paddingVertical: 3, borderRadius: 4, marginBottom: 8 },
  categoryText: { color: '#000', fontSize: 10, fontWeight: 'bold', letterSpacing: 1 },
  cardTitle: { color: '#FFF', fontSize: 16, fontWeight: 'bold', marginBottom: 5 },
  cardExcerpt: { color: '#AAA', fontSize: 13, lineHeight: 18 },
  cardFoot: { flexDirection: 'row', alignItems: 'center', marginTop: 10 },
  cardDate: { color: '#666', fontSize: 11, marginLeft: 4 },
  modalContainer: { flex: 1, backgroundColor: '#0A0A0A' },
  modalHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 15, backgroundColor: '#1a1a1a' },
  modalHeadTitle: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
  modalImg: { width: '100%', height: 200, borderRadius: 12, marginBottom: 15, backgroundColor: '#1a1a1a' },
  modalTitle: { color: '#FFF', fontSize: 22, fontWeight: 'bold', marginTop: 10 },
  modalMeta: { flexDirection: 'row', alignItems: 'center', marginTop: 8, marginBottom: 15 },
  modalDate: { color: '#666', fontSize: 12, marginLeft: 5 },
  modalContent: { color: '#DDD', fontSize: 14, lineHeight: 22 },
  linkBtn: { flexDirection: 'row', backgroundColor: '#FFD700', padding: 15, borderRadius: 25, alignItems: 'center', justifyContent: 'center', marginTop: 20 },
  linkBtnText: { color: '#000', fontWeight: 'bold', marginLeft: 8, letterSpacing: 1 }
});
