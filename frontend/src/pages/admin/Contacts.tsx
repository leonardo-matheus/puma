import { useState, useEffect } from 'react'
import { Mail, MailOpen, Trash2, Phone, Clock } from 'lucide-react'
import { Button, Badge, Card, CardContent } from '@/components/ui'
import { contactService } from '@/services/contactService'
import { formatDate } from '@/lib/utils'
import type { Contact } from '@/types'

export function AdminContacts() {
  const [contacts, setContacts] = useState<Contact[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null)

  useEffect(() => {
    loadContacts()
  }, [])

  const loadContacts = async () => {
    setIsLoading(true)
    try {
      const data = await contactService.getAll()
      setContacts(data)
    } catch (error) {
      console.error('Erro ao carregar contatos:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleMarkAsRead = async (contact: Contact) => {
    try {
      await contactService.markAsRead(contact.id)
      setContacts(contacts.map(c =>
        c.id === contact.id ? { ...c, read: true } : c
      ))
      if (selectedContact?.id === contact.id) {
        setSelectedContact({ ...contact, read: true })
      }
    } catch (error) {
      console.error('Erro ao marcar como lido:', error)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta mensagem?')) return

    try {
      await contactService.delete(id)
      setContacts(contacts.filter(c => c.id !== id))
      if (selectedContact?.id === id) {
        setSelectedContact(null)
      }
    } catch (error) {
      console.error('Erro ao excluir contato:', error)
    }
  }

  const unreadCount = contacts.filter(c => !c.read).length

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-display font-bold text-white">Contatos</h1>
        <p className="text-dark-400 mt-1">
          {unreadCount > 0
            ? `${unreadCount} mensagem(s) nao lida(s)`
            : 'Todas as mensagens foram lidas'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Contact List */}
        <div className="lg:col-span-1 space-y-3">
          {isLoading ? (
            [...Array(3)].map((_, i) => (
              <div key={i} className="h-24 bg-dark-800 rounded-xl animate-pulse" />
            ))
          ) : contacts.length > 0 ? (
            contacts.map((contact) => (
              <Card
                key={contact.id}
                hover
                className={`cursor-pointer ${selectedContact?.id === contact.id ? 'border-primary-500' : ''}`}
                onClick={() => {
                  setSelectedContact(contact)
                  if (!contact.read) handleMarkAsRead(contact)
                }}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                      contact.read ? 'bg-dark-700' : 'bg-primary-500/20'
                    }`}>
                      {contact.read ? (
                        <MailOpen className="w-5 h-5 text-dark-400" />
                      ) : (
                        <Mail className="w-5 h-5 text-primary-500" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className={`font-semibold truncate ${contact.read ? 'text-dark-300' : 'text-white'}`}>
                          {contact.name}
                        </h3>
                        {!contact.read && <Badge variant="primary">Novo</Badge>}
                      </div>
                      <p className="text-sm text-dark-400 truncate">{contact.email}</p>
                      <p className="text-xs text-dark-500 mt-1 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatDate(contact.createdAt)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-dark-400">Nenhuma mensagem recebida</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Contact Detail */}
        <div className="lg:col-span-2">
          {selectedContact ? (
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-semibold text-white">{selectedContact.name}</h2>
                    <p className="text-dark-400">{selectedContact.email}</p>
                  </div>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDelete(selectedContact.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>

                <div className="flex items-center gap-4 mb-6 pb-6 border-b border-dark-700">
                  <a href={`tel:${selectedContact.phone}`} className="flex items-center gap-2 text-dark-300 hover:text-primary-500 transition-colors">
                    <Phone className="w-4 h-4" />
                    {selectedContact.phone}
                  </a>
                  <span className="text-dark-600">|</span>
                  <span className="text-dark-400 text-sm">
                    Recebido em {formatDate(selectedContact.createdAt)}
                  </span>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-dark-400 mb-2">Mensagem:</h3>
                  <p className="text-white whitespace-pre-wrap">{selectedContact.message}</p>
                </div>

                {selectedContact.vehicleId && (
                  <div className="mt-6 pt-6 border-t border-dark-700">
                    <p className="text-sm text-dark-400">
                      Interesse no veiculo: <span className="text-primary-500">{selectedContact.vehicleId}</span>
                    </p>
                  </div>
                )}

                <div className="mt-6 flex gap-3">
                  <a href={`mailto:${selectedContact.email}`}>
                    <Button variant="outline">
                      <Mail className="w-4 h-4 mr-2" />
                      Responder por E-mail
                    </Button>
                  </a>
                  <a href={`https://wa.me/55${selectedContact.phone.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer">
                    <Button className="bg-green-600 hover:bg-green-700">
                      WhatsApp
                    </Button>
                  </a>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <Mail className="w-12 h-12 text-dark-600 mx-auto mb-4" />
                <p className="text-dark-400">Selecione uma mensagem para visualizar</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
