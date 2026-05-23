import type {
  ChatMessage,
  CourseChapter,
  DiscoveryFeedItem,
  EncyclopediaEntry,
  HealthContent,
  LiveMaterial,
  LiveSession,
  ProfileSummary,
  QuizQuestion,
} from './types';

export const volcengineDemoLiveRoomUrl = 'https://live.byteoc.com/2619/websdkdemo';

export const liveSessions: LiveSession[] = [
  {
    id: 'sleep-live',
    title: '睡眠修复课：稳定节奏',
    teacher: '林静',
    subtitle: '课件开放 · 课后可咨询',
    timeLabel: 'NOW',
    status: 'live',
    audience: '8,216 人正在看',
    h5Url: volcengineDemoLiveRoomUrl,
    topic: '睡眠专题',
    description: '从作息节律、睡前光线和晚间饮食三个角度，带会员建立可执行的睡眠修复方案。',
  },
  {
    id: 'after-meal',
    title: '饭后活动怎么安排',
    teacher: '周允',
    subtitle: '适合久坐和控糖人群',
    timeLabel: '20:00',
    status: 'scheduled',
    topic: '运动恢复',
    description: '拆解饭后慢走、拉伸和禁忌动作，帮助会员把饭后活动安排得更稳定。',
  },
  {
    id: 'dinner-sleep',
    title: '晚餐份量和睡前饥饿感',
    teacher: '陈禾',
    subtitle: '饮食记录表可领取',
    timeLabel: '21:30',
    status: 'scheduled',
    topic: '饮食管理',
    description: '结合私域会员常见饮食记录，说明晚餐份量、饱腹感和睡眠之间的关系。',
  },
  {
    id: 'season-care',
    title: '四季养护入门',
    teacher: '周允',
    subtitle: '已看 58% · 继续第 3 节',
    timeLabel: '回放',
    status: 'replay',
    progress: 58,
    durationLabel: '42:30',
    h5Url: volcengineDemoLiveRoomUrl,
    topic: '养生百科',
    description: '按春夏秋冬的节气变化，讲解睡眠、饮食和日常护理的基础原则。',
  },
  {
    id: 'bedroom-check',
    title: '睡前环境自查',
    teacher: '林静',
    subtitle: '含 7 分钟短视频和自查表',
    timeLabel: '回放',
    status: 'replay',
    h5Url: volcengineDemoLiveRoomUrl,
    topic: '睡眠专题',
    description: '用一张自查表快速排查卧室光线、噪音、温度和睡前设备使用问题。',
  },
];

export const healthContents: HealthContent[] = [
  {
    id: 'sleep-90',
    title: '睡前 90 分钟，哪些事应该提前做？',
    summary: '从光线、饮食和活动强度拆解。',
    category: 'sleep',
    kind: 'video',
    durationLabel: '7 分钟',
    body: [
      '睡前 90 分钟适合开始降低环境亮度，减少高刺激内容和剧烈活动。',
      '如果晚餐偏晚，可以把热水澡、拉伸和整理待办放到睡前流程前半段。',
      '私域会员可用课程里的自查表记录一周，找到最影响入睡的因素。',
    ],
  },
  {
    id: 'dinner-balance',
    title: '晚餐份量和睡前饥饿感怎么平衡',
    summary: '给私域会员的饮食记录方法。',
    category: 'diet',
    kind: 'article',
    readTimeLabel: '图文',
    body: [
      '晚餐不宜只追求少吃，重点是让主食、蛋白质和蔬菜的比例更稳定。',
      '如果睡前经常饥饿，可以回看饮食记录里的晚餐时间、运动量和加餐习惯。',
      '控糖人群需要结合医生建议调整，不建议自行做极端饮食限制。',
    ],
  },
  {
    id: 'after-meal-walk',
    title: '饭后轻步行，什么时候开始更合适',
    summary: '适合久坐、控糖关注人群。',
    category: 'exercise',
    kind: 'article',
    readTimeLabel: '图文',
    body: [
      '大多数人可以在饭后稍作休息，再进行 10-20 分钟轻步行。',
      '活动强度应保持能轻松说话，避免立刻进行高强度间歇训练。',
      '如果有基础疾病或明显不适，应以专业建议为准。',
    ],
  },
  {
    id: 'solar-terms',
    title: '节气变化时，作息怎么跟着调',
    summary: '节气、食材、穴位和护理词条。',
    category: 'sleep',
    kind: 'article',
    readTimeLabel: '百科',
    body: [
      '节气变化常伴随温度、湿度和日照时长变化，作息也需要逐步调整。',
      '养生百科会把节气、常见食材和日常护理词条放在同一个检索入口。',
      '首版原型先展示词条入口，后续可以接入 CMS 做运营维护。',
    ],
  },
];

