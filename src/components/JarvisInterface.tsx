import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Power, Settings, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import jarvisHero from '@/assets/jarvis-hero.jpg';
import SettingsPanel from './SettingsPanel';

const JarvisInterface = () => {
  const [isListening, setIsListening] = useState(false);
  const [isPowered, setIsPowered] = useState(true);
  const [currentCommand, setCurrentCommand] = useState('');
  const [jarvisResponse, setJarvisResponse] = useState('হ্যালো স্যার, আমি JARVIS। আপনার সেবায় প্রস্তুত।');
  const [showSettings, setShowSettings] = useState(false);

  const handleVoiceToggle = () => {
    if (!isPowered) return;
    
    setIsListening(!isListening);
    if (!isListening) {
      setJarvisResponse('আমি শুনছি স্যার...');
    } else {
      setJarvisResponse('ঠিক আছে স্যার।');
    }
  };

  const handlePowerToggle = () => {
    setIsPowered(!isPowered);
    if (isPowered) {
      setIsListening(false);
      setJarvisResponse('JARVIS বন্ধ হচ্ছে... গুড বাই স্যার।');
    } else {
      setJarvisResponse('JARVIS চালু হচ্ছে... হ্যালো স্যার।');
    }
  };

  const commandExamples = [
    "হোয়াটসঅ্যাপ খুলুন",
    "গুগলে সার্চ করুন",
    "মাকে কল করুন", 
    "ফ্ল্যাশলাইট চালু করুন",
    "১০ মিনিট পর রিমাইন্ড করুন"
  ];

  return (
    <div className="min-h-screen bg-background jarvis-grid relative overflow-hidden">
      {/* Background hero image with overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
        style={{ backgroundImage: `url(${jarvisHero})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-br from-background/90 via-background/80 to-background/90" />
      
      {/* Background glow effects */}
      <div className="absolute inset-0 bg-gradient-radial from-primary/10 via-transparent to-transparent animate-pulse"></div>
      
      {/* Header */}
      <div className="relative z-10 p-6">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Zap className={`w-8 h-8 ${isPowered ? 'text-primary glow-primary' : 'text-muted-foreground'} animate-float`} />
              {isPowered && (
                <div className="absolute inset-0 animate-ping">
                  <Zap className="w-8 h-8 text-primary opacity-30" />
                </div>
              )}
            </div>
            <h1 className="text-3xl font-bold text-primary text-glow">
              JARVIS
            </h1>
          </div>
          
          <Button
            variant="outline" 
            size="icon"
            className="glow-secondary border-secondary text-secondary hover:bg-secondary/20"
            onClick={() => setShowSettings(true)}
          >
            <Settings className="w-5 h-5" />
          </Button>
        </div>

        {/* Main Interface */}
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Power Control */}
          <Card className="p-6 border-primary/30 bg-card/80 backdrop-blur-sm glow-primary">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-foreground mb-2">
                  পাওয়ার কন্ট্রোল
                </h2>
                <p className="text-muted-foreground">
                  JARVIS {isPowered ? 'চালু' : 'বন্ধ'} আছে
                </p>
              </div>
              <Button
                onClick={handlePowerToggle}
                variant="outline"
                size="lg"
                className={`
                  px-8 py-4 border-2 transition-all duration-300
                  ${isPowered 
                    ? 'border-accent text-accent glow-accent hover:bg-accent/20' 
                    : 'border-destructive text-destructive hover:bg-destructive/20'
                  }
                `}
              >
                <Power className="w-5 h-5 mr-2" />
                {isPowered ? 'অন' : 'অফ'}
              </Button>
            </div>
          </Card>

          {/* Voice Interface */}
          <Card className={`p-8 border-primary/30 bg-card/80 backdrop-blur-sm ${isPowered ? 'glow-primary' : 'opacity-50'}`}>
            <div className="text-center space-y-6">
              <div className="relative inline-block">
                <Button
                  onClick={handleVoiceToggle}
                  disabled={!isPowered}
                  variant="outline"
                  size="lg"
                  className={`
                    w-24 h-24 rounded-full border-4 transition-all duration-300
                    ${isListening && isPowered
                      ? 'border-accent text-accent glow-accent pulse-glow scale-110' 
                      : 'border-primary text-primary hover:glow-primary hover:scale-105'
                    }
                  `}
                >
                  {isListening ? (
                    <Mic className="w-8 h-8 animate-pulse" />
                  ) : (
                    <MicOff className="w-8 h-8" />
                  )}
                </Button>
                
                {isListening && isPowered && (
                  <div className="absolute inset-0 rounded-full border-4 border-accent animate-ping opacity-30"></div>
                )}
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-foreground">
                  {isListening ? 'শুনছি...' : 'ভয়েস কমান্ড'}
                </h3>
                <p className="text-muted-foreground">
                  {isPowered 
                    ? 'মাইক বাটনে ক্লিক করে কমান্ড দিন'
                    : 'প্রথমে JARVIS চালু করুন'
                  }
                </p>
              </div>
            </div>
          </Card>

          {/* JARVIS Response */}
          <Card className="p-6 border-secondary/30 bg-card/80 backdrop-blur-sm glow-secondary">
            <div className="text-center space-y-4">
              <div className="w-12 h-12 mx-auto bg-gradient-primary rounded-full flex items-center justify-center animate-float">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-secondary">
                  JARVIS এর উত্তর
                </h3>
                <p className="text-foreground text-lg font-medium">
                  "{jarvisResponse}"
                </p>
              </div>
            </div>
          </Card>

          {/* Command Examples */}
          <Card className="p-6 border-accent/30 bg-card/80 backdrop-blur-sm glow-accent">
            <h3 className="text-lg font-semibold text-accent mb-4 text-center">
              উদাহরণ কমান্ড
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {commandExamples.map((command, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="justify-start text-left border-accent/50 text-accent hover:bg-accent/20 hover:glow-accent"
                  disabled={!isPowered}
                >
                  <span className="truncate">{command}</span>
                </Button>
              ))}
            </div>
          </Card>
        </div>
      </div>
      
      {/* Footer */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-center">
        <p className="text-muted-foreground text-sm">
          JARVIS AI Assistant v1.0
        </p>
      </div>

      {/* Settings Panel */}
      <SettingsPanel 
        isOpen={showSettings} 
        onClose={() => setShowSettings(false)} 
      />
    </div>
  );
};

export default JarvisInterface;