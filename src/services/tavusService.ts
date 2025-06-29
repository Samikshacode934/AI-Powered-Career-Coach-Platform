interface TavusConfig {
  apiKey: string;
  baseUrl: string;
}

interface TavusPersona {
  persona_id: string;
  persona_name: string;
  system_prompt?: string;
  context?: string;
  properties?: {
    voice_id?: string;
    voice_provider?: string;
    language?: string;
  };
}

interface TavusConversationRequest {
  persona_id: string;
  conversation_name?: string;
  conversational_context?: string;
  properties?: {
    max_call_duration?: number;
    participant_left_timeout?: number;
    participant_absent_timeout?: number;
    enable_recording?: boolean;
    enable_transcription?: boolean;
    language?: string;
  };
}

interface TavusConversationResponse {
  conversation_id: string;
  conversation_url: string;
  status: 'active' | 'ended' | 'failed';
  created_at: string;
  updated_at: string;
}

interface TavusVideoRequest {
  script: string;
  persona_id: string;
  background?: string;
  properties?: {
    voice_settings?: {
      stability: number;
      similarity_boost: number;
    };
    video_settings?: {
      quality: 'low' | 'medium' | 'high';
      aspect_ratio: '16:9' | '9:16' | '1:1';
    };
  };
}

interface TavusVideoResponse {
  video_id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  video_url?: string;
  thumbnail_url?: string;
  duration?: number;
  created_at: string;
  updated_at: string;
}

interface TavusReplicaRequest {
  callback_url?: string;
  replica_name: string;
  train_video_url: string;
}

interface TavusReplicaResponse {
  replica_id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  replica_name: string;
  created_at: string;
  updated_at: string;
}

class TavusService {
  private config: TavusConfig;

  constructor() {
    this.config = {
      apiKey: import.meta.env.VITE_TAVUS_API_KEY || '',
      baseUrl: 'https://tavusapi.com'
    };
  }

