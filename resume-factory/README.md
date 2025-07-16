# Resume Factory 🏭

Generate professional resumes from YAML content using LaTeX templates.

## Quick Start

1. **Add your content** in `content/example.yaml`
2. **Generate resume:**
   ```bash
   ./resume.sh example.yaml
   ```
3. **Find your files** in `output/john_developer_resume.pdf` and `output/john_developer_resume.tex`

## Architecture

```
resume-factory/
├── content/              # YAML content files
│   └── example.yaml      # Sample resume content
├── output/               # Generated PDFs and TEX files
├── blueprints/           # LaTeX templates (jakegut, etc.)
├── resume_factory/       # 📦 Python package
│   ├── __init__.py       # Package exports
│   ├── cli.py            # Command line interface
│   ├── generator.py      # Core generation logic
│   ├── schema.py         # Pydantic validation models
│   └── utils.py          # LaTeX utilities
├── resume.sh             # Shell wrapper
├── Dockerfile            # Container definition
└── setup.py              # Package installation
```

## Basic Commands

```bash
# Generate with default template
./resume.sh example.yaml

# Choose different template
./resume.sh example.yaml -b jakegut

# Add suffix to filename
./resume.sh example.yaml -o google-job

# Recompile edited TEX file
./resume.sh john_developer_resume_google_job.tex

# List available templates
./resume.sh --list
```

## File Naming

- Output files use your name from the YAML: `firstname_lastname_resume.pdf`
- Custom suffix: `firstname_lastname_resume_suffix.pdf`
- If file exists, adds random suffix automatically

## Content Format & Validation

Your YAML file is validated against a strict schema for robustness. All content files must include:

### Required Sections
```yaml
basics:
  name: "Your Name"                    # Required

education:                              # Required (at least 1 entry)
  - institution: "University Name"      # Required
    degree: "Degree Name"               # Required
    dates: "Start - End"                 # Required
    location: "City, Country"           # Optional
    details:                             # Optional
      - "Achievement or detail"

experience:                             # Required (at least 1 entry)
  - company: "Company Name"             # Required
    title: "Job Title"                   # Required
    dates: "Start - End"                 # Required
    bullets:                             # Required (at least 1 bullet)
      - "Achievement or responsibility"
    location: "City, Country"            # Optional
```

### Optional Sections
```yaml
links:                                  # Contact information
  - url: "mailto:email@example.com"     # Required if section provided
    display: "email@example.com"         # Required if section provided
  - url: "https://linkedin.com/in/you"
    display: "linkedin.com/in/you"

summary: "Brief professional summary"   # Optional

projects:                               # Optional
  - name: "Project Name"                # Required if section provided
    description: "Brief description"      # Required if section provided
    tech: "Python, React"               # Optional
    link: "github.com/project"           # Optional
    dates: "2023 - 2024"                 # Optional
    bullets:                             # Optional (alternative to description)
      - "Detailed achievement"

certifications:                         # Optional
  - name: "AWS Solutions Architect"     # Required if section provided
    issuer: "Amazon Web Services"        # Required if section provided
    date: "Dec 2023"                     # Required if section provided
    credential_id: "ABC123XYZ"           # Optional
    verification_url: "aws.amazon.com"   # Optional

skills:                                 # Optional
  "Languages": "Python, JavaScript, Java"
  "Frontend": "React, Vue.js, HTML/CSS"

meta:                                   # Optional (for PDF metadata)
  subject: "Brief document description"  # PDF subject field
  keywords: "Keyword1, Keyword2"         # PDF keywords for ATS
```

### Schema Features
- **Robust validation**: Clear error messages for missing or invalid fields
- **Flexible optional fields**: `null`, missing, and empty lists treated equivalently
- **Required within optional**: If you provide a section, certain fields become mandatory

## Manual Editing

Generated TEX files are preserved for fine-tuning. Edit the TEX file directly and recompile:

```bash
# Generate initial files
./resume.sh example.yaml -o final

# Edit the TEX file
edit output/john_developer_resume_final.tex

# Recompile
./resume.sh john_developer_resume_final.tex
```

## Development

### Local Development Setup
```bash
# Install package in development mode
pip install -e .

# Or install dependencies manually
pip install jinja2 pyyaml pydantic

# Run directly with Python
python -m resume_factory content/example.yaml
```

### Package Structure
- **`resume_factory/generator.py`**: Core PDF generation logic
- **`resume_factory/schema.py`**: Pydantic validation models
- **`resume_factory/utils.py`**: LaTeX escaping and utilities
- **`resume_factory/cli.py`**: Command line interface

### Adding New Templates
1. Create `blueprints/yourtemplate.tex.j2`
2. Use existing Jinja syntax and filters
3. Test with `./resume.sh example.yaml -b yourtemplate`

### Schema Modifications
Edit `resume_factory/schema.py` to add new fields or sections. The schema enforces:
- Required vs optional sections
- Required fields within provided sections
- Type validation and constraints
