'use client';

import { useState, useEffect, useRef, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import DashboardLayout from '@/components/layout/dashboard-layout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton, TableSkeleton } from '@/components/ui/skeleton';
import { toast } from '@/components/ui/toast';
import { getConversations, getConversationMessages, sendWidgetMessage, createWidgetSession } from '@/lib/api';
import type { Conversation, Message } from '@/types';

function ConversationsContent() {
  const searchParams = useSearchParams();
  const projectId = searchParams.get('project') || '';
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selected, setSelected] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [sessionLoading, setSessionLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const loadConversations = useCallback(async () => {
    if (!projectId) return;
    setLoading(true);
    try {
      const data = await getConversations(projectId);
      setConversations(data);
    } catch (err) {
      toast(err instanceof Error ? err.message : 'Failed to load conversations', 'error');
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  async function loadMessages(conv: Conversation) {
    setSelected(conv);
    setMessagesLoading(true);
    try {
      const data = await getConversationMessages(conv.id, 50);
      setMessages(data);
    } catch (err) {
      toast(err instanceof Error ? err.message : 'Failed to load messages', 'error');
    } finally {
      setMessagesLoading(false);
    }
  }

  async function handleCreateSession() {
    if (!apiKey) {
      toast('Please enter an API key', 'error');
      return;
    }
    setSessionLoading(true);
    try {
      createWidgetSession({ project_api_key: apiKey, visitor_identifier: `demo_${Date.now()}` });
      toast('Session created', 'success');
      loadConversations();
    } catch (err) {
      toast(err instanceof Error ? err.message : 'Failed to create session', 'error');
    } finally {
      setSessionLoading(false);
    }
  }

  async function handleSendMessage() {
    if (!newMessage.trim() || !selected || !apiKey) return;
    setSending(true);
    try {
      const message = await sendWidgetMessage(selected.id, apiKey, newMessage);
      setMessages([...messages, message]);
      setNewMessage('');
    } catch (err) {
      toast(err instanceof Error ? err.message : 'Failed to send message', 'error');
    } finally {
      setSending(false);
    }
  }

  if (!projectId) {
    return (
      <DashboardLayout>
        <div className="text-center py-20">
          <h2 className="text-2xl font-bold text-white mb-4">Select a Project</h2>
          <p className="text-zinc-400">Choose a project from the dashboard to view conversations.</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Conversations</h1>
          <p className="text-zinc-400">View and manage widget conversations</p>
        </div>

        <Card>
          <div className="flex items-center gap-3">
            <Input
              label="API Key"
              placeholder="Paste project API key for widget access"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="flex-1"
            />
            <Button onClick={handleCreateSession} loading={sessionLoading} className="mt-6">
              Create Session
            </Button>
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Conversations</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <TableSkeleton rows={5} />
              ) : conversations.length === 0 ? (
                <p className="text-zinc-400 text-sm">No conversations yet.</p>
              ) : (
                <div className="space-y-2">
                  {conversations.map((conv) => (
                    <button
                      key={conv.id}
                      onClick={() => loadMessages(conv)}
                      className={`w-full text-left p-3 rounded-lg transition-all ${
                        selected?.id === conv.id
                          ? 'bg-white/10 border border-white/20'
                          : 'bg-zinc-800/30 border border-transparent hover:bg-zinc-800/60'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-white truncate">
                          {conv.id.slice(0, 8)}...
                        </span>
                        <Badge variant={conv.status === 'active' ? 'success' : 'default'} size="sm">
                          {conv.status}
                        </Badge>
                      </div>
                      <p className="text-xs text-zinc-500 mt-1">
                        {new Date(conv.created_at).toLocaleString()}
                      </p>
                    </button>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>{selected ? `Messages` : 'Select a conversation'}</CardTitle>
            </CardHeader>
            <CardContent>
              {!selected ? (
                <p className="text-zinc-400 text-sm">Select a conversation from the left to view messages.</p>
              ) : messagesLoading ? (
                <div className="space-y-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="flex gap-3">
                      <Skeleton className="h-8 w-8 rounded-full shrink-0" variant="circular" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-1/3" variant="text" />
                        <Skeleton className="h-16 w-full" variant="rectangular" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4 max-h-[500px] overflow-y-auto">
                  {messages.map((msg) => (
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
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              )}

              {selected && (
                <div className="mt-4 pt-4 border-t border-zinc-800">
                  <div className="flex gap-3">
                    <Input
                      placeholder="Send a message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSendMessage())}
                      disabled={sending}
                    />
                    <Button onClick={handleSendMessage} loading={sending} disabled={!newMessage.trim()}>
                      Send
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default function ConversationsPage() {
  return (
    <Suspense fallback={<DashboardLayout><TableSkeleton rows={5} /></DashboardLayout>}>
      <ConversationsContent />
    </Suspense>
  );
}

