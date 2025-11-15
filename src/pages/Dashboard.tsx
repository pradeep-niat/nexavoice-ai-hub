import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Bot, Users, Mail, BarChart3, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AIAssistant from '@/components/AIAssistant';

const Dashboard = () => {
  const navigate = useNavigate();

  const cards = [
    {
      title: 'Create Agent',
      description: 'Build and configure AI voice agents',
      icon: Bot,
      path: '/agents',
      gradient: 'from-blue-500 to-cyan-500',
    },
    {
      title: 'Upload Contacts',
      description: 'Manage your contact database',
      icon: Users,
      path: '/contacts',
      gradient: 'from-purple-500 to-pink-500',
    },
    {
      title: 'Launch Campaign',
      description: 'Start voice AI campaigns',
      icon: Mail,
      path: '/campaigns',
      gradient: 'from-orange-500 to-red-500',
    },
    {
      title: 'View Results',
      description: 'Track campaign performance',
      icon: BarChart3,
      path: '/results',
      gradient: 'from-green-500 to-emerald-500',
    },
  ];

  return (
    <Layout>
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">Welcome to NexaVoice AI</h1>
          <p className="text-muted-foreground text-lg">
            Manage your AI voice campaigns from one powerful dashboard
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {cards.map((card) => {
            const Icon = card.icon;
            return (
              <Card
                key={card.path}
                className="group hover:border-primary/50 transition-all duration-300 cursor-pointer card-shadow hover:glow-effect"
                onClick={() => navigate(card.path)}
              >
                <CardHeader>
                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-br ${card.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="flex items-center justify-between">
                    {card.title}
                    <ArrowRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </CardTitle>
                  <CardDescription>{card.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="ghost" className="w-full group-hover:bg-primary/10">
                    Get Started
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Card className="border-primary/20 card-shadow">
          <CardHeader>
            <CardTitle>Quick Stats</CardTitle>
            <CardDescription>Overview of your activities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="p-4 bg-secondary rounded-lg">
                <p className="text-sm text-muted-foreground">Active Agents</p>
                <p className="text-2xl font-bold">0</p>
              </div>
              <div className="p-4 bg-secondary rounded-lg">
                <p className="text-sm text-muted-foreground">Total Contacts</p>
                <p className="text-2xl font-bold">0</p>
              </div>
              <div className="p-4 bg-secondary rounded-lg">
                <p className="text-sm text-muted-foreground">Campaigns</p>
                <p className="text-2xl font-bold">0</p>
              </div>
              <div className="p-4 bg-secondary rounded-lg">
                <p className="text-sm text-muted-foreground">Success Rate</p>
                <p className="text-2xl font-bold">-</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <AIAssistant />
    </Layout>
  );
};

export default Dashboard;
