'use client';

import { useState, useEffect } from 'react';
import { supabase, Article, Category, Source } from '@/lib/supabase';
import { Header } from '@/components/Header';
import { VerificationBadge } from '@/components/VerificationBadge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Check, X, CreditCard as Edit, Plus, Trash2, TriangleAlert as AlertTriangle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export default function AdminPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [sources, setSources] = useState<Source[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState('pending');
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);

  const [newArticle, setNewArticle] = useState({
    title: '',
    ai_summary: '',
    source_url: '',
    source_id: '',
    category_id: '',
    verification_status: 'unverified' as 'confirmed' | 'developing' | 'unverified',
    is_breaking: false,
    published_at: new Date().toISOString(),
  });

  const fetchData = async () => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const [articlesRes, categoriesRes, sourcesRes] = await Promise.all([
        supabase
          .from('articles')
          .select(
            `
            *,
            source:sources(*),
            category:categories(*)
          `
          )
          .order('created_at', { ascending: false }),
        supabase.from('categories').select('*').order('name'),
        supabase.from('sources').select('*').order('name'),
      ]);

      if (articlesRes.error) throw articlesRes.error;
      if (categoriesRes.error) throw categoriesRes.error;
      if (sourcesRes.error) throw sourcesRes.error;

      setArticles(articlesRes.data || []);
      setCategories(categoriesRes.data || []);
      setSources(sourcesRes.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (supabase) {
      fetchData();
    } else {
      setLoading(false);
    }
  }, []);

  const approveArticle = async (id: string) => {
    if (!supabase) return;

    try {
      const { error } = await supabase
        .from('articles')
        .update({ approved: true })
        .eq('id', id);

      if (error) throw error;
      fetchData();
    } catch (error) {
      console.error('Error approving article:', error);
    }
  };

  const deleteArticle = async (id: string) => {
    if (!supabase) return;
    if (!confirm('Are you sure you want to delete this article?')) return;

    try {
      const { error} = await supabase.from('articles').delete().eq('id', id);

      if (error) throw error;
      fetchData();
    } catch (error) {
      console.error('Error deleting article:', error);
    }
  };

  const updateArticle = async (article: Article) => {
    if (!supabase) return;

    try {
      const { error } = await supabase
        .from('articles')
        .update({
          title: article.title,
          ai_summary: article.ai_summary,
          verification_status: article.verification_status,
          is_breaking: article.is_breaking,
          category_id: article.category_id,
        })
        .eq('id', article.id);

      if (error) throw error;
      setEditingArticle(null);
      fetchData();
    } catch (error) {
      console.error('Error updating article:', error);
    }
  };

  const addArticle = async () => {
    if (!supabase) return;

    try {
      const { error } = await supabase.from('articles').insert([
        {
          ...newArticle,
          approved: true,
        },
      ]);

      if (error) throw error;

      setNewArticle({
        title: '',
        ai_summary: '',
        source_url: '',
        source_id: '',
        category_id: '',
        verification_status: 'unverified',
        is_breaking: false,
        published_at: new Date().toISOString(),
      });
      setShowAddDialog(false);
      fetchData();
    } catch (error) {
      console.error('Error adding article:', error);
    }
  };

  const pendingArticles = articles.filter((a) => !a.approved);
  const approvedArticles = articles.filter((a) => a.approved);

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-950 via-black to-neutral-950">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
            <p className="text-neutral-400 mt-1">
              Manage articles and moderate content
            </p>
          </div>

          <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                Add Article
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-neutral-900 border-neutral-800 max-w-2xl">
              <DialogHeader>
                <DialogTitle className="text-white">Add New Article</DialogTitle>
                <DialogDescription className="text-neutral-400">
                  Manually add a new article to the timeline
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                <div>
                  <Label className="text-neutral-300">Title</Label>
                  <Input
                    value={newArticle.title}
                    onChange={(e) =>
                      setNewArticle({ ...newArticle, title: e.target.value })
                    }
                    className="bg-neutral-800 border-neutral-700 text-white"
                    placeholder="Article headline"
                  />
                </div>

                <div>
                  <Label className="text-neutral-300">Summary</Label>
                  <Textarea
                    value={newArticle.ai_summary}
                    onChange={(e) =>
                      setNewArticle({ ...newArticle, ai_summary: e.target.value })
                    }
                    className="bg-neutral-800 border-neutral-700 text-white"
                    placeholder="2-3 sentence summary"
                    rows={3}
                  />
                </div>

                <div>
                  <Label className="text-neutral-300">Source URL</Label>
                  <Input
                    value={newArticle.source_url}
                    onChange={(e) =>
                      setNewArticle({ ...newArticle, source_url: e.target.value })
                    }
                    className="bg-neutral-800 border-neutral-700 text-white"
                    placeholder="https://..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-neutral-300">Source</Label>
                    <Select
                      value={newArticle.source_id}
                      onValueChange={(value) =>
                        setNewArticle({ ...newArticle, source_id: value })
                      }
                    >
                      <SelectTrigger className="bg-neutral-800 border-neutral-700 text-white">
                        <SelectValue placeholder="Select source" />
                      </SelectTrigger>
                      <SelectContent className="bg-neutral-800 border-neutral-700">
                        {sources.map((source) => (
                          <SelectItem key={source.id} value={source.id}>
                            {source.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-neutral-300">Category</Label>
                    <Select
                      value={newArticle.category_id}
                      onValueChange={(value) =>
                        setNewArticle({ ...newArticle, category_id: value })
                      }
                    >
                      <SelectTrigger className="bg-neutral-800 border-neutral-700 text-white">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent className="bg-neutral-800 border-neutral-700">
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-neutral-300">Verification Status</Label>
                    <Select
                      value={newArticle.verification_status}
                      onValueChange={(value: any) =>
                        setNewArticle({ ...newArticle, verification_status: value })
                      }
                    >
                      <SelectTrigger className="bg-neutral-800 border-neutral-700 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-neutral-800 border-neutral-700">
                        <SelectItem value="confirmed">Confirmed</SelectItem>
                        <SelectItem value="developing">Developing</SelectItem>
                        <SelectItem value="unverified">Unverified</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center gap-2 pt-6">
                    <input
                      type="checkbox"
                      id="breaking"
                      checked={newArticle.is_breaking}
                      onChange={(e) =>
                        setNewArticle({
                          ...newArticle,
                          is_breaking: e.target.checked,
                        })
                      }
                      className="w-4 h-4 rounded border-neutral-700 bg-neutral-800"
                    />
                    <Label htmlFor="breaking" className="text-neutral-300">
                      Breaking News
                    </Label>
                  </div>
                </div>

                <Button
                  onClick={addArticle}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  Add Article
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="bg-neutral-900 border border-neutral-800">
            <TabsTrigger value="pending" className="data-[state=active]:bg-neutral-800">
              Pending ({pendingArticles.length})
            </TabsTrigger>
            <TabsTrigger value="approved" className="data-[state=active]:bg-neutral-800">
              Approved ({approvedArticles.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="mt-6">
            {pendingArticles.length === 0 ? (
              <div className="text-center py-12 bg-neutral-900/50 border border-neutral-800 rounded-lg">
                <p className="text-neutral-400">No pending articles</p>
              </div>
            ) : (
              <div className="space-y-4">
                {pendingArticles.map((article) => (
                  <div
                    key={article.id}
                    className="bg-neutral-900/50 border border-neutral-800 rounded-lg p-5"
                  >
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-white mb-2">
                          {article.title}
                        </h3>
                        {article.ai_summary && (
                          <p className="text-neutral-400 text-sm">
                            {article.ai_summary}
                          </p>
                        )}
                      </div>
                      <VerificationBadge status={article.verification_status} />
                    </div>

                    <div className="flex items-center gap-4 text-xs text-neutral-500 mb-4">
                      {article.source && (
                        <span className="text-neutral-400">{article.source.name}</span>
                      )}
                      {article.category && (
                        <span className="px-2 py-0.5 bg-neutral-800 rounded">
                          {article.category.name}
                        </span>
                      )}
                      <span>
                        {formatDistanceToNow(new Date(article.published_at), {
                          addSuffix: true,
                        })}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        onClick={() => approveArticle(article.id)}
                        className="bg-emerald-600 hover:bg-emerald-700"
                      >
                        <Check className="w-4 h-4 mr-1.5" />
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setEditingArticle(article)}
                        className="bg-neutral-800 border-neutral-700 hover:bg-neutral-700"
                      >
                        <Edit className="w-4 h-4 mr-1.5" />
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => deleteArticle(article.id)}
                      >
                        <Trash2 className="w-4 h-4 mr-1.5" />
                        Delete
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="approved" className="mt-6">
            <div className="space-y-4">
              {approvedArticles.map((article) => (
                <div
                  key={article.id}
                  className="bg-neutral-900/50 border border-neutral-800 rounded-lg p-5"
                >
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-semibold text-white">
                          {article.title}
                        </h3>
                        {article.is_breaking && (
                          <span className="text-xs px-2 py-0.5 bg-red-600/20 text-red-400 rounded border border-red-500/30">
                            BREAKING
                          </span>
                        )}
                      </div>
                      {article.ai_summary && (
                        <p className="text-neutral-400 text-sm">
                          {article.ai_summary}
                        </p>
                      )}
                    </div>
                    <VerificationBadge status={article.verification_status} />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-xs text-neutral-500">
                      {article.source && (
                        <span className="text-neutral-400">{article.source.name}</span>
                      )}
                      {article.category && (
                        <span className="px-2 py-0.5 bg-neutral-800 rounded">
                          {article.category.name}
                        </span>
                      )}
                      <span>
                        {formatDistanceToNow(new Date(article.published_at), {
                          addSuffix: true,
                        })}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setEditingArticle(article)}
                        className="bg-neutral-800 border-neutral-700 hover:bg-neutral-700"
                      >
                        <Edit className="w-4 h-4 mr-1.5" />
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => deleteArticle(article.id)}
                      >
                        <Trash2 className="w-4 h-4 mr-1.5" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </main>

      {editingArticle && (
        <Dialog open={!!editingArticle} onOpenChange={() => setEditingArticle(null)}>
          <DialogContent className="bg-neutral-900 border-neutral-800 max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-white">Edit Article</DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <div>
                <Label className="text-neutral-300">Title</Label>
                <Input
                  value={editingArticle.title}
                  onChange={(e) =>
                    setEditingArticle({ ...editingArticle, title: e.target.value })
                  }
                  className="bg-neutral-800 border-neutral-700 text-white"
                />
              </div>

              <div>
                <Label className="text-neutral-300">Summary</Label>
                <Textarea
                  value={editingArticle.ai_summary || ''}
                  onChange={(e) =>
                    setEditingArticle({
                      ...editingArticle,
                      ai_summary: e.target.value,
                    })
                  }
                  className="bg-neutral-800 border-neutral-700 text-white"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-neutral-300">Category</Label>
                  <Select
                    value={editingArticle.category_id || ''}
                    onValueChange={(value) =>
                      setEditingArticle({ ...editingArticle, category_id: value })
                    }
                  >
                    <SelectTrigger className="bg-neutral-800 border-neutral-700 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-neutral-800 border-neutral-700">
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-neutral-300">Verification Status</Label>
                  <Select
                    value={editingArticle.verification_status}
                    onValueChange={(value: any) =>
                      setEditingArticle({
                        ...editingArticle,
                        verification_status: value,
                      })
                    }
                  >
                    <SelectTrigger className="bg-neutral-800 border-neutral-700 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-neutral-800 border-neutral-700">
                      <SelectItem value="confirmed">Confirmed</SelectItem>
                      <SelectItem value="developing">Developing</SelectItem>
                      <SelectItem value="unverified">Unverified</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="edit-breaking"
                  checked={editingArticle.is_breaking}
                  onChange={(e) =>
                    setEditingArticle({
                      ...editingArticle,
                      is_breaking: e.target.checked,
                    })
                  }
                  className="w-4 h-4 rounded border-neutral-700 bg-neutral-800"
                />
                <Label htmlFor="edit-breaking" className="text-neutral-300">
                  Breaking News
                </Label>
              </div>

              <Button
                onClick={() => updateArticle(editingArticle)}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                Save Changes
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
