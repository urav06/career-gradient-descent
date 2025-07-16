"""Utility functions for LaTeX processing and file handling."""

import re
import random
import string
from typing import Dict, Any


def escape_latex(text: str) -> str:
    """Escape LaTeX special characters for safe rendering"""
    conv = {
        '&': r'\&',
        '%': r'\%',
        '$': r'\$',
        '#': r'\#',
        '_': r'\_',
        '{': r'\{',
        '}': r'\}',
        '~': r'\textasciitilde{}',
        '^': r'\^{}',
        '\\': r'\textbackslash{}',
    }
    # Use regex for efficient replacement (longest matches first)
    regex = re.compile('|'.join(re.escape(key) for key in sorted(conv.keys(), key=len, reverse=True)))
    return regex.sub(lambda match: conv[match.group()], text)


def extract_name_from_yaml(content: Dict[str, Any]) -> str:
    """Extract and format name from YAML content for filename"""
    name = content['basics']['name']
    return name.lower().replace(' ', '_')


def generate_random_suffix() -> str:
    """Generate 3-character random suffix"""
    return ''.join(random.choices(string.ascii_lowercase + string.digits, k=3))
