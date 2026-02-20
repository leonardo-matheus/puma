'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Mail, Phone, Eye, Trash2, MessageSquare, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Card, CardContent } from '@/components/ui/Card'
import type { Contact } from '@/types'

export default function AdminContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null)

  useEffect(() => {
    fetchContacts()
  }, [])

  const fetchContacts = async () => {
    try {
      const res = await fetch('/api/contacts')
      const data = await res.json()
      setContacts(data.contacts || [])
    } catch (error) {
      console.error('Error fetching contacts:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
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
      <div>
        <h1 className="text-2xl font-display font-bold text-white">Contatos</h1>
        <p className="text-dark-400">{contacts.length} mensagens recebidas</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* List */}
        <div className="space-y-4">
          {contacts.length > 0 ? (
            contacts.map((contact, index) => (
              <motion.div
                key={contact.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card
                  hover
                  className={`cursor-pointer ${selectedContact?.id === contact.id ? 'border-primary-500' : ''}`}
                >
                  <CardContent onClick={() => setSelectedContact(contact)}>
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary-500/20 rounded-full flex items-center justify-center">
                          <span className="text-primary-400 font-medium">{contact.name[0]}</span>
                        </div>
                        <div>
                          <h3 className="text-white font-medium">{contact.name}</h3>
                          <p className="text-dark-400 text-sm">{contact.email}</p>
                        </div>
                      </div>
                      {!contact.read && <Badge variant="primary">Novo</Badge>}
                    </div>
                    <p className="text-dark-300 text-sm line-clamp-2 mb-2">{contact.message}</p>
                    <p className="text-dark-500 text-xs">{formatDate(contact.createdAt)}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <MessageSquare className="w-16 h-16 text-dark-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">Nenhum contato</h3>
                <p className="text-dark-400">As mensagens de contato aparecerão aqui.</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Detail */}
        <div className="lg:sticky lg:top-24">
          {selectedContact ? (
            <Card>
              <CardContent>
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-primary-500/20 rounded-full flex items-center justify-center">
                      <span className="text-primary-400 font-bold text-xl">{selectedContact.name[0]}</span>
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-white">{selectedContact.name}</h2>
                      <p className="text-dark-400 text-sm">{formatDate(selectedContact.createdAt)}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4 mb-6">
                  <a
                    href={`mailto:${selectedContact.email}`}
                    className="flex items-center gap-3 text-dark-300 hover:text-primary-400 transition-colors"
                  >
                    <Mail className="w-5 h-5" />
                    {selectedContact.email}
                  </a>
                  <a
                    href={`tel:${selectedContact.phone}`}
                    className="flex items-center gap-3 text-dark-300 hover:text-primary-400 transition-colors"
                  >
                    <Phone className="w-5 h-5" />
                    {selectedContact.phone}
                  </a>
                </div>

                <div className="bg-dark-700 rounded-xl p-4 mb-6">
                  <h3 className="text-white font-medium mb-2">Mensagem</h3>
                  <p className="text-dark-300 whitespace-pre-line">{selectedContact.message}</p>
                </div>

                <div className="flex gap-3">
                  <a
                    href={`https://wa.me/55${selectedContact.phone.replace(/\D/g, '')}`}
                    target="_blank"
                    className="flex-1"
                  >
                    <Button className="w-full bg-green-600 hover:bg-green-500">
                      <Phone className="w-4 h-4 mr-2" />
                      WhatsApp
                    </Button>
                  </a>
                  <a href={`mailto:${selectedContact.email}`} className="flex-1">
                    <Button variant="outline" className="w-full">
                      <Mail className="w-4 h-4 mr-2" />
                      Email
                    </Button>
                  </a>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="text-center py-16">
                <Eye className="w-12 h-12 text-dark-600 mx-auto mb-4" />
                <p className="text-dark-400">Selecione um contato para ver os detalhes</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
