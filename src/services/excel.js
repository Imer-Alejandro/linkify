import * as XLSX from 'xlsx'

export const DEFAULT_CATEGORY = 'Sin categoría'

export function normalizeCategoryName(categoria) {
  const normalized = String(categoria || '').trim().replace(/\s+/g, ' ')
  return normalized === '' ? DEFAULT_CATEGORY : normalized
}

export function buildCategories(existingCategories, importedItems) {
  const categories = []
  const seen = new Set()

  const addCategory = (category) => {
    const normalized = normalizeCategoryName(category)
    const key = normalized.toLowerCase()
    if (!seen.has(key)) {
      seen.add(key)
      return normalized
    }
    return null
  }

  const existingNormalized = []
  if (Array.isArray(existingCategories)) {
    for (const category of existingCategories) {
      const normalized = normalizeCategoryName(category)
      const key = normalized.toLowerCase()
      if (!seen.has(key)) {
        seen.add(key)
        existingNormalized.push(normalized)
      }
    }
  }

  for (const item of importedItems) {
    const category = addCategory(item.categoria)
    if (category) {
      categories.push(category)
    }
  }

  categories.sort((a, b) => a.localeCompare(b, 'es', { sensitivity: 'base' }))

  for (const category of existingNormalized) {
    categories.push(category)
  }

  return categories
}

export function isDuplicateLink(existingLinks, link) {
  const normalizedUrl = String(link.enlace_url || '').trim().toLowerCase()
  const normalizedName = String(link.nombre || '').trim().toLowerCase()
  return Array.isArray(existingLinks) && existingLinks.some(existing => {
    const existingUrl = String(existing.enlace_url || '').trim().toLowerCase()
    const existingName = String(existing.nombre || '').trim().toLowerCase()
    return existingUrl === normalizedUrl || existingName === normalizedName
  })
}

export function exportToExcel(data, filename = 'enlaces.xlsx') {
  const exportData = data.map(e => ({
    nombre: e.nombre || '',
    enlace_url: e.enlace_url || '',
    descripcion: e.descripcion || '',
    categoria: e.categoria || '',
    origen: e.origen || '',
    tags: (e.tags || []).join(', '),
    favorito: e.favorito ? 'Si' : 'No'
  }))
  const ws = XLSX.utils.json_to_sheet(exportData)
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Enlaces')
  XLSX.writeFile(wb, filename)
}

export function parseExcelFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result)
        const wb = XLSX.read(data, { type: 'array' })
        const ws = wb.Sheets[wb.SheetNames[0]]
        const json = XLSX.utils.sheet_to_json(ws, { defval: '' })

        const errors = []
        const valid = []

        json.forEach((row, i) => {
          const rowNum = i + 2
          const nombre = String(row.nombre || '').trim()
          const enlace_url = String(row.enlace_url || '').trim()

          if (!nombre || !enlace_url) {
            errors.push(`Fila ${rowNum}: faltan campos obligatorios (nombre, enlace_url)`)
            return
          }

          valid.push({
            nombre,
            enlace_url,
            descripcion: String(row.descripcion || '').trim(),
            categoria: normalizeCategoryName(row.categoria),
            tags: row.tags ? String(row.tags).split(',').map(t => t.trim().toLowerCase()).filter(Boolean) : []
          })
        })

        resolve({ data: valid, errors })
      } catch (err) {
        reject(new Error('Error al leer el archivo Excel: ' + err.message))
      }
    }
    reader.onerror = () => reject(new Error('Error al leer el archivo'))
    reader.readAsArrayBuffer(file)
  })
}

export function downloadTemplate() {
  const template = [{
    nombre: 'Ejemplo',
    enlace_url: 'https://ejemplo.com',
    descripcion: 'Descripción opcional',
    categoria: 'General',
    tags: 'tag1, tag2'
  }]
  exportToExcel(template, 'plantilla_enlaces.xlsx')
}
