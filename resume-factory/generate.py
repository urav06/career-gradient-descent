#!/usr/bin/env python3
"""Resume Generator - YAML to PDF via LaTeX"""

import yaml
import subprocess
import argparse
import random
import string
from pathlib import Path
from typing import List, Dict, Any, Optional
from jinja2 import Environment, FileSystemLoader

# Configuration
DEFAULT_BLUEPRINTS_DIR = '/workspace/blueprints'
DEFAULT_OUTPUT_DIR = '/workspace/output'

def get_available_blueprints(blueprints_dir: Path) -> List[str]:
    """Discover available blueprints from templates directory"""
    return sorted([f.stem.replace('.tex', '') for f in blueprints_dir.glob('*.tex.j2')]) if blueprints_dir.exists() else []

def extract_name_from_yaml(content: Dict[str, Any]) -> str:
    """Extract and format name from YAML content for filename"""
    name = content['basics']['name']
    return name.lower().replace(' ', '_')

def generate_random_suffix() -> str:
    """Generate 3-character random suffix"""
    return ''.join(random.choices(string.ascii_lowercase + string.digits, k=3))

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

def generate_resume(input_file: str, blueprint: str = 'sb2nov', output: Optional[str] = None, 
                   debug: bool = False, blueprints_dir: str = DEFAULT_BLUEPRINTS_DIR, 
                   output_dir: str = DEFAULT_OUTPUT_DIR) -> Path:
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
        if not all(field in content for field in ['basics', 'education', 'experience']):
            raise ValueError("Missing required fields: basics, education, or experience")
        if 'name' not in content['basics']:
            raise ValueError("Missing required field: basics.name")
    except yaml.YAMLError as e:
        raise ValueError(f"Invalid YAML syntax: {e}")
    
    # Generate output name and PDF title
    output_name = generate_output_name(content, output, output_path)
    pdf_title = f"{content['basics']['name']} Resume"
    
    # Add PDF metadata to content for template rendering
    content['pdf_title'] = pdf_title
    
    # Render template
    env = Environment(
        loader=FileSystemLoader(blueprints_path),
        block_start_string='<@', block_end_string='@>',
        variable_start_string='<<', variable_end_string='>>',
        comment_start_string='<#', comment_end_string='#>'
    )
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

def main() -> None:
    parser = argparse.ArgumentParser(description='Generate resume PDF from YAML or compile TEX')
    parser.add_argument('input_file', nargs='?', help='YAML content file or TEX file')
    parser.add_argument('-b', '--blueprint', default='sb2nov', help='Template name')
    parser.add_argument('-o', '--output', help='Output filename suffix (for YAML input only)')
    parser.add_argument('-l', '--list', action='store_true', help='List templates')
    parser.add_argument('--debug', action='store_true', help='Preserve intermediate files for debugging')
    parser.add_argument('--blueprints-dir', default=DEFAULT_BLUEPRINTS_DIR, help=argparse.SUPPRESS)
    parser.add_argument('--output-dir', default=DEFAULT_OUTPUT_DIR, help=argparse.SUPPRESS)
    
    args = parser.parse_args()
    
    if args.list:
        blueprints = get_available_blueprints(Path(args.blueprints_dir))
        print("Available templates:", ', '.join(blueprints) if blueprints else 'None found')
        return
        
    if not args.input_file:
        parser.error("Input file required (use --list to see templates)")
    
    try:
        generate_resume(
            input_file=args.input_file,
            blueprint=args.blueprint,
            output=args.output,
            debug=args.debug,
            blueprints_dir=args.blueprints_dir,
            output_dir=args.output_dir
        )
    except (ValueError, RuntimeError) as e:
        print(f"❌ Error: {e}")
        exit(1)

if __name__ == '__main__':
    main()
