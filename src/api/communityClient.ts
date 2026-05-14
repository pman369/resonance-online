import { supabase } from '../lib/supabase';

export type ReactionType = 'resonate' | 'expand' | 'ground' | 'deepen';
export type ContentType = 'story' | 'comment' | 'thread';

export interface Interaction {
  id: string;
  user_id: string;
  content_id: string;
  content_type: ContentType;
  reaction: ReactionType;
  created_at: string;
}

export interface Comment {
  id: string;
  user_id: string;
  username?: string;
  content_id: string;
  content_type: ContentType;
  parent_id: string | null;
  text: string;
  created_at: string;
  updated_at: string;
}

export interface Circle {
  id: string;
  creator_id: string;
  name: string;
  description: string;
  is_private: boolean;
  coherence_score: number;
  created_at: string;
}

export interface Thread {
  id: string;
  topic_id: string;
  user_id: string;
  username?: string;
  title: string;
  content: string;
  created_at: string;
}

// Reactions
export async function addReaction(contentId: string, contentType: ContentType, reaction: ReactionType) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Unauthorized');

  const { error } = await supabase
    .from('content_interactions')
    .upsert({
      user_id: user.id,
      content_id: contentId,
      content_type: contentType,
      reaction
    });

  if (error) throw error;
}

export async function removeReaction(contentId: string, reaction: ReactionType) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Unauthorized');

  const { error } = await supabase
    .from('content_interactions')
    .delete()
    .match({ user_id: user.id, content_id: contentId, reaction });

  if (error) throw error;
}

// Comments
export async function postComment(contentId: string, contentType: ContentType, text: string, parentId: string | null = null) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Unauthorized');

  const { data, error } = await supabase
    .from('content_comments')
    .insert({
      user_id: user.id,
      content_id: contentId,
      content_type: contentType,
      parent_id: parentId,
      text: text.trim()
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function fetchComments(contentId: string) {
  const { data, error } = await supabase
    .from('content_comments')
    .select(`
      *,
      profiles:user_id (username)
    `)
    .eq('content_id', contentId)
    .order('created_at', { ascending: true });

  if (error) throw error;
  return (data || []).map(c => ({
    ...c,
    username: (c as any).profiles?.username || 'Anonymous Seeker'
  }));
}

// Circles
export async function fetchCircles() {
  const { data, error } = await supabase
    .from('circles')
    .select('*')
    .order('coherence_score', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function joinCircle(circleId: string) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Unauthorized');

  const { error } = await supabase
    .from('circle_members')
    .insert({ circle_id: circleId, user_id: user.id });

  if (error) throw error;
}

// Discussions
export async function fetchThreads(topicId?: string) {
  let query = supabase
    .from('discussion_threads')
    .select(`
      *,
      profiles:user_id (username)
    `)
    .order('created_at', { ascending: false });

  if (topicId) {
    query = query.eq('topic_id', topicId);
  }

  const { data, error } = await query;
  if (error) throw error;
  return (data || []).map(t => ({
    ...t,
    username: (t as any).profiles?.username || 'Anonymous Seeker'
  }));
}
