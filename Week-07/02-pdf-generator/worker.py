import time
from datetime import datetime
from jobs import get_next_queued_job, update_job
from report import generate_pdf
from storage import upload_pdf
from jobs import ReportJob


def process_job(job: ReportJob):
    job_id = job.id
    if job_id is None:
        return

    update_job(job_id, status="processing", started_at=datetime.utcnow())
    try:
        pdf_bytes = generate_pdf(job_id, job.report_type)
        storage_path = upload_pdf(job_id, pdf_bytes)
        update_job(job_id, status="completed", completed_at=datetime.utcnow(), file_path=storage_path)
    except Exception as exc:  # noqa: BLE001
        update_job(
            job_id,
            status="failed",
            completed_at=datetime.utcnow(),
            error_message=str(exc),
        )


def run_worker(poll_interval: float = 2.0):
    print("Worker started. Waiting for jobs...")
    while True:
        job = get_next_queued_job()
        if job:
            print(f"Processing job {job.id}")
            process_job(job)
        time.sleep(poll_interval)


if __name__ == "__main__":
    run_worker()
