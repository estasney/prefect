/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file was automatically generated by TanStack Router.
// You should NOT make any changes in this file as it will be overwritten.
// Additionally, you should also exclude this file from your linter and/or formatter to prevent it from being checked or modified.

// Import Routes

import { Route as rootRoute } from './routes/__root'
import { Route as WorkPoolsImport } from './routes/work-pools'
import { Route as VariablesImport } from './routes/variables'
import { Route as SettingsImport } from './routes/settings'
import { Route as RunsImport } from './routes/runs'
import { Route as NotificationsImport } from './routes/notifications'
import { Route as EventsImport } from './routes/events'
import { Route as DeploymentsImport } from './routes/deployments'
import { Route as DashboardImport } from './routes/dashboard'
import { Route as ConcurrencyLimitsImport } from './routes/concurrency-limits'
import { Route as BlocksImport } from './routes/blocks'
import { Route as AutomationsImport } from './routes/automations'
import { Route as IndexImport } from './routes/index'
import { Route as FlowsIndexImport } from './routes/flows/index'
import { Route as FlowsFlowIdImport } from './routes/flows/flow.$id'

// Create/Update Routes

const WorkPoolsRoute = WorkPoolsImport.update({
  id: '/work-pools',
  path: '/work-pools',
  getParentRoute: () => rootRoute,
} as any)

const VariablesRoute = VariablesImport.update({
  id: '/variables',
  path: '/variables',
  getParentRoute: () => rootRoute,
} as any)

const SettingsRoute = SettingsImport.update({
  id: '/settings',
  path: '/settings',
  getParentRoute: () => rootRoute,
} as any)

const RunsRoute = RunsImport.update({
  id: '/runs',
  path: '/runs',
  getParentRoute: () => rootRoute,
} as any)

const NotificationsRoute = NotificationsImport.update({
  id: '/notifications',
  path: '/notifications',
  getParentRoute: () => rootRoute,
} as any)

const EventsRoute = EventsImport.update({
  id: '/events',
  path: '/events',
  getParentRoute: () => rootRoute,
} as any)

const DeploymentsRoute = DeploymentsImport.update({
  id: '/deployments',
  path: '/deployments',
  getParentRoute: () => rootRoute,
} as any)

const DashboardRoute = DashboardImport.update({
  id: '/dashboard',
  path: '/dashboard',
  getParentRoute: () => rootRoute,
} as any)

const ConcurrencyLimitsRoute = ConcurrencyLimitsImport.update({
  id: '/concurrency-limits',
  path: '/concurrency-limits',
  getParentRoute: () => rootRoute,
} as any)

const BlocksRoute = BlocksImport.update({
  id: '/blocks',
  path: '/blocks',
  getParentRoute: () => rootRoute,
} as any)

const AutomationsRoute = AutomationsImport.update({
  id: '/automations',
  path: '/automations',
  getParentRoute: () => rootRoute,
} as any)

const IndexRoute = IndexImport.update({
  id: '/',
  path: '/',
  getParentRoute: () => rootRoute,
} as any)

const FlowsIndexRoute = FlowsIndexImport.update({
  id: '/flows/',
  path: '/flows/',
  getParentRoute: () => rootRoute,
} as any)

