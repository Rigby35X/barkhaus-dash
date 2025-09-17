// Social Media Service for scheduling and publishing posts
import { SocialMediaPost } from './openaiService';

export interface ScheduledPost extends SocialMediaPost {
  publishedAt?: string;
  publishedToUrl?: string;
  error?: string;
  retryCount?: number;
}

export interface SocialMediaAccount {
  id: string;
  platform: 'facebook' | 'instagram' | 'twitter' | 'linkedin';
  accountName: string;
  isConnected: boolean;
  accessToken?: string;
  refreshToken?: string;
  expiresAt?: string;
  lastSync?: string;
}

export interface PublishingStats {
  totalPosts: number;
  publishedPosts: number;
  scheduledPosts: number;
  failedPosts: number;
  engagementRate?: number;
  reachTotal?: number;
}

class SocialMediaService {
  private posts: ScheduledPost[] = [];
  private accounts: SocialMediaAccount[] = [];

  constructor() {
    this.loadFromStorage();
  }

  // Post Management
  async createPost(post: Omit<SocialMediaPost, 'id' | 'createdDate'>): Promise<ScheduledPost> {
    const newPost: ScheduledPost = {
      ...post,
      id: this.generateId(),
      createdDate: new Date().toISOString(),
      retryCount: 0
    };

    this.posts.unshift(newPost);
    this.saveToStorage();
    
    console.log('✅ Post created:', newPost.title);
    return newPost;
  }

  async updatePost(id: string, updates: Partial<ScheduledPost>): Promise<ScheduledPost | null> {
    const index = this.posts.findIndex(p => p.id === id);
    if (index === -1) return null;

    this.posts[index] = { ...this.posts[index], ...updates };
    this.saveToStorage();
    
    console.log('✅ Post updated:', id);
    return this.posts[index];
  }

  async deletePost(id: string): Promise<boolean> {
    const index = this.posts.findIndex(p => p.id === id);
    if (index === -1) return false;

    this.posts.splice(index, 1);
    this.saveToStorage();
    
    console.log('✅ Post deleted:', id);
    return true;
  }

  async duplicatePost(id: string): Promise<ScheduledPost | null> {
    const originalPost = this.posts.find(p => p.id === id);
    if (!originalPost) return null;

    const duplicatedPost: ScheduledPost = {
      ...originalPost,
      id: this.generateId(),
      title: `${originalPost.title} (Copy)`,
      status: 'draft',
      createdDate: new Date().toISOString(),
      scheduledDate: undefined,
      publishedAt: undefined,
      publishedToUrl: undefined,
      error: undefined,
      retryCount: 0
    };

    this.posts.unshift(duplicatedPost);
    this.saveToStorage();
    
    console.log('✅ Post duplicated:', duplicatedPost.title);
    return duplicatedPost;
  }

  // Scheduling
  async schedulePost(id: string, scheduledDate: string): Promise<boolean> {
    const post = await this.updatePost(id, {
      status: 'scheduled',
      scheduledDate,
      error: undefined
    });

    if (post) {
      console.log(`📅 Post scheduled for ${scheduledDate}:`, post.title);
      this.checkScheduledPosts(); // Check if it should be published now
      return true;
    }
    return false;
  }

  async publishNow(id: string): Promise<boolean> {
    const post = this.posts.find(p => p.id === id);
    if (!post) return false;

    try {
      const result = await this.publishToSocialMedia(post);
      
      if (result.success) {
        await this.updatePost(id, {
          status: 'published',
          publishedAt: new Date().toISOString(),
          publishedToUrl: result.url,
          error: undefined
        });
        console.log('✅ Post published successfully:', post.title);
        return true;
      } else {
        await this.updatePost(id, {
          error: result.error,
          retryCount: (post.retryCount || 0) + 1
        });
        console.error('❌ Post publishing failed:', result.error);
        return false;
      }
    } catch (error) {
      await this.updatePost(id, {
        error: error instanceof Error ? error.message : 'Unknown error',
        retryCount: (post.retryCount || 0) + 1
      });
      console.error('❌ Post publishing error:', error);
      return false;
    }
  }

