import type { Post } from './types';

const VALENCE_LEVELS = ['sympathetic', 'condemning', 'neutral'];
const SUPPORT_LEVELS = ['high', 'low'];

// --- Researcher-configurable multipliers ---
const HIGH_SUPPORT_MULTIPLIER = 2.0; // Factor to boost engagement in 'high' support conditions
const LOW_SUPPORT_MULTIPLIER = 0.3;  // Factor to reduce engagement in 'low' support conditions
// -----------------------------------------

/**
 * Assigns a participant to a random experimental condition and stores it in localStorage.
 * This is a 3x2 design (valence x social support).
 * @returns {string} The assigned condition string.
 */
export function assignCondition(): string {
  const valence = VALENCE_LEVELS[Math.floor(Math.random() * VALENCE_LEVELS.length)];
  const support = SUPPORT_LEVELS[Math.floor(Math.random() * SUPPORT_LEVELS.length)];
  const condition = `${valence}-${support}`;
  
  try {
    localStorage.setItem('participantCondition', condition);
    console.log('Participant assigned to condition:', condition);
  } catch (error) {
    console.error('Failed to assign participant condition:', error);
  }
  return condition;
}

/**
 * Retrieves the participant's assigned condition from localStorage.
 * @returns {string | null} The assigned condition string or null if not found.
 */
export function getCondition(): string | null {
  try {
    return localStorage.getItem('participantCondition');
  } catch (error) {
    console.error('Failed to retrieve participant condition:', error);
    return null;
  }
}

/**
 * Applies an engagement formula to a post's likes, shares, and comments
 * to simulate different levels of social support.
 * @param {Post} post The original post.
 * @param {'high' | 'low'} socialSupport The social support condition.
 * @returns {Post} The post with modified engagement numbers.
 */
export function applyEngagementFormula(post: Post, socialSupport: 'high' | 'low'): Post {
  const multiplier = socialSupport === 'high' ? HIGH_SUPPORT_MULTIPLIER : LOW_SUPPORT_MULTIPLIER;
  
  // Gaussian-like randomization: adds variability (approx. +/- 25%)
  const randomize = (value: number) => {
    const randomFactor = 1 + (Math.random() - 0.5) * 0.5; // e.g., 0.75 to 1.25
    return Math.round(value * randomFactor);
  };
  
  const newPost = { ...post };

  newPost.likes = Math.max(0, randomize(post.likes * multiplier));
  newPost.shares = Math.max(0, randomize(post.shares * multiplier));
  
  // Also adjust likes on comments
  newPost.comments = post.comments.map(comment => ({
    ...comment,
    likes: Math.max(0, randomize(comment.likes * multiplier)),
  }));

  return newPost;
}
