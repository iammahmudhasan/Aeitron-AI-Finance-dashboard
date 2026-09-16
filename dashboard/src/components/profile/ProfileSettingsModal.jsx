import { useState, useRef } from 'react';
import {
  X,
  Upload,
  Camera,
  User,
  Mail,
  Phone,
  FileText,
  Check,
  Sparkles,
  Link,
  Shield,
  Trash2,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&h=160&fit=crop&crop=faces',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=160&h=160&fit=crop&crop=faces',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=160&h=160&fit=crop&crop=faces',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=160&h=160&fit=crop&crop=faces',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=160&h=160&fit=crop&crop=faces',
  'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=160&h=160&fit=crop&crop=faces',
];

export default function ProfileSettingsModal({ isOpen, onClose }) {
  const { currentUser, updateUser } = useAuth();
  const fileInputRef = useRef(null);

  const [name, setName] = useState(currentUser?.name || '');
  const [avatar, setAvatar] = useState(currentUser?.avatar || '/aeitron_icon_fb.png');
  const [phone, setPhone] = useState(currentUser?.phone || '+1 (555) 234-8901');
  const [bio, setBio] = useState(currentUser?.bio || 'Leading agency automations, AI telephony voice systems, and business intelligence.');
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [customUrl, setCustomUrl] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  // Handle local file upload
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle URL Avatar submit
  const handleApplyUrl = () => {
    if (customUrl.trim()) {
      setAvatar(customUrl.trim());
      setCustomUrl('');
      setShowUrlInput(false);
    }
  };

  // Submit Profile Changes
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    updateUser({
      ...currentUser,
      name: name.trim(),
      avatar,
      phone: phone.trim(),
      bio: bio.trim(),
    });

    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-bg-card border border-border shadow-2xl rounded-2xl max-w-lg w-full overflow-hidden animate-fade-in text-text">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-border bg-bg/20">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-accent/15 text-accent flex items-center justify-center">
              <User size={18} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-text">Customize Profile</h3>
              <p className="text-[11px] text-text-muted">Update your profile picture, display name, and details</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-text-muted hover:text-text rounded-lg hover:bg-bg transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Content Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Profile Picture Section */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 p-3.5 bg-bg/50 rounded-2xl border border-border/80">
            {/* Avatar Preview with Camera Button */}
            <div className="relative mx-auto sm:mx-0 shrink-0 group">
              <img
                src={avatar}
                alt={name}
                className="w-20 h-20 rounded-2xl object-cover border-2 border-accent/40 shadow-md ring-4 ring-accent/10"
                onError={(e) => {
                  e.currentTarget.src = '/aeitron_icon_fb.png';
                }}
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute inset-0 bg-black/40 rounded-2xl flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
                title="Change Photo"
              >
                <Camera size={20} />
              </button>
            </div>

            {/* Actions for Photo */}
            <div className="flex-1 space-y-2 text-center sm:text-left">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept="image/*"
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-accent hover:bg-accent-hover text-white rounded-xl text-xs font-semibold transition-colors shadow-xs"
                >
                  <Upload size={13} />
                  <span>Upload Picture</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowUrlInput(!showUrlInput)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-bg border border-border hover:bg-bg-hover text-text rounded-xl text-xs font-medium transition-colors"
                >
                  <Link size={13} />
                  <span>Image Link</span>
                </button>
              </div>

              {/* URL Input dropdown */}
              {showUrlInput && (
                <div className="flex items-center gap-2 mt-2">
                  <input
                    type="url"
                    placeholder="https://example.com/photo.jpg"
                    value={customUrl}
                    onChange={(e) => setCustomUrl(e.target.value)}
                    className="flex-1 px-3 py-1.5 bg-bg border border-border rounded-xl text-xs text-text outline-none focus:border-accent"
                  />
                  <button
                    type="button"
                    onClick={handleApplyUrl}
                    className="px-3 py-1.5 bg-accent text-white rounded-xl text-xs font-semibold"
                  >
                    Apply
                  </button>
                </div>
              )}

              {/* Quick Preset Selector */}
              <div>
                <span className="text-[10px] font-semibold text-text-muted uppercase tracking-wider block mb-1.5">
                  Or pick a preset avatar
                </span>
                <div className="flex items-center justify-center sm:justify-start gap-1.5">
                  {PRESET_AVATARS.map((presetUrl, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setAvatar(presetUrl)}
                      className={`w-7 h-7 rounded-lg overflow-hidden border transition-all ${
                        avatar === presetUrl ? 'ring-2 ring-accent border-accent scale-110' : 'border-border opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={presetUrl} alt="Preset" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Full Name */}
          <div className="space-y-1">
            <label className="block text-xs font-medium text-text-muted">
              Display Name
            </label>
            <div className="relative">
              <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted/70" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Your full name"
                className="w-full pl-10 pr-4 py-2 bg-bg border border-border rounded-xl text-text text-xs focus:border-accent outline-none transition-colors"
              />
            </div>
          </div>

          {/* Account Email (Read-Only) */}
          <div className="space-y-1">
            <label className="block text-xs font-medium text-text-muted flex items-center justify-between">
              <span>Account Email</span>
              <span className="text-[10px] text-text-muted/70">Credential Login ID</span>
            </label>
            <div className="relative">
              <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted/50" />
              <input
                type="email"
                value={currentUser?.email || ''}
                disabled
                className="w-full pl-10 pr-4 py-2 bg-bg/50 border border-border/60 rounded-xl text-text-muted text-xs cursor-not-allowed"
              />
            </div>
          </div>


          {/* Phone / WhatsApp */}
          <div className="space-y-1">
            <label className="block text-xs font-medium text-text-muted">
              Phone / WhatsApp
            </label>
            <div className="relative">
              <Phone size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted/70" />
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 (555) 234-8901"
                className="w-full pl-10 pr-4 py-2 bg-bg border border-border rounded-xl text-text text-xs focus:border-accent outline-none transition-colors"
              />
            </div>
          </div>

          {/* Bio / Agency Motto */}
          <div className="space-y-1">
            <label className="block text-xs font-medium text-text-muted">
              Short Bio / Responsibilities
            </label>
            <textarea
              rows={2}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell your team about your primary focus..."
              className="w-full p-3 bg-bg border border-border rounded-xl text-text text-xs focus:border-accent outline-none transition-colors resize-none"
            />
          </div>

          {/* Feedback */}
          {savedSuccess && (
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-success/15 text-success border border-success/30 text-xs font-semibold animate-fade-in">
              <Check size={16} />
              <span>Profile updated successfully!</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="pt-3 border-t border-border flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-bg hover:bg-bg-hover text-text border border-border rounded-xl text-xs font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-4 py-2 bg-accent hover:bg-accent-hover text-white rounded-xl text-xs font-semibold transition-colors shadow-xs"
            >
              <Check size={14} />
              <span>Save Profile</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
