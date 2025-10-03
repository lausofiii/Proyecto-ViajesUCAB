"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, DollarSign, Calendar, MapPin, Tag } from "lucide-react"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

// Datos de ejemplo para las métricas
const dailyBookings = [
  { date: "Lun", bookings: 12 },
  { date: "Mar", bookings: 19 },
  { date: "Mié", bookings: 15 },
  { date: "Jue", bookings: 25 },
  { date: "Vie", bookings: 22 },
  { date: "Sáb", bookings: 30 },
  { date: "Dom", bookings: 28 },
]

const monthlyRevenue = [
  { month: "Sep", revenue: 45 },
  { month: "Oct", revenue: 52 },
  { month: "Nov", revenue: 48 },
  { month: "Dic", revenue: 61 },
  { month: "Ene", revenue: 55 },
  { month: "Feb", revenue: 67 },
]

const topDestinations = [
  { destination: "Cancún", sales: 160 },
  { destination: "Punta Cana", sales: 145 },
  { destination: "Miami", sales: 128 },
  { destination: "Cartagena", sales: 98 },
  { destination: "Los Roques", sales: 87 },
]

const promotionPerformance = [
  { name: "Verano 2024", conversions: 75 },
  { name: "Black Friday", conversions: 89 },
  { name: "Año Nuevo", conversions: 82 },
  { name: "Semana Santa", conversions: 95 },
  { name: "Escapada Junio", conversions: 68 },
  { name: "Especial Agosto", conversions: 78 },
]

export function DashboardView() {
  const totalBookingsToday = dailyBookings[dailyBookings.length - 1].bookings
  const totalRevenueThisMonth = monthlyRevenue[monthlyRevenue.length - 1].revenue * 1000
  const bookingsTrend = 12.5
  const revenueTrend = 8.3

  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-muted-foreground text-lg">Métricas y análisis del rendimiento de ViajesUCAB</p>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Reservas Hoy</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalBookingsToday}</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
              <TrendingUp className="h-3 w-3 text-accent" />
              <span className="text-accent">+{bookingsTrend}%</span> vs ayer
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ingresos del Mes</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalRevenueThisMonth.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
              <TrendingUp className="h-3 w-3 text-accent" />
              <span className="text-accent">+{revenueTrend}%</span> vs mes anterior
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Destinos Activos</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground mt-1">En 12 países</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Promociones Activas</CardTitle>
            <Tag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground mt-1">2 finalizan pronto</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid gap-4 md:grid-cols-2 mb-8">
        {/* Daily Bookings Chart - Mantenido como está */}
        <Card>
          <CardHeader>
            <CardTitle>Reservas Diarias</CardTitle>
            <CardDescription>Últimos 7 días</CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <ChartContainer
              config={{
                bookings: {
                  label: "Reservas",
                  color: "hsl(var(--chart-1))",
                },
              }}
              className="h-[280px] w-full"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dailyBookings} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted/20" vertical={false} />
                  <XAxis dataKey="date" className="text-xs" tickLine={false} axisLine={false} />
                  <YAxis className="text-xs" tickLine={false} axisLine={false} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="bookings" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Ingresos Mensuales</CardTitle>
            <CardDescription>Últimos 6 meses</CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <ChartContainer
              config={{
                revenue: {
                  label: "Ingresos (miles)",
                  color: "hsl(var(--foreground))",
                },
              }}
              className="h-[280px] w-full"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyRevenue} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted/20" vertical={false} />
                  <XAxis dataKey="month" className="text-xs" tickLine={false} axisLine={false} />
                  <YAxis
                    className="text-xs"
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `$${value}k`}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} formatter={(value) => [`$${value}k`, "Ingresos"]} />
                  <Bar dataKey="revenue" fill="hsl(var(--foreground))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Destinos Más Vendidos</CardTitle>
            <CardDescription>Top 5 del mes actual</CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <ChartContainer
              config={{
                sales: {
                  label: "Ventas",
                  color: "hsl(var(--foreground))",
                },
              }}
              className="h-[280px] w-full"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topDestinations} layout="vertical" margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted/20" horizontal={false} />
                  <XAxis type="number" className="text-xs" tickLine={false} axisLine={false} />
                  <YAxis
                    type="category"
                    dataKey="destination"
                    className="text-xs"
                    tickLine={false}
                    axisLine={false}
                    width={90}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="sales" fill="hsl(var(--foreground))" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Rendimiento de Promociones</CardTitle>
            <CardDescription>Conversión por promoción activa</CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <ChartContainer
              config={{
                conversions: {
                  label: "Conversiones",
                  color: "hsl(var(--foreground))",
                },
              }}
              className="h-[280px] w-full"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={promotionPerformance} margin={{ top: 10, right: 10, left: 0, bottom: 60 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted/20" vertical={false} />
                  <XAxis
                    dataKey="name"
                    className="text-xs"
                    tickLine={false}
                    axisLine={false}
                    angle={-45}
                    textAnchor="end"
                    height={60}
                    interval={0}
                  />
                  <YAxis className="text-xs" tickLine={false} axisLine={false} tickFormatter={(value) => `${value}%`} />
                  <ChartTooltip content={<ChartTooltipContent />} formatter={(value) => [`${value}%`, "Conversión"]} />
                  <Bar dataKey="conversions" fill="hsl(var(--foreground))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
