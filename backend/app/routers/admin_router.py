from fastapi import APIRouter, Depends, HTTPException, Header
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional
import secrets

from app.database import get_db
from app.models import User
from app.auth import hash_password


router = APIRouter(
    prefix="/admin",
    tags=["Admin"]
)


# ---------------------------------------------------------
# Request Models
# ---------------------------------------------------------

class CreateUserRequest(BaseModel):
    fullname: str
    username: Optional[str] = None
    email: str
    role: str = "Tester"


class UpdateUserRequest(BaseModel):
    fullname: Optional[str] = None
    username: Optional[str] = None
    email: Optional[str] = None


class UpdateRoleRequest(BaseModel):
    role: str


class UpdateStatusRequest(BaseModel):
    status: str


# ---------------------------------------------------------
# Admin Authentication
# ---------------------------------------------------------

def require_admin(
    x_auth_token: Optional[str] = Header(default=None),
    db: Session = Depends(get_db)
):
    if not x_auth_token:
        raise HTTPException(
            status_code=401,
            detail="Authentication token is required"
        )

    admin = (
        db.query(User)
        .filter(User.auth_token == x_auth_token)
        .first()
    )

    if not admin:
        raise HTTPException(
            status_code=401,
            detail="Invalid authentication token"
        )

    if admin.role != "Admin":
        raise HTTPException(
            status_code=403,
            detail="Admin access required"
        )

    if admin.status != "Active":
        raise HTTPException(
            status_code=403,
            detail="Admin account is not active"
        )

    return admin


# ---------------------------------------------------------
# Dashboard
# ---------------------------------------------------------

