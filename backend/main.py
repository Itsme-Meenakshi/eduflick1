import json
from datetime import datetime
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List, Dict, Any, Optional

from .database import engine, Base, SessionLocal, get_db
from . import models, schemas, auth
from .auth import get_current_user, get_password_hash, verify_password, create_access_token

app = FastAPI(title="EduFlick AI Backend")

# Setup CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins in development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def create_initial_roadmap(track_name: str, has_project_by_default: bool = True):
    lessons_m1 = [
        {"id": 1, "title": f"Introduction to {track_name}", "completed": True, "locked": False, "content": f"Welcome to {track_name}! In this lesson you will understand the core principles, history, and real-world applications. This is the starting point of your journey.\n\nBy the end of this lesson you will:\n• Understand what {track_name} means\n• Know its real-world applications\n• Be ready for the next lesson"},
        {"id": 2, "title": "Key Concepts and Terminology", "completed": False, "locked": False, "content": "Every field has its own language. In this lesson you will master the essential vocabulary and concepts used throughout this course.\n\nTopics covered:\n• Core definitions\n• Industry terminology\n• Practical examples\n• Common misconceptions"},
        {"id": 3, "title": "Tools and Environment Setup", "completed": False, "locked": True, "content": "Setting up the right environment is critical. This lesson walks you through every tool you need and how to configure them.\n\nYou will install and configure:\n• Required software\n• Development environment\n• Key extensions and plugins"},
    ]
    
    lessons_m2 = [
        {"id": 4, "title": "Building Your First Project", "completed": False, "locked": True, "content": "Hands-on time! You will build your first real project in this field from scratch."},
        {"id": 5, "title": "Working with Data", "completed": False, "locked": True, "content": "Data is the backbone of AI. Learn how to collect, clean, and use data effectively."},
        {"id": 6, "title": "Testing and Debugging", "completed": False, "locked": True, "content": "Learn professional debugging techniques and how to write tests for your projects."},
    ]
    
    lessons_m3 = [
        {"id": 7, "title": "Advanced Patterns", "completed": False, "locked": True, "content": "Deep dive into advanced techniques used by professionals in the industry."},
        {"id": 8, "title": "Real-World Case Studies", "completed": False, "locked": True, "content": "Analyze real projects, understand decisions made, and learn from industry leaders."},
        {"id": 9, "title": "Capstone Project", "completed": False, "locked": True, "content": "Build a complete end-to-end project that showcases everything you have learned."},
    ]

    roadmap = [
        {
            "id": 1, "title": "Module 1: Foundations", "passingScore": 70, "completed": False,
            "assessmentUnlocked": False, "assessmentPassed": False,
            "lessons": lessons_m1
        }
    ]

    if has_project_by_default:
        roadmap.append({
            "id": 2, "title": "Module 2: Core Skills", "passingScore": 75, "completed": False,
            "assessmentUnlocked": False, "assessmentPassed": False,
            "lessons": lessons_m2
        })
        roadmap.append({
            "id": 3, "title": "Module 3: Advanced Topics", "passingScore": 80, "completed": False,
            "assessmentUnlocked": False, "assessmentPassed": False,
            "lessons": lessons_m3
        })
    else:
        lessons_m2_no_project = [
            {"id": 4, "title": "Fundamentals of Programming", "completed": False, "locked": True, "content": "Learn variables, loops, and condition statements."},
            {"id": 5, "title": "Working with Data Structures", "completed": False, "locked": True, "content": "Understand lists, arrays, dictionaries, and hash maps."},
            {"id": 6, "title": "Standard Libraries and Modules", "completed": False, "locked": True, "content": "Learn standard built-in functions and libraries."},
        ]
        lessons_m3_no_project = [
            {"id": 7, "title": "Introduction to Algorithms", "completed": False, "locked": True, "content": "Study searching, sorting, and complexity metrics."},
            {"id": 8, "title": "System Design Basics", "completed": False, "locked": True, "content": "Learn basic components of server/client system design."},
            {"id": 9, "title": "Performance Tuning", "completed": False, "locked": True, "content": "Optimize code for speed and lower memory usage."},
        ]
        roadmap.append({
            "id": 2, "title": "Module 2: Core Skills", "passingScore": 75, "completed": False,
            "assessmentUnlocked": False, "assessmentPassed": False,
            "lessons": lessons_m2_no_project
        })
        roadmap.append({
            "id": 3, "title": "Module 3: Advanced Topics", "passingScore": 80, "completed": False,
            "assessmentUnlocked": False, "assessmentPassed": False,
            "lessons": lessons_m3_no_project
        })

    # Safety Check:
    # "if any tracks doent have project add that module too"
    has_project = False
    for module in roadmap:
        for lesson in module["lessons"]:
            if "project" in lesson["title"].lower():
                has_project = True
                break
    
    if not has_project:
        # Dynamically inject Module 2 with project
        roadmap[1] = {
            "id": 2, "title": "Module 2: Core Skills", "passingScore": 75, "completed": False,
            "assessmentUnlocked": False, "assessmentPassed": False,
            "lessons": lessons_m2
        }

    return roadmap

