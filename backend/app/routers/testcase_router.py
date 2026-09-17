from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from fastapi.responses import FileResponse
from pydantic import BaseModel

from app.services.pdf_service import (
    create_pdf,
    create_bug_report_pdf
)

from app.database import get_db

from app.models import (
    Project,
    TestCase,
    BugReport
)

from app import schemas

from app.services.ai_service import (
    generate_test_cases,
    generate_bug_report,
    generate_requirement_summary,
    generate_automation_script,
    generate_test_data,
    ask_qa_ai
)

from app.services.excel_service import create_excel

from app.services.document_service import (
    read_pdf,
    read_docx,
    read_txt
)

import os
import traceback


router = APIRouter(
    prefix="/testcases",
    tags=["Test Cases"]
)


# ============================================================
# Generate Demo Test Cases
# ============================================================

@router.post("/generate/{project_id}")
def generate_testcases(
    project_id: int,
    db: Session = Depends(get_db)
):

    project = db.query(Project).filter(
        Project.id == project_id
    ).first()

    if not project:
        raise HTTPException(
            status_code=404,
            detail="Project not found"
        )

    demo_testcases = [

        TestCase(
            project_id=project.id,
            title="Verify Login with Valid Credentials",
            pre_condition="User account should exist",
            steps="Enter valid username and password",
            expected_result="Dashboard should open",
            priority="High"
        ),

        TestCase(
            project_id=project.id,
            title="Verify Login with Invalid Password",
            pre_condition="User account should exist",
            steps="Enter wrong password",
            expected_result="Error message should display",
            priority="High"
        ),

        TestCase(
            project_id=project.id,
            title="Verify Blank Username",
            pre_condition="Login page opened",
            steps="Keep username blank",
            expected_result="Validation message",
            priority="Medium"
        )

    ]

    db.add_all(demo_testcases)
    db.commit()

    return {
        "message": "Demo Test Cases Generated Successfully"
    }


# ============================================================
# Generate AI Test Cases
# ============================================================

@router.post("/generate-ai/{project_id}")
def generate_ai_testcases(
    project_id: int,
    db: Session = Depends(get_db)
):

    project = db.query(Project).filter(
        Project.id == project_id
    ).first()

    if not project:
        raise HTTPException(
            status_code=404,
            detail="Project not found"
        )

    if not project.document_path:
        raise HTTPException(
            status_code=400,
            detail="No document uploaded"
        )

    # ------------------------------------------------------------
    # Read Requirement
    # ------------------------------------------------------------

    if project.document_type == "pdf":

        requirement_text = read_pdf(
            project.document_path
        )

    elif project.document_type == "docx":

        requirement_text = read_docx(
            project.document_path
        )

    else:

        requirement_text = read_txt(
            project.document_path
        )

    # ------------------------------------------------------------
    # Load Existing Test Cases
    # ------------------------------------------------------------

    existing_testcases = db.query(TestCase).filter(
        TestCase.project_id == project.id
    ).all()

    existing_testcase_data = []

    for tc in existing_testcases:

        existing_testcase_data.append({
            "title": tc.title or "",
            "pre_condition": tc.pre_condition or "",
            "steps": tc.steps or "",
            "expected_result": tc.expected_result or "",
            "priority": tc.priority or "Medium"
        })

    # ------------------------------------------------------------
    # AI Generation + Existing Case Comparison
    # ------------------------------------------------------------

    try:

        testcases = generate_test_cases(
            requirement_text,
            existing_testcase_data
        )

    except Exception as e:

        print("\n================ AI GENERATION ERROR ================\n")
        traceback.print_exc()
        print("\n======================================================\n")

        raise HTTPException(
            status_code=500,
            detail=f"AI Generation Failed: {str(e)}"
        )

    # ------------------------------------------------------------
    # Extra Duplicate Protection
    # ------------------------------------------------------------

    def normalize(value):

        if not value:
            return ""

        return " ".join(
            str(value)
            .lower()
            .strip()
            .split()
        )

    existing_keys = set()

    for tc in existing_testcases:

        key = (
            normalize(tc.title),
            normalize(tc.expected_result)
        )

        existing_keys.add(key)

    saved = []
    new_keys = set()

    for tc in testcases:

        title = tc.get("title", "")
        expected_result = tc.get(
            "expected_result",
            ""
        )

        key = (
            normalize(title),
            normalize(expected_result)
        )

        # Already present in DB
        if key in existing_keys:
            continue

        # Duplicate inside current AI response
        if key in new_keys:
            continue

        testcase = TestCase(
            project_id=project.id,
            title=title,
            pre_condition=tc.get(
                "pre_condition"
            ),
            steps=tc.get(
                "steps"
            ),
            expected_result=expected_result,
            priority=tc.get(
                "priority",
                "Medium"
            )
        )

        db.add(testcase)

        saved.append(testcase)
        new_keys.add(key)

    # ------------------------------------------------------------
    # Save Only NEW Test Cases
    # ------------------------------------------------------------

    if saved:
        db.commit()

    # ------------------------------------------------------------
    # Response
    # ------------------------------------------------------------

    return {
        "message":
            f"{len(saved)} new AI Test Cases Generated Successfully",

        "new_test_cases":
            len(saved),

        "total_test_cases":
            len(existing_testcases) + len(saved)
    }

