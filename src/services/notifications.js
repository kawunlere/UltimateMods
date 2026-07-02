import notifee, { AndroidImportance, AndroidStyle } from '@notifee/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getConfigFresh } from './api';

const CHANNEL_ID = 'ultimate_mods_channel';
const PERSISTENT_ID = 'persistent_bar';

export const setupNotifications = async () => {
  await notifee.requestPermission();
  await notifee.createChannel({
    id: CHANNEL_ID,
    name: 'Ultimate Mods Updates',
    importance: AndroidImportance.HIGH,
    sound: 'default',
    vibration: true
  });
  await notifee.createChannel({
    id: PERSISTENT_ID,
    name: 'Featured Apps Bar',
    importance: AndroidImportance.LOW
  });
};

export const showPersistentBar = async (apps) => {
  if (!apps || apps.length === 0) return;
  const top = apps.slice(0, 4);
  const list = top.map(a => `• ${a.name}`).join('\n');
  
  await notifee.displayNotification({
    id: 'persistent-bar',
    title: '🎮 Ultimate Mods',
    body: `${top.length} featured apps waiting for you`,
    android: {
      channelId: PERSISTENT_ID,
      ongoing: true,
      autoCancel: false,
      smallIcon: 'ic_launcher',
      color: '#FFD700',
      style: { type: AndroidStyle.BIGTEXT, text: list },
      pressAction: { id: 'default' }
    }
  });
};

export const showUpdateNotification = async (appName, version) => {
  await notifee.displayNotification({
    title: `🔄 Update Available: ${appName}`,
    body: `New version ${version} is out! Tap to download.`,
    android: {
      channelId: CHANNEL_ID,
      smallIcon: 'ic_launcher',
      color: '#FFD700',
      pressAction: { id: 'default' }
    }
  });
};

export const showNewsNotification = async (title, excerpt) => {
  await notifee.displayNotification({
    title: `📰 ${title}`,
    body: excerpt || 'Tap to read more',
    android: {
      channelId: CHANNEL_ID,
      smallIcon: 'ic_launcher',
      color: '#FFD700',
      pressAction: { id: 'default' }
    }
  });
};

export const showNewAppNotification = async (appName) => {
  await notifee.displayNotification({
    title: `🆕 New Mod: ${appName}`,
    body: `Just added! Tap to check it out.`,
    android: {
      channelId: CHANNEL_ID,
      smallIcon: 'ic_launcher',
      color: '#FFD700',
      pressAction: { id: 'default' }
    }
  });
};

// Check for updates by comparing cached vs fresh config
export const checkForUpdates = async () => {
  try {
    const lastSnapshot = await AsyncStorage.getItem('LAST_SNAPSHOT');
    const oldData = lastSnapshot ? JSON.parse(lastSnapshot) : { apps: [], news: [] };
    const fresh = await getConfigFresh();

    // Check new apps
    const oldAppNames = (oldData.apps || []).map(a => a.name);
    const newApps = (fresh.apps || []).filter(a => !oldAppNames.includes(a.name));
    for (const app of newApps) {
      await showNewAppNotification(app.name);
    }

    // Check version updates
    for (const app of (fresh.apps || [])) {
      const old = (oldData.apps || []).find(a => a.name === app.name);
      if (old && old.version && app.version && old.version !== app.version) {
        await showUpdateNotification(app.name, app.version);
      }
    }

    // Check new news
    const oldNewsTitles = (oldData.news || []).map(n => n.title);
    const newArticles = (fresh.news || []).filter(n => !oldNewsTitles.includes(n.title));
    for (const article of newArticles.slice(0, 3)) {
      await showNewsNotification(article.title, article.excerpt);
    }

    // Update persistent bar with featured/top apps
    const featured = (fresh.apps || []).filter(a => a.topApp || a.featured);
    if (featured.length > 0) {
      await showPersistentBar(featured);
    }

    // Save snapshot
    await AsyncStorage.setItem('LAST_SNAPSHOT', JSON.stringify({ apps: fresh.apps, news: fresh.news }));
  } catch (e) {
    console.log('Update check error:', e);
  }
};