export const discoveryFeed: DiscoveryFeedItem[] = [
  {
    id: 'sleep-feed',
    author: '林静营养师',
    avatar: '林',
    channel: '睡眠修复',
    comments: '246',
    description: '把睡前光线、饮食和活动强度拆成 3 个可执行步骤。',
    favorites: '1.4w',
    likes: '8.2w',
    primaryAction: '看图文解析',
    route: '/content/sleep-90',
    secondaryAction: '做 3 题自测',
    tone: 'sleep',
    title: '睡前 90 分钟，如何把身体切回休息模式',
  },
  {
    id: 'food-feed',
    author: '周医生健康课',
    avatar: '周',
    channel: '饮食记录',
    comments: '128',
    description: '晚餐份量不是越少越好，关键是稳定和可复盘。',
    favorites: '8362',
    likes: '4.9w',
    primaryAction: '查养生百科',
    route: '/encyclopedia',
    secondaryAction: '阅读全文',
    tone: 'food',
    title: '晚餐和睡前饥饿感怎么平衡',
  },
  {
    id: 'live-feed',
    author: '颐享直播间',
    avatar: '颐',
    channel: '今日直播',
    comments: '512',
    description: '今晚 19:00，林静带你拆解睡眠修复课。',
    favorites: '2.1w',
    likes: '12w',
    primaryAction: '进入直播间',
    route: '/course/sleep-live',
    secondaryAction: '预约提醒',
    tone: 'live',
    title: '睡眠修复课正在直播',
  },
];

export const encyclopediaEntries: EncyclopediaEntry[] = [
  {
    id: 'grain-buds',
    category: 'season',
    description: '节气 · 饮食清淡、注意湿热',
    tag: '节气',
    title: '小满',
  },
  {
    id: 'oat',
    category: 'food',
    description: '食材 · 膳食纤维、早餐搭配',
    tag: '食材',
    title: '燕麦',
  },
  {
    id: 'bed-light',
    category: 'habit',
    description: '习惯 · 降低屏幕刺激',
    tag: '习惯',
    title: '睡前光线',
  },
  {
    id: 'yam',
    category: 'food',
    description: '食材 · 家常搭配和禁忌提示',
    tag: '食材',
    title: '山药',
  },
];

export const courseChapters: CourseChapter[] = [
  { id: 'season-01', duration: '12:20 · 已看完', status: 'complete', title: '节气与作息' },
  { id: 'season-02', duration: '18:06 · 继续播放', status: 'current', title: '饮食节律' },
  { id: 'season-03', duration: '15:44 · 未开始', status: 'pending', title: '轻运动安排' },
];

export const liveMaterials: LiveMaterial[] = [
  {
    id: 'sleep-check',
    description: '今晚直播配套资料。',
    label: 'PDF',
    title: '睡眠节奏自查表',
  },
  {
    id: 'dinner-record',
    description: '课后 7 天使用。',
    label: '表格',
    title: '晚间饮食记录',
  },
];

export const chatMessages: ChatMessage[] = [
  { id: 'chat-1', author: '周女士', message: '晚上运动和睡眠冲突怎么办？' },
  { id: 'chat-2', author: '林静', host: true, message: '强度降下来，睡前 90 分钟优先做放松型活动。' },
  { id: 'chat-3', author: '陈先生', message: '资料包在哪里领取？' },
];

export const todayQuiz: QuizQuestion = {
  id: 'after-meal-choice',
  topic: '睡眠专题',
  index: 2,
  total: 5,
  prompt: '饭后想活动，下面哪种安排更适合大多数人？',
  answerId: 'b',
  explanation: '稍作休息后轻步行 10-20 分钟，更适合作为大多数人的饭后活动起点。高强度训练、立即平躺或大量喝浓茶都不适合作为通用建议。',
  options: [
    { id: 'a', label: 'A. 立刻进行高强度间歇训练' },
    { id: 'b', label: 'B. 稍作休息后轻步行 10-20 分钟' },
    { id: 'c', label: 'C. 立即平躺休息一小时' },
    { id: 'd', label: 'D. 饭后马上大量喝浓茶' },
  ],
};

export const profileSummary: ProfileSummary = {
  name: '周女士',
  memberLabel: '私域会员',
  streakDays: 6,
  reservedCount: 3,
  favoriteCount: 12,
  quizProgress: 64,
};
