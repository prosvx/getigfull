import React, { useState } from 'react';
import { Profile } from './types';
import { generateProfileData, generateImageSafe } from './services/gemini';
import ProfileView from './components/ProfileView';
import { Loader2, Sparkles, Instagram } from 'lucide-react';

export default function App() {
  const [prompt, setPrompt] = useState('');
  const [server, setServer] = useState('gemini-3-flash-preview');
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState('');
  const [profile, setProfile] = useState<Profile | null>(null);

  const handleGenerate = async () => {
    if (!prompt) return;
    setLoading(true);
    setProfile(null);
    try {
      setProgress('Criando persona e dados do perfil...');
      const profileData = await generateProfileData(prompt, server);
      
      setProfile(profileData);

      setProgress('Gerando foto de perfil...');
      const profilePicUrl = await generateImageSafe(profileData.profilePicturePrompt);
      setProfile(prev => prev ? { ...prev, profilePictureUrl: profilePicUrl } : null);

      for (let i = 0; i < profileData.posts.length; i++) {
        setProgress(`Gerando foto do post ${i + 1} de ${profileData.posts.length}...`);
        const postImageUrl = await generateImageSafe(profileData.posts[i].imagePrompt);
        setProfile(prev => {
          if (!prev) return null;
          const newPosts = [...prev.posts];
          newPosts[i].imageUrl = postImageUrl;
          return { ...prev, posts: newPosts };
        });
      }

      setProgress('');
    } catch (error) {
      console.error(error);
      alert('Erro ao gerar perfil. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 font-sans pb-12">
      <header className="bg-white border-b border-neutral-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center gap-2">
          <Instagram className="w-6 h-6 text-pink-600" />
          <h1 className="font-semibold text-xl tracking-tight">AI InstaGen</h1>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        {!profile && !loading && (
          <div className="max-w-2xl mx-auto mt-12 text-center space-y-8">
            <div className="space-y-4">
              <h2 className="text-4xl font-bold tracking-tight text-neutral-900">
                Crie perfis de Instagram com IA
              </h2>
              <p className="text-lg text-neutral-600">
                Descreva uma persona e nós geraremos um perfil completo com foto de perfil, biografia, e posts com imagens e legendas.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-200 space-y-4 text-left">
              <label className="block text-sm font-medium text-neutral-700">
                Descreva o perfil que deseja criar
              </label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Ex: Uma influenciadora de moda sustentável que mora em São Paulo, adora brechós e dá dicas de looks minimalistas."
                className="w-full h-32 p-4 rounded-xl border border-neutral-300 focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none resize-none"
              />
              
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-neutral-700">Servidor (Modelo de IA)</label>
                <select
                  value={server}
                  onChange={(e) => setServer(e.target.value)}
                  className="w-full p-3 rounded-xl border border-neutral-300 focus:ring-2 focus:ring-pink-500 outline-none bg-white"
                >
                  <option value="gemini-3-flash-preview">Server 1 (Atual - gemini-3)</option>
                  <option value="gemini-2.5-flash">Server 2 (Alternativo - gemini-2.5)</option>
                </select>
              </div>

              <button
                onClick={handleGenerate}
                disabled={!prompt || loading}
                className="w-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white font-medium py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              >
                <Sparkles className="w-5 h-5" />
                Gerar Perfil Completo
              </button>
            </div>
          </div>
        )}

        {(loading || profile) && (
          <div className="space-y-8">
            {loading && (
              <div className="bg-white p-4 rounded-xl shadow-sm border border-neutral-200 flex items-center gap-4 max-w-4xl mx-auto">
                <Loader2 className="w-6 h-6 text-pink-600 animate-spin" />
                <span className="font-medium text-neutral-700">{progress}</span>
              </div>
            )}
            
            {profile && <ProfileView profile={profile} />}
          </div>
        )}
      </main>
    </div>
  );
}
