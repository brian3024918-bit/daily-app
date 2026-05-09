import { Category, Schedule, DiaryEntry, Tag } from '@/types';

export const dummyCategories: Category[] = [
  { id: '1', name: '업무', color: '#F2A896' },
  { id: '2', name: '건강', color: '#A8D4B0' },
  { id: '3', name: '개인', color: '#E8D8A0' },
  { id: '4', name: '학교', color: '#A8C8E8' },
];

export const dummyTasks: Schedule[] = [
  { id: 't1', title: '디자인 시안 검토', categoryId: '1', color: '#F2A896', date: '2026-05-08', isTask: true, priority: 'high',   repeat: 'none', isCompleted: false, isArchived: false, sortOrder: 0 },
  { id: 't2', title: '운동 30분',        categoryId: '2', color: '#A8D4B0', date: '2026-05-08', isTask: true, priority: 'medium', repeat: 'none', isCompleted: false, isArchived: false, sortOrder: 1 },
  { id: 't3', title: '책 1챕터 읽기',    categoryId: '3', color: '#E8D8A0', date: '2026-05-10', isTask: true, priority: 'low',    repeat: 'none', isCompleted: false, isArchived: false, sortOrder: 2 },
  { id: 't4', title: '주간 리포트 작성', categoryId: '1', color: '#A8C8E8', date: '2026-05-12', isTask: true, priority: 'high',   repeat: 'none', isCompleted: false, isArchived: false, sortOrder: 3 },
  { id: 't5', title: '엄마 생신 선물 알아보기', categoryId: '3', color: '#E8D8A0', date: '2026-05-13', isTask: true, priority: 'medium', repeat: 'none', isCompleted: false, isArchived: false, sortOrder: 4 },
  { id: 't6', title: '치과 예약',        categoryId: '3', color: '#C8B8E8', isTask: true, priority: 'medium', repeat: 'none', isCompleted: false, isArchived: false, sortOrder: 5 },
  { id: 't7', title: '블로그 초안',      categoryId: '3', color: '#E8D8A0', isTask: true, priority: 'low',    repeat: 'none', isCompleted: false, isArchived: false, sortOrder: 6 },
  { id: 't8', title: '장보기 (파, 두부, 우유)', categoryId: '3', color: '#C8B8E8', isTask: true, priority: 'low', repeat: 'none', isCompleted: false, isArchived: false, sortOrder: 7 },
];

