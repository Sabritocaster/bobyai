export interface Database {
  public: {
    Tables: {
      chat_sessions: {
        Row: {
          id: string;
          user_id: string;
          character_id: string;
          title: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          character_id: string;
          title: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["chat_sessions"]["Insert"]>;
      };
      chat_messages: {
        Row: {
          id: string;
          session_id: string;
          sender: "user" | "assistant" | "system";
          content: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          session_id: string;
          sender: "user" | "assistant" | "system";
          content: string;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["chat_messages"]["Insert"]>;
      };
    };
  };
}
