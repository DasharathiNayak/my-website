from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import Base, engine
from app.routers.auth_router import router as auth_router
from app.routers.project_router import router as project_router
from app.routers.testcase_router import router as testcase_router
from app.routers.bug_report_router import router as bug_report_router

Base.metadata.create_all(bind=engine)

app = FastAPI()



app.include_router(testcase_router)

app.include_router(project_router)

app.include_router(auth_router)

app.include_router(bug_report_router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def home():
    return {
        "message": "Database Connected Successfully"
    }