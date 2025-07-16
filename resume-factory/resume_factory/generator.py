"""Resume generation core functionality."""

import yaml
import subprocess
from pathlib import Path
from typing import List, Dict, Any, Optional
from jinja2 import Environment, FileSystemLoader
from pydantic import ValidationError

from .schema import ResumeSchema
from .utils import escape_latex, extract_name_from_yaml, generate_random_suffix


def get_available_blueprints(blueprints_dir: Path) -> List[str]:
    """Discover available blueprints from templates directory"""
    return sorted([f.stem.replace('.tex', '') for f in blueprints_dir.glob('*.tex.j2')]) if blueprints_dir.exists() else []


def generate_output_name(yaml_content: Dict[str, Any], manual_suffix: Optional[str], output_path: Path) -> str:
    """Generate output filename with collision handling"""
    base_name = extract_name_from_yaml(yaml_content)
    
    if manual_suffix:
        return f"{base_name}_resume_{manual_suffix}"
    
    filename = f"{base_name}_resume"
    if not (output_path / f"{filename}.pdf").exists():
        return filename
    else:
        suffix = generate_random_suffix()
        return f"{filename}_{suffix}"


def compile_tex_only(tex_file: str, output_dir: str) -> Path:
    """Compile existing TEX file to PDF"""
    tex_path = Path(tex_file)
    output_path = Path(output_dir)
    
    # Handle both absolute and relative paths
    if not tex_path.is_absolute():
        tex_path = output_path / tex_path
    
    if not tex_path.exists():
        raise ValueError(f"TEX file not found: {tex_path}")
    
    # Compile PDF
    cmd = ['pdflatex', '-interaction=nonstopmode', '-file-line-error', 
           '-output-directory', str(output_path), str(tex_path)]
    
    *_, result = [subprocess.run(cmd, capture_output=True, cwd=output_path) for _ in range(2)]
    
    if result.returncode != 0:
        error_output = (result.stdout or b'').decode() + (result.stderr or b'').decode()
        raise RuntimeError(f"LaTeX compilation failed:\n{error_output}")
    
    # Cleanup auxiliary files
    base_name = tex_path.stem
    cleanup_extensions = ['.aux', '.log', '.out']
    [Path(output_path, f"{base_name}{ext}").unlink(missing_ok=True) for ext in cleanup_extensions]
    
    return output_path / f"{base_name}.pdf"


def generate_resume(input_file: str, blueprint: str = 'jakegut', output: Optional[str] = None, 
                   debug: bool = False, blueprints_dir: str = '/workspace/blueprints', 
                   output_dir: str = '/workspace/output') -> Path:
    """Generate PDF from YAML content or compile existing TEX file"""
    
    # Detect workflow based on input file type
    if input_file.endswith('.tex'):
        return compile_tex_only(input_file, output_dir)
    
    # YAML to PDF workflow
    blueprints_path, output_path = Path(blueprints_dir), Path(output_dir)
    available_blueprints = get_available_blueprints(blueprints_path)
    
    if blueprint not in available_blueprints:
        raise ValueError(f"Blueprint '{blueprint}' not found. Available: {available_blueprints}")
    
    # Load and validate YAML
    try:
        content = yaml.safe_load(Path(input_file).read_text())
        ResumeSchema(**content)  # Validate schema
    except yaml.YAMLError as e:
        raise ValueError(f"Invalid YAML syntax: {e}")
    except ValidationError as e:
        raise ValueError(f"Schema validation failed: {e}")
    
    # Generate output name
    output_name = generate_output_name(content, output, output_path)
    
    # Render template
    env = Environment(
        loader=FileSystemLoader(blueprints_path),
        block_start_string='<@', block_end_string='@>',
        variable_start_string='<<', variable_end_string='>>',
        comment_start_string='<#', comment_end_string='#>'
    )
    env.filters['escape_latex'] = escape_latex
    rendered = env.get_template(f"{blueprint}.tex.j2").render(**content)
    
    # Write and compile
    output_path.mkdir(parents=True, exist_ok=True)
    tex_file = output_path / f"{output_name}.tex"
    tex_file.write_text(rendered)
    
    # Compile PDF (run twice for cross-references, check final result)
    cmd = ['pdflatex', '-interaction=nonstopmode', '-file-line-error', 
           '-output-directory', str(output_path), str(tex_file)]
    
    *_, result = [subprocess.run(cmd, capture_output=True, cwd=output_path) for _ in range(2)]
    
    if result.returncode != 0:
        error_output = (result.stdout or b'').decode() + (result.stderr or b'').decode()
        raise RuntimeError(f"LaTeX compilation failed:\n{error_output}")
    
    # Cleanup
    if not debug:
        for ext in ('.aux', '.log', '.out'):
            Path(output_path, f"{output_name}{ext}").unlink(missing_ok=True)
    
    return output_path / f"{output_name}.pdf"
