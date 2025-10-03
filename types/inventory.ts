export type ServiceType = "vuelo" | "tour" | "crucero"

export type InventoryStatus = "disponible" | "por-agotarse" | "agotado"

export interface InventoryItem {
  id: string
  serviceType: ServiceType
  name: string
  code: string
  totalCapacity: number
  availableCapacity: number
  reservedCapacity: number
  destination?: string
  departureDate?: string
  arrivalDate?: string
  price: number
  currency: string
  lastUpdated: string
}

export interface InventoryHistory {
  id: string
  itemId: string
  itemName: string
  action: "created" | "updated" | "capacity-changed"
  previousCapacity?: number
  newCapacity: number
  timestamp: string
  user: string
}
