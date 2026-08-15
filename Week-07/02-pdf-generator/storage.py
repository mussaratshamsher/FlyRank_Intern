from supabase import create_client
from config import SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY

supabase = create_client(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

BUCKET_NAME = "reports"


def ensure_bucket():
    try:
        supabase.storage.get_bucket(BUCKET_NAME)
    except Exception as exc:
        try:
            supabase.storage.create_bucket(BUCKET_NAME, options={"public": False})
        except Exception as create_exc:
            raise RuntimeError(
                f"Storage bucket '{BUCKET_NAME}' is missing and could not be created automatically: {create_exc}. "
                "Please create it manually in Supabase Dashboard -> Storage."
            ) from create_exc


def upload_pdf(job_id: int, content: bytes) -> str:
    ensure_bucket()
    path = f"reports/{job_id}.pdf"
    supabase.storage.from_(BUCKET_NAME).upload(path, content, {"content-type": "application/pdf"})
    return path


def get_signed_url(storage_path: str, expires_in: int = 3600) -> str:
    res = supabase.storage.from_(BUCKET_NAME).create_signed_url(storage_path, expires_in)
    return res.get("signedURL") or res.get("signed_url") or ""
