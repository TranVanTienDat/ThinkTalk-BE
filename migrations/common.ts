import { TableColumn } from 'typeorm';

export const commonColumns = [
  new TableColumn({
    name: 'id',
    type: 'char',
    length: '36',
    isPrimary: true,
    generationStrategy: 'uuid',
  }),
  new TableColumn({
    name: 'created_at',
    type: 'timestamp',
    default: 'CURRENT_TIMESTAMP',
  }),
  new TableColumn({
    name: 'updated_at',
    type: 'timestamp',
    default: 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  }),
  new TableColumn({
    name: 'created_by',
    type: 'char',
    length: '36',
    isNullable: true,
  }),
  new TableColumn({
    name: 'updated_by',
    type: 'char',
    length: '36',
    isNullable: true,
  }),
  new TableColumn({
    name: 'deleted_at',
    type: 'timestamp',
    isNullable: true,
    default: null,
  }),
];
