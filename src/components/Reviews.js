import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ActivityIndicator, Modal } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { getReviews, addReview } from '../services/api';
import { showToast } from '../services/toast';

export default function Reviews({ appName }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [username, setUsername] = useState('');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const load = async () => {
    setLoading(true);
    const r = await getReviews(appName);
    setReviews(r);
    setLoading(false);
  };

  useEffect(() => { load(); }, [appName]);

  const submit = async () => {
    if (!username.trim() || !comment.trim()) {
      showToast("Please fill all fields", "warning");
      return;
    }
    setSubmitting(true);
    const ok = await addReview(appName, username, rating, comment);
    setSubmitting(false);
    if (ok) {
      showToast("Review posted!", "success");
      setModalVisible(false);
      setUsername(''); setComment(''); setRating(5);
      load();
    } else {
      showToast("Failed to post", "error");
    }
  };

  const avgRating = reviews.length > 0 
    ? (reviews.reduce((s, r) => s + (r.rating || 0), 0) / reviews.length).toFixed(1)
    : '0.0';

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Reviews ({reviews.length})</Text>
        <TouchableOpacity style={styles.writeBtn} onPress={() => setModalVisible(true)}>
          <Icon name="create-outline" size={16} color="#000" />
          <Text style={styles.writeBtnText}>Write</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator color="#FFD700" style={{ marginVertical: 20 }} />
      ) : reviews.length === 0 ? (
        <Text style={styles.empty}>No reviews yet. Be the first!</Text>
      ) : (
        <>
          <View style={styles.avgBox}>
            <Text style={styles.avgNumber}>{avgRating}</Text>
            <View style={styles.avgStars}>
              {[1,2,3,4,5].map(i => (
                <Icon key={i} name={i <= parseFloat(avgRating) ? "star" : "star-outline"} size={16} color="#FFD700" />
              ))}
              <Text style={styles.avgCount}>{reviews.length} reviews</Text>
            </View>
          </View>
          {reviews.slice(0, 5).map((r, i) => (
            <View key={i} style={styles.reviewBox}>
              <View style={styles.reviewHead}>
                <View style={styles.avatar}><Text style={styles.avatarText}>{(r.username || '?').charAt(0).toUpperCase()}</Text></View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.reviewUser}>{r.username}</Text>
                  <View style={{ flexDirection: 'row' }}>
                    {[1,2,3,4,5].map(x => (
                      <Icon key={x} name={x <= r.rating ? "star" : "star-outline"} size={11} color="#FFD700" />
                    ))}
                  </View>
                </View>
                <Text style={styles.reviewDate}>{new Date(r.date).toLocaleDateString()}</Text>
              </View>
              <Text style={styles.reviewText}>{r.comment}</Text>
            </View>
          ))}
        </>
      )}

      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalBg}>
          <View style={styles.modalBox}>
            <View style={styles.modalHead}>
              <Text style={styles.modalTitle}>Write a Review</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Icon name="close" size={24} color="#FFF" />
              </TouchableOpacity>
            </View>
            <TextInput 
              style={styles.input} 
              placeholder="Your Name" 
              placeholderTextColor="#666"
              value={username} 
              onChangeText={setUsername} 
            />
            <View style={styles.starPicker}>
              {[1,2,3,4,5].map(i => (
                <TouchableOpacity key={i} onPress={() => setRating(i)}>
                  <Icon name={i <= rating ? "star" : "star-outline"} size={32} color="#FFD700" />
                </TouchableOpacity>
              ))}
            </View>
            <TextInput 
              style={[styles.input, { height: 80, textAlignVertical: 'top' }]} 
              placeholder="Your review..." 
              placeholderTextColor="#666"
              value={comment} 
              onChangeText={setComment} 
              multiline 
            />
            <TouchableOpacity style={styles.submitBtn} onPress={submit} disabled={submitting}>
              {submitting ? <ActivityIndicator color="#000" /> : <Text style={styles.submitText}>POST REVIEW</Text>}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 15 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  title: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
  writeBtn: { flexDirection: 'row', backgroundColor: '#FFD700', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 15, alignItems: 'center' },
  writeBtnText: { color: '#000', fontWeight: 'bold', marginLeft: 4, fontSize: 12 },
  empty: { color: '#666', textAlign: 'center', marginVertical: 20 },
  avgBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1a1a1a', padding: 15, borderRadius: 12, marginBottom: 15 },
  avgNumber: { color: '#FFD700', fontSize: 40, fontWeight: 'bold', marginRight: 15 },
  avgStars: { flex: 1 },
  avgCount: { color: '#888', fontSize: 12, marginTop: 4 },
  reviewBox: { backgroundColor: '#1a1a1a', padding: 12, borderRadius: 10, marginBottom: 10 },
  reviewHead: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  avatar: { width: 34, height: 34, borderRadius: 17, backgroundColor: '#FFD700', justifyContent: 'center', alignItems: 'center', marginRight: 10 },
  avatarText: { color: '#000', fontWeight: 'bold' },
  reviewUser: { color: '#FFF', fontWeight: 'bold', fontSize: 13 },
  reviewDate: { color: '#666', fontSize: 10 },
  reviewText: { color: '#DDD', fontSize: 13, lineHeight: 18 },
  modalBg: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'flex-end' },
  modalBox: { backgroundColor: '#1a1a1a', padding: 20, borderTopLeftRadius: 20, borderTopRightRadius: 20 },
  modalHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  modalTitle: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
  input: { backgroundColor: '#0A0A0A', color: '#FFF', padding: 12, borderRadius: 8, marginBottom: 10, borderWidth: 1, borderColor: '#333' },
  starPicker: { flexDirection: 'row', justifyContent: 'center', marginVertical: 15 },
  submitBtn: { backgroundColor: '#FFD700', padding: 15, borderRadius: 25, alignItems: 'center', marginTop: 10 },
  submitText: { color: '#000', fontWeight: 'bold', letterSpacing: 1 }
});
