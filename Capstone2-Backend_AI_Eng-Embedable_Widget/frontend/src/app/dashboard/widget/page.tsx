'use client';

import { useState, useEffect, useRef } from 'react';
import DashboardLayout from '@/components/layout/dashboard-layout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/components/ui/toast';
import { createWidgetSession, sendWidgetMessage, getWidgetMessages } from '@/lib/api';
import type { Message } from '@/types';

export default function WidgetPage() {
  const [apiKey, setApiKey] = useState('');
  const [session, setSession] = useState<{ visitor_id: string; conversation_id: string } | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  async function handleStart() {
    if (!apiKey) {
      toast('Please enter an API key', 'error');
      return;
    }
    setLoading(true);
    try {
      const s = await createWidgetSession({ project_api_key: apiKey, visitor_identifier: `widget_demo_${Date.now()}` });
      setSession({ visitor_id: s.visitor_id, conversation_id: s.conversation_id });
      const msgs = await getWidgetMessages(s.conversation_id, apiKey, 50);
      setMessages(msgs);
      toast('Widget session started', 'success');
    } catch (err) {
      toast(err instanceof Error ? err.message : 'Failed to start session', 'error');
    } finally {
      setLoading(false);
    }
  }

  async function handleSend() {
    if (!newMessage.trim() || !session || !apiKey) return;
    setSending(true);
    try {
      const msg = await sendWidgetMessage(session.conversation_id, apiKey, newMessage);
      setMessages([...messages, msg]);
      setNewMessage('');
    } catch (err) {
      toast(err instanceof Error ? err.message : 'Failed to send message', 'error');
    } finally {
      setSending(false);
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Widget Preview</h1>
          <p className="text-zinc-400">Test your AI widget in real-time</p>
        </div>

        {!session ? (
          <Card>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Start a Widget Session</h3>
                <p className="text-sm text-zinc-400 mb-4">Enter a project API key to initialize a widget session and start chatting.</p>
              </div>
              <Input
                label="Project API Key"
                placeholder="Paste your project API key"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
              />
              <Button onClick={handleStart} loading={loading} size="lg">
                Start Widget
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>AI Widget Chat</CardTitle>
                  <p className="text-xs text-zinc-500 mt-1">
                    Conversation: {session.conversation_id.slice(0, 8)}...
                  </p>
                </div>
                <Badge variant="success">Active</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-[500px] overflow-y-auto mb-4">
                {messages.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 rounded-2xl bg-zinc-800/50 border border-zinc-700 flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 013 21V12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
                      </svg>
                    </div>
                    <p className="text-zinc-400 text-sm">Send a message to start the conversation.</p>
                  </div>
                ) : (
                  messages.map((msg) => (
                    <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`flex gap-3 max-w-[80%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium shrink-0 ${
                          msg.role === 'user' ? 'bg-zinc-700 text-zinc-300' : 'bg-white text-black'
                        }`}>
                          {msg.role === 'user' ? 'U' : 'AI'}
                        </div>
                        <div className={`px-4 py-2.5 rounded-2xl text-sm ${
                          msg.role === 'user'
                            ? 'bg-white text-black'
                            : 'bg-zinc-800 text-zinc-300 border border-zinc-700'
                        }`}>
                          {msg.content}
                        </div>
                      </div>
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>

              <div className="flex gap-3 pt-4 border-t border-zinc-800">
                <Input
                  placeholder="Type your message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleSend())}
                  disabled={sending}
                />
                <Button onClick={handleSend} loading={sending} disabled={!newMessage.trim()}>
                  Send
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
