import { describe, it, expect } from 'vitest'
import { buildCategories, isDuplicateLink } from './excel'

describe('import Excel helpers', () => {
  it('crea categorías nuevas y evita duplicados por nombre normalizado', () => {
    const existing = ['General', 'Diseño']
    const imported = [
      { categoria: ' Redes  Sociales ' },
      { categoria: 'diseño' },
      { categoria: 'Marketing' }
    ]

    const result = buildCategories(existing, imported)

    expect(result).toEqual(['Marketing', 'Redes Sociales', 'General', 'Diseño'])
  })

  it('asigna Sin categoría cuando falta categoría en la importación', () => {
    const existing = []
    const imported = [
      { categoria: '' },
      { categoria: '   ' },
      { categoria: null }
    ]

    const result = buildCategories(existing, imported)

    expect(result).toEqual(['Sin categoría'])
  })

  it('bloquea enlaces duplicados por URL o nombre', () => {
    const existingLinks = [
      { nombre: 'Docs', enlace_url: 'https://example.com/docs' },
      { nombre: 'Otro', enlace_url: 'https://example.com/otro' }
    ]

    expect(isDuplicateLink(existingLinks, { nombre: 'docs', enlace_url: 'https://example.com/docs' })).toBe(true)
    expect(isDuplicateLink(existingLinks, { nombre: 'Nuevo', enlace_url: 'https://example.com/nuevo' })).toBe(false)
    expect(isDuplicateLink(existingLinks, { nombre: 'Docs', enlace_url: 'https://example.com/other' })).toBe(true)
  })
})
