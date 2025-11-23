import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Rocket } from 'lucide-react';
import AIAssistant from '@/components/AIAssistant';

interface Agent {
  id: string;
  name: string;
}

const Campaigns = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [agents, setAgents] = useState<Agent[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    agentId: '',
  });

  useEffect(() => {
    loadAgents();
  }, []);

  const loadAgents = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('agents')
        .select('id, name')
        .eq('user_id', user.id);

      if (error) throw error;
      setAgents(data || []);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to load agents',
        variant: 'destructive',
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsLoading(true);
    try {
      const { error } = await supabase.from('campaigns').insert({
        user_id: user.id,
        agent_id: formData.agentId,
        name: formData.name,
        status: 'pending',
      });

      if (error) throw error;

      // Send to webhook
      try {
        await fetch('https://workflow.ccbp.in/webhook-test/campaign', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            user_id: user.id,
            agent_id: formData.agentId,
            name: formData.name,
            status: 'pending',
            timestamp: new Date().toISOString(),
          }),
        });
      } catch (webhookError) {
        console.error('Webhook error:', webhookError);
      }

      toast({
        title: 'Campaign created!',
        description: 'Your campaign has been successfully created and is ready to launch.',
      });

      setFormData({ name: '', agentId: '' });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create campaign',
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
          <h1 className="text-4xl font-bold mb-2">Launch Campaign</h1>
          <p className="text-muted-foreground text-lg">
            Start your AI voice campaign
          </p>
        </div>

        <Card className="border-primary/20 card-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Rocket className="w-5 h-5" />
              Campaign Configuration
            </CardTitle>
            <CardDescription>
              Select an agent and configure your campaign
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Campaign Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Q1 Sales Outreach"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="agent">Select Agent *</Label>
                <Select
                  value={formData.agentId}
                  onValueChange={(value) => setFormData({ ...formData, agentId: value })}
                  required
                >
                  <SelectTrigger id="agent">
                    <SelectValue placeholder="Choose an agent" />
                  </SelectTrigger>
                  <SelectContent>
                    {agents.length === 0 ? (
                      <SelectItem value="none" disabled>
                        No agents available
                      </SelectItem>
                    ) : (
                      agents.map((agent) => (
                        <SelectItem key={agent.id} value={agent.id}>
                          {agent.name}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
                {agents.length === 0 && (
                  <p className="text-sm text-muted-foreground">
                    You need to create an agent first
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Contact Group</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="All Contacts" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Contacts</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={isLoading || agents.length === 0}
              >
                {isLoading ? 'Creating...' : 'Create Campaign'}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="border-orange-500/20 bg-orange-500/5">
          <CardHeader>
            <CardTitle className="text-orange-400">Campaign Setup</CardTitle>
            <CardDescription>
              Once created, campaigns will need to be manually started through the Results page
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
      
      <AIAssistant />
    </Layout>
  );
};

export default Campaigns;
