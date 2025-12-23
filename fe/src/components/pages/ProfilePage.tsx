import React, { useState, useEffect } from 'react';
import { User, Save, Globe, Lock } from 'lucide-react';
import useToast from '../Hooks/useToast';
import type { Profile } from '@/lib/types';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { api } from '@/lib/api';


export const ProfilePage: React.FC = () => {
  const { success, error: showError } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [formData, setFormData] = useState({
    profession: '',
    bio: '',
    avatar: '',
    socialLinks: {
      XLink: '',
      InstagramLink: '',
      Whatsapp: '',
      MediumLink: '',
    },
    publicProfile: false,
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const data = await api.profile.get();
      setProfile(data);
      setFormData({
        profession: data.profession || '',
        bio: data.bio || '',
        avatar: data.avatar || '',
        socialLinks: data.socialLinks || {
          XLink: '',
          InstagramLink: '',
          Whatsapp: '',
          MediumLink: '',
        },
        publicProfile: data.publicProfile || false,
      });
    } catch (err: any) {
      showError('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.profile.update(formData);
      success('Profile updated successfully');
      await loadProfile();
    } catch (err: any) {
      showError('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const toggleVisibility = async () => {
    try {
      await api.profile.toggleVisibility(!formData.publicProfile);
      setFormData(prev => ({ ...prev, publicProfile: !prev.publicProfile }));
      success(`Profile is now ${!formData.publicProfile ? 'public' : 'private'}`);
    } catch (err: any) {
      showError('Failed to update visibility');
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="inline-block w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="flex-1">
      <div className="max-w-3xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Profile Settings</h1>
          <p className="text-muted-foreground">
            Manage your personal information and public profile
          </p>
        </div>

        {/* Profile Visibility */}
        <div className="bg-white border border-border rounded-lg p-6 mb-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                {formData.publicProfile ? (
                  <Globe className="h-5 w-5 text-green-600" />
                ) : (
                  <Lock className="h-5 w-5 text-muted-foreground" />
                )}
                <h3 className="font-semibold">Profile Visibility</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                {formData.publicProfile 
                  ? 'Your profile is visible to everyone'
                  : 'Your profile is private'}
              </p>
            </div>
            <Button
              variant={formData.publicProfile ? "secondary" : "default"}
              onClick={toggleVisibility}
              size="sm"
            >
              {formData.publicProfile ? 'Make Private' : 'Make Public'}
            </Button>
          </div>
        </div>

        {/* Profile Form */}
        <form onSubmit={handleSave} className="space-y-6">
          <div className="bg-white border border-border rounded-lg p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <User className="h-5 w-5" />
              Personal Information
            </h3>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  value={profile?.username || ''}
                  disabled
                  className="bg-secondary"
                />
                <p className="text-xs text-muted-foreground">
                  Username cannot be changed
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="profession">Profession</Label>
                <Input
                  id="profession"
                  placeholder="e.g. Software Engineer, Designer"
                  value={formData.profession}
                  onChange={(e) => setFormData({ ...formData, profession: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  placeholder="Tell us about yourself..."
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="avatar">Avatar URL</Label>
                <Input
                  id="avatar"
                  type="url"
                  placeholder="https://example.com/avatar.jpg"
                  value={formData.avatar}
                  onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
                />
              </div>
            </div>
          </div>

          {/* Social Links */}
          <div className="bg-white border border-border rounded-lg p-6">
            <h3 className="font-semibold mb-4">Social Links</h3>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="xlink">X (Twitter)</Label>
                <Input
                  id="xlink"
                  type="url"
                  placeholder="https://x.com/username"
                  value={formData.socialLinks.XLink}
                  onChange={(e) => setFormData({
                    ...formData,
                    socialLinks: { ...formData.socialLinks, XLink: e.target.value }
                  })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="instagram">Instagram</Label>
                <Input
                  id="instagram"
                  type="url"
                  placeholder="https://instagram.com/username"
                  value={formData.socialLinks.InstagramLink}
                  onChange={(e) => setFormData({
                    ...formData,
                    socialLinks: { ...formData.socialLinks, InstagramLink: e.target.value }
                  })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="whatsapp">WhatsApp</Label>
                <Input
                  id="whatsapp"
                  placeholder="+1234567890"
                  value={formData.socialLinks.Whatsapp}
                  onChange={(e) => setFormData({
                    ...formData,
                    socialLinks: { ...formData.socialLinks, Whatsapp: e.target.value }
                  })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="medium">Medium</Label>
                <Input
                  id="medium"
                  type="url"
                  placeholder="https://medium.com/@username"
                  value={formData.socialLinks.MediumLink}
                  onChange={(e) => setFormData({
                    ...formData,
                    socialLinks: { ...formData.socialLinks, MediumLink: e.target.value }
                  })}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <Button type="submit" disabled={saving} size="lg">
              <Save className="h-4 w-4" />
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;