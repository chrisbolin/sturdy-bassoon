import { range } from 'lodash';

export const DIM = 10;
export const UP = [0, -1];
export const DOWN = [0, 1];
export const RIGHT = [1, 0];
export const LEFT = [-1, 0];

export const GRID = range(DIM * DIM);;
export const ENTITY_MAP = {
  PLAYER: '🐭',
  DEAD_PLAYER: '💀',
  GOAL: '🧀',
  ENEMY: '💣',
  DEAD_ENEMY: '💥',
};
