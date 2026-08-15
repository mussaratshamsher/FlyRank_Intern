from supabase import create_client
from config import SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
from datetime import datetime

supabase = create_client(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)


def fetch_all(table_name: str, filters: dict = None, order_by: tuple = None, limit: int = None):
    query = supabase.table(table_name).select("*")
    if filters:
        for key, value in filters.items():
            if value is None:
                query = query.is_(key, None)
            else:
                query = query.eq(key, value)
    if order_by:
        query = query.order(order_by[0], desc=order_by[1] if len(order_by) > 1 else False)
    if limit:
        query = query.limit(limit)
    result = query.execute()
    return result.data or []


def fetch_one(table_name: str, filters: dict = None, order_by: tuple = None):
    rows = fetch_all(table_name, filters, order_by, limit=1)
    return rows[0] if rows else None


def insert(table_name: str, data: dict):
    result = supabase.table(table_name).insert(data).execute()
    return result.data[0] if result.data else None


def update(table_name: str, data: dict, filters: dict):
    query = supabase.table(table_name).update(data)
    for key, value in filters.items():
        query = query.eq(key, value)
    result = query.execute()
    return result.data
