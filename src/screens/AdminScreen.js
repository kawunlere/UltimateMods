import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { getConfig, updateConfig } from '../services/api';

export default function AdminScreen() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [password, setPassword] = useState('');
  const [config, setConfig] = useState({ mods: [], settings: {}, vip: { plans: [] }, keys: {} });
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState('settings');

  const login = async () => {
    setLoading(true);
    const cfg = await getConfig();
    setConfig({
      mods: cfg.mods || [],
      settings: cfg.settings || {},
      vip: cfg.vip || { plans: [] },
      keys: cfg.keys || {}
    });
    setLoggedIn(true);
    setLoading(false);
  };

  const save = async () => {
    setLoading(true);
    const ok = await updateConfig(config, password);
    setLoading(false);
    Alert.alert(ok ? "Saved ✅" : "Failed ❌", ok ? "Changes are live!" : "Wrong password or error.");
  };

  // ---------- LOGIN SCREEN ----------
  if (!loggedIn) {
    return (
      <SafeAreaView style={styles.loginBox}>
        <Text style={styles.lockIcon}>🔒</Text>
        <Text style={styles.loginTitle}>SECRET ADMIN ROOM</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter Admin Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity style={styles.loginBtn} onPress={login} disabled={loading}>
          {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.btnText}>ENTER</Text>}
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  // ---------- HELPERS ----------
  const updateSetting = (k, v) => setConfig({ ...config, settings: { ...config.settings, [k]: v } });
  const updateVip = (k, v) => setConfig({ ...config, vip: { ...config.vip, [k]: v } });

  const addMod = () => setConfig({ ...config, mods: [...config.mods, { name: '', desc: '', img: '', features: '', version: '', size: '', downloadUrl: '' }] });
  const updateMod = (i, k, v) => {
    const m = [...config.mods]; m[i] = { ...m[i], [k]: v }; setConfig({ ...config, mods: m });
  };
  const removeMod = (i) => setConfig({ ...config, mods: config.mods.filter((_, x) => x !== i) });

  const addPlan = () => setConfig({ ...config, vip: { ...config.vip, plans: [...(config.vip.plans || []), { name: '', price: '', desc: '' }] } });
  const updatePlan = (i, k, v) => {
    const p = [...config.vip.plans]; p[i] = { ...p[i], [k]: v }; setConfig({ ...config, vip: { ...config.vip, plans: p } });
  };
  const removePlan = (i) => setConfig({ ...config, vip: { ...config.vip, plans: config.vip.plans.filter((_, x) => x !== i) } });

  const addKey = () => {
    const name = prompt ? prompt("Mod name?") : '';
    if (name) setConfig({ ...config, keys: { ...config.keys, [name]: '' } });
  };
  const updateKey = (name, val) => setConfig({ ...config, keys: { ...config.keys, [name]: val } });
  const removeKey = (name) => { const k = { ...config.keys }; delete k[name]; setConfig({ ...config, keys: k }); };

  // ---------- MAIN PANEL ----------
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topBar}>
        <Text style={styles.topTitle}>👑 ADMIN PANEL</Text>
        <TouchableOpacity style={styles.saveBtn} onPress={save} disabled={loading}>
          {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.saveText}>SAVE</Text>}
        </TouchableOpacity>
      </View>

      <View style={styles.tabs}>
        {['settings', 'mods', 'vip', 'keys'].map(t => (
          <TouchableOpacity key={t} style={[styles.tab, tab === t && styles.tabActive]} onPress={() => setTab(t)}>
            <Text style={[styles.tabText, tab === t && styles.tabTextActive]}>{t.toUpperCase()}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView contentContainerStyle={{ padding: 15 }}>
        {tab === 'settings' && (
          <View>
            <Text style={styles.label}>App Name (blue part)</Text>
            <TextInput style={styles.input} value={config.settings.appName} onChangeText={v => updateSetting('appName', v)} placeholder="ULTIMATE" />
            <Text style={styles.label}>App Name (gold part)</Text>
            <TextInput style={styles.input} value={config.settings.appNameGold} onChangeText={v => updateSetting('appNameGold', v)} placeholder="MODS" />
            <Text style={styles.label}>Background Color (hex)</Text>
            <TextInput style={styles.input} value={config.settings.bgColor} onChangeText={v => updateSetting('bgColor', v)} placeholder="#FFFFFF" />
            <Text style={styles.label}>Announcement Banner</Text>
            <TextInput style={styles.input} value={config.settings.banner} onChangeText={v => updateSetting('banner', v)} placeholder="Welcome message" />
          </View>
        )}

        {tab === 'mods' && (
          <View>
            <TouchableOpacity style={styles.addBtn} onPress={addMod}><Text style={styles.addText}>+ ADD MOD</Text></TouchableOpacity>
            {config.mods.map((m, i) => (
              <View key={i} style={styles.itemBox}>
                <TextInput style={styles.input} value={m.name} onChangeText={v => updateMod(i, 'name', v)} placeholder="Name" />
                <TextInput style={styles.input} value={m.desc} onChangeText={v => updateMod(i, 'desc', v)} placeholder="Short description" />
                <TextInput style={styles.input} value={m.img} onChangeText={v => updateMod(i, 'img', v)} placeholder="Image URL" />
                <TextInput style={styles.input} value={m.features} onChangeText={v => updateMod(i, 'features', v)} placeholder="Features" multiline />
                <TextInput style={styles.input} value={m.version} onChangeText={v => updateMod(i, 'version', v)} placeholder="Version" />
                <TextInput style={styles.input} value={m.size} onChangeText={v => updateMod(i, 'size', v)} placeholder="Size (e.g. 120MB)" />
                <TextInput style={styles.input} value={m.downloadUrl} onChangeText={v => updateMod(i, 'downloadUrl', v)} placeholder="Download URL" />
                <TouchableOpacity style={styles.delBtn} onPress={() => removeMod(i)}><Text style={styles.delText}>🗑 DELETE</Text></TouchableOpacity>
              </View>
            ))}
          </View>
        )}

        {tab === 'vip' && (
          <View>
            <Text style={styles.label}>Tagline</Text>
            <TextInput style={styles.input} value={config.vip.tagline} onChangeText={v => updateVip('tagline', v)} placeholder="Unlock Premium Power" />
            <Text style={styles.label}>Benefits</Text>
            <TextInput style={styles.input} value={config.vip.benefits} onChangeText={v => updateVip('benefits', v)} placeholder="List benefits" multiline />
            <TouchableOpacity style={styles.addBtn} onPress={addPlan}><Text style={styles.addText}>+ ADD PLAN</Text></TouchableOpacity>
            {(config.vip.plans || []).map((p, i) => (
              <View key={i} style={styles.itemBox}>
                <TextInput style={styles.input} value={p.name} onChangeText={v => updatePlan(i, 'name', v)} placeholder="Plan name" />
                <TextInput style={styles.input} value={p.price} onChangeText={v => updatePlan(i, 'price', v)} placeholder="Price" />
                <TextInput style={styles.input} value={p.desc} onChangeText={v => updatePlan(i, 'desc', v)} placeholder="Description" />
                <TouchableOpacity style={styles.delBtn} onPress={() => removePlan(i)}><Text style={styles.delText}>🗑 DELETE</Text></TouchableOpacity>
              </View>
            ))}
          </View>
        )}

        {tab === 'keys' && (
          <View>
            <Text style={styles.hint}>Add license keys for each mod. The "Mod Name" must match exactly.</Text>
            <TouchableOpacity style={styles.addBtn} onPress={() => {
              const name = 'NewMod' + Date.now();
              setConfig({ ...config, keys: { ...config.keys, [name]: '' } });
            }}><Text style={styles.addText}>+ ADD KEY</Text></TouchableOpacity>
            {Object.keys(config.keys || {}).map((name, i) => (
              <View key={i} style={styles.itemBox}>
                <Text style={styles.label}>Mod: {name}</Text>
                <TextInput style={styles.input} value={config.keys[name]} onChangeText={v => updateKey(name, v)} placeholder="License Key" />
                <TouchableOpacity style={styles.delBtn} onPress={() => removeKey(name)}><Text style={styles.delText}>🗑 DELETE</Text></TouchableOpacity>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9F9F9' },
  loginBox: { flex: 1, backgroundColor: '#FFF', alignItems: 'center', justifyContent: 'center', padding: 30 },
  lockIcon: { fontSize: 60 },
  loginTitle: { fontSize: 22, fontWeight: 'bold', color: '#DAA520', marginVertical: 20, letterSpacing: 1 },
  loginBtn: { backgroundColor: '#FFD700', padding: 15, borderRadius: 10, width: '100%', alignItems: 'center', marginTop: 10 },
  btnText: { color: '#FFF', fontWeight: 'bold' },
  topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 15, backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: '#EEE' },
  topTitle: { fontSize: 18, fontWeight: 'bold', color: '#DAA520' },
  saveBtn: { backgroundColor: '#FFD700', paddingHorizontal: 20, paddingVertical: 8, borderRadius: 8 },
  saveText: { color: '#FFF', fontWeight: 'bold' },
  tabs: { flexDirection: 'row', backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: '#EEE' },
  tab: { flex: 1, padding: 12, alignItems: 'center' },
  tabActive: { borderBottomWidth: 3, borderBottomColor: '#FFD700' },
  tabText: { color: '#888', fontSize: 12, fontWeight: '600' },
  tabTextActive: { color: '#DAA520' },
  label: { color: '#666', fontSize: 12, marginTop: 10, marginBottom: 5, fontWeight: '600' },
  input: { backgroundColor: '#FFF', borderWidth: 1, borderColor: '#DDD', borderRadius: 8, padding: 12, marginBottom: 8, color: '#333' },
  itemBox: { backgroundColor: '#FFF', padding: 12, borderRadius: 10, marginBottom: 15, borderWidth: 1, borderColor: '#FFE699' },
  addBtn: { backgroundColor: '#87CEEB', padding: 12, borderRadius: 8, alignItems: 'center', marginBottom: 15 },
  addText: { color: '#FFF', fontWeight: 'bold' },
  delBtn: { backgroundColor: '#FFEBEE', padding: 10, borderRadius: 8, alignItems: 'center', marginTop: 5 },
  delText: { color: '#C62828', fontWeight: 'bold' },
  hint: { color: '#888', fontSize: 12, marginBottom: 10, fontStyle: 'italic' }
});
