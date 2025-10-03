export interface ExchangeRate {
  id: string
  currency: string
  currencyName: string
  rateToBolivar: number
  timestamp: Date
  updatedBy?: string
}

export interface ExchangeRateHistory {
  id: string
  currency: string
  rateToBolivar: number
  timestamp: Date
  updatedBy?: string
  transactionReference?: string
}