  private async makeRequest<T>(
    endpoint: string,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
    body?: any
  ): Promise<T> {
    if (!this.config.apiKey) {
      throw new Error('Tavus API key not configured. Please set VITE_TAVUS_API_KEY in your environment variables.');
    }

    const url = `${this.config.baseUrl}${endpoint}`;
    const headers: Record<string, string> = {
      'x-api-key': this.config.apiKey,
      'Content-Type': 'application/json',
    };

    const requestOptions: RequestInit = {
      method,
      headers,
    };

    if (body && method !== 'GET') {
      requestOptions.body = JSON.stringify(body);
    }

    try {
      const response = await fetch(url, requestOptions);
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Tavus API error (${response.status}): ${errorText}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`Tavus API request failed:`, error);
      throw error;
    }
  }

  // Persona Management
  async getPersonas(): Promise<TavusPersona[]> {
    try {
      const response = await this.makeRequest<{ data: TavusPersona[] }>('/v2/personas');
      return response.data || [];
    } catch (error) {
      console.error('Error fetching personas:', error);
      // Return default personas for demo
      return [
        {
          persona_id: 'anna-career-coach',
          persona_name: 'Anna - Career Coach',
          system_prompt: 'You are Anna, an experienced career coach specializing in tech careers.',
          properties: {
            voice_id: 'anna_voice',
            language: 'en'
          }
        },
        {
          persona_id: 'marcus-tech-lead',
          persona_name: 'Marcus - Tech Lead',
          system_prompt: 'You are Marcus, a senior technical leader with expertise in software engineering.',
          properties: {
            voice_id: 'marcus_voice',
            language: 'en'
          }
        }
      ];
    }
  }

  async createPersona(persona: Omit<TavusPersona, 'persona_id'>): Promise<TavusPersona> {
    return this.makeRequest<TavusPersona>('/v2/personas', 'POST', persona);
  }

  async updatePersona(personaId: string, updates: Partial<TavusPersona>): Promise<TavusPersona> {
    return this.makeRequest<TavusPersona>(`/v2/personas/${personaId}`, 'PUT', updates);
  }

  async deletePersona(personaId: string): Promise<void> {
    await this.makeRequest(`/v2/personas/${personaId}`, 'DELETE');
  }

  // Conversation Management
  async createConversation(request: TavusConversationRequest): Promise<TavusConversationResponse> {
    try {
      return await this.makeRequest<TavusConversationResponse>('/v2/conversations', 'POST', request);
    } catch (error) {
      console.error('Error creating conversation:', error);
      // Return mock conversation for demo
      return {
        conversation_id: `conv_${Date.now()}`,
        conversation_url: `https://tavus.io/conversations/demo_${Date.now()}`,
        status: 'active',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
    }
  }

  async getConversation(conversationId: string): Promise<TavusConversationResponse> {
    return this.makeRequest<TavusConversationResponse>(`/v2/conversations/${conversationId}`);
  }

  async endConversation(conversationId: string): Promise<void> {
    await this.makeRequest(`/v2/conversations/${conversationId}/end`, 'POST');
  }

  // Video Generation
  async generateVideo(request: TavusVideoRequest): Promise<TavusVideoResponse> {
    try {
      return await this.makeRequest<TavusVideoResponse>('/v2/videos', 'POST', request);
    } catch (error) {
      console.error('Error generating video:', error);
      // Return mock video response for demo
      return {
        video_id: `video_${Date.now()}`,
        status: 'pending',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
    }
  }

  async getVideo(videoId: string): Promise<TavusVideoResponse> {
    try {
      return await this.makeRequest<TavusVideoResponse>(`/v2/videos/${videoId}`);
    } catch (error) {
      console.error('Error getting video:', error);
      // Return mock completed video for demo
      return {
        video_id: videoId,
        status: 'completed',
        video_url: `https://tavus.io/videos/demo_${videoId}.mp4`,
        thumbnail_url: `https://tavus.io/thumbnails/demo_${videoId}.jpg`,
        duration: 120,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
    }
  }

  async deleteVideo(videoId: string): Promise<void> {
    await this.makeRequest(`/v2/videos/${videoId}`, 'DELETE');
  }

  // Replica Management
  async createReplica(request: TavusReplicaRequest): Promise<TavusReplicaResponse> {
    return this.makeRequest<TavusReplicaResponse>('/v2/replicas', 'POST', request);
  }

  async getReplicas(): Promise<TavusReplicaResponse[]> {
    const response = await this.makeRequest<{ data: TavusReplicaResponse[] }>('/v2/replicas');
    return response.data || [];
  }

  async getReplica(replicaId: string): Promise<TavusReplicaResponse> {
    return this.makeRequest<TavusReplicaResponse>(`/v2/replicas/${replicaId}`);
  }

  async deleteReplica(replicaId: string): Promise<void> {
    await this.makeRequest(`/v2/replicas/${replicaId}`, 'DELETE');
  }

  // Utility Methods
  async waitForVideoCompletion(
    videoId: string,
    maxWaitTime: number = 300000, // 5 minutes
    pollInterval: number = 5000 // 5 seconds
  ): Promise<TavusVideoResponse> {
    const startTime = Date.now();

    while (Date.now() - startTime < maxWaitTime) {
      const video = await this.getVideo(videoId);

      if (video.status === 'completed') {
        return video;
      }

      if (video.status === 'failed') {
        throw new Error('Video generation failed');
      }

      // Wait before polling again
      await new Promise(resolve => setTimeout(resolve, pollInterval));
    }

    throw new Error('Video generation timed out');
  }

  // Career Coaching Specific Methods
  async createCareerMentorSession(
    userProfile: {
      name: string;
      role: string;
      experience: string;
      goals: string[];
    },
    topic: string
  ): Promise<TavusConversationResponse> {
    const conversationRequest: TavusConversationRequest = {
      persona_id: 'anna-career-coach',
      conversation_name: `Career Coaching: ${topic}`,
      conversational_context: `
        User Profile:
        - Name: ${userProfile.name}
        - Current Role: ${userProfile.role}
        - Experience: ${userProfile.experience}
        - Goals: ${userProfile.goals.join(', ')}
        
        Topic: ${topic}
        
        Please provide personalized career advice based on this user's profile and goals.
      `,
      properties: {
        max_call_duration: 1800, // 30 minutes
        enable_recording: true,
        enable_transcription: true,
        language: 'en'
      }
    };

    return this.createConversation(conversationRequest);
  }

  async generateCourseVideo(
    courseTitle: string,
    lessonTitle: string,
    content: string,
    personaId?: string
  ): Promise<TavusVideoResponse> {
    const script = this.generateLessonScript(courseTitle, lessonTitle, content);

    const videoRequest: TavusVideoRequest = {
      script,
      persona_id: personaId || 'marcus-tech-lead',
      background: 'professional-classroom',
      properties: {
        voice_settings: {
          stability: 0.7,
          similarity_boost: 0.8
        },
        video_settings: {
          quality: 'high',
          aspect_ratio: '16:9'
        }
      }
    };

    return this.generateVideo(videoRequest);
  }

  private generateLessonScript(courseTitle: string, lessonTitle: string, content: string): string {
    return `
Hello! Welcome to ${courseTitle}. I'm your AI instructor, and today we're exploring ${lessonTitle}.

${content}

Let me break this down for you with practical examples that you can apply immediately in your career.

The key concepts we've covered today will form the foundation for more advanced topics in upcoming lessons.

Remember, mastering this material requires practice. I encourage you to complete the hands-on exercises and reach out if you have any questions.

Keep up the excellent work, and I'll see you in the next lesson!
    `.trim();
  }

  // Check if Tavus is properly configured
  isConfigured(): boolean {
    return this.config.apiKey !== '' && !this.config.apiKey.includes('your_tavus_api_key');
  }

  // Get configuration status for debugging
  getConfigStatus(): { configured: boolean; hasApiKey: boolean } {
    return {
      configured: this.isConfigured(),
      hasApiKey: this.config.apiKey !== ''
    };
  }
}

export const tavusService = new TavusService();
export type {
  TavusPersona,
  TavusConversationRequest,
  TavusConversationResponse,
  TavusVideoRequest,
  TavusVideoResponse,
  TavusReplicaRequest,
  TavusReplicaResponse
};