export const dummySchedules: Schedule[] = [
  { id: 's1',  title: '팀 회의',          date: '2026-05-04', startTime: '10:00', endTime: '11:00', color: '#A8C8E8', isTask: false, priority: 'medium', repeat: 'none', isCompleted: false, isArchived: false, sortOrder: 0 },
  { id: 's2',  title: '운동',             date: '2026-05-05', startTime: '07:00', endTime: '08:00', color: '#A8D4B0', isTask: false, priority: 'medium', repeat: 'none', isCompleted: false, isArchived: false, sortOrder: 1 },
  { id: 's3',  title: '디자인 검토',      date: '2026-05-05', startTime: '14:00', endTime: '15:30', color: '#F2A896', isTask: false, priority: 'medium', repeat: 'none', isCompleted: false, isArchived: false, sortOrder: 2 },
  { id: 's4',  title: '점심 약속 - 지수', date: '2026-05-07', startTime: '12:00', endTime: '13:30', color: '#E8D8A0', isTask: false, priority: 'medium', repeat: 'none', isCompleted: false, isArchived: false, sortOrder: 3 },
  { id: 's5',  title: '제출 마감',        date: '2026-05-11', startTime: '18:00', endTime: '19:00', color: '#F2A896', isTask: false, priority: 'high',   repeat: 'none', isCompleted: false, isArchived: false, sortOrder: 4 },
  { id: 's6',  title: '엄마 생신',        date: '2026-05-12', color: '#E8A8B8', isTask: false, priority: 'medium', repeat: 'none', isCompleted: false, isArchived: false, sortOrder: 5 },
  { id: 's7',  title: '주간 리포트',      date: '2026-05-14', startTime: '09:00', endTime: '10:00', color: '#A8C8E8', isTask: false, priority: 'medium', repeat: 'none', isCompleted: false, isArchived: false, sortOrder: 6 },
  { id: 's8',  title: '운동',             date: '2026-05-15', startTime: '07:00', endTime: '08:00', color: '#A8D4B0', isTask: false, priority: 'medium', repeat: 'none', isCompleted: false, isArchived: false, sortOrder: 7 },
  { id: 's9',  title: '치과',             date: '2026-05-18', startTime: '14:00', endTime: '15:00', color: '#C8B8E8', isTask: false, priority: 'medium', repeat: 'none', isCompleted: false, isArchived: false, sortOrder: 8 },
  { id: 's10', title: '워크숍',           date: '2026-05-20', startTime: '09:00', endTime: '18:00', color: '#F2A896', isTask: false, priority: 'high',   repeat: 'none', isCompleted: false, isArchived: false, sortOrder: 9 },
  { id: 's11', title: '운동',             date: '2026-05-20', startTime: '07:00', endTime: '08:00', color: '#A8D4B0', isTask: false, priority: 'medium', repeat: 'none', isCompleted: false, isArchived: false, sortOrder: 10 },
  { id: 's12', title: '월간 정산',        date: '2026-05-22', startTime: '10:00', endTime: '11:30', color: '#A8C8E8', isTask: false, priority: 'medium', repeat: 'none', isCompleted: false, isArchived: false, sortOrder: 11 },
  { id: 's13', title: '독서모임',         date: '2026-05-25', startTime: '15:00', endTime: '17:00', color: '#E8D8A0', isTask: false, priority: 'medium', repeat: 'none', isCompleted: false, isArchived: false, sortOrder: 12 },
  { id: 's14', title: '제품 데모',        date: '2026-05-28', startTime: '14:00', endTime: '15:30', color: '#F2A896', isTask: false, priority: 'high',   repeat: 'none', isCompleted: false, isArchived: false, sortOrder: 13 },
];

export const dummyTags: Tag[] = [
  { id: 'tag1', name: '일상',  color: '#A8D4B0' },
  { id: 'tag2', name: '업무',  color: '#F2A896' },
  { id: 'tag3', name: '카페',  color: '#E8D8A0' },
  { id: 'tag4', name: '운동',  color: '#A8C8E8' },
  { id: 'tag5', name: '독서',  color: '#C8B8E8' },
  { id: 'tag6', name: '가족',  color: '#E8A8B8' },
];

export const dummyDiaries: DiaryEntry[] = [
  {
    id: 'd1', date: '2026-05-08', mood: '✏️', weather: 'sunny',
    content: '아침에 라일락 향기 — 창문 열고 한참 앉아 있었다.\n카페에서 따뜻한 라떼 한 잔. 오늘은 그냥 천천히 가도 되는 날.\n\n디자인 시안 검토 — 따뜻한 톤이 마음에 든다.\n저녁엔 운동 다녀와서 책 한 챕터…',
    tags: [
      { id: 'tag1', name: '일상', color: '#A8D4B0' },
      { id: 'tag2', name: '업무', color: '#F2A896' },
      { id: 'tag3', name: '카페', color: '#E8D8A0' },
    ],
  },
  {
    id: 'd2', date: '2026-05-07', mood: '🍵', weather: 'cloudy',
    content: '지수랑 점심. 오랜만에 길게 수다.',
    tags: [{ id: 'tag1', name: '일상', color: '#A8D4B0' }],
  },
  {
    id: 'd3', date: '2026-05-05', mood: '🌿', weather: 'sunny',
    content: '운동 후 산책. 라일락 향기.',
    tags: [{ id: 'tag4', name: '운동', color: '#A8C8E8' }],
  },
  {
    id: 'd4', date: '2026-05-03', mood: '☁️', weather: 'rainy',
    content: '비 오는 일요일, 카페에서 책 읽기.',
    tags: [{ id: 'tag3', name: '카페', color: '#E8D8A0' }, { id: 'tag5', name: '독서', color: '#C8B8E8' }],
  },
  {
    id: 'd5', date: '2026-05-01', mood: '🌟', weather: 'sunny',
    content: '5월의 시작. 오랜만에 일찍 일어났다.',
    tags: [{ id: 'tag1', name: '일상', color: '#A8D4B0' }],
  },
];
