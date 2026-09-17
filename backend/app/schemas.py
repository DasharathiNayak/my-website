from pydantic import BaseModel, EmailStr, Field
from typing import Optional


class UserCreate(BaseModel):
    fullname: str = Field(..., min_length=3, max_length=100)
    email: EmailStr
    password: str = Field(..., min_length=8, max_length=50)


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserResponse(BaseModel):
    id: int
    fullname: str
    email: EmailStr

    class Config:
        from_attributes = True
        



class ProjectCreate(BaseModel):
    user_id: int
    project_name: str = Field(..., min_length=3, max_length=200)
    description: Optional[str] = None
    application_type: str
    status: str = "Active"


        
class TestCaseCreate(BaseModel):
    project_id: int
    title: str
    pre_condition: Optional[str] = None
    steps: str
    expected_result: str
    priority: str = "Medium"
    status: str = "Pending"


class TestCaseResponse(BaseModel):
    id: int
    project_id: int
    title: str
    pre_condition: Optional[str]
    steps: str
    expected_result: str
    priority: str
    status: str

    class Config:
        from_attributes = True

class TestCaseUpdate(BaseModel):

    title: Optional[str] = None
    pre_condition: Optional[str] = None
    steps: Optional[str] = None
    expected_result: Optional[str] = None
    priority: Optional[str] = None
    status: Optional[str] = None
    
# ============================================================
# Bug Report Schemas
# ============================================================

class BugReportCreate(BaseModel):

    testcase_id: int

    project_id: int

    title: str

    severity: str = "Medium"

    priority: str = "Medium"

    environment: Optional[str] = None

    pre_condition: Optional[str] = None

    steps_to_reproduce: Optional[str] = None

    expected_result: Optional[str] = None

    actual_result: Optional[str] = None

    status: str = "Open"


class BugReportUpdate(BaseModel):

    title: Optional[str] = None

    severity: Optional[str] = None

    priority: Optional[str] = None

    environment: Optional[str] = None

    pre_condition: Optional[str] = None

    steps_to_reproduce: Optional[str] = None

    expected_result: Optional[str] = None

    actual_result: Optional[str] = None

    status: Optional[str] = None


class BugReportResponse(BaseModel):

    id: int

    testcase_id: int

    project_id: int
    
    project_name: Optional[str] = None

    assigned_to: Optional[int] = None

    bug_id: str

    title: str

    severity: str

    priority: str

    environment: Optional[str]

    pre_condition: Optional[str]

    steps_to_reproduce: Optional[str]

    expected_result: Optional[str]

    actual_result: Optional[str]

    status: str
    
class ProjectResponse(BaseModel):
    id: int
    user_id: int
    project_name: str
    description: Optional[str]
    application_type: str
    status: str
    assigned_to: Optional[int] = None

    class Config:
        from_attributes = True


class ProjectUpdate(BaseModel):
    project_name: str
    description: Optional[str] = None
    application_type: str
    status: str
    assigned_to: Optional[int] = None

    class Config:
        from_attributes = True
