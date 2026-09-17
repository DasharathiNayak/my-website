from fastapi import APIRouter, Depends, HTTPException
import random
from datetime import datetime, timedelta, timezone
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError

from app.auth import hash_password, verify_password
from app.database import get_db
from app.models import User, EmailVerificationOTP
from app.schemas import UserCreate, UserLogin

import os
import smtplib
from email.message import EmailMessage
from dotenv import load_dotenv

load_dotenv()
def send_otp_email(to_email, otp):
    msg = EmailMessage()

    msg["Subject"] = "TestCraftAI - Email Verification OTP"
    msg["From"] = os.getenv("SMTP_EMAIL")
    msg["To"] = to_email

    msg.set_content(
        f"""Hello,

Your TestCraftAI email verification OTP is:

{otp}

This OTP is valid for 10 minutes.

If you did not request this email change, please ignore this email.

Regards,
TestCraftAI Team
"""
    )

    with smtplib.SMTP(os.getenv("SMTP_SERVER"), 587) as server:
        server.starttls()
        server.login(
            os.getenv("SMTP_EMAIL"),
            os.getenv("SMTP_APP_PASSWORD")
        )
        server.send_message(msg)

router = APIRouter(tags=["Authentication"])


@router.post("/signup")
def signup(user: UserCreate, db: Session = Depends(get_db)):
    try:
        # Check existing email
        existing_user = db.query(User).filter(
            User.email == user.email
        ).first()

        if existing_user:
            raise HTTPException(
                status_code=400,
                detail="Email already registered"
            )

        # Create new user
        new_user = User(
            fullname=user.fullname,
            email=user.email,
            password=hash_password(user.password)
        )

        db.add(new_user)
        db.commit()
        db.refresh(new_user)

        return {
            "message": "User created successfully",
            "user_id": new_user.id
        }

    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail=f"Database Error : {str(e)}"
        )

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )


@router.post("/login")
def login(user: UserLogin, db: Session = Depends(get_db)):

    db_user = db.query(User).filter(
        User.email == user.email
    ).first()

    if not db_user:
        raise HTTPException(
            status_code=401,
            detail="Invalid Email or Password"
        )

    if not verify_password(
        user.password,
        db_user.password
    ):
        raise HTTPException(
            status_code=401,
            detail="Invalid Email or Password"
        )

    return {
        "message": "Login Successful",
        "user_id": db_user.id,
        "email": db_user.email
    }
    
@router.get("/users/{user_id}")
def get_user_profile(
    user_id: int,
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(
        User.id == user_id
    ).first()

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    return {
        "user_id": user.id,
        "fullname": user.fullname,
        "email": user.email
    }
    
@router.get("/users/{user_id}")
def get_user_profile(
    user_id: int,
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(
        User.id == user_id
    ).first()

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    return {
        "user_id": user.id,
        "fullname": user.fullname,
        "email": user.email
    }
@router.get("/users")
def get_all_users(
    db: Session = Depends(get_db)
):
    users = db.query(User).all()

    return [
        {
            "user_id": user.id,
            "fullname": user.fullname,
            "email": user.email
        }
        for user in users
    ]
    
    
@router.put("/users/{user_id}")
def update_user_profile(
    user_id: int,
    fullname: str,
    email: str,
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(
        User.id == user_id
    ).first()

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    user.fullname = fullname
    user.email = email

    db.commit()
    db.refresh(user)

    return {
        "message": "Profile updated successfully",
        "user_id": user.id,
        "fullname": user.fullname,
        "email": user.email
    }
    
@router.post("/users/{user_id}/email/send-otp")
def send_email_change_otp(
    user_id: int,
    new_email: str,
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(
        User.id == user_id
    ).first()

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    # Same email hai to OTP ki zarurat nahi
    if user.email.lower() == new_email.lower():
        raise HTTPException(
            status_code=400,
            detail="This is already your current email"
        )

    # Check whether email already belongs to another account
    existing_email = db.query(User).filter(
        User.email == new_email,
        User.id != user_id
    ).first()

    if existing_email:
        raise HTTPException(
            status_code=400,
            detail="Email already registered"
        )

    # Generate 6-digit OTP
    otp = str(random.randint(100000, 999999))

    # OTP valid for 10 minutes
    expires_at = datetime.now(timezone.utc) + timedelta(minutes=10)

    # Remove previous OTPs for this user
    db.query(EmailVerificationOTP).filter(
        EmailVerificationOTP.user_id == user_id
    ).delete()

    verification = EmailVerificationOTP(
        user_id=user_id,
        new_email=new_email,
        otp=otp,
        expires_at=expires_at
    )

    db.add(verification)
    db.commit()

    # Send OTP to the new email address
    try:
        send_otp_email(new_email, otp)
    except Exception as e:
        print("OTP email sending failed:", e)
        raise HTTPException(
            status_code=500,
            detail="Failed to send OTP email"
        )

    return {
        "message": "OTP sent successfully"
    }
    
@router.post("/users/{user_id}/email/verify-otp")
def verify_email_change_otp(
    user_id: int,
    new_email: str,
    otp: str,
    db: Session = Depends(get_db)
):
    verification = db.query(EmailVerificationOTP).filter(
        EmailVerificationOTP.user_id == user_id,
        EmailVerificationOTP.new_email == new_email,
        EmailVerificationOTP.otp == otp
    ).first()

    if not verification:
        raise HTTPException(
            status_code=400,
            detail="Invalid OTP"
        )

    now = datetime.now(timezone.utc)

    if verification.expires_at < now:
        db.delete(verification)
        db.commit()

        raise HTTPException(
            status_code=400,
            detail="OTP expired"
        )

    user = db.query(User).filter(
        User.id == user_id
    ).first()

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    existing_email = db.query(User).filter(
        User.email == new_email,
        User.id != user_id
    ).first()

    if existing_email:
        raise HTTPException(
            status_code=400,
            detail="Email already registered"
        )

    user.email = new_email

    db.delete(verification)
    db.commit()
    db.refresh(user)

    return {
        "message": "Email verified and updated successfully",
        "email": user.email
    }