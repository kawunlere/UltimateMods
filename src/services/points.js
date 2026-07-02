import AsyncStorage from '@react-native-async-storage/async-storage';

const POINTS_KEY = 'USER_POINTS';
const CHECKIN_KEY = 'LAST_CHECKIN';
const REFERRAL_KEY = 'USER_REFERRAL';

export const getPoints = async () => {
  const p = await AsyncStorage.getItem(POINTS_KEY);
  return p ? parseInt(p) : 0;
};

export const addPoints = async (amount) => {
  const current = await getPoints();
  const newTotal = current + amount;
  await AsyncStorage.setItem(POINTS_KEY, newTotal.toString());
  return newTotal;
};

export const spendPoints = async (amount) => {
  const current = await getPoints();
  if (current < amount) return false;
  await AsyncStorage.setItem(POINTS_KEY, (current - amount).toString());
  return true;
};

export const canCheckInToday = async () => {
  const last = await AsyncStorage.getItem(CHECKIN_KEY);
  if (!last) return true;
  const lastDate = new Date(last).toDateString();
  const today = new Date().toDateString();
  return lastDate !== today;
};

export const doCheckIn = async () => {
  const can = await canCheckInToday();
  if (!can) return { success: false, message: "Already checked in today" };
  await AsyncStorage.setItem(CHECKIN_KEY, new Date().toISOString());
  const newTotal = await addPoints(10);
  return { success: true, points: 10, total: newTotal };
};

export const getReferralCode = async () => {
  let code = await AsyncStorage.getItem(REFERRAL_KEY);
  if (!code) {
    code = 'UM' + Math.random().toString(36).substr(2, 6).toUpperCase();
    await AsyncStorage.setItem(REFERRAL_KEY, code);
  }
  return code;
};

export const useReferralCode = async (code) => {
  const used = await AsyncStorage.getItem('USED_REFERRAL');
  if (used) return { success: false, message: "Already used a referral code" };
  const myCode = await getReferralCode();
  if (code === myCode) return { success: false, message: "Cannot use your own code" };
  await AsyncStorage.setItem('USED_REFERRAL', code);
  const newTotal = await addPoints(50);
  return { success: true, points: 50, total: newTotal };
};
