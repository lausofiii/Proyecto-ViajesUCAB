"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { RefreshCw, History, Plus, Trash2 } from "lucide-react"
import type { ExchangeRate, ExchangeRateHistory } from "@/types/exchange-rate"

const initialRates: ExchangeRate[] = [
  {
    id: "1",
    currency: "USD",
    currencyName: "Dólar Estadounidense",
    rateToBolivar: 180.0,
    timestamp: new Date(),
  },
  {
    id: "2",
    currency: "EUR",
    currencyName: "Euro",
    rateToBolivar: 39.8,
    timestamp: new Date(),
  },
  {
    id: "3",
    currency: "COP",
    currencyName: "Peso Colombiano",
    rateToBolivar: 0.0092,
    timestamp: new Date(),
  },
  {
    id: "4",
    currency: "ARS",
    currencyName: "Peso Argentino",
    rateToBolivar: 0.037,
    timestamp: new Date(),
  },
  {
    id: "5",
    currency: "BRL",
    currencyName: "Real Brasileño",
    rateToBolivar: 7.25,
    timestamp: new Date(),
  },
]

const historyData: ExchangeRateHistory[] = [
  {
    id: "h1",
    currency: "USD",
    rateToBolivar: 180.0,
    timestamp: new Date(),
    updatedBy: "Admin",
  },
  {
    id: "h2",
    currency: "USD",
    rateToBolivar: 36.2,
    timestamp: new Date(Date.now() - 86400000),
    updatedBy: "Admin",
  },
  {
    id: "h3",
    currency: "EUR",
    rateToBolivar: 39.8,
    timestamp: new Date(),
    updatedBy: "Admin",
  },
  {
    id: "h4",
    currency: "EUR",
    rateToBolivar: 39.5,
    timestamp: new Date(Date.now() - 86400000),
    updatedBy: "Admin",
  },
]

