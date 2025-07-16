"""Command line interface for the resume factory."""

import argparse
from pathlib import Path

from resume_factory.generator import generate_resume, get_available_blueprints


def main() -> None:
    """Main CLI entry point"""
    parser = argparse.ArgumentParser(description='Generate resume PDF from YAML or compile TEX')
    parser.add_argument('input_file', nargs='?', help='YAML content file or TEX file')
    parser.add_argument('-b', '--blueprint', default='jakegut', help='Template name')
    parser.add_argument('-o', '--output', help='Output filename suffix (for YAML input only)')
    parser.add_argument('-l', '--list', action='store_true', help='List templates')
    parser.add_argument('--debug', action='store_true', help='Preserve intermediate files for debugging')
    parser.add_argument('--blueprints-dir', default='/workspace/blueprints', help=argparse.SUPPRESS)
    parser.add_argument('--output-dir', default='/workspace/output', help=argparse.SUPPRESS)
    
    args = parser.parse_args()
    
    if args.list:
        blueprints = get_available_blueprints(Path(args.blueprints_dir))
        print("Available templates:", ', '.join(blueprints) if blueprints else 'None found')
        return
        
    if not args.input_file:
        parser.error("Input file required (use --list to see templates)")
    
    try:
        result_path = generate_resume(
            input_file=args.input_file,
            blueprint=args.blueprint,
            output=args.output,
            debug=args.debug,
            blueprints_dir=args.blueprints_dir,
            output_dir=args.output_dir
        )
        print(f"✅ Generated: {result_path}")
    except (ValueError, RuntimeError) as e:
        print(f"❌ Error: {e}")
        exit(1)


if __name__ == '__main__':
    main()
