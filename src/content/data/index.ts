import type { CourseData, Chapter, DerivationEdge } from '../types'
import { limitsConcepts } from './limits'
import { derivativesConcepts } from './derivatives'
import { integralsConcepts } from './integrals'
import { seriesConcepts } from './series'
import { odeConcepts } from './ode'
import { vectorGeometryConcepts } from './vectorGeometry'

const chapters: Chapter[] = [
  {
    id: 'ch1',
    title: '第一章 函数、极限和连续',
    order: 1,
    description: '高等数学的根基：函数是对象，极限是工具，连续是状态的衔接。',
  },
  {
    id: 'ch2',
    title: '第二章 一元函数微分学',
    order: 2,
    description: '以极限定义导数，用导数研究函数的变化、单调性与凹凸性。',
  },
  {
    id: 'ch3',
    title: '第三章 一元函数积分学',
    order: 3,
    description: '积分是微分的逆运算：先会求原函数，再用牛顿-莱布尼茨公式把定积分算成面积与体积。',
  },
  {
    id: 'ch4',
    title: '第四章 无穷级数',
    order: 4,
    description: '级数是无限个数相加；收敛性与幂级数展开是两条主线。',
  },
  {
    id: 'ch5',
    title: '第五章 常微分方程',
    order: 5,
    description: '含未知函数及其导数的方程：一阶方程先按类型选方法，高阶常系数方程用特征方程与待定系数法。',
  },
  {
    id: 'ch6',
    title: '第六章 向量代数与空间解析几何',
    order: 6,
    description: '用向量描述空间的点、线、面：数量积与向量积是工具，平面与直线方程是落点。',
  },
]

