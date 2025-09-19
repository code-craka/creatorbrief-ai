import { createClient } from '@/lib/supabase/server';

export interface Comment {
  id: number;
  brief_id: number;
  user_id: string;
  content: string;
  parent_id: number | null;
  created_at: string;
  updated_at: string;
  user_profile?: {
    id: string;
    company_name: string | null;
    role: string;
  };
  replies?: Comment[];
}

export interface CreateCommentData {
  brief_id: number;
  content: string;
  parent_id?: number;
}

export class CommentService {
  private async getSupabase() {
    return await createClient();
  }

  /**
   * Create a new comment
   */
  async createComment(userId: string, data: CreateCommentData): Promise<Comment> {
    const supabase = await this.getSupabase();
    
    const { data: comment, error } = await supabase
      .from('comments')
      .insert({
        brief_id: data.brief_id,
        user_id: userId,
        content: data.content,
        parent_id: data.parent_id || null,
      })
      .select(`
        *,
        user_profile:profiles!comments_user_id_fkey(
          id,
          company_name,
          role
        )
      `)
      .single();

    if (error) {
      throw new Error(`Failed to create comment: ${error.message}`);
    }

    return comment;
  }

  /**
   * Get comments for a brief
   */
  async getBriefComments(briefId: number): Promise<Comment[]> {
    const supabase = await this.getSupabase();
    
    const { data: comments, error } = await supabase
      .from('comments')
      .select(`
        *,
        user_profile:profiles!comments_user_id_fkey(
          id,
          company_name,
          role
        )
      `)
      .eq('brief_id', briefId)
      .order('created_at', { ascending: true });

    if (error) {
      throw new Error(`Failed to fetch comments: ${error.message}`);
    }

    // Organize comments into threads (parent comments with replies)
    const commentMap = new Map<number, Comment>();
    const rootComments: Comment[] = [];

    // First pass: create comment objects
    comments?.forEach(comment => {
      commentMap.set(comment.id, { ...comment, replies: [] });
    });

    // Second pass: organize into threads
    comments?.forEach(comment => {
      const commentObj = commentMap.get(comment.id)!;
      if (comment.parent_id) {
        const parent = commentMap.get(comment.parent_id);
        if (parent) {
          parent.replies!.push(commentObj);
        }
      } else {
        rootComments.push(commentObj);
      }
    });

    return rootComments;
  }

  /**
   * Update a comment
   */
  async updateComment(userId: string, commentId: number, content: string): Promise<Comment> {
    const supabase = await this.getSupabase();
    
    const { data: comment, error } = await supabase
      .from('comments')
      .update({ 
        content,
        updated_at: new Date().toISOString(),
      })
      .eq('id', commentId)
      .eq('user_id', userId)
      .select(`
        *,
        user_profile:profiles!comments_user_id_fkey(
          id,
          company_name,
          role
        )
      `)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        throw new Error('Comment not found or you do not have permission to edit it');
      }
      throw new Error(`Failed to update comment: ${error.message}`);
    }

    return comment;
  }

  /**
   * Delete a comment
   */
  async deleteComment(userId: string, commentId: number): Promise<void> {
    const supabase = await this.getSupabase();
    
    const { error } = await supabase
      .from('comments')
      .delete()
      .eq('id', commentId)
      .eq('user_id', userId);

    if (error) {
      throw new Error(`Failed to delete comment: ${error.message}`);
    }
  }

  /**
   * Get comment count for a brief
   */
  async getCommentCount(briefId: number): Promise<number> {
    const supabase = await this.getSupabase();
    
    const { count, error } = await supabase
      .from('comments')
      .select('*', { count: 'exact', head: true })
      .eq('brief_id', briefId);

    if (error) {
      throw new Error(`Failed to get comment count: ${error.message}`);
    }

    return count || 0;
  }
}