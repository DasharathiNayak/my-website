from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import BugReport, TestCase, Project
from app.schemas import BugReportCreate, BugReportUpdate, BugReportResponse

router = APIRouter(
    prefix="/bug-reports",
    tags=["Bug Reports"]
)


# ============================================================
# ADD BUG REPORT
# ============================================================

@router.post("/", response_model=BugReportResponse)
def create_bug_report(
    bug: BugReportCreate,
    db: Session = Depends(get_db)
):

    # Check project
    project = db.query(Project).filter(
        Project.id == bug.project_id
    ).first()

    if not project:
        raise HTTPException(
            status_code=404,
            detail="Project not found"
        )

    # Check testcase
    testcase = db.query(TestCase).filter(
        TestCase.id == bug.testcase_id
    ).first()

    if not testcase:
        raise HTTPException(
            status_code=404,
            detail="Test Case not found"
        )

    # Generate project-wise Bug ID
    existing_count = db.query(BugReport).filter(
        BugReport.project_id == bug.project_id
    ).count()

    bug_number = existing_count + 1

    bug_id = f"BUG-PRJ{bug.project_id}-{bug_number:03d}"

    # Make sure ID is unique
    while db.query(BugReport).filter(
        BugReport.bug_id == bug_id
    ).first():

        bug_number += 1

        bug_id = f"BUG-PRJ{bug.project_id}-{bug_number:03d}"

    new_bug = BugReport(

        testcase_id=bug.testcase_id,

        project_id=bug.project_id,

        bug_id=bug_id,

        title=bug.title,

        severity=bug.severity,

        priority=bug.priority,

        environment=bug.environment,

        pre_condition=bug.pre_condition,

        steps_to_reproduce=bug.steps_to_reproduce,

        expected_result=bug.expected_result,

        actual_result=bug.actual_result,

        status=bug.status

    )

    db.add(new_bug)

    db.commit()

    db.refresh(new_bug)

    return new_bug


# ============================================================
# GET ALL BUGS FOR PROJECT
# ============================================================

@router.get(
    "/all",
    response_model=list[BugReportResponse]
)
def get_all_bug_reports(
    db: Session = Depends(get_db)
):
    bugs = (
        db.query(
            BugReport,
            Project.project_name,
            Project.assigned_to
        )
        .join(
            Project,
            BugReport.project_id == Project.id
        )
        .order_by(BugReport.id.desc())
        .all()
    )

    result = []

    for bug, project_name, assigned_to in bugs:
        result.append({
            "id": bug.id,
            "testcase_id": bug.testcase_id,
            "project_id": bug.project_id,
            "project_name": project_name,
            "assigned_to": assigned_to,
            "bug_id": bug.bug_id,
            "title": bug.title,
            "severity": bug.severity,
            "priority": bug.priority,
            "environment": bug.environment,
            "pre_condition": bug.pre_condition,
            "steps_to_reproduce": bug.steps_to_reproduce,
            "expected_result": bug.expected_result,
            "actual_result": bug.actual_result,
            "status": bug.status
        })

    return result
@router.get(
    "/project/{project_id}",
    response_model=list[BugReportResponse]
)
def get_project_bug_reports(
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

    bugs = db.query(BugReport).filter(
        BugReport.project_id == project_id
    ).order_by(
        BugReport.id.desc()
    ).all()

    return bugs


# ============================================================
# GET SINGLE BUG
# ============================================================

@router.get(
    "/{bug_id}",
    response_model=BugReportResponse
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


# ============================================================
# UPDATE BUG
# ============================================================

@router.put(
    "/{bug_id}",
    response_model=BugReportResponse
)
def update_bug_report(
    bug_id: int,
    bug_data: BugReportUpdate,
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

    for field, value in update_data.items():

        setattr(
            bug,
            field,
            value
        )

    db.commit()

    db.refresh(bug)

    return bug


# ============================================================
# DELETE BUG
# ============================================================

@router.delete("/{bug_id}")
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
        "message": "Bug Report deleted successfully"
    }