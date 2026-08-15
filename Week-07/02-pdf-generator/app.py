import chainlit as cl
from jobs import create_job, get_job
from storage import get_signed_url


@cl.on_chat_start
async def on_chat_start():
    await cl.Message(
        content=(
            "Welcome to the PDF Report Generator.\n\n"
            "Type **generate** to create a new sales report.\n"
            "Type **status &lt;job_id&gt;** to check progress.\n"
            "Type **refresh &lt;job_id&gt;** to refresh status.\n"
        )
    ).send()


@cl.on_message
async def on_message(message: cl.Message):
    text = message.content.strip().lower()

    if text == "generate":
        job = create_job("sales_summary")
        await cl.Message(
            content=(
                f"Report job created.\n"
                f"Job ID: {job.id}\n"
                f"Status: {job.status}\n"
                f"The worker will process it in the background.\n\n"
                f"Type **refresh {job.id}** to check status."
            )
        ).send()
        return

    if text.startswith("refresh ") or text.startswith("status "):
        parts = text.split()
        if len(parts) < 2:
            await cl.Message(content="Usage: refresh &lt;job_id&gt;").send()
            return

        job_id = int(parts[1])
        job = get_job(job_id)
        if not job:
            await cl.Message(content="Job not found.").send()
            return

        status_text = job.status.upper()
        if job.status == "completed" and job.file_path:
            url = get_signed_url(job.file_path)
            await cl.Message(
                content=f"Job #{job.id} status: {status_text}\nDownload: [PDF]({url})\n\nType **generate** to create another report."
            ).send()
        elif job.status == "failed":
            await cl.Message(
                content=f"Job #{job.id} status: {status_text}\nError: {job.error_message}\n\nType **generate** to try again."
            ).send()
        else:
            await cl.Message(
                content=f"Job #{job.id} status: {status_text}\n\nThe worker is still processing. Type **refresh {job.id}** again in a moment."
            ).send()
        return

    await cl.Message(
        content=(
            "I didn't understand that command.\n\n"
            "Type **generate** to create a new sales report.\n"
            "Type **refresh &lt;job_id&gt;** to check progress."
        )
    ).send()