const FlowsFlowIdRoute = FlowsFlowIdImport.update({
  id: '/flows/flow/$id',
  path: '/flows/flow/$id',
  getParentRoute: () => rootRoute,
} as any)

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/': {
      id: '/'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof IndexImport
      parentRoute: typeof rootRoute
    }
    '/automations': {
      id: '/automations'
      path: '/automations'
      fullPath: '/automations'
      preLoaderRoute: typeof AutomationsImport
      parentRoute: typeof rootRoute
    }
    '/blocks': {
      id: '/blocks'
      path: '/blocks'
      fullPath: '/blocks'
      preLoaderRoute: typeof BlocksImport
      parentRoute: typeof rootRoute
    }
    '/concurrency-limits': {
      id: '/concurrency-limits'
      path: '/concurrency-limits'
      fullPath: '/concurrency-limits'
      preLoaderRoute: typeof ConcurrencyLimitsImport
      parentRoute: typeof rootRoute
    }
    '/dashboard': {
      id: '/dashboard'
      path: '/dashboard'
      fullPath: '/dashboard'
      preLoaderRoute: typeof DashboardImport
      parentRoute: typeof rootRoute
    }
    '/deployments': {
      id: '/deployments'
      path: '/deployments'
      fullPath: '/deployments'
      preLoaderRoute: typeof DeploymentsImport
      parentRoute: typeof rootRoute
    }
    '/events': {
      id: '/events'
      path: '/events'
      fullPath: '/events'
      preLoaderRoute: typeof EventsImport
      parentRoute: typeof rootRoute
    }
    '/notifications': {
      id: '/notifications'
      path: '/notifications'
      fullPath: '/notifications'
      preLoaderRoute: typeof NotificationsImport
      parentRoute: typeof rootRoute
    }
    '/runs': {
      id: '/runs'
      path: '/runs'
      fullPath: '/runs'
      preLoaderRoute: typeof RunsImport
      parentRoute: typeof rootRoute
    }
    '/settings': {
      id: '/settings'
      path: '/settings'
      fullPath: '/settings'
      preLoaderRoute: typeof SettingsImport
      parentRoute: typeof rootRoute
    }
    '/variables': {
      id: '/variables'
      path: '/variables'
      fullPath: '/variables'
      preLoaderRoute: typeof VariablesImport
      parentRoute: typeof rootRoute
    }
    '/work-pools': {
      id: '/work-pools'
      path: '/work-pools'
      fullPath: '/work-pools'
      preLoaderRoute: typeof WorkPoolsImport
      parentRoute: typeof rootRoute
    }
    '/flows/': {
      id: '/flows/'
      path: '/flows'
      fullPath: '/flows'
      preLoaderRoute: typeof FlowsIndexImport
      parentRoute: typeof rootRoute
    }
    '/flows/flow/$id': {
      id: '/flows/flow/$id'
      path: '/flows/flow/$id'
      fullPath: '/flows/flow/$id'
      preLoaderRoute: typeof FlowsFlowIdImport
      parentRoute: typeof rootRoute
    }
  }
}

// Create and export the route tree

export interface FileRoutesByFullPath {
  '/': typeof IndexRoute
  '/automations': typeof AutomationsRoute
  '/blocks': typeof BlocksRoute
  '/concurrency-limits': typeof ConcurrencyLimitsRoute
  '/dashboard': typeof DashboardRoute
  '/deployments': typeof DeploymentsRoute
  '/events': typeof EventsRoute
  '/notifications': typeof NotificationsRoute
  '/runs': typeof RunsRoute
  '/settings': typeof SettingsRoute
  '/variables': typeof VariablesRoute
  '/work-pools': typeof WorkPoolsRoute
  '/flows': typeof FlowsIndexRoute
  '/flows/flow/$id': typeof FlowsFlowIdRoute
}

export interface FileRoutesByTo {
  '/': typeof IndexRoute
  '/automations': typeof AutomationsRoute
  '/blocks': typeof BlocksRoute
  '/concurrency-limits': typeof ConcurrencyLimitsRoute
  '/dashboard': typeof DashboardRoute
  '/deployments': typeof DeploymentsRoute
  '/events': typeof EventsRoute
  '/notifications': typeof NotificationsRoute
  '/runs': typeof RunsRoute
  '/settings': typeof SettingsRoute
  '/variables': typeof VariablesRoute
  '/work-pools': typeof WorkPoolsRoute
  '/flows': typeof FlowsIndexRoute
  '/flows/flow/$id': typeof FlowsFlowIdRoute
}

export interface FileRoutesById {
  __root__: typeof rootRoute
  '/': typeof IndexRoute
  '/automations': typeof AutomationsRoute
  '/blocks': typeof BlocksRoute
  '/concurrency-limits': typeof ConcurrencyLimitsRoute
  '/dashboard': typeof DashboardRoute
  '/deployments': typeof DeploymentsRoute
  '/events': typeof EventsRoute
  '/notifications': typeof NotificationsRoute
  '/runs': typeof RunsRoute
  '/settings': typeof SettingsRoute
  '/variables': typeof VariablesRoute
  '/work-pools': typeof WorkPoolsRoute
  '/flows/': typeof FlowsIndexRoute
  '/flows/flow/$id': typeof FlowsFlowIdRoute
}

