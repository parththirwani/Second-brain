export interface ContentDocument {
  _id: string;
  userId: string;
  type: 'Document' | 'Tweet' | 'Youtube' | 'Link';
  link: string;
  title: string;
  description?: string;
  tags: string[];
  sharable: boolean;
  sharableId?: string;
}

export interface User {
  token: string;
}

export interface Profile {
  userId: string;
  username: string;
  profession?: string;
  avatar?: string;
  socialLinks?: {
    XLink?: string;
    InstagramLink?: string;
    Whatsapp?: string;
    MediumLink?: string;
  };
  bio?: string;
  publicProfile: boolean;
}