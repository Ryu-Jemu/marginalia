import type { ComponentProps } from 'astro/types';
import type Icon from '../components/Icon.astro';

/** Reuse the same icon names as the rest of the portfolio. */
export type ArchitectureIconName = ComponentProps<typeof Icon>['name'];
export type ArchitectureRole = 'owned' | 'shared' | 'external';
export type ArchitectureEdgeKind = 'request' | 'event' | 'storage';
export type ArchitecturePoint = readonly [number, number];

export interface ArchitectureZone {
  id: string;
  label: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface ArchitectureNode {
  id: string;
  label: string;
  detail: string;
  icon: ArchitectureIconName;
  /** Top-left coordinates, in the model's SVG coordinate system. */
  x: number;
  y: number;
  /** Defaults to 156. */
  width?: number;
  /** Defaults to 84. A one-line label, detail and optional role fit in this height. */
  height?: number;
  role: ArchitectureRole;
  roleLabel?: string;
}

export interface ArchitectureEdge {
  from: string;
  to: string;
  kind: ArchitectureEdgeKind;
  /** Explicit polyline coordinates, including the start and end points. */
  points: readonly ArchitecturePoint[];
  label?: string;
  labelX?: number;
  labelY?: number;
}

export interface ArchitectureModel {
  id: string;
  title: string;
  summary: string;
  width: number;
  height: number;
  zones: readonly ArchitectureZone[];
  nodes: readonly ArchitectureNode[];
  edges: readonly ArchitectureEdge[];
  notes: readonly string[];
}
