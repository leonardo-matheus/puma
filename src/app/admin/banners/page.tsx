'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Plus, Edit, Trash2, Image as ImageIcon, GripVertical, Eye, EyeOff } from 'lucide-react'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader } from '@/components/ui/Card'

interface Banner {
  id: string
  title?: string | null
  subtitle?: string | null
  imageUrl: string
  link?: string | null
  active: boolean
  order: number
}

export default function AdminBannersPage() {
  const [banners, setBanners] = useState<Banner[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    imageUrl: '',
    link: '',
    active: true,
  })

  useEffect(() => {
    fetchBanners()
  }, [])

  const fetchBanners = async () => {
    try {
      const res = await fetch('/api/banners')
      const data = await res.json()
      setBanners(data.banners || [])
    } catch (error) {
      console.error('Error fetching banners:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const url = editingId ? `/api/banners/${editingId}` : '/api/banners'
      const method = editingId ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          order: editingId ? undefined : banners.length,
        }),
      })

      if (res.ok) {
        fetchBanners()
        resetForm()
      }
    } catch (error) {
      console.error('Error saving banner:', error)
    }
  }

  const handleEdit = (banner: Banner) => {
    setFormData({
      title: banner.title || '',
      subtitle: banner.subtitle || '',
      imageUrl: banner.imageUrl,
      link: banner.link || '',
      active: banner.active,
    })
    setEditingId(banner.id)
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este banner?')) return

    try {
      const res = await fetch(`/api/banners/${id}`, { method: 'DELETE' })
      if (res.ok) {
        setBanners((prev) => prev.filter((b) => b.id !== id))
      }
    } catch (error) {
      console.error('Error deleting banner:', error)
    }
  }

  const toggleActive = async (banner: Banner) => {
    try {
      const res = await fetch(`/api/banners/${banner.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...banner, active: !banner.active }),
      })

      if (res.ok) {
        setBanners((prev) =>
          prev.map((b) => (b.id === banner.id ? { ...b, active: !b.active } : b))
        )
      }
    } catch (error) {
      console.error('Error toggling banner:', error)
    }
  }

  const resetForm = () => {
    setFormData({ title: '', subtitle: '', imageUrl: '', link: '', active: true })
    setEditingId(null)
    setShowForm(false)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-white">Banners</h1>
          <p className="text-dark-400">Gerencie os banners do carrossel da home</p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="w-5 h-5 mr-2" />
          Novo Banner
        </Button>
      </div>

      {/* Form */}
      {showForm && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold text-white">
                {editingId ? 'Editar Banner' : 'Novo Banner'}
              </h2>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Título (opcional)"
                    placeholder="Título do banner"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  />
                  <Input
                    label="Subtítulo (opcional)"
                    placeholder="Subtítulo do banner"
                    value={formData.subtitle}
                    onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                  />
                </div>
                <Input
                  label="URL da Imagem *"
                  placeholder="https://exemplo.com/imagem.jpg"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  required
                />
                <Input
                  label="Link (opcional)"
                  placeholder="https://exemplo.com ou /pagina"
                  value={formData.link}
                  onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                />

                {formData.imageUrl && (
                  <div className="relative aspect-[21/9] rounded-lg overflow-hidden bg-dark-800">
                    <img
                      src={formData.imageUrl}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-5 h-5 rounded bg-dark-700 border-dark-600 text-primary-500 focus:ring-primary-500"
                    checked={formData.active}
                    onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                  />
                  <span className="text-white">Banner ativo</span>
                </label>

                <div className="flex gap-3 pt-4">
                  <Button type="button" variant="ghost" onClick={resetForm}>
                    Cancelar
                  </Button>
                  <Button type="submit">
                    {editingId ? 'Salvar Alterações' : 'Criar Banner'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Banners List */}
      {banners.length > 0 ? (
        <div className="space-y-4">
          {banners.map((banner, index) => (
            <motion.div
              key={banner.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className={!banner.active ? 'opacity-60' : ''}>
                <CardContent className="p-4">
                  <div className="flex flex-col sm:flex-row gap-4">
                    {/* Image Preview */}
                    <div className="w-full sm:w-48 aspect-video rounded-lg overflow-hidden bg-dark-800 flex-shrink-0">
                      <img
                        src={banner.imageUrl}
                        alt={banner.title || 'Banner'}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="text-white font-medium">
                            {banner.title || 'Sem título'}
                          </h3>
                          {banner.subtitle && (
                            <p className="text-dark-400 text-sm">{banner.subtitle}</p>
                          )}
                          {banner.link && (
                            <p className="text-primary-500 text-sm mt-1 truncate">
                              Link: {banner.link}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => toggleActive(banner)}
                            className={`p-2 rounded-lg transition-colors ${
                              banner.active
                                ? 'text-green-400 hover:bg-green-500/10'
                                : 'text-dark-500 hover:bg-dark-700'
                            }`}
                            title={banner.active ? 'Desativar' : 'Ativar'}
                          >
                            {banner.active ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                          </button>
                          <button
                            onClick={() => handleEdit(banner)}
                            className="p-2 text-dark-400 hover:text-white hover:bg-dark-700 rounded-lg transition-colors"
                          >
                            <Edit className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleDelete(banner.id)}
                            className="p-2 text-dark-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="text-center py-12">
            <ImageIcon className="w-16 h-16 text-dark-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Nenhum banner cadastrado</h3>
            <p className="text-dark-400 mb-6">Adicione banners para exibir no carrossel da home.</p>
            <Button onClick={() => setShowForm(true)}>
              <Plus className="w-5 h-5 mr-2" />
              Criar primeiro banner
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