# ============================================================
# Get Test Cases
# ============================================================

@router.get("/{project_id}")
def get_testcases(
    project_id: int,
    db: Session = Depends(get_db)
):

    return db.query(TestCase).filter(
        TestCase.project_id == project_id
    ).all()
    
@router.get("/assigned-user/{user_id}")
def get_testcases_by_assigned_user(
    user_id: int,
    db: Session = Depends(get_db)
):
    projects = db.query(Project).filter(
        Project.assigned_to == user_id
    ).all()

    project_ids = [project.id for project in projects]

    if not project_ids:
        return []

    return db.query(TestCase).filter(
        TestCase.project_id.in_(project_ids)
    ).all()


# ============================================================
# Update Test Case
# ============================================================

@router.put("/{testcase_id}")
def update_testcase(
    testcase_id: int,
    testcase: schemas.TestCaseUpdate,
    db: Session = Depends(get_db)
):

    db_testcase = db.query(TestCase).filter(
        TestCase.id == testcase_id
    ).first()

    if not db_testcase:

        raise HTTPException(
            status_code=404,
            detail="Test Case not found"
        )

    update_data = testcase.model_dump(
        exclude_unset=True
    )

    for field, value in update_data.items():

        setattr(
            db_testcase,
            field,
            value
        )

    db.commit()

    db.refresh(db_testcase)

    return {

        "message":
            "Test Case Updated Successfully",

        "data":
            db_testcase

    }


# ============================================================
# Delete Test Case
# ============================================================

@router.delete("/{testcase_id}")
def delete_testcase(
    testcase_id: int,
    db: Session = Depends(get_db)
):

    testcase = db.query(TestCase).filter(
        TestCase.id == testcase_id
    ).first()

    if not testcase:

        raise HTTPException(
            status_code=404,
            detail="Test Case not found"
        )

    db.delete(testcase)

    db.commit()

    return {

        "message":
            "Test Case Deleted Successfully"

    }


# ============================================================
# Export Excel
# ============================================================

@router.get("/export/{project_id}")
def export_testcases(
    project_id: int,
    db: Session = Depends(get_db)
):

    testcases = db.query(TestCase).filter(
        TestCase.project_id == project_id
    ).all()

    if not testcases:

        raise HTTPException(
            status_code=404,
            detail="No Test Cases Found"
        )

    os.makedirs(
        "exports",
        exist_ok=True
    )

    file_path = (
        f"exports/TestCases_Project_{project_id}.xlsx"
    )

    create_excel(
        testcases,
        file_path
    )

    return FileResponse(

        path=file_path,

        filename=
            f"TestCases_Project_{project_id}.xlsx",

        media_type=
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"

    )


# ============================================================
# Export PDF
# ============================================================

@router.get("/export-pdf/{project_id}")
def export_pdf(
    project_id: int,
    db: Session = Depends(get_db)
):

    testcases = db.query(TestCase).filter(
        TestCase.project_id == project_id
    ).all()

    if not testcases:

        raise HTTPException(
            status_code=404,
            detail="No Test Cases Found"
        )

    os.makedirs(
        "exports",
        exist_ok=True
    )

    file_path = (
        f"exports/TestCases_Project_{project_id}.pdf"
    )

    create_pdf(
        testcases,
        file_path
    )

    return FileResponse(

        path=file_path,

        filename=
            f"TestCases_Project_{project_id}.pdf",

        media_type="application/pdf"

    )


# ============================================================
# AI Generate Bug Report
# ============================================================

