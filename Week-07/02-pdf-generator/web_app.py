from flask import Flask, render_template_string, jsonify, request
from supabase import create_client
from dotenv import load_dotenv
import os
from datetime import datetime

load_dotenv()

app = Flask(__name__)
supabase = create_client(os.getenv("SUPABASE_URL"), os.getenv("SUPABASE_SERVICE_ROLE_KEY"))

HTML_TEMPLATE = """
<!DOCTYPE html>
<html>
<head>
    <title>PDF Report Generator</title>
    <style>
        body { font-family: Arial, sans-serif; max-width: 800px; margin: 50px auto; padding: 20px; }
        button { background: #4CAF50; color: white; padding: 10px 20px; border: none; border-radius: 4px; cursor: pointer; font-size: 16px; }
        button:hover { background: #45a049; }
        button:disabled { background: #ccc; cursor: not-allowed; }
        .job { border: 1px solid #ddd; padding: 15px; margin: 10px 0; border-radius: 4px; }
        .status { font-weight: bold; }
        .queued { color: #ff9800; }
        .processing { color: #2196F3; }
        .completed { color: #4CAF50; }
        .failed { color: #f44336; }
        a { color: #2196F3; text-decoration: none; }
        a:hover { text-decoration: underline; }
    </style>
</head>
<body>
    <h1>PDF Report Generator</h1>
    <button onclick="createJob()">Generate Report</button>
    
    <div id="jobs"></div>
    
    <script>
        let jobs = [];
        
        async function createJob() {
            const response = await fetch('/api/jobs', { method: 'POST' });
            const job = await response.json();
            jobs.unshift(job);
            renderJobs();
            pollStatus();
        }
        
        async function pollStatus() {
            for (let job of jobs) {
                if (job.status === 'queued' || job.status === 'processing') {
                    const response = await fetch(`/api/jobs/${job.id}`);
                    const updated = await response.json();
                    const idx = jobs.findIndex(j => j.id === job.id);
                    if (idx !== -1) jobs[idx] = updated;
                }
            }
            renderJobs();
            if (jobs.some(j => j.status === 'queued' || j.status === 'processing')) {
                setTimeout(pollStatus, 2000);
            }
        }
        
        function renderJobs() {
            const container = document.getElementById('jobs');
            container.innerHTML = jobs.map(job => `
                <div class="job">
                    <h3>Job #${job.id}</h3>
                    <p>Status: <span class="status ${job.status}">${job.status.toUpperCase()}</span></p>
                    <p>Created: ${new Date(job.created_at).toLocaleString()}</p>
                    ${job.file_path ? `<p>Download: <a href="/api/download/${job.id}" target="_blank">PDF</a></p>` : ''}
                    ${job.error_message ? `<p style="color: red;">Error: ${job.error_message}</p>` : ''}
                </div>
            `).join('');
        }
        
        // Load existing jobs on page load
        fetch('/api/jobs')
            .then(r => r.json())
            .then(data => {
                jobs = data.reverse();
                renderJobs();
            });
    </script>
</body>
</html>
"""


@app.route("/")
def index():
    return render_template_string(HTML_TEMPLATE)


@app.route("/api/jobs", methods=["GET"])
def get_jobs():
    result = supabase.table("report_jobs").select("*").order("id", desc=True).limit(20).execute()
    return jsonify(result.data or [])


@app.route("/api/jobs", methods=["POST"])
def create_job():
    result = supabase.table("report_jobs").insert({
        "report_type": "sales_summary",
        "status": "queued"
    }).execute()
    return jsonify(result.data[0] if result.data else {})


@app.route("/api/jobs/<int:job_id>")
def get_job(job_id):
    result = supabase.table("report_jobs").select("*").eq("id", job_id).execute()
    return jsonify(result.data[0] if result.data else {})


@app.route("/api/download/<int:job_id>")
def download_pdf(job_id):
    job_result = supabase.table("report_jobs").select("file_path").eq("id", job_id).execute()
    if not job_result.data:
        return "Job not found", 404
    
    file_path = job_result.data[0]["file_path"]
    if not file_path:
        return "PDF not ready", 404
    
    # Create signed URL
    url_result = supabase.storage.from_("reports").create_signed_url(file_path, 3600)
    signed_url = url_result.get("signedURL") or url_result.get("signed_url", "")
    
    if signed_url:
        return jsonify({"url": signed_url})
    return "Failed to generate download link", 500


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