export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath
  fullPaths:
    | '/'
    | '/automations'
    | '/blocks'
    | '/concurrency-limits'
    | '/dashboard'
    | '/deployments'
    | '/events'
    | '/notifications'
    | '/runs'
    | '/settings'
    | '/variables'
    | '/work-pools'
    | '/flows'
    | '/flows/flow/$id'
  fileRoutesByTo: FileRoutesByTo
  to:
    | '/'
    | '/automations'
    | '/blocks'
    | '/concurrency-limits'
    | '/dashboard'
    | '/deployments'
    | '/events'
    | '/notifications'
    | '/runs'
    | '/settings'
    | '/variables'
    | '/work-pools'
    | '/flows'
    | '/flows/flow/$id'
  id:
    | '__root__'
    | '/'
    | '/automations'
    | '/blocks'
    | '/concurrency-limits'
    | '/dashboard'
    | '/deployments'
    | '/events'
    | '/notifications'
    | '/runs'
    | '/settings'
    | '/variables'
    | '/work-pools'
    | '/flows/'
    | '/flows/flow/$id'
  fileRoutesById: FileRoutesById
}

export interface RootRouteChildren {
  IndexRoute: typeof IndexRoute
  AutomationsRoute: typeof AutomationsRoute
  BlocksRoute: typeof BlocksRoute
  ConcurrencyLimitsRoute: typeof ConcurrencyLimitsRoute
  DashboardRoute: typeof DashboardRoute
  DeploymentsRoute: typeof DeploymentsRoute
  EventsRoute: typeof EventsRoute
  NotificationsRoute: typeof NotificationsRoute
  RunsRoute: typeof RunsRoute
  SettingsRoute: typeof SettingsRoute
  VariablesRoute: typeof VariablesRoute
  WorkPoolsRoute: typeof WorkPoolsRoute
  FlowsIndexRoute: typeof FlowsIndexRoute
  FlowsFlowIdRoute: typeof FlowsFlowIdRoute
}

const rootRouteChildren: RootRouteChildren = {
  IndexRoute: IndexRoute,
  AutomationsRoute: AutomationsRoute,
  BlocksRoute: BlocksRoute,
  ConcurrencyLimitsRoute: ConcurrencyLimitsRoute,
  DashboardRoute: DashboardRoute,
  DeploymentsRoute: DeploymentsRoute,
  EventsRoute: EventsRoute,
  NotificationsRoute: NotificationsRoute,
  RunsRoute: RunsRoute,
  SettingsRoute: SettingsRoute,
  VariablesRoute: VariablesRoute,
  WorkPoolsRoute: WorkPoolsRoute,
  FlowsIndexRoute: FlowsIndexRoute,
  FlowsFlowIdRoute: FlowsFlowIdRoute,
}

export const routeTree = rootRoute
  ._addFileChildren(rootRouteChildren)
  ._addFileTypes<FileRouteTypes>()

/* ROUTE_MANIFEST_START
{
  "routes": {
    "__root__": {
      "filePath": "__root.tsx",
      "children": [
        "/",
        "/automations",
        "/blocks",
        "/concurrency-limits",
        "/dashboard",
        "/deployments",
        "/events",
        "/notifications",
        "/runs",
        "/settings",
        "/variables",
        "/work-pools",
        "/flows/",
        "/flows/flow/$id"
      ]
    },
    "/": {
      "filePath": "index.tsx"
    },
    "/automations": {
      "filePath": "automations.tsx"
    },
    "/blocks": {
      "filePath": "blocks.tsx"
    },
    "/concurrency-limits": {
      "filePath": "concurrency-limits.tsx"
    },
    "/dashboard": {
      "filePath": "dashboard.tsx"
    },
    "/deployments": {
      "filePath": "deployments.tsx"
    },
    "/events": {
      "filePath": "events.tsx"
    },
    "/notifications": {
      "filePath": "notifications.tsx"
    },
    "/runs": {
      "filePath": "runs.tsx"
    },
    "/settings": {
      "filePath": "settings.tsx"
    },
    "/variables": {
      "filePath": "variables.tsx"
    },
    "/work-pools": {
      "filePath": "work-pools.tsx"
    },
    "/flows/": {
      "filePath": "flows/index.tsx"
    },
    "/flows/flow/$id": {
      "filePath": "flows/flow.$id.tsx"
    }
  }
}
ROUTE_MANIFEST_END */