@router.get("/bug-report/{testcase_id}")
def ai_bug_report(
    testcase_id: int,
    db: Session = Depends(get_db)
):

    testcase = db.query(TestCase).filter(
        TestCase.id == testcase_id
    ).first()

    if not testcase:

        raise HTTPException(
            status_code=404,
            detail="Test Case not found"
        )

    try:

        bug_report = generate_bug_report(
            testcase
        )

        return {

            "message":
                "Bug Report Generated Successfully",

            "testcase_id":
                testcase.id,

            "data":
                bug_report

        }

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )


# ============================================================
# Download Bug Report PDF
# ============================================================

@router.get("/bug-report-pdf/{testcase_id}")
def download_bug_report_pdf(
    testcase_id: int,
    db: Session = Depends(get_db)
):

    testcase = db.query(TestCase).filter(
        TestCase.id == testcase_id
    ).first()

    if not testcase:

        raise HTTPException(
            status_code=404,
            detail="Test Case not found"
        )

    try:

        bug = generate_bug_report(
            testcase
        )

        os.makedirs(
            "exports",
            exist_ok=True
        )

        file_path = (
            f"exports/Bug_Report_{testcase_id}.pdf"
        )

        create_bug_report_pdf(
            bug,
            file_path
        )

        return FileResponse(

            path=file_path,

            filename=
                f"Bug_Report_{testcase_id}.pdf",

            media_type="application/pdf"

        )

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )


# ============================================================
# Generate Automation Script
# ============================================================

@router.get("/script/{testcase_id}")
def generate_script(
    testcase_id: int,
    db: Session = Depends(get_db)
):

    testcase = db.query(TestCase).filter(
        TestCase.id == testcase_id
    ).first()

    if not testcase:

        raise HTTPException(
            status_code=404,
            detail="Test Case Not Found"
        )

    script = generate_automation_script(
        testcase
    )

    testcase.automation_script = script

    db.commit()

    db.refresh(testcase)

    return {

        "message":
            "Automation Script Generated Successfully",

        "testcase_id":
            testcase.id,

        "data": {

            "script":
                script

        }

    }


# ============================================================
# Generate Test Data
# ============================================================

@router.get("/test-data/{testcase_id}")
def generate_test_data_api(
    testcase_id: int,
    db: Session = Depends(get_db)
):

    testcase = db.query(TestCase).filter(
        TestCase.id == testcase_id
    ).first()

    if not testcase:

        raise HTTPException(
            status_code=404,
            detail="Test Case Not Found"
        )

    test_data = generate_test_data(
        testcase
    )

    testcase.test_data = test_data

    db.commit()

    db.refresh(testcase)

    return {

        "message":
            "Test Data Generated Successfully",

        "testcase_id":
            testcase.id,

        "data": {

            "test_data":
                test_data

        }

    }


# ============================================================
# BUG REPORTS
# ============================================================


# ------------------------------------------------------------
# Save AI Generated Bug Report
# ------------------------------------------------------------

@router.post(
    "/bug-reports",
    response_model=schemas.BugReportResponse
)
def create_bug_report(
    bug: schemas.BugReportCreate,
    db: Session = Depends(get_db)
):

    testcase = db.query(TestCase).filter(
        TestCase.id == bug.testcase_id
    ).first()

    if not testcase:

        raise HTTPException(
            status_code=404,
            detail="Test Case not found"
        )

    project = db.query(Project).filter(
        Project.id == bug.project_id
    ).first()

    if not project:

        raise HTTPException(
            status_code=404,
            detail="Project not found"
        )

    # Make sure testcase belongs to same project
    if testcase.project_id != project.id:

        raise HTTPException(
            status_code=400,
            detail="Test Case does not belong to this project"
        )

    # Generate unique bug id
    last_bug = (
        db.query(BugReport)
        .order_by(BugReport.id.desc())
        .first()
    )

    if last_bug:

        next_number = last_bug.id + 1

    else:

        next_number = 1

    bug_id = f"BUG-{next_number:04d}"

    new_bug = BugReport(

        testcase_id=
            bug.testcase_id,

        project_id=
            bug.project_id,

        bug_id=
            bug_id,

        title=
            bug.title,

        severity=
            bug.severity,

        priority=
            bug.priority,

        environment=
            bug.environment,

        pre_condition=
            bug.pre_condition,

        steps_to_reproduce=
            bug.steps_to_reproduce,

        expected_result=
            bug.expected_result,

        actual_result=
            bug.actual_result,

        status=
            bug.status or "Open"

    )

    db.add(new_bug)

    db.commit()

    db.refresh(new_bug)

    return new_bug


