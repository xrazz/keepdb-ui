import postgres from 'postgres';
import { getKeepDbDatabaseUrl } from '@/lib/keepdb/config';

let sql: postgres.Sql | null = null;

export function getKeepDbSql() {
  sql ??= postgres(getKeepDbDatabaseUrl(), {
    prepare: false,
    ssl: 'require',
  });

  return sql;
}
