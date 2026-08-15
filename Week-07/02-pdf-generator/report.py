from datetime import datetime
from collections import defaultdict
from reportlab.lib import colors
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from io import BytesIO
from database import fetch_all


def aggregate_sales_report():
    rows = fetch_all("orders")

    total_orders = len(rows)
    total_revenue = sum((row.get("amount") or 0) for row in rows)
    average_order_value = total_revenue / total_orders if total_orders else 0
    completed_orders = sum(1 for row in rows if row.get("status") == "completed")
    pending_orders = sum(1 for row in rows if row.get("status") == "pending")
    refunded_orders = sum(1 for row in rows if row.get("status") == "refunded")

    monthly = defaultdict(lambda: {"orders": 0, "revenue": 0})
    for row in rows:
        created_at = row.get("created_at")
        if isinstance(created_at, str):
            created_at = datetime.fromisoformat(created_at.replace("Z", "+00:00"))
        month = created_at.strftime("%Y-%m") if created_at else "unknown"
        monthly[month]["orders"] += 1
        monthly[month]["revenue"] += row.get("amount") or 0

    monthly_sorted = [
        {"month": month, "orders": data["orders"], "revenue": data["revenue"]}
        for month, data in sorted(monthly.items())
    ]

    return {
        "summary": {
            "total_orders": total_orders,
            "total_revenue": total_revenue,
            "average_order_value": average_order_value,
            "completed_orders": completed_orders,
            "pending_orders": pending_orders,
            "refunded_orders": refunded_orders,
        },
        "monthly": monthly_sorted,
    }


def generate_pdf(job_id: int, report_type: str) -> bytes:
    data = aggregate_sales_report()
    buffer = BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=letter)
    styles = getSampleStyleSheet()

    title_style = ParagraphStyle(
        "Title",
        parent=styles["Heading1"],
        fontSize=22,
        spaceAfter=14,
        textColor=colors.HexColor("#0f172a"),
    )
    subtitle_style = ParagraphStyle(
        "Subtitle",
        parent=styles["Normal"],
        fontSize=11,
        textColor=colors.HexColor("#475569"),
        spaceAfter=18,
    )

    story = []
    story.append(Paragraph("Sales Aggregation Report", title_style))
    story.append(Paragraph(f"Generated: {datetime.utcnow().strftime('%Y-%m-%d %H:%M:%S UTC')}", subtitle_style))
    story.append(Paragraph(f"Job ID: {job_id}", subtitle_style))
    story.append(Spacer(1, 0.2 * inch))

    summary = data["summary"]
    story.append(Paragraph("Summary Statistics", styles["Heading2"]))
    summary_data = [
        ["Metric", "Value"],
        ["Total Orders", str(summary["total_orders"])],
        ["Total Revenue", f"${summary['total_revenue']:.2f}"],
        ["Average Order Value", f"${summary['average_order_value']:.2f}"],
        ["Completed Orders", str(summary["completed_orders"])],
        ["Pending Orders", str(summary["pending_orders"])],
        ["Refunded Orders", str(summary["refunded_orders"])],
    ]
    summary_table = Table(summary_data, colWidths=[3.2 * inch, 2.8 * inch])
    summary_table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#e2e8f0")),
        ("TEXTCOLOR", (0, 0), (-1, 0), colors.HexColor("#0f172a")),
        ("GRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#cbd5e1")),
        ("BACKGROUND", (0, 1), (-1, -1), colors.HexColor("#f8fafc")),
        ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
        ("FONTNAME", (0, 1), (-1, -1), "Helvetica"),
        ("FONTSIZE", (0, 0), (-1, -1), 10),
        ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.HexColor("#ffffff"), colors.HexColor("#f1f5f9")]),
    ]))
    story.append(summary_table)
    story.append(Spacer(1, 0.3 * inch))

    story.append(Paragraph("Revenue by Month", styles["Heading2"]))
    monthly = data["monthly"]
    monthly_data = [["Month", "Orders", "Revenue"]]
    for row in monthly:
        monthly_data.append([
            row["month"],
            str(row["orders"]),
            f"${row['revenue']:.2f}",
        ])
    monthly_table = Table(monthly_data, colWidths=[2.2 * inch, 2.2 * inch, 1.6 * inch])
    monthly_table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#e2e8f0")),
        ("TEXTCOLOR", (0, 0), (-1, 0), colors.HexColor("#0f172a")),
        ("GRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#cbd5e1")),
        ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
        ("FONTNAME", (0, 1), (-1, -1), "Helvetica"),
        ("FONTSIZE", (0, 0), (-1, -1), 10),
        ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.HexColor("#ffffff"), colors.HexColor("#f1f5f9")]),
    ]))
    story.append(monthly_table)

    doc.build(story)
    buffer.seek(0)
    return buffer.getvalue()
