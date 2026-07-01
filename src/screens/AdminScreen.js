import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert, ActivityIndicator, StatusBar, Switch, Modal } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { getConfig, verifyAdmin, updateConfig } from '../services/api';

export default function AdminScreen({ navigation }) {
  const [loggedIn, setLoggedIn] = useState(false);
  const [password, setPassword] = useState('');
  const [token, setToken] = useState(null);
  const [config, setConfig] = useState({ apps: [], settings: {}, vip: { plans: [] }, keys: {}, featured: [], news: [] });
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState('dashboard');
  const [editingApp, setEditingApp] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const login = async () => {
    if (!password) return Alert.alert("Error", "Enter password");
    setLoading(true);
    const t = await verifyAdmin(password);
    setLoading(false);
    if (t) {
      setToken(t);
      const cfg = await getConfig();
      setConfig({
        apps: cfg.apps || [],
        settings: cfg.settings || {},
        vip: cfg.vip || { plans: [] },
        keys: cfg.keys || {},
        featured: cfg.featured || [],
        news: cfg.news || []
      });
      setLoggedIn(true);
    } else {
      Alert.alert("❌ Access Denied", "Wrong password");
      setPassword('');
    }
  };

  const save = async () => {
    setLoading(true);
    const ok = await updateConfig(config, token);
    setLoading(false);
    Alert.alert(ok ? "✅ Saved" : "❌ Failed", ok ? "Changes are LIVE!" : "Session expired. Login again.");
    if (!ok) setLoggedIn(false);
  };

  const logout = () => {
    setLoggedIn(false); setToken(null); setPassword('');
    navigation.goBack();
  };

  // ---------- LOGIN ----------
  if (!loggedIn) {
    return (
      <View style={styles.loginContainer}>
        <StatusBar barStyle="light-content" backgroundColor="#0A0A0A" />
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Icon name="close" size={26} color="#FFF" />
        </TouchableOpacity>
        <View style={styles.lockCircle}>
          <Icon name="shield-checkmark" size={50} color="#FFD700" />
        </View>
        <Text style={styles.lockTitle}>ADMIN ACCESS</Text>
        <Text style={styles.lockSub}>Authorized Personnel Only</Text>
        <TextInput
          style={styles.loginInput}
          placeholder="Enter Admin Password"
          placeholderTextColor="#555"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity style={styles.loginBtn} onPress={login} disabled={loading}>
          {loading ? <ActivityIndicator color="#000" /> : <Text style={styles.loginBtnText}>AUTHENTICATE</Text>}
        </TouchableOpacity>
      </View>
    );
  }

  // ---------- HELPERS ----------
  const updateSetting = (k, v) => setConfig({ ...config, settings: { ...config.settings, [k]: v } });
  const updateVip = (k, v) => setConfig({ ...config, vip: { ...config.vip, [k]: v } });

  const emptyApp = () => ({
    name: '', developer: '', type: 'App', category: '', icon: '', cover: '',
    downloadUrl: '', playStoreUrl: '', version: '', size: '', rating: '',
    totalRatings: '', modInfo: '', description: '', screenshots: '',
    featured: false, topApp: false, editorsChoice: false, paid: false
  });

  const openNewApp = () => { setEditingApp({ ...emptyApp(), _new: true }); setModalVisible(true); };
  const openEditApp = (i) => { setEditingApp({ ...config.apps[i], _index: i }); setModalVisible(true); };
  const saveApp = () => {
    const apps = [...config.apps];
    const app = { ...editingApp }; delete app._new; delete app._index;
    if (editingApp._new) apps.push(app);
    else apps[editingApp._index] = app;
    setConfig({ ...config, apps });
    setModalVisible(false); setEditingApp(null);
  };
  const deleteApp = (i) => {
    Alert.alert("Delete?", "This cannot be undone", [
      { text: "Cancel" },
      { text: "Delete", style: "destructive", onPress: () => setConfig({ ...config, apps: config.apps.filter((_, x) => x !== i) }) }
    ]);
  };

  const addPlan = () => setConfig({ ...config, vip: { ...config.vip, plans: [...(config.vip.plans || []), { name: '', price: '', duration: '', desc: '', popular: false }] } });
  const updatePlan = (i, k, v) => { const p = [...config.vip.plans]; p[i] = { ...p[i], [k]: v }; setConfig({ ...config, vip: { ...config.vip, plans: p } }); };
  const removePlan = (i) => setConfig({ ...config, vip: { ...config.vip, plans: config.vip.plans.filter((_, x) => x !== i) } });

  const addFeatured = () => setConfig({ ...config, featured: [...config.featured, { title: '', image: '', link: '' }] });
  const updateFeatured = (i, k, v) => { const f = [...config.featured]; f[i] = { ...f[i], [k]: v }; setConfig({ ...config, featured: f }); };
  const removeFeatured = (i) => setConfig({ ...config, featured: config.featured.filter((_, x) => x !== i) });

  const addKey = () => {
    Alert.prompt ? Alert.prompt("App Name", "Must match app name exactly", n => n && setConfig({ ...config, keys: { ...config.keys, [n]: '' } })) 
    : setConfig({ ...config, keys: { ...config.keys, ['NewApp' + Date.now()]: '' } });
  };
  const updateKey = (n, v) => setConfig({ ...config, keys: { ...config.keys, [n]: v } });
  const removeKey = (n) => { const k = { ...config.keys }; delete k[n]; setConfig({ ...config, keys: k }); };

  const tabs = [
    { id: 'dashboard', icon: 'grid', label: 'Dashboard' },
    { id: 'apps', icon: 'apps', label: 'Apps' },
    { id: 'featured', icon: 'star', label: 'Featured' },
    { id: 'vip', icon: 'diamond', label: 'VIP' },
    { id: 'keys', icon: 'key', label: 'Keys' },
    { id: 'settings', icon: 'settings', label: 'Settings' }
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0A0A0A" />
      
      {/* Top Bar */}
      <View style={styles.topBar}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Icon name="shield-checkmark" size={22} color="#FFD700" />
          <Text style={styles.topTitle}>Admin Dashboard</Text>
        </View>
        <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
          <Icon name="log-out" size={16} color="#FFF" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabBar}>
        {tabs.map(t => (
          <TouchableOpacity key={t.id} style={[styles.tab, tab === t.id && styles.tabActive]} onPress={() => setTab(t.id)}>
            <Icon name={t.icon} size={16} color={tab === t.id ? '#FFD700' : '#888'} />
            <Text style={[styles.tabText, tab === t.id && { color: '#FFD700' }]}>{t.label}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView contentContainerStyle={{ padding: 15, paddingBottom: 100 }}>

        {/* DASHBOARD */}
        {tab === 'dashboard' && (
          <View>
            <View style={styles.statsGrid}>
              <StatCard icon="apps" label="Total Apps" value={config.apps.length} color="#4A90E2" />
              <StatCard icon="star" label="Featured" value={config.featured.length} color="#FFD700" />
              <StatCard icon="key" label="Keys" value={Object.keys(config.keys).length} color="#4CAF50" />
              <StatCard icon="diamond" label="VIP Plans" value={(config.vip.plans || []).length} color="#E91E63" />
            </View>
            <Text style={styles.hint}>Welcome back! Use tabs above to manage everything.</Text>
          </View>
        )}

        {/* APPS */}
        {tab === 'apps' && (
          <View>
            <View style={styles.headRow}>
              <Text style={styles.headTitle}>Manage Apps & Games</Text>
              <TouchableOpacity style={styles.addNewBtn} onPress={openNewApp}>
                <Icon name="add" size={18} color="#FFF" />
                <Text style={styles.addNewText}>Add New</Text>
              </TouchableOpacity>
            </View>
            {config.apps.length === 0 ? (
              <Text style={styles.empty}>No apps yet. Tap "Add New"</Text>
            ) : config.apps.map((a, i) => (
              <View key={i} style={styles.appRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.appRowName} numberOfLines={2}>{a.name || 'Unnamed'}</Text>
                  <Text style={styles.appRowMeta}>{a.category || 'No category'} • {a.type || 'App'} {a.topApp ? '⭐' : ''}</Text>
                </View>
                <TouchableOpacity style={styles.editBtn} onPress={() => openEditApp(i)}>
                  <Text style={styles.editText}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.delBtn} onPress={() => deleteApp(i)}>
                  <Text style={styles.delText}>Delete</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}

        {/* FEATURED */}
        {tab === 'featured' && (
          <View>
            <Text style={styles.hint}>Banners at top of Home screen</Text>
            <TouchableOpacity style={styles.addBtn} onPress={addFeatured}>
              <Icon name="add" size={18} color="#FFF" /><Text style={styles.addText}>Add Banner</Text>
            </TouchableOpacity>
            {config.featured.map((f, i) => (
              <View key={i} style={styles.itemBox}>
                <Field label="Title" value={f.title} onChange={v => updateFeatured(i, 'title', v)} />
                <Field label="Image URL" value={f.image} onChange={v => updateFeatured(i, 'image', v)} />
                <Field label="Link (optional)" value={f.link} onChange={v => updateFeatured(i, 'link', v)} />
                <TouchableOpacity style={styles.delBtn} onPress={() => removeFeatured(i)}><Text style={styles.delText}>Delete</Text></TouchableOpacity>
              </View>
            ))}
          </View>
        )}

        {/* VIP */}
        {tab === 'vip' && (
          <View>
            <Field label="Tagline" value={config.vip.tagline} onChange={v => updateVip('tagline', v)} />
            <Field label="Benefits (one per line)" value={config.vip.benefits} onChange={v => updateVip('benefits', v)} multi />
            <TouchableOpacity style={styles.addBtn} onPress={addPlan}>
              <Icon name="add" size={18} color="#FFF" /><Text style={styles.addText}>Add Plan</Text>
            </TouchableOpacity>
            {(config.vip.plans || []).map((p, i) => (
              <View key={i} style={styles.itemBox}>
                <Field label="Plan Name" value={p.name} onChange={v => updatePlan(i, 'name', v)} />
                <Field label="Price" value={p.price} onChange={v => updatePlan(i, 'price', v)} />
                <Field label="Duration" value={p.duration} onChange={v => updatePlan(i, 'duration', v)} />
                <Field label="Description" value={p.desc} onChange={v => updatePlan(i, 'desc', v)} multi />
                <Toggle label="Mark as Popular" value={p.popular} onChange={v => updatePlan(i, 'popular', v)} />
                <TouchableOpacity style={styles.delBtn} onPress={() => removePlan(i)}><Text style={styles.delText}>Delete</Text></TouchableOpacity>
              </View>
            ))}
          </View>
        )}

        {/* KEYS */}
        {tab === 'keys' && (
          <View>
            <Text style={styles.hint}>License keys per app (name must match exactly)</Text>
            <TouchableOpacity style={styles.addBtn} onPress={addKey}>
              <Icon name="add" size={18} color="#FFF" /><Text style={styles.addText}>Add Key</Text>
            </TouchableOpacity>
            {Object.keys(config.keys).map((n, i) => (
              <View key={i} style={styles.itemBox}>
                <Text style={styles.keyName}>{n}</Text>
                <Field label="License Key" value={config.keys[n]} onChange={v => updateKey(n, v)} />
                <TouchableOpacity style={styles.delBtn} onPress={() => removeKey(n)}><Text style={styles.delText}>Delete</Text></TouchableOpacity>
              </View>
            ))}
          </View>
        )}

        {/* SETTINGS */}
        {tab === 'settings' && (
          <View>
            <Field label="App Name (blue)" value={config.settings.appName} onChange={v => updateSetting('appName', v)} />
            <Field label="App Name (gold)" value={config.settings.appNameGold} onChange={v => updateSetting('appNameGold', v)} />
            <Field label="Contact URL (WhatsApp/Telegram)" value={config.settings.contactUrl} onChange={v => updateSetting('contactUrl', v)} />
            <Field label="Announcement" value={config.settings.banner} onChange={v => updateSetting('banner', v)} />
          </View>
        )}
      </ScrollView>

      {/* Save Button */}
      <TouchableOpacity style={styles.saveFloat} onPress={save} disabled={loading}>
        {loading ? <ActivityIndicator color="#000" /> : (
          <><Icon name="save" size={18} color="#000" /><Text style={styles.saveFloatText}>SAVE CHANGES</Text></>
        )}
      </TouchableOpacity>

      {/* Add/Edit App Modal */}
      <Modal visible={modalVisible} animationType="slide">
        {editingApp && (
          <View style={styles.modalContainer}>
            <View style={styles.modalHead}>
              <Text style={styles.modalTitle}>{editingApp._new ? 'Add New App' : 'Edit App'}</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Icon name="close" size={26} color="#FFF" />
              </TouchableOpacity>
            </View>
            <ScrollView contentContainerStyle={{ padding: 15, paddingBottom: 40 }}>
              <Field label="App Name *" value={editingApp.name} onChange={v => setEditingApp({ ...editingApp, name: v })} />
              <Field label="Developer Name" value={editingApp.developer} onChange={v => setEditingApp({ ...editingApp, developer: v })} />
              <Field label="Type (App/Game/MOD)" value={editingApp.type} onChange={v => setEditingApp({ ...editingApp, type: v })} />
              <Field label="Category *" value={editingApp.category} onChange={v => setEditingApp({ ...editingApp, category: v })} />
              <Field label="Icon URL *" value={editingApp.icon} onChange={v => setEditingApp({ ...editingApp, icon: v })} />
              <Field label="Background Cover URL" value={editingApp.cover} onChange={v => setEditingApp({ ...editingApp, cover: v })} />
              <Field label="Download URL *" value={editingApp.downloadUrl} onChange={v => setEditingApp({ ...editingApp, downloadUrl: v })} />
              <Field label="Version" value={editingApp.version} onChange={v => setEditingApp({ ...editingApp, version: v })} />
              <Field label="Size (e.g. 89.7MB)" value={editingApp.size} onChange={v => setEditingApp({ ...editingApp, size: v })} />
              <Field label="Rating (1-5)" value={editingApp.rating} onChange={v => setEditingApp({ ...editingApp, rating: v })} />
              <Field label="Total Ratings Count" value={editingApp.totalRatings} onChange={v => setEditingApp({ ...editingApp, totalRatings: v })} />
              <Field label="Google Play URL" value={editingApp.playStoreUrl} onChange={v => setEditingApp({ ...editingApp, playStoreUrl: v })} />
              <Field label="Mod Info" value={editingApp.modInfo} onChange={v => setEditingApp({ ...editingApp, modInfo: v })} multi />
              <Field label="Description" value={editingApp.description} onChange={v => setEditingApp({ ...editingApp, description: v })} multi />
              <Field label="Screenshots URLs (comma separated)" value={editingApp.screenshots} onChange={v => setEditingApp({ ...editingApp, screenshots: v })} multi />
              
              <View style={styles.checkRow}>
                <Check label="Featured" value={editingApp.featured} onChange={v => setEditingApp({ ...editingApp, featured: v })} />
                <Check label="Top App" value={editingApp.topApp} onChange={v => setEditingApp({ ...editingApp, topApp: v })} />
              </View>
              <View style={styles.checkRow}>
                <Check label="Editor's Choice" value={editingApp.editorsChoice} onChange={v => setEditingApp({ ...editingApp, editorsChoice: v })} />
                <Check label="Paid" value={editingApp.paid} onChange={v => setEditingApp({ ...editingApp, paid: v })} />
              </View>

              <TouchableOpacity style={styles.modalSave} onPress={saveApp}>
                <Icon name="save" size={18} color="#000" />
                <Text style={styles.modalSaveText}>SAVE APP</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        )}
      </Modal>
    </View>
  );
}

const Field = ({ label, value, onChange, multi }) => (
  <View style={{ marginBottom: 12 }}>
    <Text style={styles.label}>{label}</Text>
    <TextInput
      style={[styles.input, multi && { height: 80, textAlignVertical: 'top' }]}
      value={value || ''}
      onChangeText={onChange}
      placeholderTextColor="#555"
      multiline={multi}
    />
  </View>
);

const Toggle = ({ label, value, onChange }) => (
  <View style={styles.toggleRow}>
    <Text style={styles.toggleLabel}>{label}</Text>
    <Switch value={!!value} onValueChange={onChange} trackColor={{ true: '#FFD700' }} />
  </View>
);

const Check = ({ label, value, onChange }) => (
  <TouchableOpacity style={styles.checkBox} onPress={() => onChange(!value)}>
    <Icon name={value ? "checkbox" : "square-outline"} size={22} color={value ? "#FFD700" : "#666"} />
    <Text style={styles.checkLabel}>{label}</Text>
  </TouchableOpacity>
);

const StatCard = ({ icon, label, value, color }) => (
  <View style={[styles.statCard, { borderLeftColor: color }]}>
    <Icon name={icon} size={22} color={color} />
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0A0A' },
  loginContainer: { flex: 1, backgroundColor: '#0A0A0A', alignItems: 'center', justifyContent: 'center', padding: 30 },
  backBtn: { position: 'absolute', top: 40, right: 20 },
  lockCircle: { width: 110, height: 110, borderRadius: 55, backgroundColor: '#1a1500', justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#FFD700' },
  lockTitle: { fontSize: 24, color: '#FFD700', fontWeight: 'bold', marginTop: 20, letterSpacing: 2 },
  lockSub: { color: '#666', marginTop: 5, marginBottom: 30 },
  loginInput: { width: '100%', backgroundColor: '#1a1a1a', color: '#FFF', padding: 15, borderRadius: 10, borderWidth: 1, borderColor: '#333' },
  loginBtn: { backgroundColor: '#FFD700', width: '100%', padding: 15, borderRadius: 10, alignItems: 'center', marginTop: 15 },
  loginBtnText: { color: '#000', fontWeight: 'bold', letterSpacing: 1 },
  topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 15, backgroundColor: '#1a1a1a' },
  topTitle: { color: '#FFF', fontSize: 16, fontWeight: 'bold', marginLeft: 8 },
  logoutBtn: { flexDirection: 'row', backgroundColor: '#E53935', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6, alignItems: 'center' },
  logoutText: { color: '#FFF', marginLeft: 5, fontSize: 12, fontWeight: 'bold' },
  tabBar: { backgroundColor: '#1a1a1a', maxHeight: 50 },
  tab: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 15, paddingVertical: 12 },
  tabActive: { borderBottomWidth: 2, borderBottomColor: '#FFD700' },
  tabText: { color: '#888', marginLeft: 5, fontSize: 12, fontWeight: '600' },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  statCard: { width: '48%', backgroundColor: '#1a1a1a', padding: 15, borderRadius: 10, marginBottom: 10, borderLeftWidth: 3 },
  statValue: { color: '#FFF', fontSize: 24, fontWeight: 'bold', marginTop: 8 },
  statLabel: { color: '#888', fontSize: 11, marginTop: 3 },
  headRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  headTitle: { color: '#FFF', fontSize: 16, fontWeight: 'bold', flex: 1 },
  addNewBtn: { flexDirection: 'row', backgroundColor: '#4CAF50', paddingHorizontal: 15, paddingVertical: 8, borderRadius: 8, alignItems: 'center' },
  addNewText: { color: '#FFF', fontWeight: 'bold', marginLeft: 4 },
  appRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1a1a1a', padding: 12, borderRadius: 8, marginBottom: 8 },
  appRowName: { color: '#FFF', fontWeight: 'bold', fontSize: 14 },
  appRowMeta: { color: '#888', fontSize: 11, marginTop: 3 },
  editBtn: { backgroundColor: '#2196F3', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6, marginRight: 5 },
  editText: { color: '#FFF', fontSize: 11, fontWeight: 'bold' },
  delBtn: { backgroundColor: '#E53935', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6, alignItems: 'center' },
  delText: { color: '#FFF', fontSize: 11, fontWeight: 'bold' },
  addBtn: { flexDirection: 'row', backgroundColor: '#4CAF50', padding: 12, borderRadius: 8, alignItems: 'center', justifyContent: 'center', marginBottom: 15 },
  addText: { color: '#FFF', fontWeight: 'bold', marginLeft: 5 },
  itemBox: { backgroundColor: '#1a1a1a', padding: 12, borderRadius: 10, marginBottom: 15 },
  keyName: { color: '#FFD700', fontWeight: 'bold', marginBottom: 8 },
  label: { color: '#AAA', fontSize: 11, marginBottom: 5, fontWeight: '600' },
  input: { backgroundColor: '#0A0A0A', color: '#FFF', padding: 10, borderRadius: 6, borderWidth: 1, borderColor: '#333', fontSize: 13 },
  toggleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8 },
  toggleLabel: { color: '#DDD', fontSize: 13 },
  checkRow: { flexDirection: 'row', marginVertical: 8 },
  checkBox: { flexDirection: 'row', alignItems: 'center', marginRight: 20 },
  checkLabel: { color: '#DDD', marginLeft: 8, fontSize: 13 },
  saveFloat: { position: 'absolute', bottom: 20, left: 20, right: 20, flexDirection: 'row', backgroundColor: '#FFD700', padding: 15, borderRadius: 30, alignItems: 'center', justifyContent: 'center', elevation: 5 },
  saveFloatText: { color: '#000', fontWeight: 'bold', marginLeft: 8, letterSpacing: 1 },
  modalContainer: { flex: 1, backgroundColor: '#0A0A0A' },
  modalHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 15, backgroundColor: '#1a1a1a' },
  modalTitle: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
  modalSave: { flexDirection: 'row', backgroundColor: '#FFD700', padding: 15, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginTop: 20 },
  modalSaveText: { color: '#000', fontWeight: 'bold', marginLeft: 8, letterSpacing: 1 },
  hint: { color: '#666', fontSize: 12, marginBottom: 10, fontStyle: 'italic' },
  empty: { color: '#666', textAlign: 'center', marginTop: 30 }
});
