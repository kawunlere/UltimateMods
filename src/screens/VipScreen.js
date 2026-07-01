import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { getConfig } from '../services/api';

export default function VipScreen() {
  const [vip, setVip] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const cfg = await getConfig();
      setVip(cfg.vip || {});
      setLoading(false);
    })();
  }, []);

  const subscribe = (plan) => {
    Alert.alert("Subscribe", `Contact admin to activate: ${plan.name}`);
  };

  if (loading) return <ActivityIndicator size="large" color="#FFD700" style={{ flex: 1 }} />;

  const plans = vip.plans || [];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <View style={styles.header}>
          <Text style={styles.crown}>👑</Text>
          <Text style={styles.title}>VIP MEMBERSHIP</Text>
          <Text style={styles.subtitle}>{vip.tagline || 'Unlock Premium Power'}</Text>
        </View>

        {vip.benefits ? (
          <View style={styles.benefits}>
            <Text style={styles.benefitsTitle}>✨ VIP Benefits</Text>
            <Text style={styles.benefitsText}>{vip.benefits}</Text>
          </View>
        ) : null}

        {plans.length === 0 ? (
          <Text style={styles.empty}>No plans yet. Add from Admin Panel.</Text>
        ) : (
          plans.map((plan, idx) => (
            <TouchableOpacity key={idx} style={styles.plan} onPress={() => subscribe(plan)}>
              <Text style={styles.planName}>{plan.name}</Text>
              <Text style={styles.planPrice}>{plan.price}</Text>
              <Text style={styles.planDesc}>{plan.desc}</Text>
              <View style={styles.planBtn}>
                <Text style={styles.planBtnText}>SUBSCRIBE</Text>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFDF5' },
  header: { alignItems: 'center', marginBottom: 25 },
  crown: { fontSize: 50 },
  title: { fontSize: 26, fontWeight: '900', color: '#DAA520', letterSpacing: 2, marginTop: 5 },
  subtitle: { color: '#888', marginTop: 5 },
  benefits: { backgroundColor: '#FFF', padding: 15, borderRadius: 12, borderWidth: 1, borderColor: '#FFD700', marginBottom: 20 },
  benefitsTitle: { fontWeight: 'bold', color: '#DAA520', marginBottom: 8 },
  benefitsText: { color: '#555', lineHeight: 20 },
  plan: { backgroundColor: '#FFF', padding: 20, borderRadius: 15, borderWidth: 2, borderColor: '#FFD700', marginBottom: 15, alignItems: 'center', elevation: 3 },
  planName: { fontSize: 20, fontWeight: 'bold', color: '#333' },
  planPrice: { fontSize: 28, fontWeight: '900', color: '#DAA520', marginTop: 5 },
  planDesc: { color: '#666', textAlign: 'center', marginTop: 8, fontSize: 12 },
  planBtn: { backgroundColor: '#FFD700', paddingHorizontal: 40, paddingVertical: 12, borderRadius: 25, marginTop: 15 },
  planBtnText: { color: '#FFF', fontWeight: 'bold', letterSpacing: 1 },
  empty: { textAlign: 'center', color: '#AAA', marginTop: 30 }
});
