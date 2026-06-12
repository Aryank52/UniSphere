import { AIService } from '../services/aiService'
import jwt from 'jsonwebtoken'

// A simple Assertion test framework
let passes = 0
let fails = 0

function describe(suiteName: string, fn: () => void) {
  console.log(`\n\x1b[36mRunning Suite: ${suiteName}\x1b[0m`)
  try {
    fn()
  } catch (err: any) {
    console.error(`\x1b[31m[FAIL] Suite crashed: ${err.message}\x1b[0m`)
  }
}

function it(testName: string, fn: () => void) {
  try {
    fn()
    passes++
    console.log(`  \x1b[32m✓\x1b[0m ${testName}`)
  } catch (err: any) {
    fails++
    console.log(`  \x1b[31m✗\x1b[0m ${testName}`)
    console.error(`    Error: ${err.message}`)
  }
}

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(message)
  }
}

// ----------------------------------------------------
// RUN TEST SUITES
// ----------------------------------------------------

describe('Authentication Service', () => {
  it('should generate and verify JWT tokens correctly', () => {
    const payload = { id: 42, role: 'STUDENT' }
    const secret = 'test-secret-key'
    
    // sign
    const token = jwt.sign(payload, secret, { expiresIn: '1h' })
    assert(!!token, 'JWT Token was not generated')

    // verify
    const decoded = jwt.verify(token, secret) as any
    assert(decoded.id === 42, 'Decoded ID does not match')
    assert(decoded.role === 'STUDENT', 'Decoded Role does not match')
  })
})

describe('AI Service - RAG Vector Search Heuristics', () => {
  it('should correctly tokenise strings into word frequency vectors', () => {
    const text = 'Computer Science AI coding hackathon'
    const vec = AIService.getTermVector(text)
    
    assert(vec['computer'] === 1, 'Failed to extract word: computer')
    assert(vec['science'] === 1, 'Failed to extract word: science')
    assert(vec['ai'] === 1, 'Failed to extract word: ai')
  })

  it('should compute correct Cosine Similarity between matching vectors', () => {
    const vecA = { 'ai': 1, 'computer': 1, 'science': 1 }
    const vecB = { 'ai': 1, 'computer': 1, 'science': 1, 'basketball': 1 }
    
    const similarity = AIService.cosineSimilarity(vecA, vecB)
    
    assert(similarity > 0.8 && similarity < 0.9, `Similarity should be ~0.866, got: ${similarity}`)
  })

  it('should return 0 similarity for completely disjoint vectors', () => {
    const vecA = { 'cricket': 1, 'sports': 1 }
    const vecB = { 'ai': 1, 'coding': 1 }
    
    const similarity = AIService.cosineSimilarity(vecA, vecB)
    assert(similarity === 0, `Similarity should be 0, got: ${similarity}`)
  })
})

describe('AI Service - Attendance Regression Predictor', () => {
  it('should predict attendance rate and expected occupancy correctly', () => {
    const category = 'TECH'
    const capacity = 100
    const day = 'Saturday'
    
    const prediction = AIService.predictAttendance(category, capacity, day)
    
    assert(prediction.predictedAttendanceRate > 0, 'Predicted rate must be positive')
    assert(prediction.expectedAttendance > 0, 'Expected occupancy must be positive')
    assert(prediction.factors.length > 0, 'Factors list must not be empty')
  })
})

// ----------------------------------------------------
// PRINT REPORT
// ----------------------------------------------------
console.log(`\n==================================================`)
if (fails === 0) {
  console.log(`\x1b[32;1mPASS\x1b[0m \x1b[37;1mAll tests passed! (${passes} total)\x1b[0m`)
} else {
  console.log(`\x1b[31;1mFAIL\x1b[0m \x1b[37;1mSome tests failed! (${fails} failed, ${passes} passed)\x1b[0m`)
  process.exit(1)
}
console.log(`==================================================\n`)