@app.on_event("startup")
def startup_event():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        # Seed tracks
        if db.query(models.Track).count() == 0:
            tracks_to_seed = [
                models.Track(id=1, name='AI Foundations', type='Main Course', description='Master the core concepts of artificial intelligence and machine learning.', icon='🧠', color='purple', duration='8 weeks', lessons_count=24),
                models.Track(id=2, name='AI Content Creation', type='Main Course', description='Learn to create compelling content using AI tools and automation.', icon='✍️', color='blue', duration='6 weeks', lessons_count=18),
                models.Track(id=3, name='AI Software Dev', type='Main Course', description='Build real-world AI-powered applications and APIs.', icon='💻', color='teal', duration='10 weeks', lessons_count=30),
                models.Track(id=4, name='Agentic Automation', type='Main Course', description='Design and deploy autonomous AI agents for real workflows.', icon='🤖', color='green', duration='8 weeks', lessons_count=22),
                models.Track(id=5, name='AgentEx Beginner Bootcamp', type='Bootcamp', description='Fast-track into agentic AI. Zero to hero in 4 weeks.', icon='🚀', color='orange', duration='4 weeks', lessons_count=12),
                models.Track(id=6, name='AgentEx Intermediate Bootcamp', type='Bootcamp', description='Build multi-agent systems and advanced automation pipelines.', icon='⚡', color='yellow', duration='4 weeks', lessons_count=14),
                models.Track(id=7, name='AgentEx Advanced Bootcamp', type='Bootcamp', description='Production-grade agentic systems, evals, and deployment.', icon='🎯', color='red', duration='4 weeks', lessons_count=16),
            ]
            db.bulk_save_objects(tracks_to_seed)
            db.commit()

        # Seed mentors & user accounts for mentors
        if db.query(models.User).filter(models.User.role == "mentor").count() == 0:
            mentors_data = [
                {"email": "priya@example.com", "name": "Priya Nair", "avatar": "PN", "specialty": "AI Foundations & ML", "students": 24},
                {"email": "alex@example.com", "name": "Alex Chen", "avatar": "AC", "specialty": "Software Dev & APIs", "students": 18},
                {"email": "sara@example.com", "name": "Sara Mathew", "avatar": "SM", "specialty": "Content & Automation", "students": 20},
                {"email": "rohan@example.com", "name": "Rohan Das", "avatar": "RD", "specialty": "Agentic Systems", "students": 15},
            ]
            for m in mentors_data:
                user = models.User(
                    name=m["name"],
                    email=m["email"],
                    password_hash=get_password_hash("password"),
                    role="mentor"
                )
                db.add(user)
                db.commit()
                db.refresh(user)

                mentor = models.Mentor(
                    user_id=user.id,
                    avatar=m["avatar"],
                    specialty=m["specialty"],
                    active_students_count=m["students"]
                )
                db.add(mentor)
                db.commit()

        # Seed student accounts if empty
        if db.query(models.User).filter(models.User.role == "student").count() == 0:
            students_data = [
                {"email": "arun@example.com", "name": "Arun Kumar", "track_id": 1, "mentor_email": "priya@example.com", "streak": 7},
                {"email": "meena@example.com", "name": "Meena Pillai", "track_id": 3, "mentor_email": "alex@example.com", "streak": 3},
                {"email": "rahul@example.com", "name": "Rahul Sharma", "track_id": 1, "mentor_email": "priya@example.com", "streak": 14},
                {"email": "divya@example.com", "name": "Divya Nair", "track_id": 4, "mentor_email": "rohan@example.com", "streak": 2},
            ]
            for s in students_data:
                user = models.User(
                    name=s["name"],
                    email=s["email"],
                    password_hash=get_password_hash("password"),
                    role="student"
                )
                db.add(user)
                db.commit()
                db.refresh(user)

                # Get track & mentor
                track = db.query(models.Track).filter(models.Track.id == s["track_id"]).first()
                mentor_user = db.query(models.User).filter(models.User.email == s["mentor_email"]).first()
                mentor = db.query(models.Mentor).filter(models.Mentor.user_id == mentor_user.id).first()

                # Simulate track 4 having NO project by default (to test our safety guard)
                has_proj = s["track_id"] not in [2, 4, 6]
                roadmap = create_initial_roadmap(track.name, has_proj)

                enrollment = models.Enrollment(
                    user_id=user.id,
                    track_id=track.id,
                    mentor_id=mentor.id,
                    streak=s["streak"],
                    last_active="2 hours ago",
                    roadmap_json=json.dumps(roadmap)
                )
                db.add(enrollment)
                db.commit()
    finally:
        db.close()

