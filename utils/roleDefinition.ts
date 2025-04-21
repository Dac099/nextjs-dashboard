import { Role } from './types/roles';

export const ROLES: Record<string, Role> = {
  SYSTEMS: {
    name: 'SYSTEMS',
    description: 'Role with all access and privileges',
    permissions: [
      {
        workspace: 'Proyectos',
        actions: ['read', 'create', 'update'],
        boards: ['General Status', 'Global planning', 'Proyectos 2025']
      },
      {
        workspace: 'Cobranza',
        actions: ['read', 'create', 'update'],
        boards: ['Cobranza Jobs']
      },
      {
        workspace: 'Servicios',
        actions: ['read', 'create', 'update'],
        boards: ['02 Registro Servicios y refacciones', '1.- S&R Locales General status', 'Monitor']
      },
      {
        workspace: 'Recursos Humanos',
        actions: ['read', 'create', 'update'],
        boards: ['Contratación', 'Solicitud de viáticos', '2025 Bono Horas Extra']
      },
    ]
  },
  PROJECTMANAGER: {
    name: 'PROJECTMANAGER',
    description: 'Role with all access to Proyectos',
    permissions: [
      {
        workspace: 'Proyectos',
        actions: ['read', 'create', 'update'],
        boards: ['General Status', 'Global planning', 'Proyectos 2025']
      }
    ]
  },
  LEADPM: {
    name: 'LEADPM',
    description: 'Like PM role, but with access to create boards in projects',
    permissions: [
      {
        workspace: 'Proyectos',
        actions: ['read', 'create', 'update'],
        boards: ['*']
      }
    ]
  },
  PURCHASES: {
    name: 'PURCHASES',
    description: 'Role with all access in Cobranza and read access in Proyectos',
    permissions: [
      {
        workspace: 'Proyectos',
        actions: ['read'],
        boards: ['General Status', 'Global planning', 'Proyectos 2025']
      },
      {
        workspace: 'Cobranza',
        actions: ['read', 'create', 'update'],
        boards: ['Cobranza Jobs']
      }
    ]
  },
  GUEST: {
    name: 'GUEST',
    description: 'Role with read access to Proyectos',
    permissions: [
      {
        workspace: 'Proyectos',
        actions: ['read'],
        boards: ['Proyectos 2025']
      }
    ]
  },
  READER: {
    name: 'Reader',
    description: 'Role with read access to the entire app',
    permissions: [
      {
        workspace: 'Proyectos',
        actions: ['read'],
        boards: ['General Status', 'Global planning', 'Proyectos 2025']
      },
      {
        workspace: 'Cobranza',
        actions: ['read'],
        boards: ['Cobranza Jobs']
      },
      {
        workspace: 'Servicios',
        actions: ['read'],
        boards: ['02 Registro Servicios y refacciones', '1.- S&R Locales General status', 'Monitor']
      },
      {
        workspace: 'Recursos Humanos',
        actions: ['read'],
        boards: ['Contratación', 'Solicitud de viáticos', '2025 Bono Horas Extra']
      },
    ]
  }
};
