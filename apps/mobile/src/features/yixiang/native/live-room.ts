import type { LiveSession } from '../types';

import { Alert, Linking, NativeModules, Platform } from 'react-native';

type NativeBDLLiveModule = {
  openLiveRoom?: (url: string) => Promise<boolean>;
};

const bdlLiveModule = NativeModules.YXBDLLiveModule as NativeBDLLiveModule | undefined;
const missingNativeModuleMessage = '当前安装包未包含火山直播原生组件，请重新安装包含原生模块的开发版 App。';

export function canOpenLiveRoom(session: LiveSession) {
  return session.status !== 'scheduled' && Boolean(session.h5Url);
}

export function showLiveRoomOpenError(error: unknown) {
  Alert.alert('无法打开直播间', getLiveRoomOpenErrorMessage(error));
}

export async function openLiveRoom(url?: string) {
  if (!url) {
    return false;
  }

  if (Platform.OS === 'ios') {
    if (!bdlLiveModule?.openLiveRoom) {
      throw new Error(missingNativeModuleMessage);
    }

    await bdlLiveModule.openLiveRoom(url);
    return true;
  }

  await Linking.openURL(url);
  return true;
}

function getLiveRoomOpenErrorMessage(error: unknown) {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  return '直播间打开失败，请稍后重试。';
}
