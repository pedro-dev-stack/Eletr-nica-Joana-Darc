'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Cliente {
  id: number;
  nome: string;
  email: string;
  telefone: string;
  endereco: string;
}

export default function Dashboard() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [modalAberto, setModalAberto] = useState(false);
  const [clienteEditando, setClienteEditando] = useState<Cliente | null>(null);
  const [formData, setFormData] = useState({ nome: '', email: '', telefone: '', endereco: '' });
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const auth = localStorage.getItem('adminAuth');
      if (!auth) {
        router.push('/admin');
      }
      
      const clientesSalvos = localStorage.getItem('clientes');
      if (clientesSalvos) {
        setClientes(JSON.parse(clientesSalvos));
      }
    }
  }, [router]);

  const salvarClientes = (novosClientes: Cliente[]) => {
    setClientes(novosClientes);
    localStorage.setItem('clientes', JSON.stringify(novosClientes));
  };

  const abrirModal = (cliente?: Cliente) => {
    if (cliente) {
      setClienteEditando(cliente);
      setFormData({ nome: cliente.nome, email: cliente.email, telefone: cliente.telefone, endereco: cliente.endereco });
    } else {
      setClienteEditando(null);
      setFormData({ nome: '', email: '', telefone: '', endereco: '' });
    }
    setModalAberto(true);
  };

  const fecharModal = () => {
    setModalAberto(false);
    setClienteEditando(null);
    setFormData({ nome: '', email: '', telefone: '', endereco: '' });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (clienteEditando) {
      const atualizados = clientes.map(c => 
        c.id === clienteEditando.id ? { ...clienteEditando, ...formData } : c
      );
      salvarClientes(atualizados);
    } else {
      const novoCliente: Cliente = {
        id: Date.now(),
        ...formData
      };
      salvarClientes([...clientes, novoCliente]);
    }
    
    fecharModal();
  };

  const deletarCliente = (id: number) => {
    if (confirm('Deseja realmente deletar este cliente?')) {
      salvarClientes(clientes.filter(c => c.id !== id));
    }
  };

  const logout = () => {
    localStorage.removeItem('adminAuth');
    router.push('/admin');
  };

  return (
    <div className="min-h-screen bg-background">
      <nav className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-primary">Painel Joana D'Arc</h1>
          <button
            onClick={logout}
            className="bg-destructive hover:bg-destructive/80 text-destructive-foreground px-4 py-2 rounded-lg transition"
          >
            Sair
          </button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-card rounded-xl border border-border p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-foreground">Gerenciar Clientes</h2>
            <button
              onClick={() => abrirModal()}
              className="bg-primary hover:bg-primary/80 text-primary-foreground px-6 py-2 rounded-lg transition flex items-center gap-2"
            >
              <span className="text-xl">+</span> Novo Cliente
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-secondary border-b-2 border-border">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Nome</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Telefone</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Endereço</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {clientes.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">
                      Nenhum cliente cadastrado
                    </td>
                  </tr>
                ) : (
                  clientes.map((cliente) => (
                    <tr key={cliente.id} className="hover:bg-secondary/50">
                      <td className="px-6 py-4 text-sm text-foreground">{cliente.nome}</td>
                      <td className="px-6 py-4 text-sm text-foreground">{cliente.email}</td>
                      <td className="px-6 py-4 text-sm text-foreground">{cliente.telefone}</td>
                      <td className="px-6 py-4 text-sm text-foreground">{cliente.endereco}</td>
                      <td className="px-6 py-4 text-sm space-x-2">
                        <button
                          onClick={() => abrirModal(cliente)}
                          className="bg-accent hover:bg-accent/80 text-accent-foreground px-3 py-1 rounded transition"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => deletarCliente(cliente.id)}
                          className="bg-destructive hover:bg-destructive/80 text-destructive-foreground px-3 py-1 rounded transition"
                        >
                          Deletar
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {modalAberto && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-card rounded-xl border border-border w-full max-w-md p-6">
            <h3 className="text-xl font-bold text-foreground mb-4">
              {clienteEditando ? 'Editar Cliente' : 'Novo Cliente'}
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Nome</label>
                <input
                  type="text"
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  className="w-full px-4 py-2 bg-input border border-border rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent outline-none text-foreground"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2 bg-input border border-border rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent outline-none text-foreground"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Telefone</label>
                <input
                  type="tel"
                  value={formData.telefone}
                  onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                  className="w-full px-4 py-2 bg-input border border-border rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent outline-none text-foreground"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Endereço</label>
                <input
                  type="text"
                  value={formData.endereco}
                  onChange={(e) => setFormData({ ...formData, endereco: e.target.value })}
                  className="w-full px-4 py-2 bg-input border border-border rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent outline-none text-foreground"
                  required
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={fecharModal}
                  className="flex-1 bg-secondary hover:bg-secondary/80 text-secondary-foreground py-2 rounded-lg transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-primary hover:bg-primary/80 text-primary-foreground py-2 rounded-lg transition"
                >
                  {clienteEditando ? 'Atualizar' : 'Cadastrar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
