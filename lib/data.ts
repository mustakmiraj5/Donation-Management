"use server"

import type { InventoryItem, DashboardStats } from "./types"

// This is a mock database for demonstration
// In a real application, you would use a database like Supabase, Neon, etc.
let mockInventory: InventoryItem[] = [
  {
    id: 1,
    date: "2025-05-10",
    companyToken: "ACME-123",
    location: "Warehouse A",
    category: "Electronics",
    description: "Laptop computers - Dell XPS 13",
    unitOfMeasure: "Units",
    received: 100,
    issued: 45,
    availableQuantity: 55,
  },
  {
    id: 2,
    date: "2025-05-12",
    companyToken: "ACME-123",
    location: "Warehouse B",
    category: "Office Supplies",
    description: "Printer paper - A4 size",
    unitOfMeasure: "Reams",
    received: 500,
    issued: 125,
    availableQuantity: 375,
  },
  {
    id: 3,
    date: "2025-05-14",
    companyToken: "TECH-456",
    location: "Warehouse A",
    category: "Electronics",
    description: "Wireless keyboards - Logitech",
    unitOfMeasure: "Units",
    received: 200,
    issued: 75,
    availableQuantity: 125,
  },
  {
    id: 4,
    date: "2025-05-15",
    companyToken: "TECH-456",
    location: "Warehouse C",
    category: "Furniture",
    description: "Office chairs - ergonomic",
    unitOfMeasure: "Units",
    received: 50,
    issued: 20,
    availableQuantity: 30,
  },
  {
    id: 5,
    date: "2025-05-16",
    companyToken: "ACME-123",
    location: "Warehouse A",
    category: "Electronics",
    description: "Monitors - 27 inch 4K",
    unitOfMeasure: "Units",
    received: 75,
    issued: 30,
    availableQuantity: 45,
  },
  {
    id: 6,
    date: "2025-05-17",
    companyToken: "SUPPLY-789",
    location: "Warehouse B",
    category: "Office Supplies",
    description: "Notebooks - spiral bound",
    unitOfMeasure: "Boxes",
    received: 100,
    issued: 40,
    availableQuantity: 60,
  },
  {
    id: 7,
    date: "2025-05-18",
    companyToken: "SUPPLY-789",
    location: "Warehouse C",
    category: "Furniture",
    description: "Desks - standing convertible",
    unitOfMeasure: "Units",
    received: 30,
    issued: 15,
    availableQuantity: 15,
  },
  {
    id: 8,
    date: "2025-05-19",
    companyToken: "TECH-456",
    location: "Warehouse A",
    category: "Electronics",
    description: "Tablets - iPad Pro",
    unitOfMeasure: "Units",
    received: 50,
    issued: 25,
    availableQuantity: 25,
  },
]

export async function fetchInventory(): Promise<InventoryItem[]> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500))
  return [...mockInventory]
}

export async function getInventoryItem(id: number): Promise<InventoryItem | undefined> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 300))
  return mockInventory.find((item) => item.id === id)
}

export async function saveInventoryItem(item: Partial<InventoryItem> & { id?: number }): Promise<InventoryItem> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 800))

  if (item.id) {
    // Update existing item
    const index = mockInventory.findIndex((i) => i.id === item.id)
    if (index === -1) throw new Error("Item not found")

    const updatedItem = { ...mockInventory[index], ...item } as InventoryItem
    mockInventory[index] = updatedItem
    return updatedItem
  } else {
    // Create new item
    const newItem = {
      ...item,
      id: Math.max(0, ...mockInventory.map((i) => i.id)) + 1,
    } as InventoryItem

    mockInventory.push(newItem)
    return newItem
  }
}

export async function deleteInventoryItem(id: number): Promise<void> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  const index = mockInventory.findIndex((item) => item.id === id)
  if (index === -1) throw new Error("Item not found")

  mockInventory = mockInventory.filter((item) => item.id !== id)
}

export async function clearAllInventoryData(): Promise<void> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 800))

  // Clear all inventory data
  mockInventory = []
}

export async function getDashboardStats(): Promise<DashboardStats> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 700))

  // Calculate totals
  const totalItems = mockInventory.length
  const totalReceived = mockInventory.reduce((sum, item) => sum + item.received, 0)
  const totalIssued = mockInventory.reduce((sum, item) => sum + item.issued, 0)
  const availableStock = mockInventory.reduce((sum, item) => sum + item.availableQuantity, 0)

  // Simulate changes from previous period
  return {
    totalItems,
    totalItemsChange: 12.5,
    totalReceived,
    totalReceivedChange: 8.3,
    totalIssued,
    totalIssuedChange: 5.7,
    availableStock,
    availableStockChange: -2.4,
  }
}
