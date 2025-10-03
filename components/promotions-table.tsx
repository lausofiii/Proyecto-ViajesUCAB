"use client"

import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Pencil, Trash2, Calendar, MapPin, Percent } from "lucide-react"
import type { Promotion } from "@/types/promotion"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface PromotionsTableProps {
  promotions: Promotion[]
  onEdit: (promotion: Promotion) => void
  onDelete: (id: string) => void
}

export function PromotionsTable({ promotions, onEdit, onDelete }: PromotionsTableProps) {
  if (promotions.length === 0) {
    return (
      <Card className="p-12 text-center">
        <div className="flex flex-col items-center gap-2">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-2">
            <Percent className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold">No se encontraron promociones</h3>
          <p className="text-muted-foreground">Comienza creando una nueva promoción para tus clientes</p>
        </div>
      </Card>
    )
  }

  return (
    <Card>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Descripción</TableHead>
              <TableHead className="text-center">Descuento</TableHead>
              <TableHead>Vigencia</TableHead>
              <TableHead>Destinos</TableHead>
              <TableHead className="text-center">Estado</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {promotions.map((promotion) => (
              <TableRow key={promotion.id}>
                <TableCell className="font-medium">{promotion.name}</TableCell>
                <TableCell className="max-w-xs">
                  <p className="text-sm text-muted-foreground line-clamp-2">{promotion.description}</p>
                </TableCell>
                <TableCell className="text-center">
                  <Badge variant="secondary" className="gap-1">
                    <Percent className="h-3 w-3" />
                    {promotion.discount}%
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-start gap-1.5 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                    <div className="space-y-0.5">
                      <div>{new Date(promotion.startDate).toLocaleDateString("es-ES")}</div>
                      <div className="text-muted-foreground">
                        {new Date(promotion.endDate).toLocaleDateString("es-ES")}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-start gap-1.5">
                    <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                    <div className="flex flex-wrap gap-1">
                      {promotion.destinations.slice(0, 2).map((dest, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {dest}
                        </Badge>
                      ))}
                      {promotion.destinations.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{promotion.destinations.length - 2}
                        </Badge>
                      )}
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <Badge variant={promotion.isActive ? "default" : "secondary"}>
                    {promotion.isActive ? "Activa" : "Inactiva"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" onClick={() => onEdit(promotion)} className="h-8 w-8">
                      <Pencil className="h-4 w-4" />
                      <span className="sr-only">Editar promoción</span>
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Eliminar promoción</span>
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Esta acción no se puede deshacer. La promoción "{promotion.name}" será eliminada
                            permanentemente del sistema.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => onDelete(promotion.id)}
                            className="bg-destructive text-white hover:bg-destructive/90"
                          >
                            Eliminar
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  )
}
