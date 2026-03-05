export interface Post {
  id: string;
  imagePrompt: string;
  imageUrl?: string;
  caption: string;
  likes: string;
  comments: string;
}

export interface Profile {
  username: string;
  fullName: string;
  bio: string;
  followers: string;
  following: string;
  profilePicturePrompt: string;
  profilePictureUrl?: string;
  posts: Post[];
}
