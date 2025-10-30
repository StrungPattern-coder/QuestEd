import Ably from 'ably';

let ablyServerClient: Ably.Rest | null = null;

export const getAblyServerClient = () => {
  if (!ablyServerClient) {
    const ablyKey = process.env.NEXT_PUBLIC_ABLY_KEY || process.env.ABLY_API_KEY || 'demo-key';
    ablyServerClient = new Ably.Rest({ key: ablyKey });
  }
  return ablyServerClient;
};

// Materials
export const publishMaterialAdded = async (classroomId: string, material: any) => {
  try {
    const ably = getAblyServerClient();
    const channel = ably.channels.get(`classroom-${classroomId}-materials`);
    await channel.publish('material-added', material);
  } catch (error) {
    console.error('Failed to publish material-added event:', error);
  }
};

export const publishMaterialDeleted = async (classroomId: string, materialId: string) => {
  try {
    const ably = getAblyServerClient();
    const channel = ably.channels.get(`classroom-${classroomId}-materials`);
    await channel.publish('material-deleted', { materialId });
  } catch (error) {
    console.error('Failed to publish material-deleted event:', error);
  }
};

// Announcements
export const publishAnnouncementAdded = async (classroomId: string, announcement: any) => {
  try {
    const ably = getAblyServerClient();
    const channel = ably.channels.get(`classroom-${classroomId}-announcements`);
    await channel.publish('announcement-added', announcement);
  } catch (error) {
    console.error('Failed to publish announcement-added event:', error);
  }
};

export const publishAnnouncementUpdated = async (classroomId: string, announcement: any) => {
  try {
    const ably = getAblyServerClient();
    const channel = ably.channels.get(`classroom-${classroomId}-announcements`);
    await channel.publish('announcement-updated', announcement);
  } catch (error) {
    console.error('Failed to publish announcement-updated event:', error);
  }
};

export const publishAnnouncementDeleted = async (classroomId: string, announcementId: string) => {
  try {
    const ably = getAblyServerClient();
    const channel = ably.channels.get(`classroom-${classroomId}-announcements`);
    await channel.publish('announcement-deleted', { announcementId });
  } catch (error) {
    console.error('Failed to publish announcement-deleted event:', error);
  }
};
