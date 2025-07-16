"""Resume generation core functionality."""

import subprocess
from pathlib import Path
from typing import Any, Dict, List, Optional

import yaml
from jinja2 import Environment, FileSystemLoader
from pydantic import ValidationError
from pylatex.utils import escape_latex

from resume_factory.schema import ResumeSchema
from resume_factory.utils import extract_name_from_yaml, generate_random_suffix


def get_available_blueprints(blueprints_dir: Path) -> List[str]:
    """Discover available blueprints from templates directory"""
    return sorted([f.stem.replace('.tex', '') for f in blueprints_dir.glob('*.tex.j2')]) if blueprints_dir.exists() else []


def _compile_tex_to_pdf(tex_path: Path, output_dir: Path, debug: bool = False) -> Path:
    """Internal: compile TEX file to PDF with cleanup"""
    cmd = ['pdflatex', '-interaction=nonstopmode', '-file-line-error', 
           '-output-directory', str(output_dir), str(tex_path)]
    
    *_, result = [subprocess.run(cmd, capture_output=True, cwd=output_dir) for _ in range(2)]
    
    if result.returncode != 0:
        error_output = (result.stdout or b'').decode() + (result.stderr or b'').decode()
        raise RuntimeError(f"LaTeX compilation failed:\n{error_output}")
    
    # Cleanup auxiliary files unless debugging
    if not debug:
        for ext in ('.aux', '.log', '.out'):
            Path(output_dir, f"{tex_path.stem}{ext}").unlink(missing_ok=True)
    
    return output_dir / f"{tex_path.stem}.pdf"


def _load_and_validate_yaml(input_file: str) -> Dict[str, Any]:
    """Internal: load and validate YAML content"""
    try:
        content = yaml.safe_load(Path(input_file).read_text())
    except yaml.YAMLError as e:
        raise ValueError(f"Invalid YAML syntax in {input_file}: {e}")
    except Exception as e:
        raise ValueError(f"Failed to read {input_file}: {e}")
    
    try:
        ResumeSchema(**content)  # Validate schema
    except ValidationError as e:
        error_details = []
        for error in e.errors():
            field = " → ".join(str(x) for x in error['loc'])
            error_details.append(f"  • {field}: {error['msg']}")
        raise ValueError(f"Schema validation failed:\n" + "\n".join(error_details))
    
    return content


def _render_yaml_to_tex(content: Dict[str, Any], blueprint: str, output_name: str, blueprints_dir: Path, output_dir: Path) -> Path:
    """Internal: render YAML content to TEX file using template"""
    env = Environment(
        loader=FileSystemLoader(blueprints_dir),
        block_start_string='<@', block_end_string='@>',
        variable_start_string='<<', variable_end_string='>>',
        comment_start_string='<#', comment_end_string='#>'
    )
    env.filters['escape_latex'] = escape_latex
    rendered = env.get_template(f"{blueprint}.tex.j2").render(**content)
    
    output_dir.mkdir(parents=True, exist_ok=True)
    tex_file = output_dir / f"{output_name}.tex"
    tex_file.write_text(rendered)
    
    return tex_file


def _generate_output_name(yaml_content: Dict[str, Any], manual_suffix: Optional[str], output_path: Path) -> str:
    """Internal: generate output filename with collision handling"""
    base_name = extract_name_from_yaml(yaml_content)
    
    if manual_suffix:
        return f"{base_name}_resume_{manual_suffix}"
    
    filename = f"{base_name}_resume"
    if not (output_path / f"{filename}.pdf").exists():
        return filename
    else:
        suffix = generate_random_suffix()
        return f"{filename}_{suffix}"


def generate_resume(
    input_file: str,
    blueprint: str = 'jakegut',
    output: Optional[str] = None, 
    debug: bool = False,
    blueprints_dir: str = '/workspace/blueprints', 
    output_dir: str = '/workspace/output'
) -> Path:
    """Generate PDF from YAML content or compile existing TEX file"""
    output_path = Path(output_dir)
    
    if input_file.endswith('.tex'):
        # TEX workflow: validate path and compile
        tex_path = Path(input_file) if Path(input_file).is_absolute() else output_path / input_file
        if not tex_path.exists():
            raise ValueError(f"TEX file not found: {tex_path}")
        return _compile_tex_to_pdf(tex_path, output_path, debug)
    
    # YAML workflow: parse → render → compile
    blueprints_path = Path(blueprints_dir)
    available_blueprints = get_available_blueprints(blueprints_path)
    
    if blueprint not in available_blueprints:
        raise ValueError(f"Blueprint '{blueprint}' not found. Available: {available_blueprints}")
    
    content = _load_and_validate_yaml(input_file)
    output_name = _generate_output_name(content, output, output_path)
    tex_file = _render_yaml_to_tex(content, blueprint, output_name, blueprints_path, output_path)
    
    return _compile_tex_to_pdf(tex_file, output_path, debug)
