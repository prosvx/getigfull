import React, { useState } from 'react';
import { Profile, Post } from '../types';
import { Grid, Heart, MessageCircle, MoreHorizontal, Bookmark, Send, X, Download } from 'lucide-react';

export default function ProfileView({ profile }: { profile: Profile }) {
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [showProfilePic, setShowProfilePic] = useState(false);

  const handleDownload = (url: string, filename: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-4xl mx-auto bg-white border border-neutral-200 rounded-2xl overflow-hidden shadow-sm">
      {/* Header */}
      <div className="p-4 md:p-8 border-b border-neutral-200">
        <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-start md:items-center">
          {/* Profile Pic */}
          <div className="flex-shrink-0 mx-auto md:mx-0 cursor-pointer" onClick={() => profile.profilePictureUrl && setShowProfilePic(true)}>
            <div className="w-24 h-24 md:w-40 md:h-40 rounded-full p-1 bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-500 hover:scale-105 transition-transform">
              <div className="w-full h-full rounded-full border-4 border-white overflow-hidden bg-neutral-100">
                {profile.profilePictureUrl ? (
                  <img src={profile.profilePictureUrl} alt={profile.fullName} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                ) : (
                  <div className="w-full h-full animate-pulse bg-neutral-200" />
                )}
              </div>
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 space-y-4 w-full">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <h2 className="text-xl font-medium">{profile.username}</h2>
              <div className="flex gap-2">
                <button className="flex-1 sm:flex-none px-6 py-1.5 bg-neutral-100 hover:bg-neutral-200 font-medium rounded-lg text-sm transition-colors">
                  Seguir
                </button>
                <button className="flex-1 sm:flex-none px-6 py-1.5 bg-neutral-100 hover:bg-neutral-200 font-medium rounded-lg text-sm transition-colors">
                  Mensagem
                </button>
              </div>
            </div>

            <div className="flex justify-between sm:justify-start sm:gap-8 text-sm py-2 sm:py-0 border-y sm:border-y-0 border-neutral-100">
              <div className="flex flex-col sm:flex-row sm:gap-1 items-center sm:items-start"><span className="font-semibold">{profile.posts.length}</span> <span className="text-neutral-500 sm:text-neutral-900">publicações</span></div>
              <div className="flex flex-col sm:flex-row sm:gap-1 items-center sm:items-start"><span className="font-semibold">{profile.followers}</span> <span className="text-neutral-500 sm:text-neutral-900">seguidores</span></div>
              <div className="flex flex-col sm:flex-row sm:gap-1 items-center sm:items-start"><span className="font-semibold">{profile.following}</span> <span className="text-neutral-500 sm:text-neutral-900">seguindo</span></div>
            </div>

            <div className="text-sm">
              <div className="font-semibold">{profile.fullName}</div>
              <div className="whitespace-pre-wrap mt-1">{profile.bio}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex justify-center border-b border-neutral-200">
        <div className="flex items-center gap-2 px-4 py-4 border-t border-neutral-900 -mt-[1px] text-sm font-medium">
          <Grid className="w-4 h-4" />
          PUBLICAÇÕES
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-3 gap-1 md:gap-2 p-1 md:p-2">
        {profile.posts.map((post) => (
          <div 
            key={post.id} 
            className="aspect-square bg-neutral-100 relative group cursor-pointer"
            onClick={() => setSelectedPost(post)}
          >
            {post.imageUrl ? (
              <img src={post.imageUrl} alt="Post" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            ) : (
              <div className="w-full h-full animate-pulse bg-neutral-200" />
            )}
            
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 md:gap-6 text-white font-semibold">
              <div className="flex items-center gap-1 md:gap-2">
                <Heart className="w-5 h-5 md:w-6 md:h-6 fill-white" />
                <span className="text-sm md:text-base">{post.likes}</span>
              </div>
              <div className="flex items-center gap-1 md:gap-2">
                <MessageCircle className="w-5 h-5 md:w-6 md:h-6 fill-white" />
                <span className="text-sm md:text-base">{post.comments}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Profile Picture Modal */}
      {showProfilePic && profile.profilePictureUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 bg-black/90" onClick={() => setShowProfilePic(false)}>
          <button 
            className="absolute top-4 right-4 text-white hover:text-neutral-300 transition-colors"
            onClick={() => setShowProfilePic(false)}
          >
            <X className="w-8 h-8" />
          </button>
          
          <div className="relative max-w-2xl w-full flex flex-col items-center gap-4" onClick={e => e.stopPropagation()}>
            <img 
              src={profile.profilePictureUrl} 
              alt={profile.fullName} 
              className="w-full max-h-[80vh] object-contain rounded-full md:rounded-2xl" 
              referrerPolicy="no-referrer" 
            />
            <button
              onClick={() => handleDownload(profile.profilePictureUrl!, `${profile.username}-profile.png`)}
              className="flex items-center gap-2 px-6 py-3 bg-white text-black font-semibold rounded-full hover:bg-neutral-200 transition-colors"
            >
              <Download className="w-5 h-5" />
              Baixar Foto de Perfil
            </button>
          </div>
        </div>
      )}

      {/* Post Modal */}
      {selectedPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 bg-black/80" onClick={() => setSelectedPost(null)}>
          <button 
            className="absolute top-4 right-4 text-white hover:text-neutral-300 transition-colors"
            onClick={() => setSelectedPost(null)}
          >
            <X className="w-8 h-8" />
          </button>
          
          <div 
            className="bg-white rounded-xl flex flex-col md:flex-row max-w-5xl w-full max-h-[90vh] overflow-hidden relative"
            onClick={e => e.stopPropagation()}
          >
            {/* Image */}
            <div className="w-full md:w-[60%] bg-black flex items-center justify-center flex-shrink-0 relative group">
              {selectedPost.imageUrl ? (
                <>
                  <img src={selectedPost.imageUrl} alt="Post" className="w-full h-auto max-h-[50vh] md:max-h-full object-contain" referrerPolicy="no-referrer" />
                  <button
                    onClick={() => handleDownload(selectedPost.imageUrl!, `${profile.username}-post-${selectedPost.id}.png`)}
                    className="absolute bottom-4 right-4 p-3 bg-black/50 hover:bg-black/70 text-white rounded-full backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100"
                    title="Baixar imagem"
                  >
                    <Download className="w-5 h-5" />
                  </button>
                </>
              ) : (
                <div className="w-full aspect-square animate-pulse bg-neutral-800" />
              )}
            </div>

            {/* Sidebar */}
            <div className="w-full md:w-[40%] flex flex-col bg-white h-[40vh] md:h-auto">
              {/* Header */}
              <div className="p-4 border-b border-neutral-200 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full overflow-hidden bg-neutral-100">
                  {profile.profilePictureUrl && <img src={profile.profilePictureUrl} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />}
                </div>
                <span className="font-semibold text-sm">{profile.username}</span>
                <MoreHorizontal className="w-5 h-5 ml-auto text-neutral-500" />
              </div>

              {/* Comments/Caption */}
              <div className="p-4 flex-1 overflow-y-auto">
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full overflow-hidden bg-neutral-100 flex-shrink-0">
                    {profile.profilePictureUrl && <img src={profile.profilePictureUrl} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />}
                  </div>
                  <div className="text-sm">
                    <span className="font-semibold mr-2">{profile.username}</span>
                    <span className="whitespace-pre-wrap">{selectedPost.caption}</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="p-4 border-t border-neutral-200 space-y-3 bg-white">
                <div className="flex items-center justify-between">
                  <div className="flex gap-4">
                    <Heart className="w-6 h-6 hover:text-neutral-500 cursor-pointer" />
                    <MessageCircle className="w-6 h-6 hover:text-neutral-500 cursor-pointer" />
                    <Send className="w-6 h-6 hover:text-neutral-500 cursor-pointer" />
                  </div>
                  <Bookmark className="w-6 h-6 hover:text-neutral-500 cursor-pointer" />
                </div>
                <div className="font-semibold text-sm">
                  {selectedPost.likes} curtidas
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
