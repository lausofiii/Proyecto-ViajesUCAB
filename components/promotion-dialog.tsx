"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import type { Promotion } from "@/types/promotion"

interface PromotionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  promotion?: Promotion | null
  onSubmit: (promotion: Omit<Promotion, "id" | "createdAt">) => void
}

export function PromotionDialog({ open, onOpenChange, promotion, onSubmit }: PromotionDialogProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    discount: 0,
    startDate: "",
    endDate: "",
    destinations: "",
    isActive: true,
  })

  useEffect(() => {
    if (promotion) {
      setFormData({
        name: promotion.name,
        description: promotion.description,
        discount: promotion.discount,
        startDate: promotion.startDate,
        endDate: promotion.endDate,
        destinations: promotion.destinations.join(", "),
        isActive: promotion.isActive,
      })
    } else {
      setFormData({
        name: "",
        description: "",
        discount: 0,
        startDate: "",
        endDate: "",
        destinations: "",
        isActive: true,
      })
    }
  }, [promotion, open])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const destinations = formData.destinations
      .split(",")
      .map((d) => d.trim())
      .filter((d) => d.length > 0)

    onSubmit({
      name: formData.name,
      description: formData.description,
      discount: formData.discount,
      startDate: formData.startDate,
      endDate: formData.endDate,
      destinations,
      isActive: formData.isActive,
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{promotion ? "Editar Promoción" : "Nueva Promoción"}</DialogTitle>
          <DialogDescription>
            {promotion
              ? "Modifica los detalles de la promoción existente."
              : "Completa los datos para crear una nueva promoción exclusiva."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre de la Promoción *</Label>
              <Input
                id="name"
                placeholder="Ej: Verano Caribeño 2025"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descripción *</Label>
              <Textarea
                id="description"
                placeholder="Describe los detalles de la promoción..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="discount">Descuento (%) *</Label>
                <Input
                  id="discount"
                  type="number"
                  min="0"
                  max="100"
                  placeholder="25"
                  value={formData.discount || ""}
                  onChange={(e) => setFormData({ ...formData, discount: Number(e.target.value) })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="destinations">Destinos *</Label>
                <Input
                  id="destinations"
                  placeholder="Aruba, Curazao, Margarita"
                  value={formData.destinations}
                  onChange={(e) => setFormData({ ...formData, destinations: e.target.value })}
                  required
                />
                <p className="text-xs text-muted-foreground">Separa múltiples destinos con comas</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Fecha de Inicio *</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="endDate">Fecha de Fin *</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="space-y-0.5">
                <Label htmlFor="isActive" className="text-base">
                  Estado de la Promoción
                </Label>
                <p className="text-sm text-muted-foreground">
                  {formData.isActive
                    ? "La promoción está activa y visible para los clientes"
                    : "La promoción está inactiva y no será visible"}
                </p>
              </div>
              <Switch
                id="isActive"
                checked={formData.isActive}
                onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit">{promotion ? "Guardar Cambios" : "Crear Promoción"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
