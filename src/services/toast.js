import Toast from 'react-native-root-toast';

export const showToast = (message, type = 'info') => {
  const colors = {
    success: '#4CAF50',
    error: '#E53935',
    warning: '#FF9800',
    info: '#4A90E2',
    gold: '#FFD700'
  };
  
  Toast.show(message, {
    duration: Toast.durations.SHORT,
    position: Toast.positions.BOTTOM,
    backgroundColor: colors[type] || colors.info,
    textColor: type === 'gold' ? '#000' : '#FFF',
    shadow: true,
    animation: true,
    hideOnPress: true,
    delay: 0,
    containerStyle: { borderRadius: 25, paddingHorizontal: 20 }
  });
};
