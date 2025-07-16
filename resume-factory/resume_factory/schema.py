from typing import Dict, List, Optional

from pydantic import BaseModel, Field


class Basics(BaseModel):
    name: str
    ats_optimization: Optional[str] = None

class Link(BaseModel):
    url: str
    display: str

class Education(BaseModel):
    institution: str
    degree: str
    dates: str
    location: Optional[str] = None
    details: Optional[List[str]] = None

class Experience(BaseModel):
    company: str
    title: str
    dates: str
    bullets: List[str] = Field(min_length=1)
    location: Optional[str] = None

class Project(BaseModel):
    name: str
    description: Optional[str] = None
    tech: Optional[str] = None
    dates: Optional[str] = None
    link: Optional[str] = None
    bullets: Optional[List[str]] = None

class Certification(BaseModel):
    name: str
    issuer: str
    date: str
    credential_id: Optional[str] = None
    verification_url: Optional[str] = None

class Meta(BaseModel):
    subject: Optional[str] = None
    keywords: Optional[str] = None

class ResumeSchema(BaseModel):
    basics: Basics
    education: List[Education] = Field(min_length=1)
    experience: List[Experience] = Field(min_length=1)
    
    # Optional sections - null/missing/empty list all equivalent
    links: Optional[List[Link]] = None
    summary: Optional[str] = None
    projects: Optional[List[Project]] = None
    skills: Optional[Dict[str, str]] = None
    certifications: Optional[List[Certification]] = None
    meta: Optional[Meta] = None

    class Config:
        # Allow null values to be treated as None
        extra = "forbid"  # Reject unknown fields
        validate_assignment = True
