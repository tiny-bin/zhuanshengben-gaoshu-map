import type { Example } from '../content/types'
import MathFormula from './MathFormula'

/**
 * 分步例题列表。走的是「题目 → 编号步骤 → 答案」的固定结构，
 * 目的是让每个知识点都有一道能照着抄下来的完整过程，而不只是公式。
 */
export default function WorkedExamples({ examples }: { examples: Example[] }) {
  return (
    <ol className="example-list">
      {examples.map((example, index) => (
        <li key={example.id} className="example">
          <div className="example-head">
            <span className="example-index">例 {index + 1}</span>
            <span className="example-problem">{example.problem}</span>
          </div>
          {example.problemLatex ? (
            <div className="example-problem-math">
              <MathFormula latex={example.problemLatex} displayMode />
            </div>
          ) : null}
          <ol className="example-steps">
            {example.steps.map((step, stepIndex) => (
              <li key={`${example.id}-${stepIndex}`} className="example-step">
                <span className="example-step-no">{stepIndex + 1}</span>
                <div className="example-step-body">
                  <div className="example-step-text">{step.text}</div>
                  {step.latex ? <MathFormula latex={step.latex} displayMode /> : null}
                </div>
              </li>
            ))}
          </ol>
          <div className="example-answer">
            <span className="example-answer-tag">答案</span>
            <span className="example-answer-text">{example.answer}</span>
            {example.answerLatex ? <MathFormula latex={example.answerLatex} /> : null}
          </div>
        </li>
      ))}
    </ol>
  )
}