@router.get("/dashboard")
def admin_dashboard(
    admin: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    total_users = db.query(User).count()

    active_users = (
        db.query(User)
        .filter(User.status == "Active")
        .count()
    )

    suspended_users = (
        db.query(User)
        .filter(User.status == "Suspended")
        .count()
    )

    pending_users = (
        db.query(User)
        .filter(User.status == "Pending Verification")
        .count()
    )

    return {
        "total_users": total_users,
        "active_users": active_users,
        "suspended_users": suspended_users,
        "pending_users": pending_users
    }


# ---------------------------------------------------------
# Get All Users
# ---------------------------------------------------------

@router.get("/users")
def get_users(
    admin: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    users = (
        db.query(User)
        .order_by(User.id.desc())
        .all()
    )

    return [
        {
            "id": user.id,
            "fullname": user.fullname,
            "username": user.username,
            "email": user.email,
            "role": user.role,
            "status": user.status,
            "created_at": user.created_at,
            "updated_at": user.updated_at
        }
        for user in users
    ]


# ---------------------------------------------------------
# Get Single User
# ---------------------------------------------------------

@router.get("/users/{user_id}")
def get_user(
    user_id: int,
    admin: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    user = (
        db.query(User)
        .filter(User.id == user_id)
        .first()
    )

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    return {
        "id": user.id,
        "fullname": user.fullname,
        "username": user.username,
        "email": user.email,
        "role": user.role,
        "status": user.status,
        "created_at": user.created_at,
        "updated_at": user.updated_at
    }


# ---------------------------------------------------------
# Create User
# ---------------------------------------------------------

@router.post("/users")
def create_user(
    request: CreateUserRequest,
    admin: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    existing_email = (
        db.query(User)
        .filter(User.email == request.email)
        .first()
    )

    if existing_email:
        raise HTTPException(
            status_code=400,
            detail="Email already exists"
        )

    username = (
        request.username.strip()
        if request.username
        else request.email.split("@")[0]
    )

    existing_username = (
        db.query(User)
        .filter(User.username == username)
        .first()
    )

    if existing_username:
        raise HTTPException(
            status_code=400,
            detail="Username already exists"
        )

    allowed_roles = [
        "Admin",
        "Manager",
        "Developer",
        "Tester",
        "Viewer"
    ]

    if request.role not in allowed_roles:
        raise HTTPException(
            status_code=400,
            detail="Invalid role"
        )

    # Temporary password.
    # OTP/password setup will be connected in the next step.
    temporary_password = secrets.token_urlsafe(12)

    new_user = User(
        fullname=request.fullname.strip(),
        username=username,
        email=request.email.strip().lower(),
        password=hash_password(temporary_password),
        role=request.role,
        status="Pending Verification",
        auth_token=None
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {
        "message": "User created successfully",
        "user": {
            "id": new_user.id,
            "fullname": new_user.fullname,
            "username": new_user.username,
            "email": new_user.email,
            "role": new_user.role,
            "status": new_user.status
        }
    }


# ---------------------------------------------------------
# Update User
# ---------------------------------------------------------

@router.put("/users/{user_id}")
def update_user(
    user_id: int,
    request: UpdateUserRequest,
    admin: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    user = (
        db.query(User)
        .filter(User.id == user_id)
        .first()
    )

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    if request.fullname is not None:
        user.fullname = request.fullname.strip()

    if request.username is not None:
        username = request.username.strip()

        existing = (
            db.query(User)
            .filter(
                User.username == username,
                User.id != user_id
            )
            .first()
        )

        if existing:
            raise HTTPException(
                status_code=400,
                detail="Username already exists"
            )

        user.username = username

    if request.email is not None:
        email = request.email.strip().lower()

        existing = (
            db.query(User)
            .filter(
                User.email == email,
                User.id != user_id
            )
            .first()
        )

        if existing:
            raise HTTPException(
                status_code=400,
                detail="Email already exists"
            )

        user.email = email

    db.commit()
    db.refresh(user)

    return {
        "message": "User updated successfully",
        "user": {
            "id": user.id,
            "fullname": user.fullname,
            "username": user.username,
            "email": user.email,
            "role": user.role,
            "status": user.status
        }
    }


# ---------------------------------------------------------
# Change User Role
# ---------------------------------------------------------

@router.patch("/users/{user_id}/role")
def change_user_role(
    user_id: int,
    request: UpdateRoleRequest,
    admin: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    user = (
        db.query(User)
        .filter(User.id == user_id)
        .first()
    )

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    if user.id == admin.id and request.role != "Admin":
        raise HTTPException(
            status_code=400,
            detail="You cannot remove your own Admin role"
        )

    allowed_roles = [
        "Admin",
        "Manager",
        "Developer",
        "Tester",
        "Viewer"
    ]

    if request.role not in allowed_roles:
        raise HTTPException(
            status_code=400,
            detail="Invalid role"
        )

    user.role = request.role

    db.commit()
    db.refresh(user)

    return {
        "message": "User role updated successfully",
        "role": user.role
    }


# ---------------------------------------------------------
# Change User Status
# ---------------------------------------------------------

@router.patch("/users/{user_id}/status")
def change_user_status(
    user_id: int,
    request: UpdateStatusRequest,
    admin: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    user = (
        db.query(User)
        .filter(User.id == user_id)
        .first()
    )

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    if user.id == admin.id:
        raise HTTPException(
            status_code=400,
            detail="You cannot change your own account status"
        )

    allowed_statuses = [
        "Active",
        "Suspended",
        "Pending Verification"
    ]

    if request.status not in allowed_statuses:
        raise HTTPException(
            status_code=400,
            detail="Invalid status"
        )

    user.status = request.status

    db.commit()
    db.refresh(user)

    return {
        "message": "User status updated successfully",
        "status": user.status
    }


# ---------------------------------------------------------
# Delete User
# ---------------------------------------------------------

@router.delete("/users/{user_id}")
def delete_user(
    user_id: int,
    admin: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    user = (
        db.query(User)
        .filter(User.id == user_id)
        .first()
    )

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    if user.id == admin.id:
        raise HTTPException(
            status_code=400,
            detail="You cannot delete your own Admin account"
        )

    db.delete(user)
    db.commit()

    return {
        "message": "User deleted successfully"
    }