# --- ROUTES ---

@app.post("/api/auth/register", response_model=schemas.Token)
def register(user_data: schemas.UserRegister, db: Session = Depends(get_db)):
    # Check if email exists
    existing_user = db.query(models.User).filter(models.User.email == user_data.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Create User
    new_user = models.User(
        name=user_data.name,
        email=user_data.email,
        password_hash=get_password_hash(user_data.password),
        role=user_data.role
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    # If role is mentor, create Mentor profile
    if user_data.role == "mentor":
        new_mentor = models.Mentor(
            user_id=new_user.id,
            avatar=user_data.name[:2].upper(),
            specialty="General AI Specialist",
            active_students_count=0
        )
        db.add(new_mentor)
        db.commit()

    # Generate token
    token = create_access_token(new_user.id)
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": new_user.id,
            "name": new_user.name,
            "email": new_user.email,
            "role": new_user.role
        }
    }

@app.post("/api/auth/login", response_model=schemas.Token)
def login(login_data: schemas.UserLogin, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == login_data.email).first()
    if not user or not verify_password(login_data.password, user.password_hash):
        raise HTTPException(status_code=400, detail="Incorrect email or password")
    
    token = create_access_token(user.id)
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "role": user.role
        }
    }

@app.get("/api/auth/me", response_model=schemas.UserOut)
def me(current_user: models.User = Depends(get_current_user)):
    return current_user

@app.get("/api/tracks", response_model=List[Dict[str, Any]])
def get_tracks(db: Session = Depends(get_db)):
    tracks = db.query(models.Track).all()
    result = []
    for t in tracks:
        result.append({
            "id": t.id,
            "name": t.name,
            "type": t.type,
            "description": t.description,
            "icon": t.icon,
            "color": t.color,
            "duration": t.duration,
            "lessons": t.lessons_count
        })
    return result

@app.get("/api/mentors", response_model=List[schemas.MentorOut])
def get_mentors(db: Session = Depends(get_db)):
    mentors = db.query(models.Mentor).all()
    result = []
    for m in mentors:
        result.append(schemas.MentorOut(
            id=m.id,
            name=m.user.name,
            specialty=m.specialty,
            avatar=m.avatar,
            students=m.active_students_count
        ))
    return result

