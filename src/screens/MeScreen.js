import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert, Linking, StatusBar, Modal } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getConfig } from '../services/api';

export default function MeScreen({ navigation }) {
  const [wishlist, setWishlist] = useState([]);
  const [settings, setSettings] = useState({});
  const [aboutOpen, setAboutOpen] = useState(false);
  const [faqOpen, setFaqOpen] = useState(false);

  const loadData = async () => {
    const w = await AsyncStorage.getItem('wishlist');
    if (w) setWishlist(JSON.parse(w));
    const cfg = await getConfig();
    setSettings(cfg.settings || {});
  };

  useEffect(() => {
    loadData();
    const unsub = navigation.addListener('focus', loadData);
    return unsub;
  }, [navigation]);

  const contactEmail = 'kawunlere@gmail.com';
  const whatsapp = settings.contactUrl || '';

  const openEmail = () => Linking.openURL(`mailto:${contactEmail}?subject=Ultimate Mods Support`);
  const openWhatsApp = () => whatsapp ? Linking.openURL(whatsapp) : Alert.alert("Coming Soon", "Contact link not set yet");
  const shareApp = () => Linking.openURL('https://github.com/kawunlere/UltimateMods');

  const clearWishlist = () => {
    Alert.alert("Clear Wishlist?", "Remove all favorites?", [
      { text: "Cancel" },
      { text: "Clear", style: "destructive", onPress: async () => {
        await AsyncStorage.removeItem('wishlist');
        setWishlist([]);
      }}
    ]);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0A0A0A" />
      <ScrollView contentContainerStyle={{ paddingBottom: 30 }}>
        
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarCircle}>
            <Icon name="person" size={40} color="#FFD700" />
          </View>
          <Text style={styles.welcomeName}>Welcome, Guest</Text>
          <Text style={styles.welcomeSub}>Ultimate Mods User</Text>
          <TouchableOpacity style={styles.upgradeBtn} onPress={() => navigation.navigate('Main', { screen: 'VIP' })}>
            <Icon name="diamond" size={16} color="#000" />
            <Text style={styles.upgradeText}>UPGRADE TO VIP</Text>
          </TouchableOpacity>
        </View>

        {/* Wishlist Section */}
        <View style={styles.section}>
          <View style={styles.sectionHead}>
            <Icon name="heart" size={18} color="#E91E63" />
            <Text style={styles.sectionTitle}>My Wishlist ({wishlist.length})</Text>
          </View>
          {wishlist.length === 0 ? (
            <Text style={styles.empty}>No favorites yet. Tap ❤️ on apps to save them.</Text>
          ) : (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 10 }}>
              {wishlist.map((app, i) => (
                <TouchableOpacity key={i} style={styles.wishCard} onPress={() => navigation.navigate('AppDetail', { app })}>
                  <Image source={{ uri: app.icon }} style={styles.wishIcon} />
                  <Text style={styles.wishName} numberOfLines={1}>{app.name}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}
          {wishlist.length > 0 && (
            <TouchableOpacity onPress={clearWishlist} style={styles.clearBtn}>
              <Text style={styles.clearText}>Clear All</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Menu */}
        <View style={styles.section}>
          <MenuItem icon="mail" label="Contact via Email" onPress={openEmail} />
          <MenuItem icon="logo-whatsapp" label="WhatsApp / Telegram" onPress={openWhatsApp} color="#25D366" />
          <MenuItem icon="share-social" label="Share This App" onPress={shareApp} />
          <MenuItem icon="help-circle" label="FAQ" onPress={() => setFaqOpen(true)} />
          <MenuItem icon="information-circle" label="About Ultimate Mods" onPress={() => setAboutOpen(true)} />
          <MenuItem icon="star" label="Rate Us 5 Stars" onPress={() => Alert.alert("Thanks!", "Coming soon on Play Store")} color="#FFD700" />
        </View>

        <Text style={styles.version}>Ultimate Mods v1.0</Text>
      </ScrollView>

      {/* About Modal */}
      <Modal visible={aboutOpen} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalHead}>
            <Text style={styles.modalTitle}>About Ultimate Mods</Text>
            <TouchableOpacity onPress={() => setAboutOpen(false)}>
              <Icon name="close" size={26} color="#FFF" />
            </TouchableOpacity>
          </View>
          <ScrollView contentContainerStyle={{ padding: 20 }}>
            <Icon name="diamond" size={60} color="#FFD700" style={{ alignSelf: 'center', marginBottom: 20 }} />
            <Text style={styles.aboutTitle}>Ultimate Mods</Text>
            <Text style={styles.aboutTag}>Your Trusted Hub for Premium Mods</Text>
            <Text style={styles.aboutText}>
              Ultimate Mods is a professional platform delivering high-quality modded games, premium apps, and secure tools to a growing global community.{'\n\n'}
              Built for gamers, by gamers — we provide safe, verified mods with unlocked features, license keys, and premium tools you won't find anywhere else.{'\n\n'}
              🛡️ 100% Scanned & Safe{'\n'}
              ⚡ Daily Fresh Updates{'\n'}
              🔑 Exclusive License Keys{'\n'}
              👑 VIP Membership Available{'\n'}
              🎮 Curated Games & Apps{'\n\n'}
              Join thousands of members from our YouTube channel, WhatsApp community, and Telegram group. We are committed to providing the safest, latest, and most trusted mods on the market.{'\n\n'}
              Follow us for daily drops of the hottest modded content!
            </Text>
          </ScrollView>
        </View>
      </Modal>

      {/* FAQ Modal */}
      <Modal visible={faqOpen} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalHead}>
            <Text style={styles.modalTitle}>Frequently Asked Questions</Text>
            <TouchableOpacity onPress={() => setFaqOpen(false)}>
              <Icon name="close" size={26} color="#FFF" />
            </TouchableOpacity>
          </View>
          <ScrollView contentContainerStyle={{ padding: 20 }}>
            <Faq q="How do I download a mod?" a="Tap any mod, then tap DOWNLOAD. If a key is required, tap UNLOCK KEY first." />
            <Faq q="Why do some mods need a key?" a="Premium mods use license keys for security and to prevent abuse." />
            <Faq q="What does VIP give me?" a="VIP members get early access, exclusive mods, no ads, and priority support." />
            <Faq q="Are the mods safe?" a="Yes! Every mod is scanned and verified safe before publishing." />
            <Faq q="How do I contact support?" a="Use the Contact via Email or WhatsApp buttons on the Me tab." />
            <Faq q="Can I request a specific mod?" a="Yes! Contact us via WhatsApp or Telegram and request any mod." />
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}

const MenuItem = ({ icon, label, onPress, color }) => (
  <TouchableOpacity style={styles.menuItem} onPress={onPress}>
    <Icon name={icon} size={22} color={color || '#4A90E2'} />
    <Text style={styles.menuLabel}>{label}</Text>
    <Icon name="chevron-forward" size={18} color="#666" />
  </TouchableOpacity>
);

const Faq = ({ q, a }) => (
  <View style={styles.faqBox}>
    <Text style={styles.faqQ}>Q: {q}</Text>
    <Text style={styles.faqA}>{a}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0A0A' },
  profileHeader: { alignItems: 'center', padding: 30, backgroundColor: '#1a1a1a' },
  avatarCircle: { width: 90, height: 90, borderRadius: 45, backgroundColor: '#0A0A0A', justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#FFD700' },
  welcomeName: { color: '#FFF', fontSize: 20, fontWeight: 'bold', marginTop: 15 },
  welcomeSub: { color: '#888', fontSize: 12, marginTop: 3 },
  upgradeBtn: { flexDirection: 'row', backgroundColor: '#FFD700', paddingHorizontal: 25, paddingVertical: 10, borderRadius: 25, marginTop: 15, alignItems: 'center' },
  upgradeText: { color: '#000', fontWeight: 'bold', marginLeft: 6, letterSpacing: 1, fontSize: 12 },
  section: { marginTop: 15, backgroundColor: '#1a1a1a', paddingVertical: 10 },
  sectionHead: { flexDirection: 'row', alignItems: 'center', padding: 15 },
  sectionTitle: { color: '#FFF', fontWeight: 'bold', fontSize: 15, marginLeft: 10 },
  empty: { color: '#666', textAlign: 'center', paddingVertical: 15, fontSize: 12 },
  wishCard: { width: 80, marginHorizontal: 6, alignItems: 'center' },
  wishIcon: { width: 60, height: 60, borderRadius: 12, backgroundColor: '#0A0A0A' },
  wishName: { color: '#DDD', fontSize: 11, marginTop: 5, textAlign: 'center' },
  clearBtn: { alignSelf: 'flex-end', marginRight: 15, marginTop: 10 },
  clearText: { color: '#E53935', fontSize: 12 },
  menuItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 15, paddingHorizontal: 20, borderBottomWidth: 1, borderBottomColor: '#0A0A0A' },
  menuLabel: { color: '#FFF', flex: 1, marginLeft: 15, fontSize: 14 },
  version: { color: '#444', textAlign: 'center', marginTop: 20, fontSize: 11 },
  modalContainer: { flex: 1, backgroundColor: '#0A0A0A' },
  modalHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 15, backgroundColor: '#1a1a1a' },
  modalTitle: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
  aboutTitle: { color: '#FFD700', fontSize: 26, fontWeight: 'bold', textAlign: 'center' },
  aboutTag: { color: '#4A90E2', textAlign: 'center', marginTop: 5, marginBottom: 20 },
  aboutText: { color: '#DDD', fontSize: 14, lineHeight: 22 },
  faqBox: { backgroundColor: '#1a1a1a', padding: 15, borderRadius: 10, marginBottom: 12 },
  faqQ: { color: '#FFD700', fontWeight: 'bold', marginBottom: 5 },
  faqA: { color: '#DDD', fontSize: 13, lineHeight: 20 }
});
