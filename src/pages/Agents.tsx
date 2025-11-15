import { useState } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Plus } from 'lucide-react';
import AIAssistant from '@/components/AIAssistant';

const Agents = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    greeting: '',
    prompt: '',
    language: 'English',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsLoading(true);
    try {
      const { error } = await supabase.from('agents').insert({
        user_id: user.id,
        name: formData.name,
        greeting_message: formData.greeting,
        prompt: formData.prompt,
        language: formData.language,
      });

      if (error) throw error;

      toast({
        title: 'Agent created!',
        description: 'Your AI agent has been successfully created.',
      });

      setFormData({ name: '', greeting: '', prompt: '', language: 'English' });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create agent',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-3xl mx-auto space-y-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">Create AI Agent</h1>
          <p className="text-muted-foreground text-lg">
            Configure your voice AI agent with custom instructions
          </p>
        </div>

        <Card className="border-primary/20 card-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="w-5 h-5" />
              New Agent Configuration
            </CardTitle>
            <CardDescription>
              Fill in the details to create a new AI voice agent
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Agent Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Sales Assistant"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="greeting">Greeting Message *</Label>
                <Textarea
                  id="greeting"
                  value={formData.greeting}
                  onChange={(e) => setFormData({ ...formData, greeting: e.target.value })}
                  placeholder="e.g., Hi, I'm calling from XYZ Company..."
                  rows={3}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="prompt">Agent Prompt *</Label>
                <Textarea
                  id="prompt"
                  value={formData.prompt}
                  onChange={(e) => setFormData({ ...formData, prompt: e.target.value })}
                  placeholder="Describe how the agent should behave, its goals, and conversation style..."
                  rows={6}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="language">Language</Label>
                <Select
                  value={formData.language}
                  onValueChange={(value) => setFormData({ ...formData, language: value })}
                >
                  <SelectTrigger id="language">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="English">English</SelectItem>
                    <SelectItem value="Spanish">Spanish</SelectItem>
                    <SelectItem value="French">French</SelectItem>
                    <SelectItem value="German">German</SelectItem>
                    <SelectItem value="Italian">Italian</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Creating...' : 'Create Agent'}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle>Need Help?</CardTitle>
            <CardDescription>
              Click the AI assistant button in the bottom right to get guidance on creating effective agents
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
      
      <AIAssistant />
    </Layout>
  );
};

export default Agents;
