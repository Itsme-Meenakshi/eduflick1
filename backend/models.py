from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, Text
from sqlalchemy.orm import relationship
from .database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    email = Column(String, unique=True, index=True)
    password_hash = Column(String)
    role = Column(String)  # "student" or "mentor"

    mentor_profile = relationship("Mentor", back_populates="user", uselist=False)
    enrollments = relationship("Enrollment", back_populates="user")

class Track(Base):
    __tablename__ = "tracks"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    description = Column(String)
    duration = Column(String)
    lessons_count = Column(Integer)
    icon = Column(String)
    color = Column(String)
    type = Column(String)  # "Main Course" or "Bootcamp"

    enrollments = relationship("Enrollment", back_populates="track")

class Mentor(Base):
    __tablename__ = "mentors"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    avatar = Column(String)
    specialty = Column(String)
    active_students_count = Column(Integer, default=0)

    user = relationship("User", back_populates="mentor_profile")
    enrollments = relationship("Enrollment", back_populates="mentor")

class Enrollment(Base):
    __tablename__ = "enrollments"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    track_id = Column(Integer, ForeignKey("tracks.id"))
    mentor_id = Column(Integer, ForeignKey("mentors.id"))
    streak = Column(Integer, default=1)
    last_active = Column(String)
    roadmap_json = Column(Text)  # Serialized JSON structure of roadmap modules & lessons

    user = relationship("User", back_populates="enrollments")
    track = relationship("Track", back_populates="enrollments")
    mentor = relationship("Mentor", back_populates="enrollments")
    submissions = relationship("ProjectSubmission", back_populates="enrollment")

class ProjectSubmission(Base):
    __tablename__ = "project_submissions"

    id = Column(Integer, primary_key=True, index=True)
    enrollment_id = Column(Integer, ForeignKey("enrollments.id"))
    student_name = Column(String)
    track_name = Column(String)
    mentor_name = Column(String)
    lesson_id = Column(Integer)
    title = Column(String)
    description = Column(String)
    repo_link = Column(String)
    status = Column(String, default="pending")  # "pending", "approved", "rejected"
    submitted_at = Column(String)

    enrollment = relationship("Enrollment", back_populates="submissions")