const edges: DerivationEdge[] = [
  // 第一章内部推导链
  { from: 'c1-functions', to: 'c1-limits', kind: 'prerequisite', label: '基础 → 极限' },
  { from: 'c1-limits', to: 'c1-infinitesimal', kind: 'derives', label: '极限为零 → 无穷小' },
  { from: 'c1-limits', to: 'c1-two-limits', kind: 'derives', label: '常用极限' },
  { from: 'c1-limits', to: 'c1-squeeze', kind: 'derives', label: '存在准则' },
  { from: 'c1-limits', to: 'c1-continuity', kind: 'derives', label: '极限=函数值 → 连续' },
  { from: 'c1-continuity', to: 'c1-discontinuity', kind: 'derives', label: '不满足连续 → 间断' },
  // 跨章：导数由极限定义
  { from: 'c1-limits', to: 'c2-derivative', kind: 'prerequisite', label: '导数由极限定义' },
  { from: 'c1-functions', to: 'c2-rules', kind: 'prerequisite', label: '基本初等函数' },
  // 第二章内部推导链
  { from: 'c2-derivative', to: 'c2-rules', kind: 'derives', label: '定义 → 求导法则' },
  { from: 'c2-derivative', to: 'c2-differential', kind: 'derives', label: '导数 → 微分' },
  { from: 'c2-rules', to: 'c2-implicit', kind: 'derives', label: '进阶求导' },
  { from: 'c2-rules', to: 'c2-higher', kind: 'derives', label: '多次求导' },
  { from: 'c2-derivative', to: 'c2-mvt', kind: 'derives', label: '导数 → 中值定理' },
  { from: 'c2-mvt', to: 'c2-lhopital', kind: 'application', label: '中值定理 → 洛必达' },
  { from: 'c2-rules', to: 'c2-monotone', kind: 'application', label: '导数 → 单调性' },
  { from: 'c2-monotone', to: 'c2-concave', kind: 'derives', label: '一阶 → 二阶' },
  // 第三章内部推导链
  { from: 'c3-integral-concept', to: 'c3-integral-methods', kind: 'derives', label: '概念 → 计算法' },
  { from: 'c3-integral-methods', to: 'c3-rational-integral', kind: 'derives', label: '方法 → 有理函数' },
  { from: 'c3-integral-concept', to: 'c3-definite-integral', kind: 'derives', label: '原函数 → 定积分' },
  { from: 'c3-definite-integral', to: 'c3-definite-methods', kind: 'derives', label: '定积分 → 计算法' },
  { from: 'c3-definite-methods', to: 'c3-definite-application', kind: 'derives', label: '计算 → 应用' },
  { from: 'c3-integral-overview', to: 'c3-integral-methods', kind: 'application', label: '总览 → 方法' },
  { from: 'c3-integral-overview', to: 'c3-definite-methods', kind: 'application', label: '总览 → 定积分方法' },
  // 跨章：积分由微分与极限引出（仅在详情面板展示来源）
  { from: 'c2-derivative', to: 'c3-integral-concept', kind: 'prerequisite', label: '微分 → 原函数（互逆）' },
  { from: 'c1-limits', to: 'c3-definite-integral', kind: 'prerequisite', label: '极限 → 定积分（黎曼和）' },
  { from: 'c2-derivative', to: 'c3-definite-application', kind: 'application', label: '导数 → 弧长' },
  // 第四章内部推导链（无穷级数）
  { from: 'c4-series', to: 'c4-positive', kind: 'prerequisite', label: '常数项级数 → 正项审敛' },
  { from: 'c4-positive', to: 'c4-alternating', kind: 'derives', label: '正项方法 → 交错/收敛性' },
  { from: 'c4-series', to: 'c4-power', kind: 'prerequisite', label: '常数项级数 → 幂级数' },
  { from: 'c4-power', to: 'c4-expansion', kind: 'derives', label: '幂级数 → 函数展开' },
  { from: 'c4-power', to: 'c4-sum', kind: 'application', label: '幂级数 → 求和函数' },
  { from: 'c4-expansion', to: 'c4-sum', kind: 'derives', label: '已知展开 → 求和函数' },
  // 跨章：泰勒展开依赖高阶导数
  { from: 'c2-derivative', to: 'c4-expansion', kind: 'prerequisite', label: '高阶导数 → 泰勒展开' },
  // 第五章内部推导链（常微分方程）
  { from: 'c5-basic', to: 'c5-separable', kind: 'derives', label: '概念 → 可分离变量' },
  { from: 'c5-basic', to: 'c5-linear-first', kind: 'derives', label: '概念 → 一阶线性' },
  { from: 'c5-basic', to: 'c5-homogeneous', kind: 'derives', label: '概念 → 齐次方程' },
  { from: 'c5-basic', to: 'c5-linear-higher', kind: 'derives', label: '一阶 → 高阶线性' },
  { from: 'c5-linear-higher', to: 'c5-const-homogeneous', kind: 'derives', label: '高阶线性 → 常系数齐次' },
  { from: 'c5-const-homogeneous', to: 'c5-const-nonhomogeneous', kind: 'derives', label: '齐次 → 非齐次' },
  // 跨章：微分方程由导数与积分引出
  { from: 'c2-derivative', to: 'c5-basic', kind: 'prerequisite', label: '导数 → 微分方程含导数' },
  { from: 'c3-integral-concept', to: 'c5-separable', kind: 'prerequisite', label: '积分 → 分离变量求解' },
  // 第六章内部推导链（向量代数与空间解析几何）
  { from: 'c6-vector-basic', to: 'c6-dot-cross', kind: 'derives', label: '向量基础 → 数量积/向量积' },
  { from: 'c6-dot-cross', to: 'c6-plane', kind: 'application', label: '法向量 → 平面方程' },
  { from: 'c6-dot-cross', to: 'c6-line', kind: 'application', label: '方向向量 → 直线方程' },
  { from: 'c6-plane', to: 'c6-line', kind: 'derives', label: '平面交线 → 空间直线' },
]

export const courseData: CourseData = {
  chapters,
  concepts: [
    ...limitsConcepts,
    ...derivativesConcepts,
    ...integralsConcepts,
    ...seriesConcepts,
    ...odeConcepts,
    ...vectorGeometryConcepts,
  ],
  edges,
}

export function getConcept(conceptId: string) {
  return courseData.concepts.find((c) => c.id === conceptId)
}

export function getChapter(chapterId: string) {
  return courseData.chapters.find((ch) => ch.id === chapterId)
}

export function getChapterLabel(chapterId: string) {
  return getChapter(chapterId)?.title ?? chapterId
}

export function conceptsOfChapter(chapterId: string) {
  return courseData.concepts.filter((c) => c.chapterId === chapterId)
}