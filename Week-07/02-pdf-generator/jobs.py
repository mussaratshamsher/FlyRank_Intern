from dataclasses import dataclass, field
from datetime import datetime
from typing import Optional

from database import fetch_one, insert, update


@dataclass
class ReportJob:
    id: Optional[int] = None
    report_type: str = ""
    status: str = "queued"
    created_at: datetime = field(default_factory=datetime.utcnow)
    started_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    file_path: Optional[str] = None
    error_message: Optional[str] = None


def create_job(report_type: str) -> ReportJob:
    row = insert("report_jobs", {"report_type": report_type, "status": "queued"})
    return ReportJob(**row)


def update_job(job_id: int, **kwargs):
    update("report_jobs", kwargs, {"id": job_id})


def get_job(job_id: int) -> Optional[ReportJob]:
    row = fetch_one("report_jobs", filters={"id": job_id})
    return ReportJob(**row) if row else None


def get_next_queued_job() -> Optional[ReportJob]:
    row = fetch_one("report_jobs", filters={"status": "queued"}, order_by=("id", False))
    return ReportJob(**row) if row else None
