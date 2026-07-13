<script>
import localforage from 'localforage'

export default {
  name: 'RecordatoriosView',
  mounted() {
    this.cargarRecordatorios()
  },
  data() {
    return {
      loading: true,
      recordatorios: [],
      currentMonth: new Date(),
      selectedDate: ''
    }
  },
  computed: {
    monthLabel() {
      return this.currentMonth.toLocaleDateString('es-ES', {
        month: 'long',
        year: 'numeric'
      })
    },
    calendarDays() {
      const year = this.currentMonth.getFullYear()
      const month = this.currentMonth.getMonth()
      const firstDay = new Date(year, month, 1)
      const lastDay = new Date(year, month + 1, 0)
      const leadingDays = (firstDay.getDay() + 6) % 7
      const totalCells = Math.ceil((leadingDays + lastDay.getDate()) / 7) * 7
      const days = []

      for (let index = 0; index < totalCells; index += 1) {
        const dayOffset = index - leadingDays + 1
        const currentDate = new Date(year, month, dayOffset)
        const isCurrentMonth = currentDate.getMonth() === month
        const key = this.formatKey(currentDate)
        const events = this.getEventsForDate(key)

        days.push({
          key,
          day: currentDate.getDate(),
          isCurrentMonth,
          events,
          isSelected: key === this.selectedDate
        })
      }

      return days
    },
    selectedEvents() {
      return this.getEventsForDate(this.selectedDate)
    }
  },
  methods: {
    formatKey(date) {
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      return `${year}-${month}-${day}`
    },
    formatDateLabel(dateString) {
      if (!dateString) return ''
      const date = new Date(dateString)
      return date.toLocaleDateString('es-ES', {
        weekday: 'short',
        day: 'numeric',
        month: 'short'
      })
    },
    formatTimeLabel(dateString) {
      if (!dateString) return ''
      const date = new Date(dateString)
      return date.toLocaleTimeString('es-ES', {
        hour: '2-digit',
        minute: '2-digit'
      })
    },
    cargarRecordatorios() {
      localforage.getItem('token_enlace')
        .then((listado) => {
          const links = listado ? JSON.parse(listado) : []
          this.recordatorios = links
            .filter((item) => item.reminder_enabled && item.reminder_at)
            .map((item) => ({
              ...item,
              reminderDateObj: new Date(item.reminder_at)
            }))
            .sort((a, b) => new Date(a.reminder_at) - new Date(b.reminder_at))

          if (this.recordatorios.length) {
            this.selectedDate = this.formatKey(this.recordatorios[0].reminderDateObj)
          } else {
            this.selectedDate = this.formatKey(new Date())
          }
          this.loading = false
        })
        .catch((error) => {
          console.error(error)
          this.loading = false
        })
    },
    goToPreviousMonth() {
      this.currentMonth = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth() - 1, 1)
    },
    goToNextMonth() {
      this.currentMonth = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth() + 1, 1)
    },
    selectDate(dateKey) {
      this.selectedDate = dateKey
    },
    getEventsForDate(dateKey) {
      return this.recordatorios.filter((item) => this.formatKey(item.reminderDateObj) === dateKey)
    },
    abrirEnlace(url) {
      window.open(url, '_blank', 'noopener,noreferrer')
    },
    volverInicio() {
      this.$router.push('/')
    }
  }
}
</script>

<template>
  <div class="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(30,41,59,0.95),_rgba(2,6,23,1))] pb-24">
    <header class="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl">
      <div class="px-4 py-4">
        <button @click="volverInicio" class="mb-3 inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900/70 px-3 py-1.5 text-sm text-slate-300">
          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
          Volver
        </button>
        <div class="rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 p-4 shadow-lg">
          <p class="text-[11px] font-semibold uppercase tracking-[0.35em] text-slate-400">Calendario de recordatorios</p>
          <h1 class="mt-1 text-xl font-semibold text-white">Tus próximos compromisos</h1>
          <p class="mt-1 text-sm text-slate-400">Revisa los enlaces que necesitas retomar en una fecha concreta.</p>
        </div>
      </div>
    </header>

    <main class="space-y-4 px-4 py-4">
      <section class="card p-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-semibold text-white">{{ monthLabel }}</p>
            <p class="text-xs text-slate-400">Selecciona un día para ver los eventos</p>
          </div>
          <div class="flex items-center gap-2">
            <button @click="goToPreviousMonth" class="rounded-lg border border-slate-700 bg-slate-800/70 p-2 text-slate-300">
              <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button @click="goToNextMonth" class="rounded-lg border border-slate-700 bg-slate-800/70 p-2 text-slate-300">
              <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        <div class="mt-4 grid grid-cols-7 gap-2 text-center text-[11px] uppercase tracking-[0.25em] text-slate-500">
          <span v-for="day in ['L', 'M', 'X', 'J', 'V', 'S', 'D']" :key="day">{{ day }}</span>
        </div>

        <div class="mt-2 grid grid-cols-7 gap-2">
          <button
            v-for="day in calendarDays"
            :key="day.key"
            @click="selectDate(day.key)"
            :class="[
              'flex h-16 flex-col items-center justify-center rounded-2xl border text-sm transition-colors',
              day.isSelected ? 'border-blue-500 bg-blue-600/20 text-white' : 'border-slate-800 bg-slate-900/70 text-slate-300',
              day.isCurrentMonth ? '' : 'opacity-50'
            ]"
          >
            <span class="font-medium">{{ day.day }}</span>
            <span v-if="day.events.length" class="mt-1 h-2 w-2 rounded-full bg-blue-400"></span>
          </button>
        </div>
      </section>

      <section class="card p-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-semibold text-white">{{ selectedDate ? formatDateLabel(selectedDate) : 'Sin selección' }}</p>
            <p class="text-xs text-slate-400">Recordatorios programados para este día</p>
          </div>
          <span class="rounded-full bg-slate-800/70 px-2.5 py-1 text-xs text-slate-300">{{ selectedEvents.length }} eventos</span>
        </div>

        <div v-if="loading" class="mt-4 space-y-2">
          <div class="h-14 animate-pulse rounded-2xl bg-slate-800/70"></div>
          <div class="h-14 animate-pulse rounded-2xl bg-slate-800/70"></div>
        </div>

        <div v-else-if="selectedEvents.length" class="mt-4 space-y-2">
          <div
            v-for="item in selectedEvents"
            :key="item.enlace_url + item.reminder_at"
            class="rounded-2xl border border-slate-800 bg-slate-900/70 p-3"
          >
            <div class="flex items-start justify-between gap-3">
              <div>
                <p class="font-medium text-white">{{ item.nombre }}</p>
                <p class="mt-1 text-sm text-slate-400">{{ item.descripcion || 'Sin descripción' }}</p>
              </div>
              <div class="rounded-full bg-blue-600/20 px-2.5 py-1 text-xs text-blue-300">
                {{ formatTimeLabel(item.reminder_at) }}
              </div>
            </div>
            <button @click="abrirEnlace(item.enlace_url)" class="mt-3 inline-flex items-center gap-2 rounded-lg bg-slate-800 px-3 py-2 text-sm text-slate-200">
              <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              Abrir enlace
            </button>
          </div>
        </div>

        <div v-else class="mt-4 rounded-2xl border border-dashed border-slate-700 bg-slate-900/50 p-6 text-center text-sm text-slate-500">
          No hay recordatorios para este día.
        </div>
      </section>
    </main>
  </div>
</template>
