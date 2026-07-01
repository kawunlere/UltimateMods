import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator, StatusBar, Linking } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { getConfig } from '../services/api';

export default function VipScreen() {
  const [vip, setVip] = useState({});
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const cfg = await getConfig();
      setVip(cfg.vip || {});
      setSettings(cfg.settings || {});
      setLoading(false);
    })();
  }, []);

  const subscribe = (plan) => {
    const contact = settings.contactUrl || '';
    Alert.alert(
      "Subscribe to " + plan.name,
      `Contact admin to activate:\n${plan.price}`,
      [
        { text: "Cancel", style: "cancel" },
        { text: "Contact Now", onPress: () => contact && Linking.openURL(contact) }
      ]
    );
  };

  if (loading) return <View style={styles.center}><ActivityIndicator size="large" color="#FFD700" /></View>;

  const plans = vip.plans || [];
  const benefits = vip.benefits ? vip.benefits.split('\n').filter(Boolean) : [];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0A0A0A" />
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 40 }}>
        
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.crownBox}>
            <Icon name="diamond" size={50} color="#FFD700" />
          </View>
          <Text style={styles.title}>VIP MEMBERSHIP</Text>
          <Text style={styles.subtitle}>{vip.tagline || 'Unlock Premium Power'}</Text>
        </View>

        {/* Benefits List */}
        {benefits.length > 0 && (
          <View style={styles.benefitsBox}>
            <Text style={styles.benefitsTitle}>✨ What You Get</Text>
            {benefits.map((b, i) => (
              <View key={i} style={styles.benefitRow}>
                <Icon name="checkmark-circle" size={18} color="#FFD700" />
                <Text style={styles.benefitText}>{b}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Plans */}
        {plans.length === 0 ? (
          <View style={styles.emptyBox}>
            <Icon name="hourglass-outline" size={40} color="#666" />
            <Text style={styles.empty}>No plans available yet</Text>
          </View>
        ) : (
          plans.map((plan, idx) => (
            <View key={idx} style={[styles.plan, plan.popular && styles.planPopular]}>
              {plan.popular && (
                <View style={styles.popularTag}>
                  <Text style={styles.popularText}>⭐ MOST POPULAR</Text>
                </View>
              )}
              <Text style={styles.planName}>{plan.name}</Text>
              <Text style={styles.planPrice}>{plan.price}</Text>
              <Text style={styles.planDuration}>{plan.duration}</Text>
              <Text style={styles.planDesc}>{plan.desc}</Text>
              <TouchableOpacity style={styles.planBtn} onPress={() => subscribe(plan)}>
                <Text style={styles.planBtnText}>SUBSCRIBE NOW</Text>
              </TouchableOpacity>
            </View>
          ))
        )}

        {/* Trust footer */}
        <View style={styles.trustBox}>
          <Icon name="shield-checkmark" size={20} color="#4A90E2" />
          <Text style={styles.trustText}>Secure • Trusted • 24/7 Support</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0A0A' },
  center: { flex: 1, backgroundColor: '#0A0A0A', justifyContent: 'center', alignItems: 'center' },
  header: { alignItems: 'center', marginBottom: 25 },
  crownBox: { width: 90, height: 90, borderRadius: 45, backgroundColor: '#1a1500', justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#FFD700' },
  title: { fontSize: 26, fontWeight: '900', color: '#FFD700', letterSpacing: 2, marginTop: 15 },
  subtitle: { color: '#888', marginTop: 5 },
  benefitsBox: { backgroundColor: '#1a1a1a', padding: 20, borderRadius: 15, marginBottom: 20 },
  benefitsTitle: { color: '#FFD700', fontWeight: 'bold', fontSize: 14, marginBottom: 12 },
  benefitRow: { flexDirection: 'row', alignItems: 'center', marginVertical: 5 },
  benefitText: { color: '#DDD', marginLeft: 10, fontSize: 13, flex: 1 },
  plan: { backgroundColor: '#1a1a1a', padding: 25, borderRadius: 18, marginBottom: 15, alignItems: 'center', borderWidth: 1, borderColor: '#333' },
  planPopular: { borderColor: '#FFD700', borderWidth: 2 },
  popularTag: { position: 'absolute', top: -10, backgroundColor: '#FFD700', paddingHorizontal: 15, paddingVertical: 4, borderRadius: 10 },
  popularText: { color: '#000', fontWeight: 'bold', fontSize: 10 },
  planName: { fontSize: 20, fontWeight: 'bold', color: '#FFF', marginTop: 5 },
  planPrice: { fontSize: 32, fontWeight: '900', color: '#FFD700', marginTop: 8 },
  planDuration: { color: '#888', fontSize: 12 },
  planDesc: { color: '#AAA', textAlign: 'center', marginTop: 10, fontSize: 12, lineHeight: 18 },
  planBtn: { backgroundColor: '#FFD700', paddingHorizontal: 50, paddingVertical: 13, borderRadius: 25, marginTop: 15 },
  planBtnText: { color: '#000', fontWeight: 'bold', letterSpacing: 1 },
  emptyBox: { alignItems: 'center', padding: 40 },
  empty: { color: '#666', marginTop: 10 },
  trustBox: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 20 },
  trustText: { color: '#666', marginLeft: 8, fontSize: 12 }
});
