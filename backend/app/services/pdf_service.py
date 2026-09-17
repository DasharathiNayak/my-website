from reportlab.platypus import SimpleDocTemplate, Table, TableStyle
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.platypus import Paragraph
from reportlab.platypus import Paragraph
from reportlab.lib.styles import getSampleStyleSheet

def create_pdf(testcases, file_path):

    doc = SimpleDocTemplate(file_path)

    styles = getSampleStyleSheet()

    data = [[
        "Sr No",
        "Title",
        "Priority",
        "Expected Result"
    ]]

    for index, tc in enumerate(testcases, start=1):

        data.append([
            str(index),
            Paragraph(tc.title or "", styles["BodyText"]),
            tc.priority or "",
            Paragraph(tc.expected_result or "", styles["BodyText"])
        ])

    table = Table(data, colWidths=[40, 220, 70, 220])

    table.setStyle(TableStyle([

        ("BACKGROUND", (0,0), (-1,0), colors.HexColor("#4F81BD")),
        ("TEXTCOLOR", (0,0), (-1,0), colors.white),

        ("GRID", (0,0), (-1,-1), 1, colors.black),

        ("FONTNAME", (0,0), (-1,0), "Helvetica-Bold"),

        ("BOTTOMPADDING", (0,0), (-1,0), 10),

        ("BACKGROUND", (0,1), (-1,-1), colors.beige),

        ("VALIGN", (0,0), (-1,-1), "TOP"),

    ]))

    doc.build([table])
    

def create_bug_report_pdf(bug, file_path):

    doc = SimpleDocTemplate(file_path)

    styles = getSampleStyleSheet()

    story = []

    story.append(Paragraph("<b><font size=18>AI Generated Bug Report</font></b>", styles["Title"]))
    story.append(Paragraph("<br/>", styles["BodyText"]))

    fields = [
        ("Bug ID", bug.get("bug_id", "")),
        ("Title", bug.get("title", "")),
        ("Severity", bug.get("severity", "")),
        ("Priority", bug.get("priority", "")),
        ("Environment", bug.get("environment", "")),
        ("Pre-condition", bug.get("pre_condition", "")),
        ("Steps to Reproduce", bug.get("steps_to_reproduce", "")),
        ("Expected Result", bug.get("expected_result", "")),
        ("Actual Result", bug.get("actual_result", "")),
        ("Status", bug.get("status", "")),
    ]

    table_data = []

    for key, value in fields:
        table_data.append([
            Paragraph(f"<b>{key}</b>", styles["BodyText"]),
            Paragraph(str(value), styles["BodyText"])
        ])

    table = Table(table_data, colWidths=[150, 330])

    table.setStyle(TableStyle([
        ("GRID", (0, 0), (-1, -1), 1, colors.black),
        ("BACKGROUND", (0, 0), (0, -1), colors.HexColor("#E8F0FE")),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 8),
    ]))

    story.append(table)

    doc.build(story)