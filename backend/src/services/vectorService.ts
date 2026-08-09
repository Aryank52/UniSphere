// Semantic Vector Embedding Engine for AI Teammate Finder

const SKILL_CLUSTERS: Record<string, number[]> = {
  // Vector dimensions: [AI/ML, Web Dev, Blockchain, Systems/Cloud, Mobile/Design]
  'python': [0.9, 0.3, 0.2, 0.4, 0.1],
  'ml': [0.95, 0.2, 0.1, 0.3, 0.1],
  'pytorch': [0.98, 0.1, 0.1, 0.3, 0.1],
  'tensorflow': [0.98, 0.1, 0.1, 0.3, 0.1],
  'deep learning': [0.99, 0.1, 0.1, 0.2, 0.1],
  'computer vision': [0.96, 0.2, 0.1, 0.3, 0.1],
  'react': [0.1, 0.95, 0.4, 0.2, 0.6],
  'typescript': [0.2, 0.95, 0.5, 0.3, 0.4],
  'node.js': [0.2, 0.9, 0.3, 0.6, 0.2],
  'tailwind': [0.1, 0.9, 0.2, 0.1, 0.8],
  'blockchain': [0.2, 0.4, 0.98, 0.4, 0.1],
  'solidity': [0.1, 0.3, 0.99, 0.3, 0.1],
  'web3': [0.2, 0.5, 0.96, 0.4, 0.2],
  'c++': [0.5, 0.2, 0.2, 0.9, 0.1],
  'cloud': [0.3, 0.4, 0.3, 0.95, 0.1],
  'aws': [0.3, 0.4, 0.3, 0.96, 0.1],
  'docker': [0.2, 0.3, 0.3, 0.94, 0.1]
}

const DEFAULT_VECTOR = [0.4, 0.4, 0.4, 0.4, 0.4]

export function computeSkillVector(skills: string[]): number[] {
  if (!skills || skills.length === 0) return DEFAULT_VECTOR

  const accum = [0, 0, 0, 0, 0]
  let count = 0

  for (const s of skills) {
    const key = s.toLowerCase().trim()
    const vec = SKILL_CLUSTERS[key] || DEFAULT_VECTOR
    for (let i = 0; i < 5; i++) {
      accum[i] += vec[i]
    }
    count++
  }

  return accum.map(v => Number((v / (count || 1)).toFixed(3)))
}

export function cosineSimilarity(vecA: number[], vecB: number[]): number {
  let dotProduct = 0
  let normA = 0
  let normB = 0

  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i]
    normA += vecA[i] * vecA[i]
    normB += vecB[i] * vecB[i]
  }

  if (normA === 0 || normB === 0) return 0.5
  const similarity = dotProduct / (Math.sqrt(normA) * Math.sqrt(normB))
  return Number((Math.min(0.99, Math.max(0.65, similarity)).toFixed(4)))
}

export function getClusterName(vector: number[]): string {
  const [ai, web, crypto, systems, ui] = vector
  const maxVal = Math.max(ai, web, crypto, systems, ui)
  if (maxVal === ai) return 'Deep Learning & Vision Intelligence Cluster'
  if (maxVal === web) return 'Full-Stack Web Architecture Cluster'
  if (maxVal === crypto) return 'Web3 Smart Contracts Cluster'
  if (maxVal === systems) return 'Cloud Infrastructure & High-Perf C++ Cluster'
  return 'UI/UX & Mobile Apps Cluster'
}
