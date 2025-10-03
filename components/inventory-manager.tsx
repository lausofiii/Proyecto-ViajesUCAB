"use client"

import { useState } from "react"
import { Plus, Pencil, Trash2, AlertTriangle, Package } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import type { InventoryItem, ServiceType, InventoryStatus, InventoryHistory } from "@/types/inventory"

const initialInventory: InventoryItem[] = [
  {
    id: "1",
    serviceType: "vuelo",
    name: "Vuelo Caracas - Miami",
    code: "VU-001",
    totalCapacity: 180,
    availableCapacity: 25,
    reservedCapacity: 155,
    destination: "Miami, USA",
    departureDate: "2025-11-15",
    price: 450,
    currency: "USD",
    lastUpdated: new Date().toISOString(),
  },
  {
    id: "2",
    serviceType: "tour",
    name: "Tour Los Roques",
    code: "TR-001",
    totalCapacity: 30,
    availableCapacity: 8,
    reservedCapacity: 22,
    destination: "Los Roques, Venezuela",
    departureDate: "2025-11-20",
    price: 12000,
    currency: "VES",
    lastUpdated: new Date().toISOString(),
  },
  {
    id: "3",
    serviceType: "crucero",
    name: "Crucero Caribe",
    code: "CR-001",
    totalCapacity: 500,
    availableCapacity: 120,
    reservedCapacity: 380,
    destination: "Caribe",
    departureDate: "2025-12-01",
    arrivalDate: "2025-12-08",
    price: 1200,
    currency: "USD",
    lastUpdated: new Date().toISOString(),
  },
]

