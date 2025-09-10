import React from 'react';
import { X, User, Volume2, Globe, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto border-primary/30 bg-card/95 backdrop-blur-md glow-primary">
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-primary text-glow">
              সেটিংস
            </h2>
            <Button 
              onClick={onClose}
              variant="outline" 
              size="icon"
              className="border-destructive text-destructive hover:bg-destructive/20"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* User Settings */}
          <Card className="p-4 border-secondary/30 bg-card/50">
            <div className="flex items-center space-x-3 mb-4">
              <User className="w-5 h-5 text-secondary" />
              <h3 className="text-lg font-semibold text-secondary">
                ইউজার তথ্য
              </h3>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullname" className="text-foreground">
                  পূর্ণ নাম
                </Label>
                <Input 
                  id="fullname"
                  placeholder="আপনার পূর্ণ নাম লিখুন"
                  className="border-secondary/50 bg-background/50"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="nickname" className="text-foreground">
                  ডাক নাম
                </Label>
                <Input 
                  id="nickname"
                  placeholder="JARVIS আপনাকে কি নামে ডাকবে?"
                  className="border-secondary/50 bg-background/50"
                />
              </div>
            </div>
          </Card>

          {/* Voice Settings */}
          <Card className="p-4 border-accent/30 bg-card/50">
            <div className="flex items-center space-x-3 mb-4">
              <Volume2 className="w-5 h-5 text-accent" />
              <h3 className="text-lg font-semibold text-accent">
                ভয়েস সেটিংস
              </h3>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-foreground">ভয়েস টাইপ</Label>
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" className="justify-start">
                    পুরুষ ভয়েস
                  </Button>
                  <Button variant="outline" className="justify-start">
                    মহিলা ভয়েস
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-foreground">কাস্টম অডিও আপলোড</Label>
                <input 
                  type="file" 
                  accept="audio/*"
                  className="w-full p-2 rounded-md border border-accent/50 bg-background/50 text-foreground"
                />
              </div>
            </div>
          </Card>

          {/* Language Settings */}
          <Card className="p-4 border-primary/30 bg-card/50">
            <div className="flex items-center space-x-3 mb-4">
              <Globe className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-semibold text-primary">
                ভাষা সেটিংস
              </h3>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Button variant="jarvis" className="justify-start">
                বাংলা
              </Button>
              <Button variant="outline" className="justify-start">
                English
              </Button>
            </div>
          </Card>

          {/* Notification Settings */}
          <Card className="p-4 border-secondary/30 bg-card/50">
            <div className="flex items-center space-x-3 mb-4">
              <Bell className="w-5 h-5 text-secondary" />
              <h3 className="text-lg font-semibold text-secondary">
                নোটিফিকেশন
              </h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-foreground">নোটিফিকেশন পড়া</span>
                <Button variant="accent" size="sm">চালু</Button>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-foreground">রিমাইন্ডার</span>
                <Button variant="accent" size="sm">চালু</Button>
              </div>
            </div>
          </Card>

          {/* Authentication Notice */}
          <Card className="p-4 border-destructive/30 bg-destructive/10">
            <div className="text-center space-y-3">
              <h3 className="text-lg font-semibold text-destructive">
                উন্নত ফিচারের জন্য
              </h3>
              <p className="text-destructive/80">
                দীর্ঘমেয়াদী স্মৃতি, রিমাইন্ডার এবং ইউজার অ্যাকাউন্টের জন্য ডাটাবেস সংযোগ প্রয়োজন
              </p>
              <Button variant="destructive">
                ডাটাবেস সংযোগ করুন
              </Button>
            </div>
          </Card>

          {/* Save Button */}
          <div className="flex justify-end space-x-3">
            <Button variant="outline" onClick={onClose}>
              বাতিল
            </Button>
            <Button variant="jarvis">
              সংরক্ষণ করুন
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default SettingsPanel;