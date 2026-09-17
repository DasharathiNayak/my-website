from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session

from app.schemas import ProjectCreate, ProjectUpdate
from app.database import get_db
from app.models import Project, TestCase, BugReport
from app.services.ai_service import generate_requirement_summary

from app.services.document_service import (
    read_pdf,
    read_docx,
    read_txt
)

import os
import shutil


router = APIRouter(
    prefix="/projects",
    tags=["Projects"]
)


# ============================================================
# CREATE PROJECT
# ============================================================

@router.post("/")
def create_project(
    project: ProjectCreate,
    db: Session = Depends(get_db)
):

    new_project = Project(
        user_id=project.user_id,
        project_name=project.project_name,
        description=project.description,
        application_type=project.application_type,
        status=project.status
    )

    db.add(new_project)
    db.commit()
    db.refresh(new_project)

    return {
        "message": "Project created successfully",
        "project_id": new_project.id
    }


# ============================================================
# GET ALL PROJECTS OF USER
# ============================================================

@router.get("/user/{user_id}")
def get_projects(
    user_id: int,
    db: Session = Depends(get_db)
):

    projects = db.query(Project).filter(
        Project.user_id == user_id
    ).all()

    return projects


# ============================================================
# GET SINGLE PROJECT
# ============================================================

@router.get("/{project_id}")
def get_project(
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

    return project


# ============================================================
# UPDATE PROJECT
# ============================================================

@router.put("/{project_id}")
def update_project(
    project_id: int,
    project: ProjectUpdate,
    db: Session = Depends(get_db)
):

    db_project = db.query(Project).filter(
        Project.id == project_id
    ).first()

    if not db_project:
        raise HTTPException(
            status_code=404,
            detail="Project not found"
        )

    db_project.project_name = project.project_name
    db_project.description = project.description
    db_project.application_type = project.application_type
    db_project.status = project.status
    db_project.assigned_to = project.assigned_to

    db.commit()
    db.refresh(db_project)

    return {
        "message": "Project updated successfully"
    }


# ============================================================
# DELETE PROJECT
# ============================================================

@router.delete("/{project_id}")
def delete_project(
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

    # Delete related bug reports first
    db.query(BugReport).filter(
        BugReport.project_id == project_id
    ).delete(synchronize_session=False)

    # Delete related test cases
    db.query(TestCase).filter(
        TestCase.project_id == project_id
    ).delete(synchronize_session=False)

    # Delete the project
    db.delete(project)

    db.commit()

    return {
        "message": "Project and all related data deleted successfully"
    }

# ============================================================
# UPLOAD REQUIREMENT DOCUMENT
# ============================================================

@router.post("/{project_id}/upload")
def upload_document(
    project_id: int,
    file: UploadFile = File(...),
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

    if not file.filename:
        raise HTTPException(
            status_code=400,
            detail="No file selected"
        )

    extension = file.filename.split(".")[-1].lower()

    folders = {
        "pdf": "app/uploads/pdf",
        "docx": "app/uploads/docx",
        "txt": "app/uploads/txt"
    }

    if extension not in folders:
        raise HTTPException(
            status_code=400,
            detail="Only PDF, DOCX and TXT files are allowed."
        )

    folder = folders[extension]

    os.makedirs(
        folder,
        exist_ok=True
    )

    file_path = os.path.join(
        folder,
        file.filename
    )

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(
            file.file,
            buffer
        )

    # Save document information
    project.document_name = file.filename
    project.document_path = file_path
    project.document_type = extension

    db.commit()
    db.refresh(project)

    # Extract document text
    if extension == "pdf":

        extracted_text = read_pdf(
            file_path
        )

    elif extension == "docx":

        extracted_text = read_docx(
            file_path
        )

    else:

        extracted_text = read_txt(
            file_path
        )

    project.document_text = extracted_text

    db.commit()
    db.refresh(project)

    return {
        "message": "Document uploaded successfully",
        "project_id": project.id,
        "file_name": file.filename,
        "file_type": extension,
        "text_preview": extracted_text[:1000]
    }


# ============================================================
# PROJECT STATISTICS
# ============================================================

@router.get("/stats/{user_id}")
def get_project_stats(
    user_id: int,
    db: Session = Depends(get_db)
):

    # Total Projects
    total_projects = db.query(
        Project.id
    ).filter(
        Project.user_id == user_id
    ).count()

    # Get Project IDs
    project_ids = db.query(
        Project.id
    ).filter(
        Project.user_id == user_id
    ).all()

    project_ids = [
        p.id
        for p in project_ids
    ]

    # User has no projects
    if not project_ids:

        return {
            "projects": 0,
            "requirements": 0,
            "testcases": 0,
            "high": 0,
            "medium": 0,
            "low": 0
        }

    # Total Test Cases
    total_testcases = db.query(
        TestCase.id
    ).filter(
        TestCase.project_id.in_(project_ids)
    ).count()

    # High Priority
    high = db.query(
        TestCase.id
    ).filter(
        TestCase.project_id.in_(project_ids),
        TestCase.priority == "High"
    ).count()

    # Medium Priority
    medium = db.query(
        TestCase.id
    ).filter(
        TestCase.project_id.in_(project_ids),
        TestCase.priority == "Medium"
    ).count()

    # Low Priority
    low = db.query(
        TestCase.id
    ).filter(
        TestCase.project_id.in_(project_ids),
        TestCase.priority == "Low"
    ).count()

    return {
        "projects": total_projects,
        "requirements": total_projects,
        "testcases": total_testcases,
        "high": high,
        "medium": medium,
        "low": low
    }


# ============================================================
# AI REQUIREMENT SUMMARY
# ============================================================

@router.get("/{project_id}/summary")
def get_requirement_summary(
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

    if not project.document_text:
        raise HTTPException(
            status_code=400,
            detail="Please upload requirement document first."
        )

    summary = generate_requirement_summary(
        project.document_text
    )

    return {
        "message": "Summary Generated Successfully",
        "data": summary
    }