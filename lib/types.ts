export interface InventoryItem {
  id: number
  date: string
  companyToken: string
  location: string
  category: string
  description: string
  unitOfMeasure: string
  received: number
  issued: number
  availableQuantity: number
}

export interface DashboardStats {
  totalItems: number
  totalItemsChange: number
  totalReceived: number
  totalReceivedChange: number
  totalIssued: number
  totalIssuedChange: number
  availableStock: number
  availableStockChange: number
}