  // Account Management
  async connectAccount(platform: 'facebook' | 'instagram' | 'twitter' | 'linkedin'): Promise<boolean> {
    // In a real implementation, this would handle OAuth flow
    console.log(`🔗 Connecting to ${platform}...`);
    
    // Simulate connection
    const account: SocialMediaAccount = {
      id: this.generateId(),
      platform,
      accountName: `${platform.charAt(0).toUpperCase() + platform.slice(1)} Account`,
      isConnected: true,
      lastSync: new Date().toISOString()
    };

    this.accounts.push(account);
    this.saveToStorage();
    
    console.log(`✅ Connected to ${platform}`);
    return true;
  }

  async disconnectAccount(id: string): Promise<boolean> {
    const index = this.accounts.findIndex(a => a.id === id);
    if (index === -1) return false;

    this.accounts.splice(index, 1);
    this.saveToStorage();
    
    console.log('✅ Account disconnected');
    return true;
  }

  // Publishing (Mock implementation)
  private async publishToSocialMedia(post: ScheduledPost): Promise<{ success: boolean; url?: string; error?: string }> {
    // In a real implementation, this would use platform APIs
    console.log(`📤 Publishing to ${post.platform}:`, post.title);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Simulate success/failure (90% success rate)
    const success = Math.random() > 0.1;
    
    if (success) {
      const mockUrl = `https://${post.platform}.com/posts/${this.generateId()}`;
      return { success: true, url: mockUrl };
    } else {
      return { success: false, error: 'Platform API error: Rate limit exceeded' };
    }
  }

  // Scheduled post checking
  private checkScheduledPosts(): void {
    const now = new Date();
    const postsToPublish = this.posts.filter(post => 
      post.status === 'scheduled' && 
      post.scheduledDate && 
      new Date(post.scheduledDate) <= now
    );

    postsToPublish.forEach(post => {
      console.log(`⏰ Auto-publishing scheduled post: ${post.title}`);
      this.publishNow(post.id);
    });
  }

  // Data retrieval
  getPosts(filters?: {
    status?: ScheduledPost['status'];
    platform?: ScheduledPost['platform'];
    postType?: ScheduledPost['postType'];
    search?: string;
  }): ScheduledPost[] {
    let filtered = [...this.posts];

    if (filters) {
      if (filters.status && filters.status !== 'all') {
        filtered = filtered.filter(p => p.status === filters.status);
      }
      if (filters.platform && filters.platform !== 'all') {
        filtered = filtered.filter(p => p.platform === filters.platform);
      }
      if (filters.postType) {
        filtered = filtered.filter(p => p.postType === filters.postType);
      }
      if (filters.search) {
        const search = filters.search.toLowerCase();
        filtered = filtered.filter(p => 
          p.title.toLowerCase().includes(search) ||
          p.content.toLowerCase().includes(search)
        );
      }
    }

    return filtered;
  }

  getAccounts(): SocialMediaAccount[] {
    return [...this.accounts];
  }

  getStats(): PublishingStats {
    const total = this.posts.length;
    const published = this.posts.filter(p => p.status === 'published').length;
    const scheduled = this.posts.filter(p => p.status === 'scheduled').length;
    const failed = this.posts.filter(p => p.error).length;

    return {
      totalPosts: total,
      publishedPosts: published,
      scheduledPosts: scheduled,
      failedPosts: failed,
      engagementRate: published > 0 ? Math.round((Math.random() * 15 + 5) * 100) / 100 : 0, // Mock data
      reachTotal: published * Math.floor(Math.random() * 1000 + 500) // Mock data
    };
  }

  // Utility methods
  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  private saveToStorage(): void {
    try {
      localStorage.setItem('socialMediaPosts', JSON.stringify(this.posts));
      localStorage.setItem('socialMediaAccounts', JSON.stringify(this.accounts));
    } catch (error) {
      console.error('Failed to save to localStorage:', error);
    }
  }

  private loadFromStorage(): void {
    try {
      const postsData = localStorage.getItem('socialMediaPosts');
      const accountsData = localStorage.getItem('socialMediaAccounts');
      
      if (postsData) {
        this.posts = JSON.parse(postsData);
      }
      if (accountsData) {
        this.accounts = JSON.parse(accountsData);
      }
    } catch (error) {
      console.error('Failed to load from localStorage:', error);
      this.posts = [];
      this.accounts = [];
    }
  }

  // Initialize scheduled post checking
  startScheduler(): void {
    // Check every minute for scheduled posts
    setInterval(() => {
      this.checkScheduledPosts();
    }, 60000);
    
    console.log('📅 Social media scheduler started');
  }
}

export const socialMediaService = new SocialMediaService();
export default socialMediaService;
