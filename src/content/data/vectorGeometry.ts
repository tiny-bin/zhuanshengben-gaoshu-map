import type { Concept } from '../types'

export const vectorGeometryConcepts: Concept[] = [
  {
    id: 'c6-vector-basic',
    chapterId: 'ch6',
    title: '向量的基本概念与代数运算',
    summary:
      '向量是有大小和方向的量。掌握坐标表示、模与方向余弦、加减与数乘，以及共线/共面判定，是点积、叉积和空间几何的地基。',
    formulas: [
      { id: 'vg-coord', name: '坐标表示', latex: String.raw`\boldsymbol{a}=(a_{x},a_{y},a_{z})=a_{x}\boldsymbol{i}+a_{y}\boldsymbol{j}+a_{z}\boldsymbol{k}` },
      { id: 'vg-mod', name: '向量的模', latex: String.raw`|\boldsymbol{a}|=\sqrt{a_{x}^{2}+a_{y}^{2}+a_{z}^{2}}` },
      { id: 'vg-unit', name: '单位向量', latex: String.raw`\boldsymbol{a}^{0}=\frac{\boldsymbol{a}}{|\boldsymbol{a}|}` },
      { id: 'vg-dircos', name: '方向余弦', latex: String.raw`\cos\alpha=\frac{a_{x}}{|\boldsymbol{a}|},\quad \cos^{2}\alpha+\cos^{2}\beta+\cos^{2}\gamma=1` },
      { id: 'vg-linear', name: '加减与数乘', latex: String.raw`\boldsymbol{a}\pm\boldsymbol{b}=(a_{x}\pm b_{x},\,a_{y}\pm b_{y},\,a_{z}\pm b_{z}),\quad \lambda\boldsymbol{a}=(\lambda a_{x},\lambda a_{y},\lambda a_{z})` },
      { id: 'vg-collinear', name: '共线条件', latex: String.raw`\boldsymbol{a}\parallel\boldsymbol{b}\ \Longleftrightarrow\ \boldsymbol{a}=\lambda\boldsymbol{b}\ \Longleftrightarrow\ \boldsymbol{a}\times\boldsymbol{b}=0` },
    ],
    problemTypes: [
      {
        id: 'c6-vector-basic-flow',
        name: '向量基础题型快速分流',
        summary:
          '先明确任务是「求单位向量」还是「判断共线/共面」，选对应工具即可，不用记复杂推导。',
        start: 'goal',
        nodes: {
          goal: { type: 'test', id: 'goal', prompt: '要求的是单位向量吗？', yes: 'unit', no: 'rel' },
          unit: {
            type: 'action',
            id: 'unit',
            text: '先算模 |a|，再除以模：a⁰ = a/|a|',
            next: 'unit-done',
          },
          'unit-done': { type: 'result', id: 'unit-done', text: '得单位向量，其分量就是方向余弦' },
          rel: { type: 'test', id: 'rel', prompt: '要判断共线（平行）吗？', yes: 'collinear', no: 'coplanar' },
          collinear: {
            type: 'action',
            id: 'collinear',
            text: '看是否 a=λb（对应分量成比例），或 a×b=0',
            next: 'collinear-done',
          },
          'collinear-done': { type: 'result', id: 'collinear-done', text: '成比例/叉积为 0 → 共线；否则不共线' },
          coplanar: {
            type: 'action',
            id: 'coplanar',
            text: '三向量共面用混合积 [a b c]=a·(b×c) 判定',
            next: 'coplanar-done',
          },
          'coplanar-done': { type: 'result', id: 'coplanar-done', text: '混合积为 0 → 共面，否则不共面' },
        },
      },
    ],
  },
  {
    id: 'c6-dot-cross',
    chapterId: 'ch6',
    title: '数量积与向量积',
    summary:
      '数量积算出「投影量」，用于求夹角、判断垂直；向量积算出「法向/面积」，用于求面积、判断平行、得到平面法向量。',
    formulas: [
      { id: 'vc-dot-def', name: '数量积定义', latex: String.raw`\boldsymbol{a}\cdot\boldsymbol{b}=|\boldsymbol{a}||\boldsymbol{b}|\cos\theta` },
      { id: 'vc-dot-coord', name: '数量积坐标', latex: String.raw`\boldsymbol{a}\cdot\boldsymbol{b}=a_{x}b_{x}+a_{y}b_{y}+a_{z}b_{z}` },
      { id: 'vc-angle', name: '夹角', latex: String.raw`\cos\theta=\frac{\boldsymbol{a}\cdot\boldsymbol{b}}{|\boldsymbol{a}||\boldsymbol{b}|}` },
      { id: 'vc-perp', name: '垂直条件', latex: String.raw`\boldsymbol{a}\perp\boldsymbol{b}\ \Longleftrightarrow\ \boldsymbol{a}\cdot\boldsymbol{b}=0` },
      { id: 'vc-cross-def', name: '向量积定义', latex: String.raw`|\boldsymbol{a}\times\boldsymbol{b}|=|\boldsymbol{a}||\boldsymbol{b}|\sin\theta` },
      { id: 'vc-cross-coord', name: '向量积坐标', latex: String.raw`\boldsymbol{a}\times\boldsymbol{b}=(a_{y}b_{z}-a_{z}b_{y},\,a_{z}b_{x}-a_{x}b_{z},\,a_{x}b_{y}-a_{y}b_{x})` },
      { id: 'vc-area', name: '几何意义（面积）', latex: String.raw`|\boldsymbol{a}\times\boldsymbol{b}|=\text{以 }a,b\text{ 为邻边的平行四边形面积}` },
      { id: 'vc-triple', name: '混合积', latex: String.raw`[\boldsymbol{a}\,\boldsymbol{b}\,\boldsymbol{c}]=\boldsymbol{a}\cdot(\boldsymbol{b}\times\boldsymbol{c})=0\ \Longleftrightarrow\ \text{共面}` },
    ],
    problemTypes: [
      {
        id: 'c6-dot-cross-choice',
        name: '选数量积还是向量积',
        summary:
          '看题目要什么：夹角/投影/垂直用数量积，面积/平行/法向量用向量积，共面用混合积。',
        start: 'ask',
        nodes: {
          ask: { type: 'test', id: 'ask', prompt: '要夹角、投影或判断垂直吗？', yes: 'dot', no: 'area' },
          dot: {
            type: 'action',
            id: 'dot',
            text: '用 a·b，夹角 cosθ=a·b/(|a||b|)，垂直则 a·b=0',
            next: 'dot-done',
          },
          'dot-done': { type: 'result', id: 'dot-done', text: '数量积解决夹角/垂直/投影' },
          area: {
            type: 'test',
            id: 'area',
            prompt: '要求面积、判断平行，或需要一个垂直于两向量的法向量？',
            yes: 'cross',
            no: 'mix',
          },
          cross: {
            type: 'action',
            id: 'cross',
            text: '用 a×b：|a×b|=面积，a×b=0 共线，a×b 是所求法向量',
            next: 'cross-done',
          },
          'cross-done': { type: 'result', id: 'cross-done', text: '向量积解决面积/平行/法向' },
          mix: {
            type: 'action',
            id: 'mix',
            text: '共面用混合积 [a b c]=a·(b×c)，为 0 则共面',
            next: 'mix-done',
          },
          'mix-done': { type: 'result', id: 'mix-done', text: '混合积解决共面判定' },
        },
      },
    ],
  },
  {
    id: 'c6-plane',
    chapterId: 'ch6',
    title: '平面及其方程',
    summary:
      '平面由「一个点 + 法向量」唯一确定。会用点法式、一般式、截距式，并会求两平面夹角与点到平面距离。',
    formulas: [
      { id: 'pl-point-normal', name: '点法式', latex: String.raw`A(x-x_{0})+B(y-y_{0})+C(z-z_{0})=0,\quad \boldsymbol{n}=(A,B,C)` },
      { id: 'pl-general', name: '一般式', latex: String.raw`Ax+By+Cz+D=0` },
      { id: 'pl-intercept', name: '截距式', latex: String.raw`\frac{x}{a}+\frac{y}{b}+\frac{z}{c}=1` },
      { id: 'pl-angle', name: '两平面夹角', latex: String.raw`\cos\theta=\frac{|\boldsymbol{n}_{1}\cdot\boldsymbol{n}_{2}|}{|\boldsymbol{n}_{1}||\boldsymbol{n}_{2}|}` },
      { id: 'pl-pos', name: '垂直/平行', latex: String.raw`\boldsymbol{n}_{1}\cdot\boldsymbol{n}_{2}=0\Rightarrow\text{垂直},\quad \boldsymbol{n}_{1}\times\boldsymbol{n}_{2}=0\Rightarrow\text{平行}` },
      { id: 'pl-distance', name: '点到平面距离', latex: String.raw`d=\frac{|Ax_{0}+By_{0}+Cz_{0}+D|}{\sqrt{A^{2}+B^{2}+C^{2}}}` },
      { id: 'pl-plane-distance', name: '两平行平面间距离', latex: String.raw`d=\frac{|D_{1}-D_{2}|}{\sqrt{A^{2}+B^{2}+C^{2}}}` },
    ],
    problemTypes: [
      {
        id: 'c6-plane-equation',
        name: '求平面方程',
        summary:
          '平面方程的核心是「一个点 + 法向量 n」。有 n 直接用点法式；只有三点就先叉积求 n。',
        start: 'known',
        nodes: {
          known: { type: 'action', id: 'known', text: '确定平面上的一个点 P 与法向量 n', next: 'how' },
          how: { type: 'test', id: 'how', prompt: '法向量能直接得到（或已给出）吗？', yes: 'point-normal', no: 'three' },
          'point-normal': {
            type: 'action',
            id: 'point-normal',
            text: '用点法式 n·(r-P)=0 写出方程',
            next: 'pn-done',
          },
          'pn-done': { type: 'result', id: 'pn-done', text: '得到平面方程（可化为一般式）' },
          three: {
            type: 'action',
            id: 'three',
            text: '由三点取两个向量叉积得法向量 n，再用点法式',
            next: 'three-done',
          },
          'three-done': { type: 'result', id: 'three-done', text: '得到平面方程' },
        },
      },
    ],
  },
  {
    id: 'c6-line',
    chapterId: 'ch6',
    title: '空间直线及其方程',
    summary:
      '直线由「一个点 + 方向向量」确定。会用点向式、参数式和一般式（两平面交线），并会求线线夹角、线与面夹角。',
    formulas: [
      { id: 'ln-point-dir', name: '点向式（对称式）', latex: String.raw`\frac{x-x_{0}}{l}=\frac{y-y_{0}}{m}=\frac{z-z_{0}}{n},\quad \boldsymbol{s}=(l,m,n)` },
      { id: 'ln-param', name: '参数式', latex: String.raw`x=x_{0}+lt,\quad y=y_{0}+mt,\quad z=z_{0}+nt` },
      { id: 'ln-general', name: '一般式（两平面交线）', latex: String.raw`\begin{cases}A_{1}x+B_{1}y+C_{1}z+D_{1}=0\\ A_{2}x+B_{2}y+C_{2}z+D_{2}=0\end{cases}` },
      { id: 'ln-line-angle', name: '两直线夹角', latex: String.raw`\cos\theta=\frac{|\boldsymbol{s}_{1}\cdot\boldsymbol{s}_{2}|}{|\boldsymbol{s}_{1}||\boldsymbol{s}_{2}|}` },
      { id: 'ln-plane-angle', name: '线与平面夹角', latex: String.raw`\sin\varphi=\frac{|\boldsymbol{s}\cdot\boldsymbol{n}|}{|\boldsymbol{s}||\boldsymbol{n}|}` },
      { id: 'ln-pos', name: '线面平行/垂直', latex: String.raw`\boldsymbol{s}\cdot\boldsymbol{n}=0\Rightarrow\text{平行},\quad \boldsymbol{s}\times\boldsymbol{n}=0\Rightarrow\text{垂直}` },
    ],
    problemTypes: [
      {
        id: 'c6-line-equation',
        name: '求空间直线方程',
        summary:
          '直线方程的核心是「一个点 + 方向向量 s」。s 已知直接用点向式；是两平面交线就先 s=n1×n2 再写。',
        start: 'known',
        nodes: {
          known: { type: 'action', id: 'known', text: '确定直线上的点 P 与方向向量 s', next: 'source' },
          source: { type: 'test', id: 'source', prompt: '方向向量能直接得到吗？', yes: 'sym', no: 'intersection' },
          sym: {
            type: 'action',
            id: 'sym',
            text: '用点向式 (x-x0)/l=(y-y0)/m=(z-z0)/n 写方程，或转参数式',
            next: 'sym-done',
          },
          'sym-done': { type: 'result', id: 'sym-done', text: '得到直线方程' },
          intersection: {
            type: 'action',
            id: 'intersection',
            text: '直线是两平面交线：取交点，且 s=n1×n2，再用点向式',
            next: 'inter-done',
          },
          'inter-done': { type: 'result', id: 'inter-done', text: '得到直线方程' },
        },
      },
    ],
  },
]
