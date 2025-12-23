import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Search, Share2, Lock, ArrowRight, Check } from 'lucide-react';
import { Button } from '../ui/button';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: FileText,
      title: 'Organize Everything',
      description: 'Save links, documents, tweets, and videos in one place',
    },
    {
      icon: Search,
      title: 'Find Instantly',
      description: 'Powerful search across all your saved content and tags',
    },
    {
      icon: Share2,
      title: 'Share Easily',
      description: 'Generate shareable links for any content in seconds',
    },
    {
      icon: Lock,
      title: 'Private & Secure',
      description: 'Your data is encrypted and belongs only to you',
    },
  ];

  const benefits = [
    'Never lose important content again',
    'Access from anywhere, anytime',
    'Tag and categorize with ease',
    'Clean, distraction-free interface',
    'Fast and reliable',
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="border-b border-border">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded flex items-center justify-center">
                <span className="text-white font-bold text-sm">SB</span>
              </div>
              <span className="text-xl font-semibold">Second Brain</span>
            </div>
            <div className="flex items-center gap-3">
              <Button 
                variant="ghost" 
                onClick={() => navigate('/auth')}
              >
                Sign In
              </Button>
              <Button onClick={() => navigate('/auth?signup=true')}>
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-6">
            Your Digital Memory,
            <br />
            <span className="text-primary">Organized</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Save, organize, and find everything that matters. Build your second brain
            and never lose track of important content again.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Button 
              size="lg" 
              onClick={() => navigate('/auth?signup=true')}
              className="text-base"
            >
              Start Free
              <ArrowRight className="h-5 w-5" />
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              onClick={() => navigate('/auth')}
              className="text-base"
            >
              Sign In
            </Button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 px-6 bg-secondary">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Everything you need to stay organized
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, idx) => (
              <div key={idx} className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-white border border-border rounded-lg mb-4">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">
                Why people love Second Brain
              </h2>
              <div className="space-y-4">
                {benefits.map((benefit, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <div className="shrink-0 w-5 h-5 bg-green-50 rounded-full flex items-center justify-center mt-0.5">
                      <Check className="h-3 w-3 text-green-600" />
                    </div>
                    <span className="text-foreground">{benefit}</span>
                  </div>
                ))}
              </div>
              <Button 
                size="lg" 
                className="mt-8"
                onClick={() => navigate('/auth?signup=true')}
              >
                Get Started Free
              </Button>
            </div>
            <div className="bg-secondary rounded-lg p-8 border border-border">
              <div className="space-y-4">
                <div className="bg-white border border-border rounded p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">LINK</span>
                  </div>
                  <h4 className="font-semibold mb-1">React Documentation</h4>
                  <p className="text-sm text-muted-foreground">Official React docs</p>
                  <div className="flex gap-2 mt-3">
                    <span className="px-2 py-0.5 bg-secondary text-xs rounded border">react</span>
                    <span className="px-2 py-0.5 bg-secondary text-xs rounded border">docs</span>
                  </div>
                </div>
                <div className="bg-white border border-border rounded p-4 opacity-60">
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">DOCUMENT</span>
                  </div>
                  <h4 className="font-semibold mb-1">Project Ideas</h4>
                  <p className="text-sm text-muted-foreground">Side project concepts</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-6 bg-primary">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to organize your digital life?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Join thousands who have built their second brain
          </p>
          <Button 
            size="lg" 
            variant="secondary"
            onClick={() => navigate('/auth?signup=true')}
            className="text-base"
          >
            Start Free Today
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-6">
        <div className="max-w-6xl mx-auto text-center text-sm text-muted-foreground">
          <p>© 2024 Second Brain. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;