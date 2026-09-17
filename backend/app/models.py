from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.sql import func

from app.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)

    fullname = Column(String(100), nullable=False)

    email = Column(
        String(255),
        unique=True,
        index=True,
        nullable=False
    )

    password = Column(
        String(255),
        nullable=False
    )

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )

    updated_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now()
    )


class Project(Base):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False
    )

    project_name = Column(
        String(200),
        nullable=False
    )

    description = Column(
        String(500),
        nullable=True
    )

    application_type = Column(
        String(100),
        nullable=False
    )

    status = Column(
        String(50),
        default="Active"
    )
    
    assigned_to = Column(
    Integer,
    ForeignKey("users.id"),
    nullable=True
)

    document_name = Column(
        String(255),
        nullable=True
    )

    document_path = Column(
        String(500),
        nullable=True
    )

    document_type = Column(
        String(50),
        nullable=True
    )

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )

    updated_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now()
    )

    document_text = Column(
        String,
        nullable=True
    )


class TestCase(Base):
    __tablename__ = "test_cases"

    id = Column(Integer, primary_key=True, index=True)

    project_id = Column(
        Integer,
        ForeignKey("projects.id"),
        nullable=False
    )

    title = Column(
        String(255),
        nullable=False
    )

    pre_condition = Column(
        String(500),
        nullable=True
    )

    steps = Column(
        String(2000),
        nullable=False
    )

    expected_result = Column(
        String(1000),
        nullable=False
    )

    automation_script = Column(
        String,
        nullable=True
    )

    test_data = Column(
        String,
        nullable=True
    )

    priority = Column(
        String(50),
        default="Medium"
    )

    status = Column(
        String(50),
        default="Pending"
    )

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )


class BugReport(Base):
    __tablename__ = "bug_reports"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    testcase_id = Column(
        Integer,
        ForeignKey("test_cases.id"),
        nullable=False
    )

    project_id = Column(
        Integer,
        ForeignKey("projects.id"),
        nullable=False
    )

    bug_id = Column(
        String(100),
        nullable=False,
        unique=True,
        index=True
    )

    title = Column(
        String(500),
        nullable=False
    )

    severity = Column(
        String(50),
        default="Medium"
    )

    priority = Column(
        String(50),
        default="Medium"
    )

    environment = Column(
        String(255),
        nullable=True
    )

    pre_condition = Column(
        String(1000),
        nullable=True
    )

    steps_to_reproduce = Column(
        String(3000),
        nullable=True
    )

    expected_result = Column(
        String(2000),
        nullable=True
    )

    actual_result = Column(
        String(2000),
        nullable=True
    )

    status = Column(
        String(50),
        default="Open"
    )

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )

    updated_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now()
    )
    
class EmailVerificationOTP(Base):
    __tablename__ = "email_verification_otps"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    new_email = Column(String(255), nullable=False)
    otp = Column(String(6), nullable=False)
    expires_at = Column(DateTime(timezone=True), nullable=False)
    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )