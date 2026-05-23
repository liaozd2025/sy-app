import { liveSessions } from '../mock-data';
import { canOpenLiveRoom } from './live-room';

describe('live room helpers', () => {
  it('allows live and replay sessions with H5 URLs', () => {
    const playableSessions = liveSessions.filter(session => session.status !== 'scheduled');

    expect(playableSessions.length).toBeGreaterThan(0);
    expect(playableSessions.every(canOpenLiveRoom)).toBe(true);
  });

  it('does not open scheduled sessions', () => {
    const scheduledSession = liveSessions.find(session => session.status === 'scheduled');

    expect(scheduledSession).toBeDefined();
    expect(canOpenLiveRoom(scheduledSession!)).toBe(false);
  });
});
