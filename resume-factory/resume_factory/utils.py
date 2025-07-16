"""Helper functions for file operations and content processing."""

import random
import string
from typing import Any, Dict


def extract_name_from_yaml(content: Dict[str, Any]) -> str:
    """Extract and format name from YAML content for filename"""
    name = content['basics']['name']
    return name.lower().replace(' ', '_')


def generate_random_suffix() -> str:
    """Generate 3-character random suffix for filename collision handling"""
    return ''.join(random.choices(string.ascii_lowercase + string.digits, k=3))