# ------------------------------------------------------------
# Get Bug Reports for Project
# ------------------------------------------------------------

@router.get(
    "/bug-reports/project/{project_id}",
    response_model=list[schemas.BugReportResponse]
)
def get_project_bug_reports(
    project_id: int,
    db: Session = Depends(get_db)
):

    return (
        db.query(BugReport)
        .filter(
            BugReport.project_id == project_id
        )
        .order_by(
            BugReport.id.desc()
        )
        .all()
    )


# ------------------------------------------------------------
# Get Single Bug Report
# ------------------------------------------------------------

@router.get(
    "/bug-reports/{bug_id}",
    response_model=schemas.BugReportResponse
)
def get_bug_report(
    bug_id: int,
    db: Session = Depends(get_db)
):

    bug = db.query(BugReport).filter(
        BugReport.id == bug_id
    ).first()

    if not bug:

        raise HTTPException(
            status_code=404,
            detail="Bug Report not found"
        )

    return bug


# ------------------------------------------------------------
# Update Bug Report / Status
# ------------------------------------------------------------

@router.put(
    "/bug-reports/{bug_id}",
    response_model=schemas.BugReportResponse
)
def update_bug_report(
    bug_id: int,
    bug_data: schemas.BugReportUpdate,
    db: Session = Depends(get_db)
):

    bug = db.query(BugReport).filter(
        BugReport.id == bug_id
    ).first()

    if not bug:

        raise HTTPException(
            status_code=404,
            detail="Bug Report not found"
        )

    update_data = bug_data.model_dump(
        exclude_unset=True
    )

    # Allowed statuses
    if (
        "status" in update_data
        and update_data["status"]
        not in [
            "Open",
            "Resolved",
            "Rejected",
            "Clarified"
        ]
    ):

        raise HTTPException(
            status_code=400,
            detail=(
                "Invalid status. "
                "Allowed: Open, Resolved, "
                "Rejected, Clarified"
            )
        )

    for field, value in update_data.items():

        setattr(
            bug,
            field,
            value
        )

    db.commit()

    db.refresh(bug)

    return bug


# ------------------------------------------------------------
# Delete Bug Report
# ------------------------------------------------------------

@router.delete(
    "/bug-reports/{bug_id}"
)
def delete_bug_report(
    bug_id: int,
    db: Session = Depends(get_db)
):

    bug = db.query(BugReport).filter(
        BugReport.id == bug_id
    ).first()

    if not bug:

        raise HTTPException(
            status_code=404,
            detail="Bug Report not found"
        )

    db.delete(bug)

    db.commit()

    return {

        "message":
            "Bug Report Deleted Successfully"

    }


# ============================================================
# QA CHAT
# ============================================================

class QAChatRequest(BaseModel):

    question: str


@router.post("/qa-chat")
def qa_chat(
    request: QAChatRequest,
    db: Session = Depends(get_db)
):
    projects = db.query(Project).all()

    context = "TESTCRAFTAI PROJECT SUMMARY\n\n"

    for project in projects:

        total_testcases = (
            db.query(TestCase)
            .filter(TestCase.project_id == project.id)
            .count()
        )

        automation_generated = (
            db.query(TestCase)
            .filter(
                TestCase.project_id == project.id,
                TestCase.automation_script.isnot(None)
            )
            .count()
        )

        automation_pending = total_testcases - automation_generated

        total_bugs = (
            db.query(BugReport)
            .filter(BugReport.project_id == project.id)
            .count()
        )

        open_bugs = (
            db.query(BugReport)
            .filter(
                BugReport.project_id == project.id,
                BugReport.status == "Open"
            )
            .count()
        )

        closed_bugs = (
            db.query(BugReport)
            .filter(
                BugReport.project_id == project.id,
                BugReport.status == "Closed"
            )
            .count()
        )

        context += f"""
Project: {project.project_name}
Project ID: {project.id}
Application Type: {project.application_type}
Status: {project.status}
Total Test Cases: {total_testcases}
Automation Generated: {automation_generated}
Automation Pending: {automation_pending}
Total Bugs: {total_bugs}
Open Bugs: {open_bugs}
Closed Bugs: {closed_bugs}

"""

    answer = ask_qa_ai(
        request.question,
        context
    )

    return {
        "message": "Success",
        "data": {
            "answer": answer
        }
    }