export function ExchangeRatesManager() {
  const [rates, setRates] = useState<ExchangeRate[]>(initialRates)
  const [history, setHistory] = useState<ExchangeRateHistory[]>(historyData)
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false)
  const [isHistoryDialogOpen, setIsHistoryDialogOpen] = useState(false)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [selectedCurrency, setSelectedCurrency] = useState<ExchangeRate | null>(null)
  const [newRate, setNewRate] = useState("")
  const [newCurrency, setNewCurrency] = useState({
    code: "",
    name: "",
    rate: "",
  })

  const handleUpdateRate = () => {
    if (!selectedCurrency || !newRate) return

    const updatedRate: ExchangeRate = {
      ...selectedCurrency,
      rateToBolivar: Number.parseFloat(newRate),
      timestamp: new Date(),
    }

    // Agregar al historial
    const historyEntry: ExchangeRateHistory = {
      id: `h${Date.now()}`,
      currency: selectedCurrency.currency,
      rateToBolivar: Number.parseFloat(newRate),
      timestamp: new Date(),
      updatedBy: "Admin",
    }

    setRates(rates.map((r) => (r.id === selectedCurrency.id ? updatedRate : r)))
    setHistory([historyEntry, ...history])
    setIsUpdateDialogOpen(false)
    setNewRate("")
    setSelectedCurrency(null)
  }

  const handleAddCurrency = () => {
    if (!newCurrency.code || !newCurrency.name || !newCurrency.rate) return

    const newExchangeRate: ExchangeRate = {
      id: `${Date.now()}`,
      currency: newCurrency.code.toUpperCase(),
      currencyName: newCurrency.name,
      rateToBolivar: Number.parseFloat(newCurrency.rate),
      timestamp: new Date(),
    }

    // Agregar al historial
    const historyEntry: ExchangeRateHistory = {
      id: `h${Date.now()}`,
      currency: newCurrency.code.toUpperCase(),
      rateToBolivar: Number.parseFloat(newCurrency.rate),
      timestamp: new Date(),
      updatedBy: "Admin",
    }

    setRates([...rates, newExchangeRate])
    setHistory([historyEntry, ...history])
    setIsAddDialogOpen(false)
    setNewCurrency({ code: "", name: "", rate: "" })
  }

  const handleDeleteCurrency = (id: string) => {
    setRates(rates.filter((r) => r.id !== id))
  }

  const openUpdateDialog = (rate: ExchangeRate) => {
    setSelectedCurrency(rate)
    setNewRate(rate.rateToBolivar.toString())
    setIsUpdateDialogOpen(true)
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Tasas de Cambio</h1>
        <p className="text-muted-foreground text-lg">Gestión de tasas de cambio frente al Bolívar Venezolano (VES)</p>
      </div>

      {/* Current Rates Card */}
      <Card className="mb-6">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Tasas Actuales</CardTitle>
            <CardDescription>Última actualización: {new Date().toLocaleString("es-VE")}</CardDescription>
          </div>
          <div className="flex gap-2">
            <Button variant="default" size="sm" onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Añadir Moneda
            </Button>
            <Button variant="outline" size="sm" onClick={() => setIsHistoryDialogOpen(true)}>
              <History className="h-4 w-4 mr-2" />
              Ver Historial
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Moneda</TableHead>
                <TableHead>Código</TableHead>
                <TableHead className="text-right">Tasa (VES)</TableHead>
                <TableHead className="text-right">Última Actualización</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rates.map((rate) => {
                return (
                  <TableRow key={rate.id}>
                    <TableCell className="font-medium">{rate.currencyName}</TableCell>
                    <TableCell>
                      <span className="font-mono font-semibold">{rate.currency}</span>
                    </TableCell>
                    <TableCell className="text-right font-mono">
                      {rate.rateToBolivar.toLocaleString("es-VE", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 4,
                      })}
                    </TableCell>
                    <TableCell className="text-right text-sm text-muted-foreground">
                      {rate.timestamp.toLocaleTimeString("es-VE", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-2 justify-end">
                        <Button variant="outline" size="sm" onClick={() => openUpdateDialog(rate)}>
                          <RefreshCw className="h-4 w-4 mr-2" />
                          Actualizar
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => handleDeleteCurrency(rate.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Añadir Nueva Moneda</DialogTitle>
            <DialogDescription>Ingresa los datos de la nueva moneda y su tasa frente al Bolívar</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="currency-code">Código de Moneda</Label>
              <Input
                id="currency-code"
                value={newCurrency.code}
                onChange={(e) => setNewCurrency({ ...newCurrency, code: e.target.value })}
                placeholder="Ej: USD, EUR, GBP"
                maxLength={3}
                className="font-mono uppercase"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="currency-name">Nombre de la Moneda</Label>
              <Input
                id="currency-name"
                value={newCurrency.name}
                onChange={(e) => setNewCurrency({ ...newCurrency, name: e.target.value })}
                placeholder="Ej: Dólar Estadounidense"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="currency-rate">Tasa Inicial (VES)</Label>
              <Input
                id="currency-rate"
                type="number"
                step="0.0001"
                value={newCurrency.rate}
                onChange={(e) => setNewCurrency({ ...newCurrency, rate: e.target.value })}
                placeholder="Ingrese la tasa inicial"
                className="font-mono"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleAddCurrency}>Añadir Moneda</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Update Rate Dialog */}
      <Dialog open={isUpdateDialogOpen} onOpenChange={setIsUpdateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Actualizar Tasa de Cambio</DialogTitle>
            <DialogDescription>
              Actualiza la tasa de cambio de {selectedCurrency?.currencyName} ({selectedCurrency?.currency}) frente al
              Bolívar
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="current-rate">Tasa Actual</Label>
              <Input
                id="current-rate"
                value={selectedCurrency?.rateToBolivar.toFixed(4) || ""}
                disabled
                className="font-mono"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-rate">Nueva Tasa (VES)</Label>
              <Input
                id="new-rate"
                type="number"
                step="0.0001"
                value={newRate}
                onChange={(e) => setNewRate(e.target.value)}
                placeholder="Ingrese la nueva tasa"
                className="font-mono"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsUpdateDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleUpdateRate}>Actualizar Tasa</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* History Dialog */}
      <Dialog open={isHistoryDialogOpen} onOpenChange={setIsHistoryDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Historial de Tasas de Cambio</DialogTitle>
            <DialogDescription>Registro completo de actualizaciones de tasas</DialogDescription>
          </DialogHeader>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Moneda</TableHead>
                <TableHead className="text-right">Tasa (VES)</TableHead>
                <TableHead>Fecha y Hora</TableHead>
                <TableHead>Actualizado Por</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {history.map((entry) => (
                <TableRow key={entry.id}>
                  <TableCell className="font-mono font-semibold">{entry.currency}</TableCell>
                  <TableCell className="text-right font-mono">
                    {entry.rateToBolivar.toLocaleString("es-VE", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 4,
                    })}
                  </TableCell>
                  <TableCell>{entry.timestamp.toLocaleString("es-VE")}</TableCell>
                  <TableCell>{entry.updatedBy}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </DialogContent>
      </Dialog>
    </div>
  )
}
