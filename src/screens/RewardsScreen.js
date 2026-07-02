import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Share, StatusBar, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { getPoints, doCheckIn, canCheckInToday, getReferralCode, useReferralCode } from '../services/points';
import { showToast } from '../services/toast';

export default function RewardsScreen({ navigation }) {
  const [points, setPoints] = useState(0);
  const [canCheckIn, setCanCheckIn] = useState(false);
  const [myCode, setMyCode] = useState('');
  const [inputCode, setInputCode] = useState('');
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    setPoints(await getPoints());
    setCanCheckIn(await canCheckInToday());
    setMyCode(await getReferralCode());
    setLoading(false);
  };

  useEffect(() => {
    load();
    const unsub = navigation.addListener('focus', load);
    return unsub;
  }, [navigation]);

  const checkIn = async () => {
    const res = await doCheckIn();
    if (res.success) {
      showToast(`+${res.points} points! Total: ${res.total}`, 'gold');
      load();
    } else {
      showToast(res.message, 'warning');
    }
  };

  const applyReferral = async () => {
    if (!inputCode.trim()) return showToast("Enter a code", "warning");
    const res = await useReferralCode(inputCode.trim().toUpperCase());
    if (res.success) {
      showToast(`+${res.points} points!`, 'gold');
      setInputCode('');
      load();
    } else {
      showToast(res.message, 'error');
    }
  };

  const shareCode = async () => {
    try {
      await Share.share({
        message: `Join me on Ultimate Mods! Use my referral code: ${myCode} to get 50 bonus points!`
      });
    } catch (e) {}
  };

  if (loading) return <View style={styles.center}><ActivityIndicator size="large" color="#FFD700" /></View>;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0A0A0A" />
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 40 }}>
        
        {/* Points Balance */}
        <View style={styles.balanceBox}>
          <Icon name="wallet" size={30} color="#FFD700" />
          <Text style={styles.balanceLabel}>Your Points</Text>
          <Text style={styles.balanceValue}>{points}</Text>
        </View>

        {/* Daily Check-in */}
        <View style={styles.card}>
          <View style={styles.cardHead}>
            <Icon name="calendar" size={20} color="#4A90E2" />
            <Text style={styles.cardTitle}>Daily Check-in</Text>
          </View>
          <Text style={styles.cardDesc}>Earn 10 points every day just for opening the app!</Text>
          <TouchableOpacity 
            style={[styles.actionBtn, !canCheckIn && styles.actionBtnDisabled]} 
            onPress={checkIn} 
            disabled={!canCheckIn}
          >
            <Icon name={canCheckIn ? "gift" : "checkmark-circle"} size={18} color={canCheckIn ? "#000" : "#666"} />
            <Text style={[styles.actionBtnText, !canCheckIn && { color: '#666' }]}>
              {canCheckIn ? "CLAIM +10 POINTS" : "ALREADY CLAIMED TODAY"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Referral System */}
        <View style={styles.card}>
          <View style={styles.cardHead}>
            <Icon name="people" size={20} color="#E91E63" />
            <Text style={styles.cardTitle}>Referral Program</Text>
          </View>
          <Text style={styles.cardDesc}>Share your code, friends get 50 points, you earn too!</Text>
          
          <View style={styles.codeBox}>
            <Text style={styles.codeLabel}>YOUR CODE</Text>
            <Text style={styles.codeValue}>{myCode}</Text>
          </View>

          <TouchableOpacity style={styles.shareBtn} onPress={shareCode}>
            <Icon name="share-social" size={18} color="#FFF" />
            <Text style={styles.shareBtnText}>SHARE CODE</Text>
          </TouchableOpacity>

          <Text style={styles.orText}>— OR —</Text>
          <Text style={styles.subLabel}>Have a friend's code?</Text>
          <View style={styles.inputRow}>
            <TextInput 
              style={styles.input} 
              placeholder="Enter code (e.g. UM123ABC)" 
              placeholderTextColor="#666"
              value={inputCode}
              onChangeText={setInputCode}
              autoCapitalize="characters"
            />
            <TouchableOpacity style={styles.applyBtn} onPress={applyReferral}>
              <Text style={styles.applyText}>APPLY</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* How to earn more */}
        <View style={styles.card}>
          <View style={styles.cardHead}>
            <Icon name="trending-up" size={20} color="#4CAF50" />
            <Text style={styles.cardTitle}>How to Earn More</Text>
          </View>
          <Earn icon="calendar" text="Daily check-in" points="+10" />
          <Earn icon="people" text="Refer a friend" points="+50" />
          <Earn icon="star" text="Post a review" points="+5" />
          <Earn icon="share-social" text="Share the app" points="+15" />
        </View>

      </ScrollView>
    </View>
  );
}

