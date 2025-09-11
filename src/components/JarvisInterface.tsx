import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Power, Settings, Zap, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import jarvisHero from '@/assets/jarvis-hero.jpg';
import SettingsPanel from './SettingsPanel';
import { MobileServices } from '@/services/mobileServices';
import { useToast } from '@/components/ui/use-toast';

const JarvisInterface = () => {
  const [isListening, setIsListening] = useState(false);
  const [isPowered, setIsPowered] = useState(true);
  const [currentCommand, setCurrentCommand] = useState('');
  const [jarvisResponse, setJarvisResponse] = useState('হ্যালো স্যার, আমি JARVIS। আপনার সেবায় প্রস্তুত।');
  const [showSettings, setShowSettings] = useState(false);
  const [deviceInfo, setDeviceInfo] = useState<any>(null);
  const { toast } = useToast();

  // Initialize mobile services
  useEffect(() => {
    const initializeMobile = async () => {
      try {
        await MobileServices.initialize();
        const info = await MobileServices.getDeviceInfo();
        setDeviceInfo(info);
        
        if (MobileServices.isNative) {
          setJarvisResponse('মোবাইল অ্যাপ চালু হয়েছে। সব ফিচার সক্রিয়।');
          toast({
            title: "JARVIS Mobile Ready",
            description: "All mobile features activated",
          });
        }
      } catch (error) {
        console.error('Mobile initialization failed:', error);
      }
    };

    initializeMobile();
  }, [toast]);

  const handleVoiceToggle = async () => {
    if (!isPowered) return;
    
    setIsListening(!isListening);
    
    if (!isListening) {
      setJarvisResponse('আমি শুনছি স্যার...');
      await MobileServices.vibrate('light');
      
      // Simulate voice recognition with timeout
      setTimeout(async () => {
        const mockCommands = [
          'সময় কত?',
          'গুগল খোলো',
          'ক্যামেরা চালু করো',
          '৫ মিনিট পর মনে করিয়ে দাও'
        ];
        const randomCommand = mockCommands[Math.floor(Math.random() * mockCommands.length)];
        setCurrentCommand(randomCommand);
        
        const response = await MobileServices.processVoiceCommand(randomCommand);
        setJarvisResponse(response);
        setIsListening(false);
        
        await MobileServices.vibrate('medium');
      }, 2000);
    } else {
      setJarvisResponse('ঠিক আছে স্যার।');
    }
  };

  const handleExampleCommand = async (command: string) => {
    if (!isPowered) return;
    
    setCurrentCommand(command);
    setJarvisResponse('কমান্ড প্রসেসিং...');
    await MobileServices.vibrate('light');
    
    const response = await MobileServices.processVoiceCommand(command);
    setJarvisResponse(response);
  };

  const handlePowerToggle = async () => {
    setIsPowered(!isPowered);
    await MobileServices.vibrate('heavy');
    
    if (isPowered) {
      setIsListening(false);
      setJarvisResponse('JARVIS বন্ধ হচ্ছে... গুড বাই স্যার।');
    } else {
      setJarvisResponse('JARVIS চালু হচ্ছে... হ্যালো স্যার।');
      await MobileServices.enableBackgroundMode();
    }
  };

  const commandExamples = [
    "সময় কত?",
    "গুগল খোল",
    "ক্যামেরা চালু কর", 
    "ইউটিউব খোল",
    "১০ মিনিট পর রিমাইন্ড কর",
    "ডিভাইস তথ্য"
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
              <div className="flex items-center space-x-2">
                <Zap className={`w-8 h-8 ${isPowered ? 'text-primary glow-primary' : 'text-muted-foreground'} animate-float`} />
                {MobileServices.isNative && (
                  <Smartphone className="w-6 h-6 text-accent animate-pulse" />
                )}
              </div>
              {isPowered && (
                <div className="absolute inset-0 animate-ping">
                  <Zap className="w-8 h-8 text-primary opacity-30" />
                </div>
              )}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-primary text-glow">
                JARVIS
              </h1>
              {MobileServices.isNative && (
                <p className="text-xs text-accent">Mobile App Active</p>
              )}
            </div>
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
                  onClick={() => handleExampleCommand(command)}
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
          JARVIS AI Assistant v1.0 {MobileServices.isNative ? '(Mobile App)' : '(Web)'}
        </p>
        {deviceInfo && (
          <p className="text-muted-foreground text-xs">
            {deviceInfo.manufacturer} {deviceInfo.model} • {deviceInfo.operatingSystem} {deviceInfo.osVersion}
          </p>
        )}
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