@app.post("/api/enroll")
def enroll_student(req: schemas.EnrollRequest, current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    if current_user.role != "student":
        raise HTTPException(status_code=400, detail="Only students can enroll in tracks")
    
    # Check if student is already enrolled
    existing = db.query(models.Enrollment).filter(models.Enrollment.user_id == current_user.id).first()
    if existing:
        # Delete existing enrollment to allow switching tracks
        db.query(models.ProjectSubmission).filter(models.ProjectSubmission.enrollment_id == existing.id).delete()
        db.delete(existing)
        db.commit()

    track = db.query(models.Track).filter(models.Track.id == req.track_id).first()
    mentor = db.query(models.Mentor).filter(models.Mentor.id == req.mentor_id).first()

    if not track or not mentor:
        raise HTTPException(status_code=404, detail="Track or Mentor not found")

    # Simulate: track 2, 4, 6 don't have project by default (to test our safety guard)
    has_proj = req.track_id not in [2, 4, 6]
    roadmap = create_initial_roadmap(track.name, has_proj)

    new_enrollment = models.Enrollment(
        user_id=current_user.id,
        track_id=track.id,
        mentor_id=mentor.id,
        streak=1,
        last_active="Just now",
        roadmap_json=json.dumps(roadmap)
    )
    db.add(new_enrollment)
    
    # Update mentor student count
    mentor.active_students_count += 1
    db.commit()
    db.refresh(new_enrollment)

    return {"message": "Enrolled successfully", "enrollment_id": new_enrollment.id}

@app.get("/api/enrollment/active")
def active_enrollment(current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    if current_user.role != "student":
        raise HTTPException(status_code=400, detail="Only students have active enrollments")
    
    enrollment = db.query(models.Enrollment).filter(models.Enrollment.user_id == current_user.id).first()
    if not enrollment:
        return None

    roadmap = json.loads(enrollment.roadmap_json)
    
    return {
        "id": enrollment.id,
        "streak": enrollment.streak,
        "last_active": enrollment.last_active,
        "track": {
            "id": enrollment.track.id,
            "name": enrollment.track.name,
            "description": enrollment.track.description,
            "duration": enrollment.track.duration,
            "lessons": enrollment.track.lessons_count,
            "icon": enrollment.track.icon,
            "color": enrollment.track.color,
            "type": enrollment.track.type
        },
        "mentor": {
            "id": enrollment.mentor.id,
            "name": enrollment.mentor.user.name,
            "specialty": enrollment.mentor.specialty,
            "avatar": enrollment.mentor.avatar
        },
        "roadmap": roadmap
    }

@app.post("/api/progress/lessons/complete")
def complete_lesson(payload: Dict[str, Any], current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    enrollment = db.query(models.Enrollment).filter(models.Enrollment.user_id == current_user.id).first()
    if not enrollment:
        raise HTTPException(status_code=404, detail="No active enrollment found")

    module_idx = payload.get("moduleIndex")
    lesson_idx = payload.get("lessonIndex")

    roadmap = json.loads(enrollment.roadmap_json)
    
    # Mark current lesson as complete, unlock next lesson
    mod = roadmap[module_idx]
    lessons = mod["lessons"]
    lessons[lesson_idx]["completed"] = True
    
    if lesson_idx + 1 < len(lessons):
        lessons[lesson_idx + 1]["locked"] = False

    # Check if all lessons in the module are complete to unlock assessment
    all_done = all(l.get("completed", False) for l in lessons)
    mod["assessmentUnlocked"] = all_done

    enrollment.roadmap_json = json.dumps(roadmap)
    db.commit()

    return {"message": "Lesson completed", "roadmap": roadmap}

@app.post("/api/assessments/{moduleId}/submit")
def submit_assessment(moduleId: int, payload: Dict[str, Any], current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    enrollment = db.query(models.Enrollment).filter(models.Enrollment.user_id == current_user.id).first()
    if not enrollment:
        raise HTTPException(status_code=404, detail="No active enrollment found")

    score = payload.get("score", 0)
    roadmap = json.loads(enrollment.roadmap_json)
    
    # Find the module
    module_idx = -1
    for i, mod in enumerate(roadmap):
        if mod["id"] == moduleId:
            module_idx = i
            break

    if module_idx == -1:
        raise HTTPException(status_code=404, detail="Module not found")

    mod = roadmap[module_idx]
    if score >= mod["passingScore"]:
        mod["assessmentPassed"] = True
        
        # Unlock next module's first lesson
        if module_idx + 1 < len(roadmap):
            next_mod = roadmap[module_idx + 1]
            if len(next_mod["lessons"]) > 0:
                next_mod["lessons"][0]["locked"] = False
    
    enrollment.roadmap_json = json.dumps(roadmap)
    db.commit()

    return {"passed": mod.get("assessmentPassed", False), "roadmap": roadmap}

@app.post("/api/submissions")
def submit_project(sub_data: schemas.SubmissionCreate, current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    enrollment = db.query(models.Enrollment).filter(models.Enrollment.user_id == current_user.id).first()
    if not enrollment:
        raise HTTPException(status_code=404, detail="No active enrollment found")

    # Check if already submitted for this lesson
    sub = db.query(models.ProjectSubmission).filter(
        models.ProjectSubmission.enrollment_id == enrollment.id,
        models.ProjectSubmission.lesson_id == sub_data.lesson_id
    ).first()

    if sub:
        sub.title = sub_data.title
        sub.description = sub_data.description
        sub.repo_link = sub_data.repo_link
        sub.status = "pending"
        sub.submitted_at = datetime.now().strftime("%d %B %Y")
    else:
        sub = models.ProjectSubmission(
            enrollment_id=enrollment.id,
            student_name=current_user.name,
            track_name=enrollment.track.name,
            mentor_name=enrollment.mentor.user.name,
            lesson_id=sub_data.lesson_id,
            title=sub_data.title,
            description=sub_data.description,
            repo_link=sub_data.repo_link,
            status="pending",
            submitted_at=datetime.now().strftime("%d %B %Y")
        )
        db.add(sub)
    
    db.commit()
    db.refresh(sub)
    return {"message": "Project submitted successfully", "submission_id": sub.id}

@app.get("/api/submissions/active")
def get_active_submissions(current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    enrollment = db.query(models.Enrollment).filter(models.Enrollment.user_id == current_user.id).first()
    if not enrollment:
        return []

    subs = db.query(models.ProjectSubmission).filter(
        models.ProjectSubmission.enrollment_id == enrollment.id
    ).all()

    return [{
        "id": s.id,
        "studentName": s.student_name,
        "trackName": s.track_name,
        "mentorName": s.mentor_name,
        "lessonId": s.lesson_id,
        "title": s.title,
        "description": s.description,
        "repoLink": s.repo_link,
        "status": s.status,
        "submittedAt": s.submitted_at
    } for s in subs]

@app.get("/api/mentor/submissions")
def get_mentor_submissions(current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    if current_user.role != "mentor":
        raise HTTPException(status_code=400, detail="Only mentors can view review submissions")

    mentor = db.query(models.Mentor).filter(models.Mentor.user_id == current_user.id).first()
    if not mentor:
        raise HTTPException(status_code=404, detail="Mentor profile not found")

    subs = db.query(models.ProjectSubmission).filter(
        models.ProjectSubmission.mentor_name == current_user.name
    ).all()

    return [{
        "id": s.id,
        "studentName": s.student_name,
        "trackName": s.track_name,
        "mentorName": s.mentor_name,
        "lessonId": s.lesson_id,
        "title": s.title,
        "description": s.description,
        "repoLink": s.repo_link,
        "status": s.status,
        "submittedAt": s.submitted_at
    } for s in subs]

@app.post("/api/submissions/{id}/review")
def review_submission(id: int, req: schemas.SubmissionReview, current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    if current_user.role != "mentor":
        raise HTTPException(status_code=400, detail="Only mentors can review submissions")

    sub = db.query(models.ProjectSubmission).filter(models.ProjectSubmission.id == id).first()
    if not sub:
        raise HTTPException(status_code=404, detail="Submission not found")

    sub.status = req.status
    
    # If approved, update student's roadmap JSON
    if req.status == "approved":
        enrollment = db.query(models.Enrollment).filter(models.Enrollment.id == sub.enrollment_id).first()
        if enrollment:
            roadmap = json.loads(enrollment.roadmap_json)
            # Find matching lesson and complete it
            for mi, mod in enumerate(roadmap):
                lessons = mod["lessons"]
                for li, lesson in enumerate(lessons):
                    if lesson["id"] == sub.lesson_id:
                        lesson["completed"] = True
                        # Unlock next lesson
                        if li + 1 < len(lessons):
                            lessons[li + 1]["locked"] = False
                        
                        # Check assessment eligibility
                        all_done = all(l.get("completed", False) for l in lessons)
                        mod["assessmentUnlocked"] = all_done
                        break
            
            enrollment.roadmap_json = json.dumps(roadmap)
    
    db.commit()
    return {"message": f"Submission marked as {req.status}"}

@app.get("/api/mentor/students")
def get_mentor_students(current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    if current_user.role != "mentor":
        raise HTTPException(status_code=400, detail="Only mentors can view student analytics")

    mentor = db.query(models.Mentor).filter(models.Mentor.user_id == current_user.id).first()
    if not mentor:
        raise HTTPException(status_code=404, detail="Mentor profile not found")

    enrollments = db.query(models.Enrollment).filter(models.Enrollment.mentor_id == mentor.id).all()
    
    result = []
    for e in enrollments:
        roadmap = json.loads(e.roadmap_json)
        all_lessons = [l for mod in roadmap for l in mod["lessons"]]
        completed_lessons = len([l for l in all_lessons if l.get("completed")])
        progress = int((completed_lessons / len(all_lessons)) * 100) if len(all_lessons) > 0 else 0
        
        modules_completed = len([mod for mod in roadmap if mod.get("assessmentPassed")])
        
        # Get best assessment score (stub/dummy logic)
        assessment_score = 85 if modules_completed > 0 else 0

        result.append({
            "id": e.user.id,
            "name": e.user.name,
            "track": e.track.name,
            "progress": progress,
            "streak": e.streak,
            "modulesCompleted": modules_completed,
            "lastActive": e.last_active or "Recently",
            "assessmentScore": assessment_score
        })
    return result
