"""Resume Factory - Generate professional resumes from YAML content using LaTeX templates."""

from .generator import generate_resume, get_available_blueprints
from .schema import ResumeSchema
from .utils import escape_latex

__version__ = "1.0.0"
__all__ = ["generate_resume", "get_available_blueprints", "ResumeSchema", "escape_latex"]