const Earn = ({ icon, text, points }) => (
  <View style={styles.earnRow}>
    <Icon name={icon} size={16} color="#888" />
    <Text style={styles.earnText}>{text}</Text>
    <Text style={styles.earnPoints}>{points}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0A0A' },
  center: { flex: 1, backgroundColor: '#0A0A0A', justifyContent: 'center', alignItems: 'center' },
  balanceBox: { backgroundColor: '#1a1500', borderWidth: 2, borderColor: '#FFD700', padding: 25, borderRadius: 20, alignItems: 'center', marginBottom: 20 },
  balanceLabel: { color: '#DAA520', marginTop: 8, fontSize: 12, letterSpacing: 1 },
  balanceValue: { color: '#FFD700', fontSize: 48, fontWeight: '900', marginTop: 5 },
  card: { backgroundColor: '#1a1a1a', padding: 18, borderRadius: 15, marginBottom: 15 },
  cardHead: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  cardTitle: { color: '#FFF', fontWeight: 'bold', fontSize: 15, marginLeft: 8 },
  cardDesc: { color: '#AAA', fontSize: 12, marginBottom: 15, lineHeight: 18 },
  actionBtn: { flexDirection: 'row', backgroundColor: '#FFD700', padding: 14, borderRadius: 25, justifyContent: 'center', alignItems: 'center' },
  actionBtnDisabled: { backgroundColor: '#2a2a2a' },
  actionBtnText: { color: '#000', fontWeight: 'bold', marginLeft: 8, letterSpacing: 1 },
  codeBox: { backgroundColor: '#0A0A0A', padding: 15, borderRadius: 10, alignItems: 'center', marginBottom: 12 },
  codeLabel: { color: '#666', fontSize: 10, letterSpacing: 1 },
  codeValue: { color: '#FFD700', fontSize: 24, fontWeight: 'bold', marginTop: 5, letterSpacing: 3 },
  shareBtn: { flexDirection: 'row', backgroundColor: '#E91E63', padding: 12, borderRadius: 25, justifyContent: 'center', alignItems: 'center' },
  shareBtnText: { color: '#FFF', fontWeight: 'bold', marginLeft: 8, letterSpacing: 1 },
  orText: { color: '#666', textAlign: 'center', marginVertical: 15, fontSize: 11, letterSpacing: 2 },
  subLabel: { color: '#AAA', fontSize: 12, marginBottom: 8 },
  inputRow: { flexDirection: 'row' },
  input: { flex: 1, backgroundColor: '#0A0A0A', color: '#FFF', padding: 12, borderRadius: 8, borderWidth: 1, borderColor: '#333', marginRight: 8 },
  applyBtn: { backgroundColor: '#4A90E2', paddingHorizontal: 20, borderRadius: 8, justifyContent: 'center' },
  applyText: { color: '#FFF', fontWeight: 'bold' },
  earnRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#0A0A0A' },
  earnText: { color: '#DDD', flex: 1, marginLeft: 10, fontSize: 13 },
  earnPoints: { color: '#FFD700', fontWeight: 'bold' }
});
