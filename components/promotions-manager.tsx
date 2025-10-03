"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { PromotionsTable } from "@/components/promotions-table"
import { PromotionDialog } from "@/components/promotion-dialog"
import { Plus, Search, Plane } from "lucide-react"
import type { Promotion } from "@/types/promotion"

export function PromotionsManager() {
  const [promotions, setPromotions] = useState<Promotion[]>([
    {
      id: "1",
      name: "Verano Caribeño 2025",
      description: "Descuento especial para destinos del Caribe durante temporada de verano",
      discount: 25,
      startDate: "2025-06-01",
      endDate: "2025-08-31",
      destinations: ["Aruba", "Curazao", "Margarita"],
      isActive: true,
      createdAt: "2025-01-15",
    },
    {
      id: "2",
      name: "Escapada Europea",
      description: "Promoción exclusiva para paquetes a Europa",
      discount: 15,
      startDate: "2025-03-01",
      endDate: "2025-05-31",
      destinations: ["Madrid", "París", "Roma", "Barcelona"],
      isActive: true,
      createdAt: "2025-01-10",
    },
    {
      id: "3",
      name: "Black Friday Viajes",
      description: "Mega descuento por Black Friday en todos los destinos",
      discount: 40,
      startDate: "2024-11-29",
      endDate: "2024-12-02",
      destinations: ["Todos"],
      isActive: false,
      createdAt: "2024-11-01",
    },
  ])

  const [searchQuery, setSearchQuery] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingPromotion, setEditingPromotion] = useState<Promotion | null>(null)

  const filteredPromotions = promotions.filter(
    (promo) =>
      promo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      promo.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      promo.destinations.some((dest) => dest.toLowerCase().includes(searchQuery.toLowerCase())),
  )

  const handleCreatePromotion = (promotion: Omit<Promotion, "id" | "createdAt">) => {
    const newPromotion: Promotion = {
      ...promotion,
      id: Date.now().toString(),
      createdAt: new Date().toISOString().split("T")[0],
    }
    setPromotions([newPromotion, ...promotions])
    setIsDialogOpen(false)
  }

  const handleUpdatePromotion = (promotion: Omit<Promotion, "id" | "createdAt">) => {
    if (!editingPromotion) return

    setPromotions(
      promotions.map((p) => (p.id === editingPromotion.id ? { ...promotion, id: p.id, createdAt: p.createdAt } : p)),
    )
    setEditingPromotion(null)
    setIsDialogOpen(false)
  }

  const handleEditPromotion = (promotion: Promotion) => {
    setEditingPromotion(promotion)
    setIsDialogOpen(true)
  }

  const handleDeletePromotion = (id: string) => {
    setPromotions(promotions.filter((p) => p.id !== id))
  }

  const handleDialogClose = () => {
    setIsDialogOpen(false)
    setEditingPromotion(null)
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <Plane className="h-5 w-5 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold text-balance">ViajesUCAB</h1>
        </div>
        <p className="text-muted-foreground text-lg">Sistema de Gestión de Promociones Exclusivas</p>
      </div>

      {/* Actions Bar */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar promociones por nombre, descripción o destino..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button onClick={() => setIsDialogOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Nueva Promoción
        </Button>
      </div>

      {/* Promotions Table */}
      <PromotionsTable promotions={filteredPromotions} onEdit={handleEditPromotion} onDelete={handleDeletePromotion} />

      {/* Create/Edit Dialog */}
      <PromotionDialog
        open={isDialogOpen}
        onOpenChange={handleDialogClose}
        promotion={editingPromotion}
        onSubmit={editingPromotion ? handleUpdatePromotion : handleCreatePromotion}
      />
    </div>
  )
}