export function InventoryManager() {
  const [inventory, setInventory] = useState<InventoryItem[]>(initialInventory)
  const [history, setHistory] = useState<InventoryHistory[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null)
  const [filterType, setFilterType] = useState<ServiceType | "all">("all")
  const [formData, setFormData] = useState<Partial<InventoryItem>>({
    serviceType: "vuelo",
    currency: "USD",
  })

  const getStatus = (item: InventoryItem): InventoryStatus => {
    const percentage = (item.availableCapacity / item.totalCapacity) * 100
    if (percentage === 0) return "agotado"
    if (percentage <= 20) return "por-agotarse"
    return "disponible"
  }

  const getStatusBadge = (status: InventoryStatus) => {
    const variants = {
      disponible: "default",
      "por-agotarse": "warning",
      agotado: "destructive",
    } as const

    const labels = {
      disponible: "Disponible",
      "por-agotarse": "Por Agotarse",
      agotado: "Agotado",
    }

    return (
      <Badge variant={variants[status]} className="gap-1">
        {status === "por-agotarse" && <AlertTriangle className="h-3 w-3" />}
        {labels[status]}
      </Badge>
    )
  }

  const getServiceTypeLabel = (type: ServiceType) => {
    const labels = {
      vuelo: "Vuelo",
      tour: "Tour",
      crucero: "Crucero",
    }
    return labels[type]
  }

  const handleOpenDialog = (item?: InventoryItem) => {
    if (item) {
      setEditingItem(item)
      setFormData(item)
    } else {
      setEditingItem(null)
      setFormData({
        serviceType: "vuelo",
        currency: "USD",
      })
    }
    setIsDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setIsDialogOpen(false)
    setEditingItem(null)
    setFormData({
      serviceType: "vuelo",
      currency: "USD",
    })
  }

  const handleSave = () => {
    if (!formData.name || !formData.code || !formData.totalCapacity || !formData.price) {
      alert("Por favor complete todos los campos requeridos")
      return
    }

    const now = new Date().toISOString()

    if (editingItem) {
      // Update existing item
      const updatedInventory = inventory.map((item) =>
        item.id === editingItem.id
          ? {
              ...item,
              ...formData,
              lastUpdated: now,
            }
          : item,
      )
      setInventory(updatedInventory as InventoryItem[])

      // Add to history
      const historyEntry: InventoryHistory = {
        id: Date.now().toString(),
        itemId: editingItem.id,
        itemName: formData.name,
        action: "updated",
        previousCapacity: editingItem.availableCapacity,
        newCapacity: formData.availableCapacity || editingItem.availableCapacity,
        timestamp: now,
        user: "Admin",
      }
      setHistory([historyEntry, ...history])
    } else {
      // Create new item
      const newItem: InventoryItem = {
        id: Date.now().toString(),
        ...formData,
        availableCapacity: formData.totalCapacity || 0,
        reservedCapacity: 0,
        lastUpdated: now,
      } as InventoryItem

      setInventory([...inventory, newItem])

      // Add to history
      const historyEntry: InventoryHistory = {
        id: Date.now().toString(),
        itemId: newItem.id,
        itemName: newItem.name,
        action: "created",
        newCapacity: newItem.availableCapacity,
        timestamp: now,
        user: "Admin",
      }
      setHistory([historyEntry, ...history])
    }

    handleCloseDialog()
  }

  const handleDelete = (id: string) => {
    if (confirm("¿Está seguro de eliminar este item del inventario?")) {
      setInventory(inventory.filter((item) => item.id !== id))
    }
  }

  const filteredInventory =
    filterType === "all" ? inventory : inventory.filter((item) => item.serviceType === filterType)

  const lowStockItems = inventory.filter((item) => getStatus(item) === "por-agotarse")

  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <Package className="h-5 w-5 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold text-balance">Inventario</h1>
        </div>
        <p className="text-muted-foreground text-lg">Gestiona la disponibilidad de vuelos, tours y cruceros</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6 items-start sm:items-center justify-between">
        <div className="flex items-center gap-3">
          <Label className="text-sm font-medium">Filtrar:</Label>
          <Select value={filterType} onValueChange={(value) => setFilterType(value as ServiceType | "all")}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los servicios</SelectItem>
              <SelectItem value="vuelo">Vuelos</SelectItem>
              <SelectItem value="tour">Tours</SelectItem>
              <SelectItem value="crucero">Cruceros</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button onClick={() => handleOpenDialog()} className="gap-2">
          <Plus className="h-4 w-4" />
          Añadir Item
        </Button>
      </div>

      {lowStockItems.length > 0 && (
        <Alert className="mb-6 border-orange-500/50 bg-orange-500/10">
          <AlertTriangle className="h-4 w-4 text-orange-600" />
          <AlertTitle className="text-orange-600">Alertas de Inventario</AlertTitle>
          <AlertDescription>
            <div className="mt-2 space-y-1">
              {lowStockItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between text-sm">
                  <span className="font-medium">{item.name}</span>
                  <span className="text-muted-foreground">
                    {item.availableCapacity} de {item.totalCapacity} disponibles
                  </span>
                </div>
              ))}
            </div>
          </AlertDescription>
        </Alert>
      )}

      <Card className="mb-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tipo</TableHead>
              <TableHead>Código</TableHead>
              <TableHead>Nombre</TableHead>
              <TableHead>Destino</TableHead>
              <TableHead>Fecha Salida</TableHead>
              <TableHead className="text-center">Total</TableHead>
              <TableHead className="text-center">Disponible</TableHead>
              <TableHead className="text-center">Reservado</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Precio</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredInventory.map((item) => {
              const status = getStatus(item)
              return (
                <TableRow key={item.id}>
                  <TableCell>
                    <Badge variant="outline">{getServiceTypeLabel(item.serviceType)}</Badge>
                  </TableCell>
                  <TableCell className="font-mono text-sm">{item.code}</TableCell>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>{item.destination || "-"}</TableCell>
                  <TableCell>
                    {item.departureDate ? new Date(item.departureDate).toLocaleDateString("es-ES") : "-"}
                  </TableCell>
                  <TableCell className="text-center">{item.totalCapacity}</TableCell>
                  <TableCell className="text-center">
                    <span
                      className={
                        status === "por-agotarse"
                          ? "font-semibold text-orange-600"
                          : status === "agotado"
                            ? "font-semibold text-red-600"
                            : ""
                      }
                    >
                      {item.availableCapacity}
                    </span>
                  </TableCell>
                  <TableCell className="text-center">{item.reservedCapacity}</TableCell>
                  <TableCell>{getStatusBadge(status)}</TableCell>
                  <TableCell>
                    {item.price} {item.currency}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(item)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(item.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </Card>

      {history.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Historial de Cambios</CardTitle>
            <CardDescription>Últimas actualizaciones del inventario</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {history.slice(0, 10).map((entry) => (
                <div key={entry.id} className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0">
                  <div>
                    <span className="font-medium">{entry.itemName}</span>
                    <span className="text-muted-foreground ml-2 text-sm">
                      {entry.action === "created"
                        ? "creado"
                        : entry.action === "updated"
                          ? "actualizado"
                          : "capacidad modificada"}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-muted-foreground">
                      {new Date(entry.timestamp).toLocaleString("es-ES")}
                    </div>
                    {entry.previousCapacity !== undefined && (
                      <div className="text-xs text-muted-foreground">
                        {entry.previousCapacity} → {entry.newCapacity}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingItem ? "Editar Item de Inventario" : "Añadir Item de Inventario"}</DialogTitle>
            <DialogDescription>Complete la información del servicio</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="serviceType">Tipo de Servicio *</Label>
                <Select
                  value={formData.serviceType}
                  onValueChange={(value) => setFormData({ ...formData, serviceType: value as ServiceType })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="vuelo">Vuelo</SelectItem>
                    <SelectItem value="tour">Tour</SelectItem>
                    <SelectItem value="crucero">Crucero</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="code">Código *</Label>
                <Input
                  id="code"
                  value={formData.code || ""}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  placeholder="VU-001"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Nombre *</Label>
              <Input
                id="name"
                value={formData.name || ""}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Vuelo Caracas - Miami"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="destination">Destino</Label>
              <Input
                id="destination"
                value={formData.destination || ""}
                onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                placeholder="Miami, USA"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="departureDate">Fecha de Salida</Label>
                <Input
                  id="departureDate"
                  type="date"
                  value={formData.departureDate || ""}
                  onChange={(e) => setFormData({ ...formData, departureDate: e.target.value })}
                />
              </div>

              {formData.serviceType === "crucero" && (
                <div className="space-y-2">
                  <Label htmlFor="arrivalDate">Fecha de Llegada</Label>
                  <Input
                    id="arrivalDate"
                    type="date"
                    value={formData.arrivalDate || ""}
                    onChange={(e) => setFormData({ ...formData, arrivalDate: e.target.value })}
                  />
                </div>
              )}
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="totalCapacity">Capacidad Total *</Label>
                <Input
                  id="totalCapacity"
                  type="number"
                  value={formData.totalCapacity || ""}
                  onChange={(e) => setFormData({ ...formData, totalCapacity: Number.parseInt(e.target.value) })}
                  placeholder="180"
                />
              </div>

              {editingItem && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="availableCapacity">Disponible</Label>
                    <Input
                      id="availableCapacity"
                      type="number"
                      value={formData.availableCapacity || ""}
                      onChange={(e) => setFormData({ ...formData, availableCapacity: Number.parseInt(e.target.value) })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="reservedCapacity">Reservado</Label>
                    <Input
                      id="reservedCapacity"
                      type="number"
                      value={formData.reservedCapacity || ""}
                      onChange={(e) => setFormData({ ...formData, reservedCapacity: Number.parseInt(e.target.value) })}
                    />
                  </div>
                </>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Precio *</Label>
                <Input
                  id="price"
                  type="number"
                  value={formData.price || ""}
                  onChange={(e) => setFormData({ ...formData, price: Number.parseFloat(e.target.value) })}
                  placeholder="450"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="currency">Moneda *</Label>
                <Select
                  value={formData.currency}
                  onValueChange={(value) => setFormData({ ...formData, currency: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">USD</SelectItem>
                    <SelectItem value="VES">VES</SelectItem>
                    <SelectItem value="EUR">EUR</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={handleCloseDialog}>
              Cancelar
            </Button>
            <Button onClick={handleSave}>{editingItem ? "Guardar Cambios" : "Añadir Item"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
