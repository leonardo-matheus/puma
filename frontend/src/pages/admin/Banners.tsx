import { useState, useEffect, useRef } from 'react'
import { Plus, Trash2, GripVertical, Image, Eye, EyeOff } from 'lucide-react'
import { Button, Input, Card, CardContent, Badge } from '@/components/ui'
import { bannerService } from '@/services/bannerService'
import type { Banner } from '@/types'

export function AdminBanners() {
  const [banners, setBanners] = useState<Banner[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    loadBanners()
  }, [])

  const loadBanners = async () => {
    setIsLoading(true)
    try {
      const data = await bannerService.getAll()
      setBanners(data)
    } catch (error) {
      console.error('Erro ao carregar banners:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    try {
      const formData = new FormData()
      formData.append('image', file)

      const newBanner = await bannerService.create(formData)
      setBanners([...banners, newBanner])
    } catch (error) {
      console.error('Erro ao fazer upload:', error)
      alert('Erro ao fazer upload do banner')
    } finally {
      setIsUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleToggleActive = async (banner: Banner) => {
    try {
      await bannerService.update(banner.id, { active: !banner.active })
      setBanners(banners.map(b =>
        b.id === banner.id ? { ...b, active: !b.active } : b
      ))
    } catch (error) {
      console.error('Erro ao atualizar banner:', error)
    }
  }

  const handleUpdateField = async (banner: Banner, field: keyof Banner, value: string) => {
    try {
      await bannerService.update(banner.id, { [field]: value })
      setBanners(banners.map(b =>
        b.id === banner.id ? { ...b, [field]: value } : b
      ))
    } catch (error) {
      console.error('Erro ao atualizar banner:', error)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este banner?')) return

    try {
      await bannerService.delete(id)
      setBanners(banners.filter(b => b.id !== id))
    } catch (error) {
      console.error('Erro ao excluir banner:', error)
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-display font-bold text-white">Banners</h1>
          <p className="text-dark-400 mt-1">{banners.length} banner(s) cadastrado(s)</p>
        </div>
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleUpload}
          />
          <Button
            onClick={() => fileInputRef.current?.click()}
            isLoading={isUploading}
          >
            <Plus className="w-5 h-5 mr-2" />
            Novo Banner
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2].map(i => (
            <div key={i} className="h-40 bg-dark-800 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : banners.length > 0 ? (
        <div className="space-y-4">
          {banners.map((banner) => (
            <Card key={banner.id}>
              <CardContent className="p-4">
                <div className="flex gap-4">
                  {/* Drag Handle */}
                  <div className="flex items-center text-dark-500 cursor-move">
                    <GripVertical className="w-5 h-5" />
                  </div>

                  {/* Image Preview */}
                  <div className="w-48 h-28 rounded-lg overflow-hidden flex-shrink-0 bg-dark-700">
                    <img
                      src={banner.imageUrl}
                      alt={banner.title || 'Banner'}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Fields */}
                  <div className="flex-1 space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <Input
                        placeholder="Titulo (opcional)"
                        value={banner.title || ''}
                        onChange={(e) => handleUpdateField(banner, 'title', e.target.value)}
                      />
                      <Input
                        placeholder="Subtitulo (opcional)"
                        value={banner.subtitle || ''}
                        onChange={(e) => handleUpdateField(banner, 'subtitle', e.target.value)}
                      />
                    </div>
                    <Input
                      placeholder="Link (opcional)"
                      value={banner.link || ''}
                      onChange={(e) => handleUpdateField(banner, 'link', e.target.value)}
                    />
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => handleToggleActive(banner)}
                      className={`p-2 rounded-lg transition-colors ${
                        banner.active
                          ? 'bg-green-500/20 text-green-500'
                          : 'bg-dark-700 text-dark-400'
                      }`}
                      title={banner.active ? 'Desativar' : 'Ativar'}
                    >
                      {banner.active ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                    </button>
                    <button
                      onClick={() => handleDelete(banner.id)}
                      className="p-2 bg-dark-700 text-dark-400 rounded-lg hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <div className="mt-3 flex items-center gap-2">
                  <Badge variant={banner.active ? 'success' : 'default'}>
                    {banner.active ? 'Ativo' : 'Inativo'}
                  </Badge>
                  <span className="text-xs text-dark-500">Ordem: {banner.order}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-12 text-center">
            <Image className="w-12 h-12 text-dark-600 mx-auto mb-4" />
            <p className="text-dark-400 mb-4">Nenhum banner cadastrado</p>
            <Button onClick={() => fileInputRef.current?.click()}>
              <Plus className="w-5 h-5 mr-2" />
              Adicionar primeiro banner
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
